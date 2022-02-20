'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function planHistorialRepository (models, Sequelize) {
  const { itinerarioHistorial, solicitudes, entidades } = models;
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
          'sigla',
          'estado'
        ],
        model: entidades,
        as: 'entidad'
      },
      {
        attributes: [
          'codigo',
          'estado'
        ],
        model: solicitudes,
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

    return itinerarioHistorial.findAndCountAll(query);
  }

  function findById (id) {
    return itinerarioHistorial.findOne({
      where: {
        id: id
      }
    });
  }
  async function createOrUpdate (historial, t) {
    const cond = {
      where: {
        id: historial.id
      }
    };

    const item = await itinerarioHistorial.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await itinerarioHistorial.update(historial, cond);
      } catch (e) {
        if (t) {
          t.rollback(t);
        }
        errorHandler(e);
      }
      return updated ? itinerarioHistorial.findOne(historial) : item;
    }

    let result;
    try {
      result = await itinerarioHistorial.create(historial, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback(t);
      }
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, itinerarioHistorial);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
