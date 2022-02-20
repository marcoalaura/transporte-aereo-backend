'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function puertasRepository (models, Sequelize) {
  const { puertas, aeropuertos } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'codigo_icao',
          'codigo_iata',
          'ciudad',
          'pais',
          'estado'
        ],
        model: aeropuertos,
        as: 'aeropuerto',
        raw: true
      }
    ];

    if (params.nro_puerta) {
      query.where.nro_puerta = {
        [Op.iLike]: `${params.nro_puerta}`
      };
    }

    if (params.tipo_vuelo) {
      query.where.tipo_vuelo = {
        [Op.iLike]: `${params.tipo_vuelo}`
      };
    }

    if (params.estado) {
      query.where.estado = {
        [Op.iLike]: `${params.estado}`
      };
    }

    if (params.id_aeropuerto) {
      query.where.id_aeropuerto = params.id_aeropuerto;
    }

    return puertas.findAndCountAll(query);
  }

  function filter (params = {}) {
    let query = {
      where: {},
      attributes: [
        'id',
        'nro_puerta',
        'estado',
        'tipo_vuelo'
      ],
      raw: true
    };
    return aeropuertos.findAll(query);
  }

  function findById (id) {
    return puertas.findOne({
      where: {
        id
      }
    });
  }

  // Valida que un numero de puerta no se repita en un aeropuerto
  function findByNroPuerta (nroPuerta, idAeropuerto) {
    return puertas.findOne({
      where: {
        nro_puerta: nroPuerta,
        id_aeropuerto: idAeropuerto
      }
    });
  }

  async function createOrUpdate (puerta, t) {
    let cond = {
      where: {
        id: puerta.id
      }
    };

    const item = await puertas.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await puertas.update(puerta, cond);
      } catch (e) {
        if (t) {
          t.rollback();
        }
        errorHandler(e);
      }
      return updated ? puertas.findOne(cond) : item;
    }

    let result;
    try {
      result = await puertas.create(puerta, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, puertas);
  }
  return {
    findAll,
    findById,
    deleteItem,
    filter,
    createOrUpdate,
    findByNroPuerta
  };
};
