'use strict';

const debug = require('debug')('app:service:usuario');
const moment = require('moment');
const { text } = require('../../../common');
const ClienteNotificaciones = require('app-notificaciones');

module.exports = function notificacionService (repositories, res) {
  debug('Lista de notificaciones');

  const { Iop, usuarios, notificaciones, Log, Parametro } = repositories;

  async function findAll(params = {}, idEntidadRemitente, idEntidadReceptora) {
    let lista;
    try {
      lista = await notificaciones.findAll(params, idEntidadRemitente, idEntidadReceptora);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de notificaciones`));
    }

    return res.success(lista);
  }

  async function findById(id) {
    debug('Buscando por id de notificacion');

    let notificacion;
    try {
      notificacion = await notificaciones.findBy(id);
    } catch (e) {
      return res.error(e);
    }

    if (!notificacion) {
      return res.error(new Error(`Notificacion ${id} no encontrado`));
    }

    return res.success(notificacion);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar notificacion');

    let notificacion;
    try {
      notificacion = notificaciones.createOrUpdate(notificacion);
    } catch (e) {
      return res.error(e);
    }

    return res.success(notificacion);
  }

  return {
    findAll,
    findById,
    createOrUpdate
  };
};
