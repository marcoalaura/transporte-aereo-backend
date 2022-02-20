'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function planVuelosRepository (models, Sequelize) {
  const { planVuelos, aeronaves, planSolicitudes, aeropuertos } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'matricula',
          'tipo_aeronave',
          'categoria_estela',
          'estado'
          // 'volumen_referencial'
        ],
        model: aeronaves,
        as: 'aeronave'
      },
      {
        attributes: [
          'estado',
          'fecha_desde',
          'fecha_hasta'
        ],
        model: planSolicitudes,
        as: 'solicitud'
      },
      {
        attributes: [
          'codigo_iata',
          'codigo_icao',
          'estado'
        ],
        model: aeropuertos,
        as: 'aeropuerto_salida'
      },
      {
        attributes: [
          'codigo_iata',
          'codigo_icao',
          'estado'
        ],
        model: aeropuertos,
        as: 'aeropuerto_destino'
      }
    ];

    if (params.fecha_desde) {
      query.where.fecha_desde = {
        [Op.iLike]: `%${params.fecha_desde}%`
      };
    }

    if (params.fecha_hasta) {
      query.where.fecha_hasta = {
        [Op.iLike]: `%${params.fecha_hasta}%`
      };
    }

    if (params.dia_1) {
      query.where.dia_1 = params.dia_1;
    }

    if (params.dia_2) {
      query.where.dia_2 = params.dia_2;
    }

    if (params.dia_3) {
      query.where.dia_3 = params.dia_3;
    }

    if (params.dia_4) {
      query.where.dia_4 = params.dia_4;
    }

    if (params.dia_5) {
      query.where.dia_5 = params.dia_5;
    }

    if (params.dia_6) {
      query.where.dia_6 = params.dia_6;
    }

    if (params.dia_7) {
      query.where.dia_7 = params.dia_7;
    }

    if (params.ruta) {
      query.where.ruta = {
        [Op.iLike]: `${params.ruta}`
      };
    }

    if (params.duracion_total) {
      query.where.duracion_total = {
        [Op.iLike]: `${params.duracion_total}`
      };
    }

    if (params.observacion) {
      query.where.observacion = {
        [Op.iLike]: `${params.observacion}`
      };
    }

    if (params.estado) {
      query.where.estado = {
        [Op.iLike]: `${params.estado}`
      };
    }

    if (params.categoria_estela) {
      query.where['$aeronave.categoria_estela$'] = `${params.categoria_estela}`;
    }

    if (params.matricula) {
      query.where['$aeronave.matricula$'] = `${params.matricula}`;
    }

    if (params.id_solicitud) {
      query.where.id_solicitud = params.id_solicitud;
    }

    // adicional para filtrar por rango de fehcas (deberia estar en formato AAAA/MM/DD)
    if (params.desde_fecha) {
      query.where.fecha_desde = {
        [Op.gte]: params.desde_fecha
      };
    }
    if (params.hasta_fecha) {
      query.where.fecha_hasta = {
        [Op.lte]: params.hasta_fecha
      };
    }

    return planVuelos.findAndCountAll(query);
  }

  function findById (id) {
    return planVuelos.findOne({
      where: {
        id: id
      }
    });
  }

  async function createorUpdate (planVuelo, t) {
    const cond = {
      where: {
        id: planVuelo.id
      }
    };

    const item = await planVuelos.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await planVuelos.update(planVuelo, cond);
      } catch (e) {
        if (t) {
          t.rollback();
        }
        errorHandler(e);
      }
      return updated ? planVuelos.findOne(cond) : item;
    }

    let result;
    try {
      result = await planVuelos.create(planVuelo, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, planVuelos);
  }

  return {
    findAll,
    findById,
    createorUpdate,
    deleteItem
  };
};
