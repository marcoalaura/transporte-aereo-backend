'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function dgacAeronavesHistorial (models, Sequelize) {
  const { dgacAeronavesHistorial, dgacAeronaves } = models;
  const Op = Sequelize.Op;
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
          'nroMatricula',
          'nroSerie'
        ],
        model: dgacAeronaves,
        as: 'dgacAeronave'
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

    if (params.id_dgac_aeronave) {
      query.where.id_dgac_aeronave = params.id_dgac_aeronave;
    }

    if (params.id_usuario) {
      query.where.id_usuario = params.id_usuario;
    }

    return dgacAeronavesHistorial.findAndCountAll(query);
  }

  function findById (id) {
    return dgacAeronavesHistorial.findOne({
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

    const item = await dgacAeronavesHistorial.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await dgacAeronavesHistorial.update(historial, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? dgacAeronavesHistorial.create(historial) : item;
    }

    let result;
    try {
      result = await dgacAeronavesHistorial.create(historial);
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, dgacAeronavesHistorial);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
