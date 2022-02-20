'use strict';

const debug = require('debug')('app:service:aeronave');

module.exports = function dgacAeronaveHistorial (repositories, res) {
  const { dgacAeronavesHistorial } = repositories;

  async function findAll (params = {}) {
    debug('Lista de dgacAeronaves|filtros');

    let lista = [];
    try {
      lista = await dgacAeronavesHistorial.findAll(params);
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
    debug('Buscando registro historial dgac aeronave por ID');

    let aeronave;
    try {
      aeronave = await dgacAeronavesHistorial.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!aeronave) {
      return res.error(new Error(`Aeronave en la DGAC ${id} not found`));
    }

    return res.success(aeronave);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar registro historial');

    let aeronave;
    try {
      aeronave = await dgacAeronavesHistorial.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!aeronave) {
      return res.error(new Error(`La aeronave no pudo ser creado`));
    }

    return res.success(aeronave);
  }

  async function deleteItem (id) {
    debug('Eliminando registro dgac aeronaves historial');

    let deleted;
    try {
      deleted = await dgacAeronavesHistorial.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe el registro en el historial de la aeronave`));
    }

    if (deleted === 0) {
      return res.error(new Error(`El registro fue eliminado`));
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
