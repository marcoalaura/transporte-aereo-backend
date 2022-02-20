'use strict';

const debug = require('debug')('app:api:aeronave');
const guard = require('express-jwt-permissions')();
const { userData } = require('../../lib/auth');

module.exports = function setupAeronave (api, services) {
  const { Aeronave } = services;

  // Sincronización Aeronaves con la DGAC
  api.get('/aeronave/sincronizar', guard.check(['aeronaves:read']), async (req, res, next) => {
    debug('Sincronizando aeronaves');
    try {
      let user = await userData(req, services);
      const result = await Aeronave.sincronizar(user.id);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo crear realizar la sincronización de aeronaves con la DGAC'));
      }
    } catch (e) {
      return next(e);
    }
  });

  api.post('/aeronave/save-all', guard.check(['aeronaves:read']), async (req, res, next) => {
    debug('api::Guardando aeronaves');

    try {
      const { matriculas, idOperador } = req.body;
      let user = await userData(req, services);
      let result = await Aeronave.createAll(matriculas, idOperador, user.id);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('Ocurrió un error al guardar las naves'));
      }
    } catch (e) {
      return next(e);
    }
  });

  return api;
};
