'use strict';

const { errorHandler } = require('../../lib/util');

module.exports = function authRepository (models, Sequelize) {
  const { auth } = models;

  function find (params) {
    return auth.findOne({
      where: params
    });
  }

  async function createOrUpdate (data) {
    const cond = {
      where: {
        id: data.id
      }
    };

    const item = await auth.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await auth.update(data, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? auth.findOne(cond) : item;
    }

    let result;
    try {
      result = await auth.create(data);
    } catch (e) {
      errorHandler(e);
    }

    return result.toJSON();
  }

  return {
    find,
    createOrUpdate
  };
};
