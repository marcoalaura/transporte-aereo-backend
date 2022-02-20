'use strict';

const debug = require('debug')('app:service:usuario');
const moment = require('moment');
const { text } = require('../../../common');
const { generateToken } = require('../../../application/lib/auth');
const ClienteNotificaciones = require('app-notificaciones');
const crypto = require('crypto');

module.exports = function userService (repositories, res) {
  const { transaction, Iop, usuarios, personas, operadores, Parametro, Log } = repositories;
  const Modulo = require('./Modulo')(repositories, res);

  async function findAll (params = {}, rol, idEntidad, idOperador) {
    debug('Lista de usuarios|filtros');
    let lista;
    try {
      switch (rol) {
        case 'OPERADOR_AVION_ADMIN':
          params.id_operador = idOperador;
          params.roles = ['OPERADOR_AVION_ADMIN', 'OPERADOR_AVION'];
          break;
        case 'OPERADOR_BUS_ADMIN':
          params.id_operador = idOperador;
          params.roles = ['OPERADOR_BUS_ADMIN', 'OPERADOR_BUS'];
          break;
        case 'MOPVS_ADMIN':
          params.id_entidad = idEntidad;
          params.roles = ['MOPVS_ADMIN', 'MOPVS'];
          break;
        case 'DGAC_ADMIN':
          params.id_entidad = idEntidad;
          params.roles = ['DGAC_ADMIN', 'DGAC'];
          break;
        case 'SABSA_ADMIN':
          params.id_entidad = idEntidad;
          params.roles = ['SABSA_ADMIN', 'SABSA'];
          break;
        case 'AASANA_ADMIN':
          params.id_entidad = idEntidad;
          params.roles = ['AASANA_ADMIN', 'AASANA', 'AASANA_TORRE_CONTROL'];
          break;
        case 'FELCN_ADMIN':
          params.id_entidad = idEntidad;
          params.roles = ['FELCN_ADMIN', 'FELCN'];
          break;
      }

      lista = await usuarios.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de usuarios`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando usuario por ID');

    let user;
    try {
      user = await usuarios.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`Usuario ${id} not found`));
    }

    return res.success(user);
  }

  async function createOrUpdate (data, rol = null, idOperador = null) {
    debug('Crear o actualizar usuario', data);
    console.log('***** pasajero: ', JSON.stringify(data, null, 2));
    let user;
    try {
      let persona = {
        nombres: data.nombres,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        nombre_completo: data.nombre_completo,
        tipo_documento: data.tipo_documento,
        tipo_documento_otro: data.tipo_documento_otro,
        nro_documento: data.nro_documento,
        fecha_nacimiento: data.fecha_nacimiento,
        movil: data.movil,
        nacionalidad: data.nacionalidad,
        pais_nacimiento: data.pais_nacimiento,
        genero: data.genero,
        telefono: data.telefono
      };

      if (data.id_persona) { // Actualizando persona
        persona.id = data.id_persona;
        persona.estado = data.estado_persona;
        persona._user_updated = data._user_updated;
        persona._updated_at = data._updated_at;
      } else {
        persona._user_created = data._user_created;
      }

      persona = await personas.createOrUpdate(persona);

      let usuario = {
        usuario: data.usuario,
        contrasena: data.contrasena,
        email: data.email,
        cargo: data.cargo,
        id_entidad: data.id_entidad,
        id_rol: data.id_rol,
        id_aeropuerto: data.id_aeropuerto,
        id_operador: data.id_operador,
        id_persona: persona.id
      };

      if (data.id) {
        usuario.id = data.id;
        usuario.estado = data.estado;
        usuario._user_updated = data._user_updated;
        usuario._updated_at = data._updated_at;
      } else {
        usuario._user_created = data._user_created;
      }
      if (rol === 'OPERADOR_AVION_ADMIN' || rol === 'OPERADOR_BUS_ADMIN') {
        usuario.id_operador = idOperador;
      }

      if (rol === 'SUPERADMIN') {
        if (usuario.id_entidad !== 6) {
          usuario.id_operador = null;
        }
      }

      user = await usuarios.createOrUpdate(usuario);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`El usuario no pudo ser creado`));
    }

    return res.success(user);
  }

  async function update (data) {
    debug('Actualizar usuario');

    if (!data.id) {
      return res.error(new Error(`Se necesita el ID del usuario para actualizar el registro`));
    }

    let user;
    try {
      user = await usuarios.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`El usuario no pudo ser actualizado`));
    }

    return res.success(user);
  }

  async function deleteItem (id) {
    debug('Eliminando usuario');

    let deleted;
    try {
      deleted = await usuarios.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe el usuario`));
    }

    if (deleted === 0) {
      return res.error(new Error(`El usuario ya fue eliminado`));
    }

    return res.success(deleted > 0);
  }

  async function userExist (usuario, contrasena, nit) {
    debug(`Comprobando si el usuario ${usuario} existe`);

    let user;
    let t;
    try {
      user = nit ? await operadores.findByNit(nit) : await usuarios.findByUsername(usuario);
      if (!nit && !user) {
        return res.error(new Error(`No existe el usuario ${usuario}`));
      }
      if (nit && !user) {
        return res.error(new Error(`El operador no esta registrado.`));
      }
      if (nit && user) {
        await verifySIN(usuario, contrasena, nit);
        if (user.id_usuario) {
          user = await usuarios.findById(user.id_usuario);
        } else {
          debug('Creando usuario administrador del operador', user.sigla);
          t = await transaction.create();
          const idOperador = user.id;
          const sigla = user.sigla;
          const tipo = user.tipo_transporte;

          // Creando usuario administrador del operador
          const dataUser = {
            usuario: sigla + '-' + Math.random().toString(36).slice(2),
            contrasena: sigla + '-' + Math.random().toString(36).slice(2),
            id_entidad: tipo === 'AVION' ? 6 : 7, // 6: ENTIDAD OPERADOR AVION, 7: ENTIDAD OPERADOR BUS
            id_operador: idOperador,
            id_rol: tipo === 'AVION' ? 6 : 8, // 6: ROL OPERADOR_AVION_ADMIN, 8: ROL OPERADOR_BUS_ADMIN
            _user_created: 1
          };
          user = await usuarios.createOrUpdate(dataUser, t);

          // Actualizando nuevo usuario administrador del operador
          const dataOperador = {
            id: idOperador,
            id_usuario: user.id,
            usuario
          };
          await operadores.createOrUpdate(dataOperador, t);

          transaction.commit(t);

          user = await usuarios.findByUsername(dataUser.usuario);
        }
      }

      let minutos = await Parametro.getParam('TIEMPO_BLOQUEO');
      minutos = minutos.valor && !isNaN(minutos.valor) ? parseInt(minutos.valor) : 0;

      let nroMaxIntentos = await Parametro.getParam('NRO_MAX_INTENTOS');
      nroMaxIntentos = nroMaxIntentos.valor && !isNaN(nroMaxIntentos.valor) ? parseInt(nroMaxIntentos.valor) : 3;

      if (user.fecha_bloqueo) {
        let tiempo = moment(user.fecha_bloqueo).valueOf();
        let now = moment().valueOf();
        console.log('FECHA BLOQUEO', moment(tiempo).format('YYYY-MM-DD HH:mm:ss'), 'FECHA ACTUAL', moment(now).format('YYYY-MM-DD HH:mm:ss'));
        if (now < tiempo) {
          return res.error(new Error(`El usuario <strong>${usuario}</strong> se encuentra bloqueado por <strong>${minutos} minutos</strong> por demasiados intentos fallidos.`));
        } else {
          await update({ id: user.id, nro_intentos: 0, fecha_bloqueo: null });
        }
      }

      if (!nit && user.contrasena !== text.encrypt(contrasena)) {
        if (user.nro_intentos !== undefined && !isNaN(user.nro_intentos)) {
          let intentos = parseInt(user.nro_intentos) + 1;
          console.log('NRO. INTENTO', intentos, 'MAX. NRO. INTENTOS', nroMaxIntentos);
          if (intentos >= nroMaxIntentos) {
            await update({
              id: user.id,
              nro_intentos: intentos,
              fecha_bloqueo: moment().add(minutos, 'minutes').format('YYYY-MM-DD HH:mm:ss')
            });
          } else {
            await update({ id: user.id, nro_intentos: intentos });
          }
        }
        return res.error(new Error(`La contraseña del usuario ${usuario} es incorrecta`));
      }

      if (user.estado === 'INACTIVO') {
        return res.error(new Error(`El usuario ${usuario} se encuentra deshabilitado. Consulte con el administrador del sistema.`));
      }

      return res.success(user);
    } catch (e) {
      if (t) {
        transaction.rollback(t);
      }

      return res.error(e);
    }
  }

  async function getUser (usuario, include = true) {
    debug('Buscando usuario por nombre de usuario');

    let user;
    try {
      user = await usuarios.findByUsername(usuario, include);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`Usuario ${usuario} not found`));
    }

    return res.success(user);
  }

  async function verifySIN (usuario, contrasena, nit) {
    try {
      const loginSIN = await Iop.sin.login(nit, usuario, contrasena);
      if (loginSIN.data.Estado === 'ACTIVO HABILITADO') {
        return loginSIN;
      }
      throw new Error('El NIT  se encuentra INACTIVO en la Plataforma del Sistema de Impuestos Nacionales.');
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async function getResponse (user, ip) {
    let respuesta;

    try {
      const usuario = user.usuario;
      // Actualizando el último login
      const now = moment();
      await update({
        id: user.id,
        ultimo_login: now.format('YYYY-MM-DD HH:mm:ss')
      });
      Log.info(`El usuario: ${usuario} ingresó al sistema a las ${now.format('DD/MM/YYYY HH:mm:ss')}`, 'LOGIN', null, usuario, ip);

      // Obteniendo menu
      let menu = await Modulo.getMenu(user.id_rol);
      let permissions = menu.data.permissions;
      menu = menu.data.menu;

      // Generando token
      let token = await generateToken(Parametro, usuario, permissions);

      // Formateando permisos
      let permisos = {};
      permissions.map(item => (permisos[item] = true));

      respuesta = {
        menu,
        token,
        permisos,
        usuario: {
          'usuario': user.usuario,
          'nombres': user['persona.nombres'],
          'primer_apellido': user['persona.primer_apellido'],
          'segundo_apellido': user['persona.segundo_apellido'],
          'email': user.email,
          'id_operador': user.id_operador,
          'entidad': user['entidad.nombre'],
          'rol': user['rol.nombre'],
          'lang': 'es',
          'operador': user['operador.razon_social'],
          'tipo': user['operador.tipo_transporte'],
          'sigla': user['operador.sigla'],
          'id_aeropuerto': user.id_aeropuerto
        },
        redirect: user['rol.path']
      };
      return respuesta;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async function regenerar (id, idUsuario) {
    debug('Regenerar contraseña');
    try {
      let datos = await usuarios.findById(id);

      if (!datos && !datos.id) {
        return res.error(new Error('El usuario no esta registrado'));
      }
      if (!datos.email) {
        return res.error(new Error('El usuario no cuenta con un email registrado'));
      }
      const contrasena = crypto.randomBytes(4).toString('hex');
      const data = {
        id,
        contrasena,
        _user_updated: idUsuario
      };
      await usuarios.createOrUpdate(data);

      let pne = await Iop.findByCode('PNE-01');
      let cli = new ClienteNotificaciones(pne.token, pne.url);

      const parametros = {
        para: [datos.email],
        asunto: 'Nueva contraseña - SISTEMA ÚNICO DE VUELOS',
        contenido: `<br> Nueva contraseña: <strong>${contrasena}</strong>`
      };

      let correo = await cli.correo(parametros);
      debug('Respuesta envio correo', correo);
      if (correo && !correo.finalizado) {
        return res.error(new Error('No se pudo enviar el correo'));
      }

      return res.success(correo);
    } catch (e) {
      return res.error(e);
    }
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem,
    userExist,
    getUser,
    update,
    getResponse,
    regenerar
  };
}
;
