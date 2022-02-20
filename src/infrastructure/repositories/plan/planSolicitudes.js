'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function planSolicitudesRepository (models, Sequelize) {
  const { planSolicitudes, solicitudes, operadores } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'codigo',
          'estado'
        ],
        model: solicitudes,
        as: 'solicitud_itinerario'
      },
      {
        attributes: [
          'nit',
          'sigla',
          'razon_social',
          'tipo'
        ],
        model: operadores,
        as: 'operador'
      }
    ];

    if (params.fecha_desde) {
      query.where.fecha = {
        [Op.iLike]: `${params.fecha_desde}`
      };
    }

    if (params.fecha_hasta) {
      query.where.hasta = {
        [Op.iLike]: `${params.fecha_hasta}`
      };
    }

    if (params.nro_serie) {
      query.where.nro_serie = {
        [Op.iLike]: `${params.nro_serie}`
      };
    }

    if (params.inf_suplementaria) {
      query.where.inf_suplementaria = {
        [Op.iLike]: `${params.inf_suplementaria}`
      };
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.estados) {
      // para incluir consultas tipo estados: ['APROBADO_AASANA', 'APROBADO', ...]
      query.where.estado = {
        [Op.in]: params.estados
      };
    }

    if (params.id_operador) {
      query.where.id_operador = params.id_operador;
    }

    if (params.id_solicitud_itinerario) {
      query.where.id_solicitud_itinerario = params.id_solicitud_itinerario;
    }

    // adicional para filtrar desde una fecha especifica (deberia estar en formato AAAA/MM/DD)
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

    return planSolicitudes.findAndCountAll(query);
  }

  function findById (id) {
    return planSolicitudes.findOne({
      where: {
        id
      },
      include: [
        {
          attributes: ['codigo', 'estado'],
          model: solicitudes,
          as: 'solicitud_itinerario'
        },
        {
          attributes: ['sigla', 'razon_social', 'tipo', 'nit'],
          model: operadores,
          as: 'operador'
        }
      ],
      raw: true
    });
  }

  function findLatestByIdItinerario (id) {
    return planSolicitudes.findOne({
      where: {
        id_solicitud_itinerario: id
      },
      order: [
        [ 'id', 'DESC' ]
      ],
      include: [
        {
          attributes: ['codigo', 'estado'],
          model: solicitudes,
          as: 'solicitud_itinerario'
        },
        {
          attributes: ['sigla', 'razon_social', 'tipo', 'nit'],
          model: operadores,
          as: 'operador'
        }
      ],
      raw: true
    });
  }

  function findByIdItinerario (id) {
    return planSolicitudes.findOne({
      where: {
        id_solicitud_itinerario: id
      },
      include: [
        {
          attributes: [
            'codigo',
            'estado'
          ],
          model: solicitudes,
          as: 'solicitud_itinerario'
        },
        {
          attributes: [
            'sigla',
            'razon_social',
            'tipo',
            'nit'
          ],
          model: operadores,
          as: 'operador'
        }
      ],
      raw: true
    });
  }

  async function createorUpdate (planSolicitud, t) {
    const cond = {
      where: {
        id: planSolicitud.id
      }
    };

    const item = await planSolicitudes.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await planSolicitudes.update(planSolicitud, cond);
      } catch (e) {
        if (t) {
          t.rollback();
        }
        errorHandler(e);
      }
      return updated ? planSolicitudes.findOne(cond) : item;
    }

    let result;
    try {
      result = await planSolicitudes.create(planSolicitud, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, planSolicitudes);
  }

  return {
    findAll,
    findById,
    findByIdItinerario,
    createorUpdate,
    deleteItem,
    findLatestByIdItinerario
  };
};
