'use strict';

const debug = require('debug')('app:api');
const api = require('./api');

module.exports = async function setupApi (app, services) {
  debug('Iniciando API-REST');

  // Registrando API-REST
  app.use('/api', api(services));

  // login
  app.post('/auth', async function auth (req, res, next) {
    debug('Autenticación de usuario');
    const { Usuario } = services;
    const { contrasena, nit } = req.body;
    let { usuario } = req.body;
    let respuesta;

    try {
      if (!usuario || !contrasena) {
        return res.status(403).send({ error: 'El usuario y la contraseña son obligatorios' });
      }
      // Verificando que exista el usuario/contraseña
      let user = await Usuario.userExist(usuario, contrasena, nit);
      if (user.code === -1) {
        return res.status(403).send({ error: user.message });
      }
      user = user.data;
      const ip = req.connection.remoteAddress;
      respuesta = await Usuario.getResponse(user, ip);
    } catch (e) {
      return next(e);
    }
    res.send(respuesta);
  });

  return app;
};
