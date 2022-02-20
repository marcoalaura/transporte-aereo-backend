'use strict';

const debug = require('debug')('app:service:puerta');

module.exports = function puertaService (repositories, res) {
  const { puertas } = repositories;

  async function findAll (params = {}) {
    debug('Lista de puertas');

    let lista;
    try {
      lista = await puertas.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de puertas`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando puerta por ID');

    let puerta;
    try {
      puerta = await puertas.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!puerta) {
      return res.error(new Error(`Puerta con ID ${id} no encontrada`));
    }

    return res.success(puerta);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar puerta');

    let puerta;
    try {
      if (!data.id) {
        let puerta = await puertas.findByNroPuerta(data.nro_puerta, data.id_aeropuerto);
        if (puerta) {
          return res.error(new Error(`La puerta ya fue registrada`));
        }
      }
      puerta = await puertas.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!puerta) {
      return res.error(new Error(`La puerta no pudo ser creado`));
    }

    return res.success(puerta);
  }

  async function deleteItem (id) {
    debug('Eliminando puerta');

    let deleted;
    try {
      deleted = await puertas.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe puerta`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La puerta ya fue eliminado`));
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
