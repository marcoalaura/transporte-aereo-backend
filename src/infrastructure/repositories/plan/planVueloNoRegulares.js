'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deletItemModel } = require('../../lib/queries');

module.exports = function planVueloNoRegularesRepository (models, Sequelize) {
  const { planVueloNoRegulares } = models;
  // const Op = Sequelize.Op;
  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.cod_plan_vuelo) {
      query.where.cod_plan_vuelo = params.cod_plan_vuelo;
    }
    if (params.detalle) {
      query.where.detalle = params.detalle;
    }
    if (params.estado) {
      query.where.estado = params.estado;
    }

    return planVueloNoRegulares.findAndCountAll(query);
  }

  function findById (id) {
    return planVueloNoRegulares.findOne({
      where: {
        id
      }
    });
  }

  async function createOrUpdate (planVueloNoRegular) {
    const cond = {
      where: {
        id: planVueloNoRegular.id
      }
    };

    const item = await planVueloNoRegulares.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await planVueloNoRegulares.update(planVueloNoRegular, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? planVueloNoRegulares.findOne(cond) : item;
      // return updated ? planVueloNoRegulares.create(planVueloNoRegular) : item;
    }

    let result;
    try {
      result = await planVueloNoRegulares.create(planVueloNoRegular);
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deletItemModel(id, planVueloNoRegulares);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
