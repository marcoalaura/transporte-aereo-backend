'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    fecha: {
      type: DataTypes.DATE,
      xlabel: lang.t('fields.fecha')
    },
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

  let TripulacionesHistorial = sequelize.define('tripulacion_historial', fields, {
    timestamps: false,
    tableName: 'vue_tripulaciones_historial'
  });

  return TripulacionesHistorial;
};
