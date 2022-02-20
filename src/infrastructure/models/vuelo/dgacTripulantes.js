'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    apPaterno: {
      type: DataTypes.STRING(100)
    },
    apMaterno: {
      type: DataTypes.STRING(100)
    },
    nombre: {
      type: DataTypes.STRING(100)
    },
    ciudad: {
      type: DataTypes.STRING(150)
    },
    nroLicencia: {
      type: DataTypes.STRING(50)
    },
    titulo: {
      type: DataTypes.STRING(255)
    },
    vigencia: {
      type: DataTypes.STRING(30)
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let DgacTripulantes = sequelize.define('dgac_tripulantes', fields, {
    timestamps: false,
    tableName: 'dgac_tripulantes'
  });

  return DgacTripulantes;
};
