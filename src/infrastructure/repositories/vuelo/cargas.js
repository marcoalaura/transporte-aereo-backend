'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function cargasRepository (models, Sequelize) {
  const { cargas } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.volumen) {
      query.where.volumen = {
        [Op.iLike]: `%${params.volumen}%`
      };
    }

    if (params.peso) {
      query.where.peso = {
        [Op.iLike]: `%${params.peso}%`
      };
    }

    if (params.id_vuelo) {
      query.where.id_vuelo = params.id_vuelo;
    }

    return cargas.findAndCountAll(query);
  }

  function findById (id) {
    return cargas.findOne({
      where: {
        id
      }
    });
  }

  async function createOrUpdate (carga) {
    const cond = {
      where: {
        id: carga.id
      }
    };

    const item = await cargas.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await cargas.update(carga, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? cargas.findOne(cond) : item;
    }

    let result;
    try {
      result = await cargas.create(carga);
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, cargas);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
