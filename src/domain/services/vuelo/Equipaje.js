'use strict';

const debug = require('debug')('app:service:equipaje');

module.exports = function equipajeService (repositories, res) {
  const { equipajes } = repositories;

  async function findAll (params = {}) {
    debug('Lista de equipajes|filtros');

    let lista;
    try {
      lista = await equipajes.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de equipajes`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando equipaje por ID');

    let equipaje;
    try {
      equipaje = await equipajes.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!equipaje) {
      return res.error(new Error(`equipaje ${id} not found`));
    }

    return res.success(equipaje);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar equipaje');

    let equipaje;
    try {
      equipaje = await equipajes.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!equipaje) {
      return res.error(new Error(`El equipaje no pudo ser creado`));
    }

    return res.success(equipaje);
  }

  async function deleteItem (id) {
    debug('Eliminando equipaje');

    let deleted;
    try {
      deleted = await equipajes.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la equipaje`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La equipaje ya fue eliminado`));
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
