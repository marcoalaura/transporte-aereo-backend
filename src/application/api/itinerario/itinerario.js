'use strict';

const debug = require('debug')('app:api:itinerario');
const guard = require('express-jwt-permissions')();
const { userData } = require('../../lib/auth');

module.exports = function setupAeronave (api, services) {
  const { Solicitud, Itinerario, Mopsv, Conexion } = services;

  // Crear itinerarios en bloque
  api.post('/itinerario/save-all', guard.check(['itinerarios:read']), async (req, res, next) => {
    debug('Guardando itinerarios');

    try {
      let user = await userData(req, services);
      const { itinerarios } = req.body;

      let result = await Itinerario.createAll(itinerarios, user.id);

      if (result.code === -1) {
        return res.status(412).send({ error: result.message });
      }

      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error(`Ocurrió un error al guardar los itinerarios`));
      }
    } catch (e) {
      return next(e);
    }
  });

  // Validar solicitud
  api.get('/itinerario/validar/:idSolicitud', guard.check(['solicitudes:read']), async (req, res, next) => {
    debug('Validando solicitud de itinerarios');
    try {
      const { idSolicitud } = req.params;

      let user = await userData(req, services);
      const result = await Solicitud.validar(idSolicitud, user);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo validar la solicitud de itinerarios'));
      }
    } catch (e) {
      return next(e);
    }
  });

  api.get('/sabsa/itinerarios/:idAeropuerto', async (req, res, next) => {
    debug('Obteniendo itinerarios desde sabsa');
    try {
      const { idAeropuerto } = req.params;
      const result = await Mopsv.sabsa.itinerariosWeb(idAeropuerto);
      res.send(result);
    } catch (e) {
      if (e.message && (e.message.indexOf('getaddrinfo') !== -1 || e.message.indexOf('ECONNREFUSED') !== -1)) {
        return res.status(412).send({ error: 'No se puede obtener los itinerarios en estos momentos, inténtelo en más tarde.' });
      }
      return next(e);
    }
  });

  api.get('/itinerario/conexiones/:idItinerario', async (req, res, next) => {
    const { idItinerario } = req.params;
    debug(`Obteniendo las conexiones para el itinerario ${idItinerario}`);

    try {
      const result = await Conexion.findItinerariosDestino(idItinerario);
      res.status(200).send(result);
    } catch (e) {
      return res.status(400).send({ error: `Error al obtener las conexiones: ${e}` });
    }
  });

  api.get('/vigentes/:idOperador/:fechaInicio/:fechaFin', async (req, res, next) => {
    const { idOperador, fechaInicio, fechaFin } = req.params;

    let user = await userData(req, services);
    console.log('user:::::', user);
    if (user['rol.nombre'] !== 'ATT' && user['rol.nombre'] !== 'SUPERADMIN') {
      return res.status(403).json({ mensaje: 'No permitido' });
    }
    try {
      const lista = await Itinerario.findByIdOperadorYRangoFechas(idOperador, fechaInicio, fechaFin);
      return res.status(200).json({ operador: idOperador, desde: fechaInicio, hasta: fechaFin,
                                    resultado: lista });
    } catch (e) {
      return res.status(400).send({ error: "Error al consultar itinerarios vigentes", detalle: e.message });
    }
    
  });

  api.get('/itinerario/itinerariosPermitidos/:idItinerario', async (req, res, next) => {
    debug('Obteniendo itinerarios con los que se puede conectar el itinerario');
    const { idItinerario } = req.params;
    try {
      const result = await Conexion.itinerariosPermitidos(idItinerario);
      res.status(200).send(result);
    } catch (e) {
      return res.status(400).send({ error: `Error al obtener itinerarios para conexion: ${e}` });
    }
  });

  return api;
};
