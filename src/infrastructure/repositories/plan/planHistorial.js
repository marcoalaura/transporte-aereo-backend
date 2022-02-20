'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function planHistorialRepository (models, Sequelize) {
  const { planHistorial, planSolicitudes, entidades } = models;
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
          'nombre',
          'sigla'
        ],
        model: entidades,
        as: 'entidad'
      },
      {
        attributes: [
          'nro_serie',
          'estado'
        ],
        model: planSolicitudes,
        as: 'solicitud'
      }
    ];

    if (params.id_solicitud) {
      query.where.id_solicitud = params.id_solicitud;
    }

    if (params.accion) {
      query.where.accion = params.accion;
    }

    if (params.id_entidad) {
      query.where.id_entidad = params.id_entidad;
    }

    if (params.fecha) {
      query.where.fecha = {
        [Op.iLike]: `${params.fecha}`
      };
    }

    if (params.nombre_usuario) {
      query.where.nombre_usuario = {
        [Op.iLike]: `${params.nombre_usuario}`
      };
    }

    if (params.id_usuario) {
      query.where.id_usuario = params.id_usuario;
    }

    if (params.limit) {
      query.limit = params.limit;
    }

    return planHistorial.findAndCountAll(query);
  }

  function findById (id) {
    return planHistorial.findOne({
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

    const item = await planHistorial.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await planHistorial.update(historial, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? planHistorial.create(historial) : item;
    }

    let result;
    try {
      result = await planHistorial.create(historial);
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, planHistorial);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
