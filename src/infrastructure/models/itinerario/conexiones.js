'use strict';

// const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk
  };

  fields = util.setTimestamps(fields);

  let Conexiones = sequelize.define('conexiones', fields, {
    timestamps: false,
    tableName: 'ite_conexiones'
  });

  return Conexiones;
};
