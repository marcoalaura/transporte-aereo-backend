'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function conexionesRepository (models, Sequelize) {
  const { conexiones, itinerarios, aeropuertos } = models;
  // const Op = Sequelize.Op;
  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'nro_vuelo',
          'hora_despegue',
          'hora_aterrizaje',
          'estado',
          'tipo_vuelo',
          'id_aeropuerto_salida',
          'id_aeropuerto_llegada'
        ],
        model: itinerarios,
        as: 'itinerarioA'
      },
      {
        attributes: [
          'nro_vuelo',
          'hora_despegue',
          'hora_aterrizaje',
          'estado',
          'tipo_vuelo',
          'id_aeropuerto_salida',
          'id_aeropuerto_llegada'
        ],
        model: itinerarios,
        as: 'itinerarioB',
        include: [
          {
            attributes: [
              'codigo_iata',
              'ciudad',
              'estado'
            ],
            model: aeropuertos,
            as: 'aeropuerto_llegada'
          }
        ]
      }
    ];

    if (params.id_itinerario_a) {
      query.where.id_itinerario_a = params.id_itinerario_a;
    }

    if (params.id_itinerario_b) {
      query.where.id_itinerario_b = params.id_itinerario_b;
    }

    return conexiones.findAndCountAll(query);
  }

  function findById (id) {
    return conexiones.findOne({
      where: {
        id
      },
      include: [
        {
          attributes: [
            'nro_vuelo',
            'estado',
            'tipo_vuelo'
          ],
          model: itinerarios,
          as: 'itinerarioA'
        },
        {
          attributes: [
            'nro_vuelo',
            'estado',
            'tipo_vuelo'
          ],
          model: itinerarios,
          as: 'itinerarioB'
        }
      ],
      raw: true
    });
  }

  async function createOrUpdate (conexion, t) {
    let cond = {
      where: {
        id: conexion.id
      }
    };

    const item = await conexiones.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await conexiones.update(conexion, cond);
      } catch (e) {
        if (t) {
          t.rollback();
        }
        errorHandler(e);
      }
      return updated ? conexiones.findOne(cond) : item;
    }

    let result;
    try {
      result = await conexiones.create(conexion, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, conexiones);
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate
  };
};
