'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    campo: {
      type: DataTypes.STRING(50)
    },
    valor_anterior: {
      type: DataTypes.STRING(255)
    },
    valor_actual: {
      type: DataTypes.STRING(255)
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let DgacAeronavesHistorial = sequelize.define('dgac_aeronaves_historial', fields, {
    timestamps: false,
    tableName: 'dgac_aeronaves_historial'
  });

  return DgacAeronavesHistorial;
};
