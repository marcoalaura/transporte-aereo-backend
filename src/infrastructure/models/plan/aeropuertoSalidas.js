'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let AeropuertoSalidas = sequelize.define('aeropuertoSalidas', fields, {
    timestamps: false,
    tableName: 'plan_aeropuerto_salidas'
  });

  return AeropuertoSalidas;
};
