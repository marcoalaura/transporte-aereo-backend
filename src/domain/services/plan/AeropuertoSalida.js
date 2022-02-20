'use strict';

const debug = require('debug')('app:service:aeropuertoSalidas');

module.exports = function aeropuertoSalidaService (repositories, res) {
  const { aeropuertoSalidas } = repositories;

  async function findAll (params = {}) {
    debug('Lista de Salidas de Aeropuertos');

    let lista;
    try {
      lista = await aeropuertoSalidas.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error('Error al obtener las salidas de aeropuertos'));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando las salidas de aeropuerto por ID');

    let aeropuertoSalida;
    try {
      aeropuertoSalida = await aeropuertoSalidas.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!aeropuertoSalida) {
      return res.error(new Error(`Salidas del aeropuerto ${id} no encontrado`));
    }

    return res.success(aeropuertoSalida);
  }

  async function createorUpdate (data) {
    debug('Crear o actualizar la salida del aeropuerto');
    let aeropuertoSalida;

    try {
      aeropuertoSalida = await aeropuertoSalidas.createorUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!aeropuertoSalida) {
      return res.error(new Error('La salida de aeropuerto no pudo ser creado'));
    }

    return res.success(aeropuertoSalida);
  }

  async function deleteItem (id) {
    debug('Eliminando salidas del aeropuerto');

    let deleted;
    try {
      deleted = await aeropuertoSalidas.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error('No existe la salida del aeropuerto'));
    }

    if (deleted === 0) {
      return res.error(new Error('La salida del aeropuerto ya fue eliminado'));
    }

    return res.success(deleted > 0);
  }

  return {
    findAll,
    findById,
    createorUpdate,
    deleteItem
  };
};
