'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function dgacAeronavesRepository (models, Sequelize) {
  const { dgacAeronaves } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.nroMatricula) {
      query.where.nroMatricula = {
        [Op.iLike]: `%${params.nroMatricula}%`
      };
    }

    return dgacAeronaves.findAndCountAll(query);
  }

  function findById (id) {
    return dgacAeronaves.findOne({
      where: {
        id
      }
    });
  }

  function findByMatricula (nroMatricula) {
    return dgacAeronaves.findOne({
      where: {
        nroMatricula
      }
    });
  }

  async function createOrUpdate (aeronave) {
    const cond = {
      where: {
        id: aeronave.id
      }
    };

    const item = await dgacAeronaves.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await dgacAeronaves.update(aeronave, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? dgacAeronaves.findOne(cond) : item;
    }

    let result;
    try {
      result = await dgacAeronaves.create(aeronave);
    } catch (e) {
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function createAll (items, t) {
    try {
      let result = await dgacAeronaves.bulkCreate(items, t ? { transaction: t } : {});
      return result;
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }
  }

  async function deleteItem (id) {
    return deleteItemModel(id, dgacAeronaves);
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate,
    findByMatricula,
    createAll
  };
};
