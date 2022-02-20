'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function solicitudesRepository (models, Sequelize) {
  const { solicitudes, operadores } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'nit',
          'codigo_iata',
          'codigo_icao',
          'razon_social',
          'matricula_comercio',
          'sigla',
          'tipo',
          'estado'
        ],
        model: operadores,
        as: 'operador'
      }
    ];

    if (params.codigo) {
      query.where.codigo = {
        [Op.iLike]: `%${params.codigo}%`
      };
    }

    if (params.observacion) {
      query.where.observacion = {
        [Op.iLike]: `%${params.observacion}%`
      };
    }

    if (params.id_operador) {
      query.where.id_operador = params.id_operador;
    }

    // Pondera el filtrado de un estado en particular
    if (params.estado) {
      query.where.estado = params.estado;
    } else {
      if (params.estados) {
        query.where.estado = {
          [Op.or]: params.estados
        };
      }
    }

    if (params.planDeVuelo) {
      query.where.planDeVuelo = params.planDeVuelo;
    }

    // adicional para filtrar desde una fecha especifica (deberia estar en formato AAAA/MM/DD)
    if (params.desde_fecha) {
      query.where.fecha_inicio = {
        [Op.gte]: params.desde_fecha
      };
    }
    if (params.hasta_fecha) {
      query.where.fecha_fin = {
        [Op.lte]: params.hasta_fecha
      };
    }

    if (params.tipo) {
      query.where['$operador.tipo$'] = params.tipo;
    }

    return solicitudes.findAndCountAll(query);
  }

  function findById (id) {
    return solicitudes.findOne({
      where: {
        id
      },
      include: [
        {
          attributes: [
            'nit',
            'codigo_iata',
            'codigo_icao',
            'razon_social',
            'matricula_comercio',
            'sigla',
            'tipo',
            'estado'
          ],
          model: operadores,
          as: 'operador'
        }
      ],
      raw: true
    });
  }

  function findOne (where) {
    return solicitudes.findOne({
      where,
      include: [
        {
          attributes: [
            'nit',
            'codigo_iata',
            'codigo_icao',
            'razon_social',
            'matricula_comercio',
            'sigla',
            'tipo',
            'estado'
          ],
          model: operadores,
          as: 'operador'
        }
      ],
      raw: true
    });
  }

  async function createOrUpdate (solicitud, t) {
    let cond = {
      where: {
        id: solicitud.id
      }
    };

    const item = await solicitudes.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await solicitudes.update(solicitud, cond);
      } catch (e) {
        if (t) {
          t.rollback();
        }
        errorHandler(e);
      }
      return updated ? solicitudes.findOne(cond) : item;
    }

    let result;
    try {
      result = await solicitudes.create(solicitud, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, solicitudes);
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate,
    findOne
  };
};
