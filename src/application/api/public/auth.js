'use strict';

const debug = require('debug')('app:api:auth');

module.exports = function setupAuth (api, services) {
  const { Auth } = services;

  // get state (usado para login con ciudadania)
  api.get('/codigo', async function codigo (req, res, next) {
    debug('Obtener código state');

    try {
      let result = await Auth.getCode();

      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo generar el state code.'));
      }
    } catch (e) {
      return next(e);
    }
  });

  // authorizate
  api.get('/autorizar', async function autorizar (req, res, next) {
    debug('Autorizar auth');
    if (req.query.error) {
      return next(new Error(req.query.error));
    } else {
      try {
        let result = await Auth.authorizate(req);
        console.log('result::::', result);
        if (result.code === -1) {
          return next(new Error(result.message));
        }
        if (result.data) {
          res.send(result.data);
        } else {
          return next(new Error('No se pudo realizar la autorización de ingreso al sistema.'));
        }
      } catch (err) {
        return next(err);
      }
    }
  });

  return api;
};
