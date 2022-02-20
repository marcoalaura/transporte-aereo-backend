'use strict';

const debug = require('debug')('app:api:tripulacion');
const guard = require('express-jwt-permissions')();
const { userData } = require('../../lib/auth');

module.exports = function setupTripulacion (api, services) {
  const { Tripulacion } = services;

  api.get('/tripulacion/sincronizar-pilotos', guard.check(['tripulaciones:read']), async (req, res, next) => {
    debug('Sincronizando tripulaciones');
    try {
      let user = await userData(req, services);
      let result = await Tripulacion.sincronizarDgacPilotos(user.id);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo crear realizar la sincronización de tripulaciones con la DGAC'));
      }
    } catch (e) {
      return next(e);
    }
  });

  api.get('/tripulacion/sincronizar-tripulantes', guard.check(['tripulaciones:read']), async (req, res, next) => {
    debug('Sincronizando tripulaciones');
    try {
      let user = await userData(req, services);
      const result = await Tripulacion.sincronizarDgacTripulantes(user.id);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo crear realizar la sincronización de tripulaciones con la DGAC'));
      }
    } catch (e) {
      return next(e);
    }
  });

  // Verificacion de la validez de certificado medico del piloto
  api.get('/tripulacion/verificarDatos/:idTripulante/:idVuelo', guard.check(['tripulaciones:read']), async (req, res, next) => {
    debug(' Verificando datos de tripulante');
    try {
      const { idTripulante, idVuelo } = req.params;

      let result = await Tripulacion.validar(idVuelo, idTripulante);
      if (result && result.data && result.data.observacion) {
        return res.send(result.data);
      }

      return res.send({ success: true });
    } catch (e) {
      return next(e);
    }
  });

  api.post('/tripulacion/save-all', guard.check(['tripulaciones:read']), async (req, res, next) => {
    debug('Asignando Tripulaciones');
    const { tripulaciones } = req.body;
    let user = await userData(req, services);
    try {
      let result = await Tripulacion.assign(tripulaciones, user.id_operador);
      if (result.code === 1) {
        return res.send({ success: true });
      } else {
        return next(new Error(result.message));
      }
    } catch (e) {
      return next(e);
    }
  });

  return api;
};
