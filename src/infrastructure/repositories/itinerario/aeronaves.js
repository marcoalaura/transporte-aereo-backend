'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function aeronavesRepository (models, Sequelize) {
  const { aeronaves, operadores } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'nit',
          'sigla',
          'razon_social',
          'matricula_comercio',
          'tipo',
          'estado'
        ],
        model: operadores,
        as: 'operador'
      }
    ];

    if (params.matricula) {
      query.where.matricula = {
        [Op.iLike]: `%${params.matricula}%`
      };
    }

    if (params.serie) {
      query.where.serie = {
        [Op.iLike]: `%${params.serie}%`
      };
    }

    if (params.marca) {
      query.where.marca = {
        [Op.iLike]: `%${params.marca}%`
      };
    }

    if (params.modelo) {
      query.where.modelo = {
        [Op.iLike]: `%${params.modelo}%`
      };
    }

    if (params.propietario) {
      query.where.propietario = {
        [Op.iLike]: `%${params.propietario}%`
      };
    }

    if (params.modelo_generico) {
      query.where.modelo_generico = {
        [Op.iLike]: `%${params.modelo_generico}%`
      };
    }

    if (params.ads_b !== undefined) {
      query.where.ads_b = params.ads_b;
    }

    if (params.id_operador) {
      query.where.id_operador = params.id_operador;
    }

    // if (params.volumen_referencial) {
    //   query.where.volumen_referencial = params.volumen_referencial;
    // }

    if (params.tipo_aeronave) {
      query.where.tipo_aeronave = {
        [Op.iLike]: `%${params.tipo_aeronave}%`
      };
    }

    if (params.categoria_estela) {
      query.where.categoria_estela = {
        [Op.iLike]: `%${params.categoria_estela}%`
      };
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    return aeronaves.findAndCountAll(query);
  }

  function findById (id) {
    return aeronaves.findOne({
      where: {
        id
      },
      include: [
        {
          attributes: [
            'id',
            'nit',
            'sigla',
            'razon_social',
            'matricula_comercio',
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

  function findByMatricula (matricula) {
    return aeronaves.findOne({
      where: {
        matricula
      }
    });
  }

  async function createOrUpdate (aeronave) {
    const cond = {
      where: {
        id: aeronave.id
      }
    };

    const item = await aeronaves.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await aeronaves.update(aeronave, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? aeronaves.findOne(cond) : item;
    }

    let result;
    try {
      result = await aeronaves.create(aeronave);
    } catch (e) {
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function createAll (items, t) {
    try {
      let result = await aeronaves.bulkCreate(items, t ? { transaction: t } : {});
      return result;
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }
  }

  async function deleteItem (id) {
    return deleteItemModel(id, aeronaves);
  }

  async function findByIds (params) {
    return aeronaves.findAll({
      where: params
    });
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate,
    findByMatricula,
    createAll,
    findByIds
  };
};
