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
    accion: {
      type: DataTypes.STRING(255),
      xlabel: lang.t('fields.accion')
    },
    detalle: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.detalle')
    },
    nombre_usuario: {
      type: DataTypes.STRING(255),
      xlabel: lang.t('fields.nombre_usuario')
    }
  };

  // campos para el log
  fields = util.setTimestamps(fields);

  let ItinerarioHistorial = sequelize.define('ite_historial', fields, {
    timestamps: false,
    tableName: 'ite_historial'
  });

  return ItinerarioHistorial;
};
