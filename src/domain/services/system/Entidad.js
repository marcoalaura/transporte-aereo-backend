'use strict';

const debug = require('debug')('app:service:entidad');

module.exports = function entidadService (repositories, res) {
  const { entidades } = repositories;

  async function findAll (params = {}, rol, idEntidad) {
    debug('Lista de entidades|filtros');

    let lista;
    try {
      switch (rol) {
        case 'OPERADOR_AVION_ADMIN':
          params.id_entidad = idEntidad;
          break;
        case 'OPERADOR_BUS_ADMIN':
          params.id_entidad = idEntidad;
          break;
        case 'MOPVS_ADMIN':
          params.id_entidad = idEntidad;
          break;
        case 'DGAC_ADMIN':
          params.id_entidad = idEntidad;
          break;
        case 'SABSA_ADMIN':
          params.id_entidad = idEntidad;
          break;
        case 'AASANA_ADMIN':
          params.id_entidad = idEntidad;
          break;
        case 'FELCN_ADMIN':
          params.id_entidad = idEntidad;
          break;
      }

      lista = await entidades.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de entidades`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando entidad por ID');

    let entidad;
    try {
      entidad = await entidades.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!entidad) {
      return res.error(new Error(`Entidad ${id} not found`));
    }

    return res.success(entidad);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar entidad');

    let entidad;
    try {
      entidad = await entidades.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!entidad) {
      return res.error(new Error(`El entidad no pudo ser creado`));
    }

    return res.success(entidad);
  }

  async function deleteItem (id) {
    debug('Eliminando entidad');

    let deleted;
    try {
      deleted = await entidades.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la entidad`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La entidad ya fue eliminada`));
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
