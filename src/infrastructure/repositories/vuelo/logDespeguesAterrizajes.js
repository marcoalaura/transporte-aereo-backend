'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');
const moment = require('moment');

module.exports = function logDespeguesAterrizajes (models, Sequelize) {
  const { logDespeguesAterrizajes } = models;
  // const Op = Sequelize.Op;
  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (!params.order) {
      query.order = [
        ['fecha_inicio', 'DESC']
      ];
    }

    if (params.fecha_inicio) {
      query.where.fecha_inicio = params.fecha_ini;
    }

    if (params.fecha_fin) {
      query.where.fecha_fin = params.fecha_fin;
    }

    if (params.url_consulta) {
      query.where.url_consulta = params.url_consulta;
    }

    if (params.datos) {
      query.where.datos = params.datos;
    }

    return logDespeguesAterrizajes.findAndCountAll(query);
  }

  function findById (id) {
    return logDespeguesAterrizajes.findOne({
      where: {
        id: id
      }
    });
  }
  async function createOrUpdate (log) {
    const cond = {
      where: {
        id: log.id
      }
    };
    log.fecha_inicio = moment().format('DD-MM-YYYY HH:mm:ss.SSS');
    const item = await logDespeguesAterrizajes.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await logDespeguesAterrizajes.update(log, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? logDespeguesAterrizajes.create(log) : item;
    }

    let result;
    try {
      result = await logDespeguesAterrizajes.create(log);
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, logDespeguesAterrizajes);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
