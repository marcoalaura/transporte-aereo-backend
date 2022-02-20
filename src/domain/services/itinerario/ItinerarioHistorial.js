'use strict';

const debug = require('debug')('app:service:planHistorial');

module.exports = function PlanHistorialService (repositories, res) {
  const { itinerarioHistorial } = repositories;

  async function findAll (params = {}) {
    debug('Lista de registros en el historial de solicitudes de itinerario');

    let lista;
    try {
      lista = await itinerarioHistorial.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error('Error al obtener la lista de registros en el historial de solicitudes de itinerario'));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando historial de solicitudes de itinerario por id');

    let historial;
    try {
      historial = await itinerarioHistorial.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!historial) {
      return res.error(new Error(`Plan Historial ${id} no encontrada`));
    }

    return res.success(historial);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar historial de solicitudes de itinerario');
    let historial;
    try {
      historial = await itinerarioHistorial.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!historial) {
      return res.error(new Error('El historial de solicitudes de itinerario no pude ser creado'));
    }

    return res.success(historial);
  }

  async function deleteItem (id) {
    debug('Eliminando historial de solicitudes de itinerario');

    let deleted;
    try {
      deleted = await itinerarioHistorial.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error('No existe el historial de solicitud de itinearario'));
    }
    if (deleted === 0) {
      return res.error(new Error('No existe el historial de solicitud de itinerario'));
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
