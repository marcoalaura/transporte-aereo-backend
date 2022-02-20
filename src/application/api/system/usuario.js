'use strict';

const debug = require('debug')('app:api:usuario');
const guard = require('express-jwt-permissions')();
const { userData, generateToken } = require('../../lib/auth');
const moment = require('moment');

module.exports = function setupUsuario (api, services) {
  api.get('/persona-segip/:ci', guard.check(['personas:read']), async (req, res, next) => {
    debug('Buscando persona en SEGIP');
    const { Iop, Persona } = services;
    const { ci } = req.params;
    const { fechaNacimiento, complemento, db, tipoDoc = 'CI' } = req.query;

    let persona;
    try {
      if (db) {
        persona = await Persona.find({
          nro_documento: ci + (complemento ? '-' + complemento : ''),
          tipo_documento: tipoDoc,
          fecha_nacimiento: moment(fechaNacimiento, 'DD/MM/YYYY').utcOffset(0).format('YYYY-MM-DD')
        });
        if (persona.code === 1) {
          persona = persona.data;
          persona = {
            paterno: persona.primer_apellido,
            materno: persona.segundo_apellido,
            nombres: persona.nombres,
            nacionalidad: persona.nacionalidad,
            telefono: persona.telefono,
            movil: persona.movil,
            genero: persona.genero,
            id_persona: persona.id
          };
          persona = { persona };
        } else {
          if (tipoDoc === 'CI') {
            persona = await Iop.segip.buscarPersona(ci, fechaNacimiento, complemento);
          } else {
            return res.send({ observacion: 'La persona no está registrada en el sistema, complete los datos para registrarla.' });
          }
        }
      } else {
        persona = await Iop.segip.buscarPersona(ci, fechaNacimiento, complemento);
      }
    } catch (e) {
      return next(e);
    }

    console.log('Respuesta segip 1', persona);
    if (persona.error && persona.error.indexOf('observación') !== -1) {
      return res.send({ observacion: persona.error });
    }
    res.send(persona);
  });

  // cambiar contrasena
  api.patch('/cambiar_pass', async (req, res, next) => {
    debug('Cambiar contraseña de usuario');
    const { Usuario } = services;
    const { password, newPassword } = req.body;

    try {
      let _user = await userData(req, services);
      let user = await Usuario.userExist(_user.usuario, password);
      if (user.code === 1) {
        await Usuario.update({
          id: _user.id,
          contrasena: newPassword
        });
        res.send({ message: 'Contraseña cambiada correctamente' });
      } else {
        res.send({ error: 'Su contraseña anterior es incorrecta' });
      }
    } catch (e) {
      return next(e);
    }
  });

  // desactivar cuenta
  api.patch('/desactivar_cuenta', async function desactivarCuenta (req, res, next) {
    debug('Desactivar cuenta de usuario');
    const { Usuario } = services;
    const { password } = req.body;
    try {
      let _user = await userData(req, services);
      let user = await Usuario.userExist(_user.usuario, password);
      if (user.code === 1) {
        await Usuario.update({
          id: _user.id,
          estado: 'INACTIVO'
        });
        res.send({ message: '¡Cuenta desactivada!' });
      } else {
        res.send({ error: 'Su contraseña es incorrecta' });
      }
    } catch (e) {
      return next(e);
    }
  });

  api.get('/menu', guard.check(['modulos:read']), async function obtenerMenu (req, res, next) {
    debug('Obteniendo menú y permisos');
    const { Modulo, Parametro } = services;
    let user = await userData(req, services);
    let menu;
    let token;
    let permisos = {};

    try {
      // Obteniendo menu
      menu = await Modulo.getMenu(user.id_rol);
      let permissions = menu.data.permissions;
      menu = menu.data.menu;

      // Generando token
      token = await generateToken(Parametro, user.usuario, permissions);

      // Formateando permisos
      permissions.map(item => (permisos[item] = true));
    } catch (e) {
      return next(e);
    }

    res.send({
      permisos,
      menu,
      token
    });
  });

  api.get('/salir', async function salir (req, res, next) {
    debug('Salir del sistema');
    const { Auth } = services;
    const { codigo } = req.query;
    let user = await userData(req, services);
    try {
      let result = await Auth.logout(codigo, user.id);
      res.send(result.data);
    } catch (e) {
      return next(e);
    }
  });

  api.get('/regenerar_password/:id', guard.check(['usuarios:read']), async function regenerarPassword (req, res, next) {
    debug('Regenerando password');
    const { Usuario } = services;
    let user = await userData(req, services);
    const { id } = req.params;
    try {
      let result = await Usuario.regenerar(id, user.id);
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
