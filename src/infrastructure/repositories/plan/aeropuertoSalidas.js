'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function aeropuertoSalidasRepository (models, Sequelize) {
  const { aeropuertoSalidas, aeropuertos } = models;
  // const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'codigo_iata',
          'nombre',
          'pais',
          'estado'
        ],
        model: aeropuertos,
        as: 'aeropuerto'
      }
    ];
    if (params.id_solicitud) {
      query.where.id_solicitud = params.id_solicitud;
    }

    if (params.id_aeropuerto) {
      query.where.id_aeropuerto = params.id_aeropuerto;
    }

    return aeropuertoSalidas.findAndCountAll(query);
  }

  function findById (id) {
    return aeropuertoSalidas.findOne({
      where: {
        id
      }
    });
  }

  async function createorUpdate (aeropuertoSalida) {
    const cond = {
      where: {
        id: aeropuertoSalida.id
      }
    };

    const item = await aeropuertoSalidas.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await aeropuertoSalidas.update(aeropuertoSalida, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? aeropuertoSalidas.findOne(cond) : item;
    }

    let result;
    try {
      result = await aeropuertoSalidas.create(aeropuertoSalida);
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, aeropuertoSalidas);
  }

  return {
    findAll,
    findById,
    createorUpdate,
    deleteItem
  };
};
