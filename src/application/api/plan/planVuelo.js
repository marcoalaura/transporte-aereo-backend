'use strict';

const debug = require('debug')('app:api:planVuelo');
const guard = require('express-jwt-permissions')();
const moment = require('moment');
const { userData } = require('../../lib/auth');

module.exports = function setupPlanVuelo (api, services) {
  const { PlanVuelo, Rol, PlanSolicitud, PlanHistorial, PlanVueloNoRegular, Mopsv, Usuario } = services;

  // Solicitar todos los planes de Vuelo para la solicitud
  api.post('/planVuelo/solicitar/:idSolicitud', guard.check(['planVuelos:update']), async (req, res, next) => {
    debug('Solicitando todos los planes de vuelo');
    const { idSolicitud } = req.params;
    let user = await userData(req, services);

    // guardando registro en el historial
    try {
      let result = await PlanHistorial.createOrUpdate({
        id_solicitud: parseInt(idSolicitud),
        id_entidad: user.id_entidad,
        fecha: new Date(),
        accion: 'SOLICITADO',
        detalle: `Se ha solicitado el plan de vuelos regulares`,
        _user_created: user.id,
        id_usuario: user.id,
        nombre_usuario: user.usuario
      });
      debug(result);
    } catch (e) {
      debug(`No se pudo crear el registro de historial RPL para solicitud ${idSolicitud}: ${e}`);
      return next(new Error(`No se pudo crear el registro de historial RPL para solicitud ${idSolicitud}`));
    }
    // cambiando estado de plan de solicitudes
    try {
      await PlanSolicitud.createOrUpdate({
        id: parseInt(idSolicitud),
        estado: 'SOLICITADO'
      });
    } catch (e) {
      return next(new Error(`No se ha podido modificar el estado de la solicitud RPL: ${e}`));
    }

    try {
      let result = await PlanVuelo.solicitar(idSolicitud, user.id);

      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (!result.data) {
        return next(new Error('No se pudo solicitar los planes de vuelo de la solicitud'));
      }
    } catch (e) {
      return next(e);
    }
    return res.send({ success: true });
  });

  api.post('/planVuelo/aprobar/:idSolicitud', guard.check(['planVuelos:update']), async (req, res, next) => {
    debug('Aprobando todos los planes de vuelo');

    const { idSolicitud } = req.params;
    let user = await userData(req, services);
    let pendientes = await PlanSolicitud.listaPendientesAprobacion(idSolicitud);
    let estadoCambiar = 'SOLICITADO';
    let detallePlanHistorial = `"${user.usuario}" ha dado el visto bueno.`;
    let planSolicitud;
    let cumpleFlujo = false;
    if (pendientes.length === 1) {
      // de acuerdo al flujo la ultima instancia en aprobar es AASANA
      if (user['rol.nombre'] === 'AASANA' || user['rol.nombre'] === 'AASANA_ADMIN') {
        cumpleFlujo = true;
      }
    }
    if (pendientes.length !== 0 && !cumpleFlujo) {
      // existen aprobaciones pendientes
      estadoCambiar = 'APROBADO_FELCN';
      // actualizando estado de los planes de vuelo
      try {
        let items = await PlanVuelo.findAll({ id_solicitud: parseInt(idSolicitud) });
        for (let i = 0; i < items.data.count; i++) {
          let result = await PlanVuelo.createOrUpdate({
            id: items.data.rows[i].id,
            estado: estadoCambiar,
            _user_updated: user.id,
            _updated_at: new Date()
          });
        }
      } catch (e) {
        debug(`no se ha podido actualizar planes de vuelo para solicitud ${idSolicitud}`);
      }
    }
    console.log('\n\ncumple flujo:', cumpleFlujo);
    if (cumpleFlujo) {
      // flujo de aprobacion completada
      estadoCambiar = 'APROBADO_AASANA';
      // actulizando los planes de vuelo y la solicitud de itinerario a APROBADO
      try {
        debug('<Aprobando> ****', idSolicitud);
        let result = await PlanVuelo.aprobar(parseInt(idSolicitud), user.id);
        if (result.code === -1) {
          return next(new Error(result.message));
        }
        if (!result.data) {
          debug(`Error, no se pudo aprobar PlanVuelo ${idSolicitud}`);
          return next(new Error('No se pudo aprobar los planes de vuelo de la solicitud'));
        }
        console.log('aprobando flujo cumplido');
      } catch (e) {
        return next(`No se ha podido aprobar los planes de vuelo para solicitud RPL ${idSolicitud}: ${e}`);
      }
    }
    // guardando registro en el historial RPL
    try {
      await PlanHistorial.createOrUpdate({
        id_solicitud: parseInt(idSolicitud),
        id_entidad: user.id_entidad,
        fecha: new Date(),
        accion: 'APROBADO',
        detalle: detallePlanHistorial,
        _user_created: user.id,
        id_usuario: user.id,
        nombre_usuario: user.usuario
      });
    } catch (e) {
      debug(`No se pudo crear el registro de historial RPL para solicitud ${idSolicitud}`);
      return next(new Error(`No se pudo crear el registro de verificaciones RPL para solicitud ${idSolicitud}`));
    }

    try {
      planSolicitud = await PlanSolicitud.findById(parseInt(idSolicitud));
    } catch (e) {
      debug(`No se ha podido encontrar la solicitud RPL ${idSolicitud}: ${e}`);
    }
    try {
      planSolicitud.data.estado = estadoCambiar;
      let result = await PlanSolicitud.updateOnly(planSolicitud.data);
    } catch (e) {
      debug(`No se ha podido actualizar el estado del plan de solicitud: ${e}`);
    }
    return res.send({ success: true });
  });

  api.post('/planVuelo/rechazar/:idSolicitud', guard.check(['planVuelos:update']), async (req, res, next) => {
    debug('Rechazando planes de solicitud de vuelo por alguna entidad');

    const { idSolicitud } = req.params;
    let user = await userData(req, services);

    // comprobando roles
    let felcnRechazado = false;
    let aasanaRechazado = false;
    let detallePlanHistorial = '';
    try {
      let rol = await Rol.findById(user.id_rol);
      if (rol.data.nombre === 'FELCN_ADMIN') {
        return next(res.send({ message: 'La cuenta FELCN_ADMIN no puede realizar acciones, esta cuenta solo puede crear usuarios para que las realicen' }));
      }
      if (rol.data.nombre === 'AASANA' || rol.data.nombre === 'AASANA_ADMIN') {
        aasanaRechazado = true;
      }
      if (rol.data.nombre === 'FELCN' || rol.data.nombre === 'FELCN_ADMIN') {
        felcnRechazado = true;
      }
    } catch (e) {
      debug(`No se ha encontrado el rol ${user.id_rol}`);
      return next(new Error(`No se ha encontrado el rol ${user.id_rol}`));
    }

    let estadoCambiar = 'RECHAZADO';
    if (felcnRechazado) {
      detallePlanHistorial = 'FELCN ha rechazado la solicitud';
    } else if (aasanaRechazado) {
      detallePlanHistorial = 'AASANA ha rechazado la solicitud';
    }
    // guardando registro de verificaciones
    try {
      let result = await PlanHistorial.createOrUpdate({
        id_solicitud: parseInt(idSolicitud),
        id_entidad: user.id_entidad,
        fecha: new Date(),
        accion: 'RECHAZADO',
        detalle: detallePlanHistorial,
        id_usuario: user.id,
        _user_created: user.id,
        nombre_usuario: user.usuario
      });
      debug(result);
    } catch (e) {
      debug(`No se pudo crear el registro de verificaciones RPL para solicitud ${idSolicitud}: ${e}`);
    }
    // rechazando toda la solicitud
    let solicitud;
    try {
      solicitud = await PlanSolicitud.createOrUpdate({
        id: idSolicitud,
        estado: estadoCambiar
      });
      debug(solicitud);
    } catch (e) {
      debug(`No se pudo actualizar la solicitud con id ${idSolicitud}`);
      return next(new Error(`No se pudo actualizar la solicitud con id ${idSolicitud}`));
    }
    try {
      debug(`** <Rechazando> ${idSolicitud}`);
      let result = await PlanVuelo.rechazar(parseInt(idSolicitud), user.id);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      res.send(result.data);
    } catch (e) {
      debug(`No se pudo rechazar la solicitud con id ${idSolicitud}: ${e}`);
      return next(new Error(`No se pudo rechazar la solicitud con id ${idSolicitud}`));
    }
  });

  // devuelve una lista con las instancias pendientes para la aprobacion del RPL
  api.get('/planSolicitud/pendientesAprobacion/:idSolicitud', guard.check(['planVuelos:update']), async (req, res, next) => {
    debug(`Consultando rango fechas permitidas para RPL`);

    const { idSolicitud } = req.params;
    let user = await userData(req, services);
    let result = await PlanSolicitud.listaPendientesAprobacion(idSolicitud);
    let puedeAprobar = PlanSolicitud.usuarioPuedeAprobarRpl(user, result);
    return res.send(JSON.stringify({
      puede_aprobar: puedeAprobar,
      pendientes: result
    }));
  });

  // devuelve objeto con rango de fechas permitidas para la solicitud de itinerario
  api.get('/planSolicitud/rangoFechasPermitidas/:idSolicitud', guard.check(['planVuelos:update']), async (req, res, next) => {
    debug(`Consultando rango fechas permitidas para RPL`);

    const { idSolicitud } = req.params;
    let result = await PlanSolicitud.rangoPlanSolicitudes(parseInt(idSolicitud));
    return res.send(JSON.stringify(result));
  });

  // Consultar si se puede crear solicitudes RPL para el itinerario dado
  api.get('/planSolicitud/solicitud/habilitada/crearRPL/:idSolicitud', guard.check(['solicitudes:read']), async (req, res, next) => {
    const { idSolicitud } = req.params;
    debug(`Comprobando si se pueden crear solicitudes RPL para solicitud de itineario ${idSolicitud}`);
    return res.send(await PlanSolicitud.habilitadaCreacionRPL(idSolicitud));
  });

  // Retornar un arreglo con detalles por solicitud RPL y si esta habilitada la creacion de nuevas solicitudes
  api.get('/planVuelo/planSolicitud/habilitacionNuevosRPL', async (req, res, next) => {
    let result = await PlanSolicitud.creacionRPLHabilitadas();
    return res.send(JSON.stringify(result));
  });

  // Planes No Regulares
  // devuelve lista de planes de vuelo No regulares otorgada por AASANA
  api.get('/planesVueloNoRegular/:aeropuerto/:fecha', guard.check(['planVuelos:read']), async (req, res, next) => {
    const { aeropuerto, fecha } = req.params;
    debug(`Consultando planes de vuelo no regulares en '${aeropuerto}' hasta '${fecha}'`);

    if (!fecha) {
      // formato "YYYYMMDD"
      fecha = 'TODOS';
    }
    if (!aeropuerto) {
      aeropuerto = 'TODOS';
    }
    
    let lista = [];
    const response = await Mopsv.aasana.planesNoRegulares.getPlanesVuelo(aeropuerto, fecha);
    // console.log('\n\n\nRESPONSE\n', response, '\n');

    // si un objeto en la lista esta en BD se devuelve ese objeto
    if (response.AASANA === '') {
      return res.send([]);
    }
    for (let i = 0; i < response.AASANA.planvuelo.length; i++) {
      let item = response.AASANA.planvuelo[i];
      let found = await PlanVueloNoRegular.findByCodigoPlanVuelo(item.Cod_PlanVuelo);
      if (found) {
        found.data.detalle.registrado = true;
        // lista.unshift(found.data.detalle);
        lista.unshift({
          Cod_PlanVuelo: found.data.cod_plan_vuelo,
          Fecha_registro: found.data.detalle.fecharegistro,
          Aed_Origen: found.data.detalle.codaerodromo.sigla,
          Aed_Dest: found.data.detalle.aerodromodestino,
          Matricula: found.data.detalle.identificacionaeronave,
          Hora: found.data.detalle.hora,
          registrado: true,
          estado: found.data.detalle.estado
        });
        
      } else {
        item.registrado = false;
        lista.unshift(item);
      }
    }
    return res.send(lista);
  });

  // devuelve el plan de vuelo No regular por codigo de plan de vuelo
  api.get('/planVueloNoRegular/:codPlanVuelo', guard.check(['planVuelos:update']), async (req, res, next) => {
    const { codPlanVuelo } = req.params;

    debug(`Consultando plan de vuelo no regular con codigo ${codPlanVuelo}`);

    const planVueloNoRegular = await Mopsv.aasana.planesNoRegulares.getPlanPorCodigo(codPlanVuelo);
    console.log('\n\n', planVueloNoRegular, '\n\n');
    return res.send(planVueloNoRegular);
  });

  // servicio para consultar pendientes de aprobacion FLCN del plan de vuelo no regular.
  api.post('/planVueloNoRegular/consultar/:codPlanVuelo', guard.check(['planVuelos:read']), async (req, res, next) => {
    const { codPlanVuelo } = req.params;
    debug(`Consultando plan de vuelo no regular ${codPlanVuelo}`);

    let plan = await PlanVueloNoRegular.findByCodigoPlanVuelo(codPlanVuelo);
    let user = await userData(req, services);
    let lista;
    if (!plan) {
      debug(`No se pudo encontrar el FPL ${codPlanVuelo}, tomando valor consultado de servicio de AASANA`);
      plan = await Mopsv.aasana.planesNoRegulares.getPlanPorCodigo(codPlanVuelo);
      plan = plan.planvuelo;
      lista = await PlanVueloNoRegular.listaPendientesAprobacion(plan);
    } else {
      let f = moment(plan.data._created_at).format('YYYY-MM-DD HH:mm');
      let u = plan.data._user_created;
      let nombreUsuario;
      try {
        u = await Usuario.findById(u);
        nombreUsuario = u.data.usuario;
      } catch (e) {
        debug(`Usuario no encontrado ${u}: ${e}`);
        nombreUsuario = 'felcn';
      }
      plan = plan.data.detalle;
      plan.fecha_actualizacion = f;
      plan.actualizadoPor = nombreUsuario;
      lista = await PlanVueloNoRegular.listaPendientesAprobacion(plan);
    }
    let puedeAprobar = await PlanVueloNoRegular.usuarioPuedeAprobarFpl(user, lista);
    return res.send(JSON.stringify({
      puede_aprobar: puedeAprobar,
      pendientes: lista,
      fpl: plan
    }));
  });
  
  // servicio para guardar el estado del plan de vuelo no regular
  api.post('/planVueloNoRegular/guardar', guard.check(['planVuelos:update']), async (req, res, next) => {
    debug(`Guardando plan FPL`);
    try {
      let user = await userData(req, services);
      let data = req.body.fpl;
      data._user_created = user.id;
      data.cod_plan_vuelo = data.codplanvuelo;
      data._updated_at = moment().format('YYYY-MM-DD');
      let item = await PlanVueloNoRegular.findByCodigoPlanVuelo(data.codplanvuelo);
      if (!item) {
        // guardar FPL en la BD como nuevo
        let result;
        try {
          result = await PlanVueloNoRegular.createOrUpdate({
            cod_plan_vuelo: data.codplanvuelo,
            estado: data.estado,
            detalle: data,
            _user_created: user.id
          });
          return res.send(result);
        } catch (e) {
          return res.send({ error: `No se pudo guardar el FPL ${data.codplanvuelo}` });
        }
      }
      // actualizar FPL si ya existe
      item.detalle = data;
      item.estado = data.estado;
      item._updated_at = moment().format('YYYY-MM-DD');
      item._user_updated = user.id;
      let result = await PlanVueloNoRegular.createOrUpdate(item);
      if (!result) {
        return res.send({ error: `No se pudo guardar el FPL ${data.codplanvuelo}` });
      }
      return res.send(result);
    } catch (e) {
      return next(e);
    }
  });

  // servicio para consultar estado del plan de vuelo no regular
  api.get('/planVueloNoRegular/ws/consultarEstado/:codPlanVuelo', async (req, res, next) => {
    const { codPlanVuelo } = req.params;
    debug(`Consultado estado de plan de vuelo no regulares con codigo ${codPlanVuelo}`);

    if (!codPlanVuelo) {
      return res.send({ error: 'No se ha recibido codigo_plan_vuelo' });
    }

    let plan;
    try {
      plan = await PlanVueloNoRegular.findByCodigoPlanVuelo(codPlanVuelo);
      if (!plan) {
        return res.send({ error: `No se ha encontrado el plan FPL con codigo ${codPlanVuelo}:` });
      }
    } catch (e) {
      debug(`No se ha encontrado el plan FPL con codigo ${codPlanVuelo}: ${e}`);
      return res.send({ error: `No se ha recibido el plan de vuelo no regular con codigo ${codPlanVuelo}` });
    }

    let user;
    try {
      user = await Usuario.findById(plan.data._user_created);
    } catch (e) {
      debug(`No existe el usuario ${plan.data._user_created}`);
    }

    return res.send(JSON.stringify(
      {
        estado: plan.data.estado,
        fecha_actualizacion: moment(plan.data._created_at).format('YYYY-MM-DD HH:mm'),
        usuario: user.data.usuario
      }));
  });
  
  // servicio para actualizar el estado del plan de vuelo no regular (revisar si dar de baja)
  /*
  api.post('/planVueloNoRegular/ws/actualizarEstado/:codPlanVuelo/:estado', guard.check(['planVuelos:update']), async (req, res, next) => {
    const { codPlanVuelo, estado } = req.params;
    debug(`Actualizando estado de plan de vuelo no regulares con codigo ${codPlanVuelo} a ${estado}`);
    if (!codPlanVuelo) {
      return res.send({ error: 'No se ha recibido codigo_plan_vuelo' });
    }
    if (!estado) {
      return res.send({ error: 'Estado incorrecto, posibles: APROBADO, RECHAZADO, OBSERVADO' });
    }

    let user = await userData(req, services);

    let planVuelo = await PlanVueloNoRegular.actualizarEstado(codPlanVuelo, estado, user.id);
    if (!planVuelo) {
      return res.send({ error: `No se pudo actualizar plan con codigo '${codPlanVuelo}' a estado '${estado}'` });
    }
    return res.send({ success: true });
  });
   */
  return api;
};
