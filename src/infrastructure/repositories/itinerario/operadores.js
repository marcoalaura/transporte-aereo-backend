'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function operadoresRepository (models, Sequelize) {
  const { operadores } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.nit) {
      query.where.nit = {
        [Op.iLike]: `%${params.nit}%`
      };
    }

    if (params.sigla) {
      query.where.sigla = {
        [Op.iLike]: `%${params.sigla}%`
      };
    }

    if (params.codigo_iata) {
      query.where.codigo_iata = {
        [Op.iLike]: `%${params.codigo_iata}%`
      };
    }

    if (params.codigo_icao) {
      query.where.codigo_icao = {
        [Op.iLike]: `%${params.codigo_icao}%`
      };
    }

    if (params.razon_social) {
      query.where.razon_social = {
        [Op.iLike]: `%${params.razon_social}%`
      };
    }

    if (params.matricula_comercio) {
      query.where.matricula_comercio = {
        [Op.iLike]: `%${params.matricula_comercio}%`
      };
    }

    if (params.licencia) {
      query.where.licencia = {
        [Op.iLike]: `%${params.licencia}%`
      };
    }

    if (params.tipo) {
      query.where.tipo = params.tipo;
    }

    if (params.tipo_transporte) {
      query.where.tipo_transporte = params.tipo_transporte;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    return operadores.findAndCountAll(query);
  }

  function findById (id) {
    return operadores.findOne({
      where: {
        id
      }
    });
  }

  async function createOrUpdate (operador, t) {
    const cond = {
      where: {
        id: operador.id
      }
    };

    const item = await operadores.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await operadores.update(operador, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? operadores.findOne(cond) : item;
    }

    let result;
    try {
      result = await operadores.create(operador, t ? { transaction: t } : {});
    } catch (e) {
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, operadores);
  }

  function findByNit (nit) {
    return operadores.findOne({
      where: {
        nit
      }
    });
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate,
    findByNit
  };
};
