'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');
// const moment = require('moment');

module.exports = function tripulacionesHistorial (models, Sequelize) {
  const { tripulacionesHistorial, tripulaciones } = models;
  // const Op = Sequelize.Op;
  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (!params.order) {
      query.order = [
        ['fecha', 'DESC']
      ];
    }

    query.include = [
      {
        attributes: [
          'id',
          'id_persona',
          'titulo',
          'tipo',
          'estado',
          'nro_licencia'
        ],
        model: tripulaciones,
        as: 'tripulacion'
      }
    ];

    if (params.campo) {
      query.where.campo = params.campo;
    }

    if (params.valor_anterior) {
      query.where.valor_anterior = params.valor_anterior;
    }

    if (params.valor_actual) {
      query.where.valor_actual = params.valor_actual;
    }

    if (params.id_tripulacion) {
      query.where.id_tripulacion = params.id_tripulacion;
    }

    if (params.id_usuario) {
      query.where.id_usuario = params.id_usuario;
    }

    return tripulacionesHistorial.findAndCountAll(query);
  }

  function findById (id) {
    return tripulacionesHistorial.findOne({
      where: {
        id: id
      }
    });
  }
  async function createOrUpdate (historial) {
    const cond = {
      where: {
        id: historial.id
      }
    };
    // historial.fecha = moment().format('DD-MM-YYYY HH:mm:ss.SSS'); arroja fecha invalida
    historial.fecha = new Date();
    const item = await tripulacionesHistorial.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await tripulacionesHistorial.update(historial, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? tripulacionesHistorial.create(historial) : item;
    }

    let result;
    try {
      result = await tripulacionesHistorial.create(historial);
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, tripulacionesHistorial);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
