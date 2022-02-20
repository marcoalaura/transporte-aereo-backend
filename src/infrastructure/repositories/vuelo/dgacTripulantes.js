'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function dgacPilotosRepository (models, Sequelize) {
  const { dgacTripulantes } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.search) {
      query.where[Op.or] = [
        {
          nroLicencia: {
            [Op.iLike]: `%${params.search}%`
          }
        },
        {
          nombre: {
            [Op.iLike]: `%${params.search}%`
          }
        },
        {
          apPaterno: {
            [Op.iLike]: `%${params.search}%`
          }
        },
        {
          apMaterno: {
            [Op.iLike]: `%${params.search}%`
          }
        }
      ];
    }

    return dgacTripulantes.findAndCountAll(query);
  }

  function findById (id) {
    return dgacTripulantes.findOne({
      where: {
        id
      }
    });
  }

  function findByLicencia (nroLicencia) {
    return dgacTripulantes.findOne({
      where: {
        nroLicencia
      }
    });
  }

  async function createOrUpdate (data) {
    const cond = {
      where: {
        id: data.id
      }
    };

    const item = await dgacTripulantes.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await dgacTripulantes.update(data, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? dgacTripulantes.findOne(cond) : item;
    }

    let result;
    try {
      result = await dgacTripulantes.create(data);
    } catch (e) {
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function createAll (items, t) {
    try {
      let result = await dgacTripulantes.bulkCreate(items, t ? { transaction: t } : {});
      return result;
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }
  }

  async function deleteItem (id) {
    return deleteItemModel(id, dgacTripulantes);
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate,
    findByLicencia,
    createAll
  };
};
