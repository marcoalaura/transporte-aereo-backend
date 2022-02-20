'use strict';

const debug = require('debug')('app:service:rol');

module.exports = function rolService (repositories, res) {
  const { roles, modulos, permisos } = repositories;

  async function findAll (params = {}, rol) {
    debug('Lista de roles|filtros');

    let lista;
    try {
      switch (rol) {
        case 'OPERADOR_AVION_ADMIN':
          params.roles = ['OPERADOR_AVION_ADMIN', 'OPERADOR_AVION'];
          break;
        case 'OPERADOR_BUS_ADMIN':
          params.roles = ['OPERADOR_BUS_ADMIN', 'OPERADOR_BUS'];
          break;
        case 'MOPVS_ADMIN':
          params.roles = ['MOPVS_ADMIN', 'MOPVS'];
          break;
        case 'DGAC_ADMIN':
          params.roles = ['DGAC_ADMIN', 'DGAC'];
          break;
        case 'SABSA_ADMIN':
          params.roles = ['SABSA_ADMIN', 'SABSA'];
          break;
        case 'AASANA_ADMIN':
          params.roles = ['AASANA_ADMIN', 'AASANA', 'AASANA_TORRE_CONTROL'];
          break;
        case 'FELCN_ADMIN':
          params.roles = ['FELCN_ADMIN', 'FELCN'];
          break;
      }

      lista = await roles.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de roles`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando rol por ID');

    let rol;
    try {
      rol = await roles.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!rol) {
      return res.error(new Error(`Rol ${id} not found`));
    }

    return res.success(rol);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar rol');

    let rol;
    try {
      rol = await roles.createOrUpdate(data);
      debug('Rol creado', rol);

      if (data.id === undefined) {
        try {
          let items = await modulos.findAll();
          if (items.count) {
            for (let modulo of items.rows) {
              let permiso = await permisos.createOrUpdate({
                id_rol: rol.id,
                id_modulo: modulo.id,
                _user_created: rol._user_created
              });
              debug(`Nuevo permiso para: ${modulo.label} - ID: ${permiso.id}`);
            }
          } else {
            return res.warning('No se tiene registrado ningún Módulo para crear sus permisos');
          }
        } catch (e) {
          return res.error(e);
        }
      }
    } catch (e) {
      return res.error(e);
    }

    if (!rol) {
      return res.error(new Error(`El rol no pudo ser creado`));
    }

    return res.success(rol);
  }

  async function deleteItem (id) {
    debug('Eliminando rol');

    let deleted;
    try {
      deleted = await roles.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe el rol`));
    }

    if (deleted === 0) {
      return res.error(new Error(`El rol ya fue eliminado`));
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
