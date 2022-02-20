'use strict';

const debug = require('debug')('app:service:token');
const ClienteNotificaciones = require('app-notificaciones');

module.exports = function tokenService (repositories, res) {
  const { tokens, usuarios, entidades, operadores, Iop } = repositories;

  async function findAll (params = {}) {
    debug('Lista de tokens|filtros');

    let lista;
    try {
      lista = await tokens.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de tokens`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando token por ID');

    let token;
    try {
      token = await tokens.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!token) {
      return res.error(new Error(`Rol ${id} not found`));
    }

    return res.success(token);
  }

  async function createOrUpdate (data, idUsuario, generateTokenInfinite) {
    debug('Crear o actualizar token', data);

    let datos = null;
    let result;
    try {
      if (data.tipo === 'USUARIO') {
        datos = await usuarios.findByUsername(data.usuario);
      }
      if (data.tipo === 'ENTIDAD') {
        datos = await entidades.findById(data.id_entidad);
      }
      if (data.tipo === 'OPERADOR') {
        datos = await operadores.findById(data.id_operador);
      }

      if (datos) {
        data.id_usuario = data.tipo === 'USUARIO' ? datos.id : null;
      } else {
        return res.error(new Error('ID no valido'));
      }

      data.token = await generateTokenInfinite(data);
      data._user_created = idUsuario;
      result = await tokens.createOrUpdate(data);

      if (result && datos.email) {
        let pne = await Iop.findByCode('PNE-01');
        let cli = new ClienteNotificaciones(pne.token, pne.url);

        const parametros = {
          para: [datos.email],
          asunto: 'Token de acceso - SISTEMA ÚNICO DE VUELOS',
          contenido: `<br> Token de acceso tipo ${data.tipo}:<br><br><small>Revise el archivo adjunto.</small>`,
          adjuntoBase64: `data:text/plain;base64,${Buffer.from(data.token).toString('base64')}`
        };
        try {
          let correo = await cli.correo(parametros);
          if (correo && !correo.finalizado) {
            return res.error(new Error('No se pudo enviar el correo'));
          }
        } catch (e) {
          console.log('Error al enviar el correo:', e);
          return res.Error(new Error('No se pudo enviar el correo'));
        }
      }
    } catch (e) {
      return res.error(e);
    }

    return res.success(result);
  }

  async function deleteItem (id) {
    debug('Eliminando token');

    let deleted;
    try {
      deleted = await tokens.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe el token`));
    }

    if (deleted === 0) {
      return res.error(new Error(`El token ya fue eliminado`));
    }

    return res.success(deleted > 0);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
