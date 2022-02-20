'use strict';

const { getQuery } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function tokensRepository (models, Sequelize) {
  const { tokens } = models;
  // const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.tipo) {
      query.where.tipo = params.tipo;
    }

    return tokens.findAndCountAll(query);
  }

  function findById (id) {
    return tokens.findOne({
      where: {
        id
      }
    });
  }

  async function createOrUpdate (token) {
    const cond = {
      where: {
        id: token.id
      }
    };

    const item = await tokens.findOne(cond);

    if (item) {
      const updated = await tokens.update(token, cond);
      return updated ? tokens.findOne(cond) : item;
    }

    const result = await tokens.create(token);
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, tokens);
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate
  };
};
