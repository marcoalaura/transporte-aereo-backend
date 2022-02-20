'use strict';

const debug = require('debug')('app:service:planSolicitudes');
const time = require('../../lib/time');
const moment = require('moment');
// const Op = require('sequelize').Op;

module.exports = function planSolicitudService (repositories, res) {
  const { Parametro, planSolicitudes, planHistorial, aeropuertoSalidas, planVuelos, solicitudes, itinerarios, usuarios, roles, itinerarioHistorial, transaction } = repositories;

  async function findAll (params = {}, role) {
    debug('Lista de plan de solicitudes');
    /* REGLA:
     Para el rol FELCN, se tiene un usuario por cada aeropuerto. FELCN solo puede visualizar
     solicitudes RPL correspondientes su aeropuerto.

     EJ: Para el usuario FELCN_EL_ALTO solo puede ver/aprobar/rechazar solicitudes que correspondan
     al aeropuerto EL_ALTO. Es decir los itinerarios que tienen como aeropuerto de salida EL_ALTO
     */
    let usuario;
    let rol;
    let comprobarFelcn = false;

    try {
      usuario = await usuarios.findById(parseInt(params.id_usuario));
      // console.log('**** usuario consultado', usuario);
    } catch (e) {
      debug(`No se ha podido obtener el usuario ${params.id_usuario}: ${e}`);
      return (new Error(`Error obteniendo usuario de la solicitud`));
    }
    try {
      rol = await roles.findById(usuario.id_rol);
      if (rol.nombre.startsWith('FELCN')) {
        comprobarFelcn = true;
      }
    } catch (e) {
      debug(`No se ha podido obtener el rol con id ${usuario.id_rol}: ${e}`);
      return (new Error(`Error obteniendo rol del usuario de la solicitud`));
    }

    switch (role) {
      case 'DGAC_ADMIN': case 'DGAC': case 'SABSA_ADMIN': case 'SABSA': case 'AASANA_ADMIN': case 'AASANA': case 'FELCN_ADMIN': case 'FELCN':
        params.estados = ['SOLICITADO', 'APROBADO', 'OBSERVADO', 'APROBADO_AASANA', 'APROBADO_FELCN'];
        break;
    }

    let lista;
    if (comprobarFelcn) {
      lista = { count: 0, rows: [] };
      try {
        let items = await planSolicitudes.findAll(params);
        for (let i = 0; i < items.rows.length; i++) {
          let test = await solicitudTieneVuelosQueSalenDeAeropuerto(items.rows[i].id, usuario.id_aeropuerto);
          if (test) {
            lista.count++;
            lista.rows.push(items.rows[i]);
          }
        }
      } catch (e) {
        return res.error(e);
      }
      return res.success(lista);
    } else {
      try {
        lista = await planSolicitudes.findAll(params);
      } catch (e) {
        return res.error(e);
      }
    }

    if (!lista) {
      return res.error(new Error('Error al obtener el plan de vuelos'));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando el plan de solicitudes por ID');

    let planSolicitud;
    try {
      planSolicitud = await planSolicitudes.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!planSolicitud) {
      return res.error(new Error(`plan de solicitudes no encontrado`));
    }

    return res.success(planSolicitud);
  }

  async function findByIdItinerario (id) {
    debug(`Buscando el plan de solicitudes para el itinerario con ID ${id}`);

    let planSolicitud;
    try {
      planSolicitud = await planSolicitudes.findByIdItinerario(id);
    } catch (e) {
      return res.error(e);
    }

    if (!planSolicitud) {
      return res.error(new Error(`plan de solicitudes para itinerario no encontrado`));
    }

    return res.success(planSolicitud);
  }

  async function findLatestByIdItinerario (idItinerario) {
    debug('Obteniendo el ultimo plan de solicitud del itinerario');

    let planSolicitud;
    try {
      planSolicitud = await planSolicitudes.findLatestByIdItinerario(idItinerario);
      debug('ULTIMO PLAN SOLICITUD OBTENIDO CON ÉXITO', planSolicitud);
    } catch (e) {
      debug(`No se ha podido obtener el último registro:: ${e}`);
      return res.error(e);
    }

    if (!planSolicitud) {
      return res.error(new Error(`plan de solicitudes para itinerario no encontrado`));
    }

    return res.success(planSolicitud);
  }

  async function createOrUpdate (data) {
    debug(`Crear o actualizar plan de solicitudes RPL ${new Date()}`);
    let r = await Parametro.getParam('DIAS_ANTICIPACION_CREACION_RPL');
    const diasAnticipacionCreacionSolicitud = parseInt(r.valor);

    let solicitud;
    let usuario;
    console.log('\n\ndatos siendo solicitados', data);
    let t = await transaction.create();
    try {
      if (!data.id) {
        // usualmente para crear un nuevo objeto no se envia un campo 'id'
        usuario = await usuarios.findById(data._user_created);
        solicitud = await solicitudes.findById(data.id_solicitud_itinerario);
        console.log('************* Solicitud de itinerario encontrada', solicitud);
        if (solicitud.estado !== 'APROBADO' && solicitud.estado !== 'PLAN_VUELO_APROBADO') {
          return res.error(new Error('Solo se pueden crear planes de vuelo para solicitudes aprobadas o habilitadas para crear planes de vuelo'));
        }
        let creacionRPLHabilitada = await habilitadaCreacionRPL(solicitud, true);
        let rangoPermitido = creacionRPLHabilitada.rango;
        if (!creacionRPLHabilitada.res) {
          transaction.rollback(t);
          return res.error(new Error(`La fecha de vigencia del plan de Vuelos repetitivo no esta en un rango permitido. Debe ser con ${diasAnticipacionCreacionSolicitud} días de anticipación y no exceder la fecha de la solicitud de itinerario aprobada.`));
        }
        // comprobando fechas de solicitud de itinerario y fecha solicitada
        if (data.fecha_desde >= moment(rangoPermitido.hasta) || data.fecha_hasta > moment(rangoPermitido.hasta) || data.fecha_hasta < moment(rangoPermitido.desde)) {
          transaction.rollback(t);
          return res.error(new Error(`La fecha de vigencia del plan de Vuelos repetitivo no esta en un rango permitido. No puede exceder la fecha de la solicitud de itinerario aprobada.`));
        }
        // escribiendo cambios en el historial de solicitudes de itinerarios
        let obj = {
          id_solicitud: solicitud.id,
          id_entidad: usuario.id_entidad,
          _user_created: usuario.id,
          id_usuario: usuario.id,
          nombre_usuario: usuario.usuario,
          fecha: new Date(),
          accion: 'PLAN_VUELO_CREADO',
          detalle: `${usuario.usuario} ha creado el plan de vuelo para el itinerario`
        };
        let historial = await itinerarioHistorial.createOrUpdate(obj, t);
        if (historial) {
          debug(`Registrado historial de solicitud de itinerario ${historial}`);
        } else {
          debug(`No se ha podido registrar en el historial de solicitudes de itinerarios: ${obj}`);
          transaction.rollback(t);
          return res.error(new Error('Error registrando en historial, no se pudo crear el plan de solicitudes de itinerario'));
        }
      }
      let planSolicitud;
      try {
        planSolicitud = await planSolicitudes.createorUpdate(data, t);
      } catch (e) {
        debug(`No se ha podido crear plan de solicitud con datos: ${data}: ${e}`);
        transaction.rollback(t);
        return res.error(new Error(`No se ha podido crear plan de solicitud`));
      }
      let creados = true;
      let items = await planVuelos.findAll({ id_solicitud: planSolicitud.id });
      if (items.count > 0) {
        creados = true;
      } else {
        creados = false;
      }
      if (!creados) {
        // creando planes de vuelo
        let items = await crearPlanesVuelo(planSolicitud, data._user_created, t);
        debug('\n\n***********Planes de vuelo creados automaticamente:', items, '***************\n\n');
        if (!Array.isArray(items)) {
          debug(`Error creando planes de vuelo`);
          transaction.rollback(t);
          return res.error(`Error creando planes de vuelo`);
        }
      }
      // actulizando estado de la solicitud de itinerarios
      solicitud = await solicitudes.findById(planSolicitud.id_solicitud_itinerario);
      solicitud.estado = 'PLAN_VUELO_CREADO';
      try {
        solicitud = await solicitudes.createOrUpdate(solicitud, t);
      } catch (e) {
        debug(`No se pudo actualizar la solicitud ${solicitud}: ${e}`);
        transaction.rollback(t);
        return res.error(`No se pudo actualizar la solicitud de itinerarios`);
      }
      // escribiendo cambios
      transaction.commit(t);
      return res.success(planSolicitud);
    } catch (e) {
      transaction.rollback(t); // por si no se ejecutan automaticamente los rollbacks
      return res.error(e);
    }
  }

  async function updateOnly (data) {
    debug('Actualizando plan de solicitudes');

    let planSolicitud;
    try {
      planSolicitud = await planSolicitudes.createorUpdate(data);
    } catch (e) {
      return res.error(e);
    }
    return res.success(planSolicitud);
  }

  async function deleteItem (id) {
    debug('Eliminando plan de solicitudes');

    let deleted;
    try {
      deleted = await planSolicitudes.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error('No existe el plan de solicitudes'));
    }

    if (deleted === 0) {
      return res.error(new Error('El plan de solicitudes ya fue eliminado'));
    }

    return res.success(deleted > 0);
  }

  async function crearPlanesVuelo (planSolicitud, userId, t) {
    // crea planes de vuelos para planes de solicitudes aprobadas y retorna la lista de planes creados
    let solicitud;
    try {
      solicitud = await solicitudes.findById(planSolicitud.id_solicitud_itinerario);
    } catch (e) {
      debug('No se ha podido consultar una solicitud de itinerarios para ', planSolicitud.id_solicitud_itinerario, ':', e);
      return res.error(e);
    }
    let itinerarioItems;
    try {
      itinerarioItems = await itinerarios.findAll({ id_solicitud: solicitud.id });
    } catch (e) {
      debug(`No se han encontrado itinerarios para solicitud ${solicitud.id}: ${e}`);
      return res.error(e);
    }
    let items = [];
    for (let i = 0; i < itinerarioItems.count; i++) {
      let itinerario = itinerarioItems.rows[i];
      if (itinerario.estado === 'APROBADO') {
        // aqui ir creando por cada itinerario
        let obj = {};
        obj.id_solicitud = planSolicitud.id;
        obj.id_aeronave = itinerario.id_aeronave;
        obj.id_aeropuerto_salida = itinerario.id_aeropuerto_salida;
        obj.id_aeropuerto_destino = itinerario.id_aeropuerto_llegada;
        // obj.fecha_desde = solicitud.fecha_inicio;
        // obj.fecha_hasta = solicitud.fecha_fin;
        obj.fecha_desde = planSolicitud.fecha_desde;
        obj.fecha_hasta = planSolicitud.fecha_hasta;
        obj.dia_1 = itinerario.dia_1;
        obj.dia_2 = itinerario.dia_2;
        obj.dia_3 = itinerario.dia_3;
        obj.dia_4 = itinerario.dia_4;
        obj.dia_5 = itinerario.dia_5;
        obj.dia_6 = itinerario.dia_6;
        obj.dia_7 = itinerario.dia_7;
        obj.hora_salida = itinerario.hora_despegue;
        obj.Velocidad_crucero = '0';
        obj.ruta = '';
        obj.nivel_crucero = '';
        let dm = time.diff(itinerario.hora_despegue, itinerario.hora_aterrizaje);
        obj.duracion_total = ('00' + parseInt(dm / 60)).slice(-2) + ('00' + dm % 60).slice(-2);
        obj.observacion = '';
        obj.estado = 'CREADO';
        obj._user_created = planSolicitud._user_created;
        try {
          let planVueloCreado = await planVuelos.createorUpdate(obj, t);
          if (planVueloCreado) {
            items.push(planVueloCreado);
          } else {
            debug(`No se ha creado el plan de vuelos ${obj}`);
          }
        } catch (e) {
          debug('error al crear el plan de solicitud de vuelo para itinerario', itinerario.id, ':', e, 'objeto', obj);
          return res.error(e);
        }
      }
    }
    return items;
  }

  async function solicitudTieneVuelosQueSalenDeAeropuerto (idSolicitud, idAeropuerto) {
    try {
      let items = await aeropuertoSalidas.findAll({ id_solicitud: idSolicitud });
      for (let i = 0; i < items.count; i++) {
        if (items.rows[i].id_aeropuerto === idAeropuerto) {
          return true;
        }
      }
      return false;
    } catch (e) {
      debug(`No se ha podido encontrar planes de vuelo RPL para id solicitud ${idSolicitud}: ${e}`);
      return false;
    }
  }

  async function habilitadaCreacionRPL (solicitud, retRango) {
    /* Comprueba las condiciones de fechas para crear una nueva solicitud de planes de
     vuelo repetitivos (RPL) de acuerdo a la solicitud de itinerario dada.
     */
    let res = await Parametro.getParam('DIAS_ANTICIPACION_CREACION_RPL');
    const diasAnticipacionCreacionSolicitud = parseInt(res.valor);
    let rangoPermitido = await rangoPlanSolicitudes(solicitud.id);
    let solicitudesRPL;
    // cuando no hay mas fechas disponibles
    if (rangoPermitido.desde === rangoPermitido.hasta) {
      return {
        limite: true,
        can: false
      };
      /* La fecha fin del ultimo plan de vuelo para la solicitud coincide con
      // la fecha fin del itinerario, por tanto, limite alcanzado */
    }
    // comprobando si existen solicitudes RPL pendientes
    try {
      solicitudesRPL = await planSolicitudes.findAll(
        {
          id_solicitud_itinerario: solicitud.id,
          estados: ['CREADO', 'SOLICITADO', 'APROBADO_FELCN']
        });
      if (solicitudesRPL.rows.length !== 0) {
        console.log(':::::::::: Existen solicitudes pendientes para:', solicitud.id);
        // return false;
        return {
          limite: false,
          can: false
        };
      }
    } catch (e) {
      debug(`No se han encontrado solicitudes pendientes: ${e}`);
    }
    try {
      solicitudesRPL = await planSolicitudes.findAll(
        { id_solicitud_itinerario: solicitud.id,
          order: '-fecha_hasta',
          estados: ['APROBADO_AASANA', 'APROBADO'],
          limit: 1
        });
      if (solicitudesRPL.rows.length === 0) {
        // no existen solicitudes RPL creadas solo comprobar la fecha desde
        console.log('>>>>>>>>>>>>>>>> no existen RPLS');
        const desde = moment(rangoPermitido.desde);
        const ahora = moment();
        const hasta = moment(rangoPermitido.hasta);
        let resultado = (ahora < hasta) && (ahora < desde.subtract(diasAnticipacionCreacionSolicitud, 'days'));
        console.log('desde', desde, 'hasta', hasta);
        console.log('(ahora < hasta):', (ahora < hasta), " desde.add(diasAnticipacionCreacionSolicitud, 'days')", desde.add(diasAnticipacionCreacionSolicitud), "(moment() < desde.add(diasAnticipacionCreacionSolicitud, 'days'):", (moment() < desde.add(diasAnticipacionCreacionSolicitud, 'days')), 'RES:', resultado);

        if (retRango) {
          return { res: resultado, rango: rangoPermitido };
        }
        return {
          limite: false,
          can: resultado
        };
      }
    } catch (e) {
      debug(`No se pudo obtener los planes de solicitud RPL para la solicitud de itinerario ${solicitud.id}: ${e}`);
      return false;
    }
    /* controla:
     - que la fecha de finalizacion solicitada no sea superior a la fecha de finalizacion del Plan de solicitudes aprobado
     - que la fecha de inicio sea al menos x dias menor que la fecha del ultimo plan de vuelos RPL aprobado
     */
    let hasta = moment(rangoPermitido.hasta);
    let desde = moment(rangoPermitido.desde);
    const ahora = moment();
    let resultado = (ahora < desde.subtract(diasAnticipacionCreacionSolicitud, 'days')) && (ahora < hasta);
    // console.log('  >>>>>> desd', desde, 'hasta', hasta,' : ', ahora < desde.subtract(diasAnticipacionCreacionSolicitud, 'days'), ' : ', (ahora < hasta), 'RES:', resultado);
    if (retRango) {
      return { res: resultado, rango: rangoPermitido };
    }
    return { can: resultado, limite: false };
  }

  async function rangoPlanSolicitudes (idSolicitud) {
    /* Retorna la fecha minima y maxima en la que se permite la creacion de un plan RPL para
     la solicitud de itinerario con el id respectivo o {} si no se encuentra. */
    let solicitud;
    try {
      solicitud = await solicitudes.findById(parseInt(idSolicitud));
    } catch (e) {
      debug(`No se ha encontrado la solicitud de itinerario con id ${idSolicitud}: ${e}`);
      return {};
    }
    let solicitudesRPL;
    try {
      solicitudesRPL = await planSolicitudes.findAll({
        id_solicitud_itinerario:
        parseInt(idSolicitud),
        order: '-fecha_hasta',
        limit: 1,
        estados: ['APROBADO_AASANA', 'APROBADO']
      });
      if (solicitudesRPL.rows.length === 0) {
        console.log(' 0 >>>> RANGO permitido:', { desde: solicitud.fecha_inicio, hasta: solicitud.fecha_fin });
        return {
          desde: solicitud.fecha_inicio,
          hasta: solicitud.fecha_fin
        };
      }
      console.log('>>>>> RANGO permitido:', { desde: solicitudesRPL.rows[0].fecha_hasta, hasta: solicitud.fecha_fin });
      return {
        desde: solicitudesRPL.rows[0].fecha_hasta,
        hasta: solicitud.fecha_fin
      };
    } catch (e) {
      debug(`No se pudo obtener los planes de solicitud RPL para la solicitud de itinerario ${solicitud.id}: ${e}`);
      return {};
    }
  }

  async function creacionRPLHabilitadas () {
    let items = await solicitudes.findAll();
    let arreglo = [];
    for (let i = 0; i < items.rows.length; i++) {
      let idstr = items.rows[i].id + '';
      let obj = {};
      let item = await habilitadaCreacionRPL(items.rows[i]);
      obj.id = idstr;
      obj.can = item.can;
      obj.limite = item.limite;
      arreglo.push(obj);
    }
    return arreglo;
  }

  async function listaPendientesAprobacion (idSolicitud) {
    /* Realiza la comprobacion del flujo de aprobacion de este plan RPL
     Reglas para cada vuelo en la solicitud:

     - Si el aeropuerto de salida es de Bolivia y tiene codigo IATA se agrega a la lista de aprobacion el usuario felcn designado a tal aeropuerto.
     - En todos los casos AASANA se agrega a la lista de aprobacion

     Se comprueba en el historial si todas las instancias en la lista de aprobacion han aprobado la solicitud RPL. Solo en ese caso se cambia el estado de la solicitud RPL a aprobado y se termina el flujo de aprobacion.

     Esta funcion retorna la lista de instancias pendientes de aprobacion.
     */
    let aeropuertosFelcn = await aeropuertosParaAprobacionFelcn(idSolicitud);
    // comprobando las instancias pendientes necesarias
    let itemsHistorial;
    try {
      itemsHistorial = await planHistorial.findAll({
        id_solicitud: parseInt(idSolicitud),
        order: '-fecha',
        limit: aeropuertosFelcn.length + 2
      });
      // console.log('\n\n items en el historial por fecha', itemsHistorial);
    } catch (e) {
      debug(`No se ha podido recuperar los registros de historial para solicitud ${idSolicitud}: ${e}`);
    }
    let pendientes = [];
    let aprobadoAasana = false;
    // ordenando de acuerdo al historial se debe tomar en cuenta solo desde la ultima peticion solicitada o rechazada
    let inicio = 0;
    for (let i = 0; i < itemsHistorial.rows.length; i++) {
      let item = itemsHistorial.rows[i];
      if (item.accion === 'SOLICITADO') {
        inicio = i;
      }
      if (item.accion === 'RECHAZADO') {
        inicio = i;
        console.log('rechazado en', i);
        break;
      }
    }
    console.log('::::::::::::::inicio', inicio, 'rows.length', itemsHistorial.rows.length);
    // comprobando aprobacion segun historial
    for (let i = 0; i < inicio; i++) {
      let usuario;
      let item = itemsHistorial.rows[i];
      // console.log('>>> item probando (',i,'):', item);
      try {
        usuario = await usuarios.findById(item._user_created);
      } catch (e) {
        debug(`usuario no encontrado ${item._user_created}: ${e}`);
      }
      if (usuario['rol.nombre'] === 'FELCN' && item.accion === 'APROBADO') {
        // buscando el usuario esta en la lista de aprobacion pendiente
        for (let j = 0; j < aeropuertosFelcn.length; j++) {
          if (usuario.id_aeropuerto === aeropuertosFelcn[j].id) {
            aeropuertosFelcn.splice(j, 1);
          }
        }
      }
      if (item['entidad.sigla'] === 'AASANA' && item.accion === 'APROBADO') {
        aprobadoAasana = true;
      }
    }
    aeropuertosFelcn.forEach(item => {
      pendientes.push({ id: item.id, nombre: 'FELCN ' + item.codigo_iata, aeropuerto: item.nombre });
    });
    if (!aprobadoAasana) {
      pendientes.push({ nombre: 'AASANA', aeropuerto: '' });
    }
    console.log('\n\npendientes', pendientes);
    return pendientes;
  }

  async function aeropuertosParaAprobacionFelcn (idSolicitud) {
    /*
     - Si el aeropuerto de salida es de Bolivia y tiene codigo IATA se agrega a la lista de aprobacion el usuario felcn designado a tal aeropuerto.

     Devuelve una lista del tipo:
     [{ id: idAeropuerto, codigo_iata: codigoIata, nombre: nombre }, ...]
     */
    let lista = [];
    let planSolicitud;
    try {
      planSolicitud = await planSolicitudes.findById(parseInt(idSolicitud));
    } catch (e) {
      debug(`No se ha encontrado la solicitud con id ${idSolicitud}: ${e}`);
    }
    let aeropuertosDeSalida;
    try {
      aeropuertosDeSalida = await aeropuertoSalidas.findAll({ id_solicitud: planSolicitud.id });
    } catch (e) {
      debug(`No se han encontrado los aeropuertos de salida para solicitud ${planSolicitud.id}: ${e}`);
    }
    aeropuertosDeSalida.rows.forEach((item) => {
      if (item['aeropuerto.codigo_iata'] !== 'N/A' && item['aeropuerto.pais'] === 'BOLIVIA') {
        let obj = {
          id: item.id_aeropuerto,
          codigo_iata: item['aeropuerto.codigo_iata'],
          nombre: item['aeropuerto.nombre']
        };
        lista.push(obj);
      }
    });
    return lista;
  }

  function usuarioPuedeAprobarRpl (user, listaPendientesAprobacion) {
    /* Comprueba si el usuario dado puede aprobar la solicitud RPL */
    for (let i = 0; i < listaPendientesAprobacion.length; i++) {
      let item = listaPendientesAprobacion[i];
      if (user.id_aeropuerto === item.id && user['rol.nombre'] === 'FELCN') {
        return true;
      }
    }
    return false;
  }

  return {
    findAll,
    findById,
    findByIdItinerario,
    createOrUpdate,
    deleteItem,
    updateOnly,
    solicitudTieneVuelosQueSalenDeAeropuerto,
    creacionRPLHabilitadas,
    rangoPlanSolicitudes,
    aeropuertosParaAprobacionFelcn,
    listaPendientesAprobacion,
    usuarioPuedeAprobarRpl,
    findLatestByIdItinerario
  };
};
