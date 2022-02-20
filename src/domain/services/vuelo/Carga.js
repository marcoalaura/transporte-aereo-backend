'use strict';

const debug = require('debug')('app:service:carga');

module.exports = function cargaService (repositories, res) {
  const { cargas } = repositories;

  async function findAll (params = {}) {
    debug('Lista de cargas|filtros');

    let lista;
    try {
      lista = await cargas.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de cargas`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando carga por ID');

    let carga;
    try {
      carga = await cargas.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!carga) {
      return res.error(new Error(`carga ${id} not found`));
    }

    return res.success(carga);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar carga');

    let carga;
    try {
      carga = await cargas.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!carga) {
      return res.error(new Error(`El carga no pudo ser creado`));
    }

    return res.success(carga);
  }

  async function deleteItem (id) {
    debug('Eliminando carga');

    let deleted;
    try {
      deleted = await cargas.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la carga`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La carga ya fue eliminado`));
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
