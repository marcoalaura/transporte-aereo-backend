'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function equipajesRepository (models, Sequelize) {
  const { equipajes } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.descripcion) {
      query.where.descripcion = {
        [Op.iLike]: `%${params.descripcion}%`
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

    return equipajes.findAndCountAll(query);
  }

  function findById (id) {
    return equipajes.findOne({
      where: {
        id
      }
    });
  }

  async function createOrUpdate (equipaje) {
    const cond = {
      where: {
        id: equipaje.id
      }
    };

    const item = await equipajes.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await equipajes.update(equipaje, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? equipajes.findOne(cond) : item;
    }

    let result;
    try {
      result = await equipajes.create(equipaje);
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, equipajes);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
