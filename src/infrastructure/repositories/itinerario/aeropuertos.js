'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function aeropuertosRepository (models, Sequelize) {
  const { aeropuertos } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.codigo_icao) {
      query.where.codigo_icao = {
        [Op.iLike]: `%${params.codigo_icao}%`
      };
    }

    if (params.codigo_iata) {
      query.where.codigo_iata = {
        [Op.iLike]: `%${params.codigo_iata}%`
      };
    }

    if (params.razon_social) {
      query.where.razon_social = {
        [Op.iLike]: `%${params.razon_social}%`
      };
    }

    if (params.nombre) {
      query.where.nombre = {
        [Op.iLike]: `%${params.nombre}%`
      };
    }

    if (params.ciudad) {
      query.where.ciudad = {
        [Op.iLike]: `%${params.ciudad}%`
      };
    }

    if (params.pais && params.pais !== 'TODOS') {
      query.where.pais = params.pais;
    }

    if (params.municipio) {
      query.where.municipio = {
        [Op.iLike]: `%${params.municipio}%`
      };
    }

    if (params.departamento) {
      query.where.departamento = {
        [Op.iLike]: `%${params.departamento}%`
      };
    }

    if (params.certificado_aerodromo) {
      query.where.certificado_aerodromo = params.certificado_aerodromo;
    }

    if (params.clave_referencia) {
      query.where.clave_referencia = {
        [Op.iLike]: `%${params.clave_referencia}%`
      };
    }

    if (params.categoria_ssei) {
      query.where.categoria_ssei = params.categoria_ssei;
    }

    if (params.lapso_entre_despegues) {
      query.where.lapso_entre_despegues = params.lapso_entre_despegues;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.mapa) {
      query.where.nombre = {
        [Op.ne]: `N/A`
      };
    }

    return aeropuertos.findAndCountAll(query);
  }

  function findById (id) {
    return aeropuertos.findOne({
      where: {
        id
      }
    });
  }

  function findByIata (iata) {
    return aeropuertos.findOne({
      where: {
        codigo_iata: iata
      }
    });
  }

  function findByIcao (icao) {
    return aeropuertos.findOne({
      where: {
        codigo_icao: icao
      }
    });
  }

  async function createOrUpdate (aeropuerto) {
    const cond = {
      where: {
        id: aeropuerto.id
      }
    };

    const item = await aeropuertos.findOne(cond);

    if (item) {
      let updated;
      try {
        updated = await aeropuertos.update(aeropuerto, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? aeropuertos.findOne(cond) : item;
    }

    let result;
    try {
      result = await aeropuertos.create(aeropuerto);
    } catch (e) {
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, aeropuertos);
  }

  async function findByIds (params) {
    return aeropuertos.findAll({
      where: params
    });
  }

  return {
    findAll,
    findById,
    deleteItem,
    createOrUpdate,
    findByIata,
    findByIcao,
    findByIds
  };
};
