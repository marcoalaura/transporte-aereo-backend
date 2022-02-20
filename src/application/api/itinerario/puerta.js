'use strict';

const debug = require('debug')('app:api:puerta');
const guard = require('express-jwt-permissions')();
// const { userData } = require('../../lib/auth');

module.exports = function setupPuerta (api, services) {
  debug('Obteniendo puerta de aeropuerto por Id');
  const { Puerta } = services;

  api.get('/puerta/listarPuerta/:idPuerta', guard.check(['puertas:read']), async (req, res, next) => {
    const { idPuerta } = req.params;
    let result = await Puerta.findById(idPuerta);
    return res.send(result.data);
  });
  return api;
};
