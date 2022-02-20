'use strict';

const debug = require('debug')('app:service:tripulacion');

module.exports = function tripulacionesHistorial (repositories, res) {
  const { tripulacionesHistorial } = repositories;

  async function findAll (params = {}) {
    debug('Lista de registros tripulaciones historial|filtros');

    let lista = [];
    try {
      lista = await tripulacionesHistorial.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener lista del historial de cambios aeronaves DGAC`));
    }

    return res.success({
      count: lista.length,
      rows: lista
    });
  }

  async function findById (id) {
    debug('Buscando Registro de historial de tripulaciones por ID');

    let aeronave;
    try {
      aeronave = await tripulacionesHistorial.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!aeronave) {
      return res.error(new Error(`Registro de tripulaciones ${id} no encontrado`));
    }

    return res.success(aeronave);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar aeronave');

    let aeronave;
    try {
      aeronave = await tripulacionesHistorial.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!aeronave) {
      return res.error(new Error(`La aeronave no pudo ser creado`));
    }

    return res.success(aeronave);
  }

  async function deleteItem (id) {
    debug('Eliminando registro tripulaciones historial');

    let deleted;
    try {
      deleted = await tripulacionesHistorial.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe el registro`));
    }

    if (deleted === 0) {
      return res.error(new Error(`El registro ya fue elminado`));
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
