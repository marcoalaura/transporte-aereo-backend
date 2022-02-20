'use strict';

const debug = require('debug')('app:service:piloto');

module.exports = function pilotoService (repositories, res) {
  const { dgacTripulantes } = repositories;

  async function findAll (params = {}) {
    debug('Lista de dgacTripulantes|filtros');

    let lista;
    try {
      lista = await dgacTripulantes.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de DGAC tripulantes`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando tripulante por ID');

    let tripulante;
    try {
      tripulante = await dgacTripulantes.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!tripulante) {
      return res.error(new Error(`Tripulante en la DGAC ${id} not found`));
    }

    return res.success(tripulante);
  }

  async function findByLicencia (nroLicencia) {
    debug('Buscando tripulante por Nro. licencia');

    let tripulante;
    try {
      tripulante = await dgacTripulantes.findByLicencia(nroLicencia);
    } catch (e) {
      return res.error(e);
    }

    if (!tripulante) {
      return res.error(new Error(`Tripulante en la DGAC ${nroLicencia} not found`));
    }

    return res.success(tripulante);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar tripulante');

    let tripulante;
    try {
      tripulante = await dgacTripulantes.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!tripulante) {
      return res.error(new Error(`El tripulante no pudo ser creado`));
    }

    return res.success(tripulante);
  }

  async function deleteItem (id) {
    debug('Eliminando tripulante');

    let deleted;
    try {
      deleted = await dgacTripulantes.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe el tripulante`));
    }

    if (deleted === 0) {
      return res.error(new Error(`El tripulante ya fue eliminado`));
    }

    return res.success(deleted > 0);
  }

  return {
    findAll,
    findById,
    findByLicencia,
    createOrUpdate,
    deleteItem
  };
};
