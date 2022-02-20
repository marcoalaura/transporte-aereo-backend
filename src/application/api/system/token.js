'use strict';

const debug = require('debug')('app:api:token');
const guard = require('express-jwt-permissions')();
const { userData, generateTokenInfinite } = require('../../lib/auth');

module.exports = function setupUsuario (api, services) {
  api.post('/token/generar', guard.check(['usuarios:read']), async function obtenerMenu (req, res, next) {
    debug('Generando nuevo token');
    const { Token } = services;
    let user = await userData(req, services);
    let data = req.body;

    try {
      let result = await Token.createOrUpdate(data, user.id, generateTokenInfinite);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo regenerar la contraseña.'));
      }
    } catch (e) {
      return next(e);
    }
  });

  return api;
};
