'use strict';
const debug = require('debug')('app:service:planVuelos');

module.exports = function planVueloService (repositories, res) {
  const { planVuelos, planSolicitudes, aeropuertos, operadores, solicitudes, itinerarios, aeronaves, usuarios, itinerarioHistorial } = repositories;

  async function findAll (params = {}) {
    debug('Lista de plan de Vuelos');

    let lista;
    try {
      lista = await planVuelos.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error('Error al obtener el plan de vuelos'));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando el plan de vuelos por ID');

    let planVuelo;
    try {
      planVuelo = await planVuelos.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!planVuelo) {
      return res.error(new Error(`Plan de vuelos ${id} no encontrado`));
    }

    return res.success(planVuelo);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar plan de vuelo');
    let planVuelo;

    try {
      planVuelo = await planVuelos.createorUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!planVuelo) {
      return res.error(new Error('El plan de vuelo no pudo ser creado'));
    }

    return res.success(planVuelo);
  }

  async function deleteItem (id) {
    debug('Eliminando plan de vuelo');

    let deleted;
    try {
      deleted = await planVuelos.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error('No existe el plan de vuelo'));
    }

    if (deleted === 0) {
      return res.error(new Error('El plan de vuelo ya fue eliminado'));
    }

    return res.success(deleted > 0);
  }

  async function planVuelosRepetitivosFormGeneral (idSolicitud) {
    debug('Consultando formulario de plan de vuelos repetitivos ', idSolicitud);

    let solicitud = null;
    try {
      solicitud = await solicitudes.findById(idSolicitud);
      if (solicitud.estado !== 'APROBADO' && solicitud.estado !== 'PLAN_VUELO_APROBADO') {
        return res.error(new Error('Solo se puede crear planes de vuelo para solicitudes aprobadas o habilitadas para enerar planes de vuelo repetitivos'));
      }
    } catch (e) {
      console.log('obteniendo solicitudes');
      return res.error(e);
    }

    let explorador = '';
    let operadorId = 0;
    try {
      let operadorItem = await operadores.findById(solicitud.id_operador);
      explorador = operadorItem.sigla;
      operadorId = operadorItem.id;
    } catch (e) {
      console.log('en obtener operador');
      return res.error(e);
    }
    let aeropuertosSalida = [];
    let itemAeropuertos = [];
    let itinerarioItems = null;
    try {
      itinerarioItems = await itinerarios.findAll({ id_solicitud: idSolicitud });
    } catch (e) {
      debug('itinerario Error');
      return res.error(e);
    }
    for (let i = 0; i < itinerarioItems.count; i++) {
      try {
        let aeropuerto = await aeropuertos.findById(itinerarioItems.rows[i].id_aeropuerto_salida);
        if (aeropuertosSalida.indexOf(aeropuerto.codigo_iata) === -1) {
          aeropuertosSalida.push(aeropuerto.codigo_iata);
          itemAeropuertos.push({ id: aeropuerto.id, codigo_iata: aeropuerto.codigo_iata });
        }
      } catch (e) {
        console.log('Aeropuerto error ');
        return res.error(e);
      }
    }
    let numSerie = solicitud.fecha_inicio.substring(2, 4) + '-' + ('0' + idSolicitud).slice(-2);
    let resp = {
      explorador: explorador,
      id_operador: operadorId,
      num_serie: numSerie,
      aeropuertos_salida: itemAeropuertos
    };
    return res.success(resp);
  }

  async function planVuelosRepetitivosFormDetallado (id) {
    debug('Devolviendo datos para plan de vuelo repetitivo detallados para solicitud', id);

    let planSolicitud;
    try {
      planSolicitud = await planSolicitudes.findById(id);
    } catch (e) {
      return res.error(e);
    }

    let planesVuelos;
    try {
      planesVuelos = await planVuelos.findAll({ id_solicitud: planSolicitud.id });
    } catch (e) {
      debug('No se ha encontrado plan de vuelo para solicitud RPL', planSolicitud.id);
      return res.error(e);
    }

    let planVuelosRepetitivosFormDetallado = [];
    for (let i = 0; i < planesVuelos.count; i++) {
      let planVueloItem = planesVuelos.rows[i];
      let planVuelosRepetitivosDetallado = {};
      planVuelosRepetitivosDetallado.plan_de_vuelo = planVueloItem;
      // datos de la aeronave
      try {
        let aeronave = await aeronaves.findById(planVueloItem.id_aeronave);
        planVuelosRepetitivosDetallado.aeronave_matricula = aeronave.matricula;
        planVuelosRepetitivosDetallado.aeronave_tipo = aeronave.tipo;
        planVuelosRepetitivosDetallado.aeronave_categoria_estela = aeronave.categoria_estela;
      } catch (e) {
        debug('No se ha encontrado la aeronave con id', planVueloItem.id_aeronave);
      }

      // datos de aerodromos
      try {
        let aerodromoSalida = await aeropuertos.findById(planVueloItem.id_aeropuerto_salida);
        planVuelosRepetitivosDetallado.aerodromo_salida_iata = aerodromoSalida.codigo_iata;
      } catch (e) {
        debug('No se ha encontrado la aeropuerto con id', planVueloItem.id_aeropuerto_salida);
      }
      try {
        let aerodromoDestino = await aeropuertos.findById(planVueloItem.id_aeropuerto_salida);
        planVuelosRepetitivosDetallado.aerodromo_destino_iata = aerodromoDestino.codigo_iata;
      } catch (e) {
        debug('No se ha encontrado la aeropuerto con id', planVueloItem.id_aeropuerto_salida);
      }
      planVuelosRepetitivosFormDetallado.push(planVuelosRepetitivosDetallado);
    }

    return res.success({ planes_de_vuelo: planVuelosRepetitivosFormDetallado });
  }

  async function aprobar (idSolicitud, idUsuario) {
    debug('::Aprobar todos los planes de vuelo::');
    try {
      let items = await planVuelos.findAll({ id_solicitud: idSolicitud });
      let planSolicitud = await planSolicitudes.findById(idSolicitud);
      let usuario = await usuarios.findById(idUsuario);
      let solicitudItinerario = await solicitudes.findById(planSolicitud.id_solicitud_itinerario);
      console.log('\n\nItems:', items);
      for (let i = 0; i < items.count; i++) {
        await planVuelos.createorUpdate({
          id: items.rows[i].id,
          estado: 'APROBADO',
          _user_updated: idUsuario,
          _updated_at: new Date()
        });
      }
      try {
        let obj = {
          id_solicitud: solicitudItinerario.id,
          id_entidad: usuario.id_entidad,
          _user_created: usuario.id,
          nombre_usuario: usuario.usuario,
          id_usuario: usuario.id,
          fecha: new Date(),
          accion: 'PLAN_VUELO_APROBADO',
          detalle: `${usuario.usuario} ha aprobado el plan de vuelo para el itinerario`
        };
        let historial = await itinerarioHistorial.createOrUpdate(obj);
        debug(`Registrado historial de solicitud de itienrario ${historial}`);
      } catch (e) {
        debug(`Error al registrar historial: ${e}`);
      }
      solicitudItinerario.estado = 'PLAN_VUELO_APROBADO';
      await solicitudes.createOrUpdate(solicitudItinerario);
      return res.success(items);
    } catch (e) {
      console.log('Error al intentar aprobar solicitudes de plan de vuelos', e);
      return res.error(e);
    }
  }

  async function rechazar (idSolicitud, idUsuario) {
    debug('::Rechazar todos los planes de vuelo::');
    try {
      let items = await planVuelos.findAll({ id_solicitud: idSolicitud });
      let planSolicitud = await planSolicitudes.findById(idSolicitud);
      debug('plan de solicitud', planSolicitud);
      console.log('***** items encontrados:', items);
      for (let i = 0; i < items.count; i++) {
        await planVuelos.createorUpdate({
          id: items.rows[i].id,
          estado: 'RECHAZADO',
          _user_updated: idUsuario,
          _updated_at: new Date()
        });
      }
      return res.success(items);
    } catch (e) {
      return res.error(e);
    }
  }

  async function solicitar (idSolicitud, idUsuario) {
    debug('::Solicitar todos los planes de vuelo::');
    try {
      let items = await planVuelos.findAll({ id_solicitud: idSolicitud });
      console.log('\n\nItems', items);
      for (let i = 0; i < items.count; i++) {
        await planVuelos.createorUpdate({
          id: items.rows[i].id,
          estado: 'SOLICITADO',
          _user_updated: idUsuario,
          _updated_at: new Date()
        });
      }
      return res.success(items);
    } catch (e) {
      return res.error(e);
    }
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem,
    planVuelosRepetitivosFormGeneral,
    planVuelosRepetitivosFormDetallado,
    aprobar,
    solicitar,
    rechazar
  };
};
