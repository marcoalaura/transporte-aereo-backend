'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function tripulacionesRepository (models, Sequelize) {
  const { tripulaciones, personas, operadores } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'nombres',
          'primer_apellido',
          'segundo_apellido',
          'nombre_completo',
          'tipo_documento',
          'tipo_documento_otro',
          'nro_documento',
          'fecha_nacimiento',
          'telefono',
          'movil',
          'nacionalidad',
          'pais_nacimiento',
          'genero',
          'estado',
          'observacion',
          'estado_verificacion'
        ],
        model: personas,
        as: 'persona'
      },
      {
        attributes: [
          'razon_social',
          'sigla',
          'estado'
        ],
        model: operadores,
        as: 'operador'
      }
    ];

    if (params.ciudad) {
      query.where.ciudad = {
        [Op.iLike]: `%${params.ciudad}%`
      };
    }

    if (params.nro_licencia) {
      query.where.nro_licencia = {
        [Op.iLike]: `%${params.nro_licencia}%`
      };
    }

    if (params.titulo) {
      query.where.titulo = {
        [Op.iLike]: `%${params.titulo}%`
      };
    }

    if (params.vigencia) {
      query.where.vigencia = {
        [Op.iLike]: `%${params.vigencia}%`
      };
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.tipo) {
      query.where.tipo = `${params.tipo}`;
    }

    if (params.estado_verificacion) {
      query.where.estado_verificacion = params.estado_verificacion;
    }

    if (params.id_operador) {
      query.where.id_operador = params.id_operador;
    }

    if (params.search) {
      query.where.id_operador = null;
      query.where.tipo = `${params.tipo}`;
      query.where[Op.or] = [
        {
          nro_licencia: {
            [Op.iLike]: `%${params.search}%`
          }
        },
        {
          '$persona.nombres$': {
            [Op.iLike]: `%${params.search}%`
          }
        },
        {
          '$persona.primer_apellido$': {
            [Op.iLike]: `%${params.search}%`
          }
        },
        {
          '$persona.segundo_apellido$': {
            [Op.iLike]: `%${params.search}%`
          }
        }
      ];
    }

    if (params.nombre_completo) {
      query.where[Op.or] = [
        {
          '$persona.nombres$': {
            [Op.iLike]: `%${params.nombre_completo}%`
          }
        },
        {
          '$persona.primer_apellido$': {
            [Op.iLike]: `%${params.nombre_completo}%`
          }
        },
        {
          '$persona.segundo_apellido$': {
            [Op.iLike]: `%${params.nombre_completo}%`
          }
        }
      ];
    }

    return tripulaciones.findAndCountAll(query);
  }

  function findById (id) {
    return tripulaciones.findById(id, {
      raw: true,
      include: [
        {
          attributes: [
            'nombres',
            'primer_apellido',
            'segundo_apellido',
            'nombre_completo',
            'tipo_documento',
            'tipo_documento_otro',
            'nro_documento',
            'fecha_nacimiento',
            'telefono',
            'movil',
            'nacionalidad',
            'pais_nacimiento',
            'genero',
            'estado',
            'observacion',
            'estado_verificacion'
          ],
          model: personas,
          as: 'persona'
        }
      ]
    });
  }

  function findByLicencia (nroLicencia) {
    return tripulaciones.findOne({
      where: {
        nro_licencia: nroLicencia
      }
    });
  }

  async function createOrUpdate (data, t) {
    const cond = {
      where: {
        id: data.id
      }
    };

    const item = await tripulaciones.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await tripulaciones.update(data, cond);
      } catch (e) {
        if (t) {
          t.rollback();
        }
        errorHandler(e);
      }
      return updated ? tripulaciones.findOne(cond) : item;
    }

    let result;
    try {
      result = await tripulaciones.create(data, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, tripulaciones);
  }

  return {
    findAll,
    findById,
    findByLicencia,
    createOrUpdate,
    deleteItem
  };
};
