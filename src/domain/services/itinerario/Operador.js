'use strict';

const debug = require('debug')('app:service:operador');

module.exports = function operadorService (repositories, res) {
  const { operadores } = repositories;

  async function findAll (params = {}) {
    debug('Lista de operadores|filtros');

    let lista;
    try {
      lista = await operadores.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de operadores`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando operador por ID');

    let operador;
    try {
      operador = await operadores.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!operador) {
      return res.error(new Error(`Operador ${id} not found`));
    }

    return res.success(operador);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar operador');

    let operador;
    try {
      operador = await operadores.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!operador) {
      return res.error(new Error(`El operador no pudo ser creado`));
    }

    return res.success(operador);
  }

  async function deleteItem (id) {
    debug('Eliminando operador');

    let deleted;
    try {
      deleted = await operadores.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la operador`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La operador ya fue eliminado`));
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
