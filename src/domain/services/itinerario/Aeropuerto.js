'use strict';

const debug = require('debug')('app:service:aeropuerto');

module.exports = function aeropuertoService (repositories, res) {
  const { aeropuertos } = repositories;

  async function findAll (params = {}) {
    debug('Lista de aeropuertos|filtros');

    let lista;
    try {
      lista = await aeropuertos.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de aeropuertos`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando aeropuerto por ID');

    let aeropuerto;
    try {
      aeropuerto = await aeropuertos.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!aeropuerto) {
      return res.error(new Error(`Aeropuerto ${id} not found`));
    }

    return res.success(aeropuerto);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar aeropuerto');

    let aeropuerto;
    try {
      aeropuerto = await aeropuertos.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!aeropuerto) {
      return res.error(new Error(`El aeropuerto no pudo ser creado`));
    }

    return res.success(aeropuerto);
  }

  async function deleteItem (id) {
    debug('Eliminando aeropuerto');

    let deleted;
    try {
      deleted = await aeropuertos.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe el aeropuerto`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La aeropuerto ya fue eliminado`));
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
