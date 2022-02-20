'use strict';

const debug = require('debug')('app:service:aeronave');

module.exports = function aeronaveService (repositories, res) {
  const { dgacAeronaves, aeronaves } = repositories;

  async function findAll (params = {}) {
    debug('Lista de dgacAeronaves|filtros');

    let listaDgac;
    let listaAeronaves;
    let registrados;
    let dgac;
    let lista = [];
    try {
      listaAeronaves = await aeronaves.findAll(params);
      listaDgac = await dgacAeronaves.findAll(params);
      registrados = listaAeronaves.rows;
      dgac = listaDgac.rows;
      if (registrados.length > 0) {
        for (let j in dgac) {
          let sw = true;
          for (let i in registrados) {
            if (dgac[j].nroMatricula === registrados[i].matricula) {
              sw = false;
              break;
            }
          }
          if (sw) {
            lista.push(dgac[j]);
          }
        }
      } else {
        lista = dgac;
      }
    } catch (e) {
      return res.error(e);
    }

    if (!listaDgac) {
      return res.error(new Error(`Error al obtener la lista de DGAC aeronaves`));
    }

    return res.success({
      count: lista.length,
      rows: lista
    });
  }

  async function findById (id) {
    debug('Buscando aeronave por ID');

    let aeronave;
    try {
      aeronave = await dgacAeronaves.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!aeronave) {
      return res.error(new Error(`Aeronave en la DGAC ${id} not found`));
    }

    return res.success(aeronave);
  }

  async function findByMatricula (matricula) {
    debug('Buscando aeronave por Matrícula');

    let aeronave;
    try {
      aeronave = await dgacAeronaves.findByMatricula(matricula);
    } catch (e) {
      return res.error(e);
    }

    if (!aeronave) {
      return res.error(new Error(`Aeronave en la DGAC ${matricula} not found`));
    }

    return res.success(aeronave);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar aeronave');

    let aeronave;
    try {
      aeronave = await dgacAeronaves.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!aeronave) {
      return res.error(new Error(`La aeronave no pudo ser creado`));
    }

    return res.success(aeronave);
  }

  async function deleteItem (id) {
    debug('Eliminando aeronave');

    let deleted;
    try {
      deleted = await dgacAeronaves.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la aeronave`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La aeronave ya fue eliminado`));
    }

    return res.success(deleted > 0);
  }

  return {
    findAll,
    findById,
    findByMatricula,
    createOrUpdate,
    deleteItem
  };
};
