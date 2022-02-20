'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function logVuelosRepository (models, Sequelize) {
  const { logVuelos } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.campo) {
      query.where.campo = {
        [Op.iLike]: `%${params.campo}%`
      };
    }

    if (params.valor) {
      query.where.valor = {
        [Op.iLike]: `%${params.valor}%`
      };
    }

    if (params.id_vuelo) {
      query.where.id_vuelo = params.id_vuelo;
    }

    return logVuelos.findAndCountAll(query);
  }

  function findById (id) {
    return logVuelos.findOne({
      where: {
        id
      }
    });
  }

  async function createOrUpdate (data, t) {
    const cond = {
      where: {
        id: data.id
      }
    };

    const item = await logVuelos.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await logVuelos.update(data, cond);
      } catch (e) {
        if (t) {
          t.rollback();
        }
        errorHandler(e);
      }
      return updated ? logVuelos.findOne(cond) : item;
    }

    let result;
    try {
      result = await logVuelos.create(data, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, logVuelos);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
