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
      type: DataTypes.ENUM,
      values: ['SOLICITADO', 'APROBADO', 'RECHAZADO'],
      defaultValue: 'SOLICITADO',
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

  // agregando campos para el log
  fields = util.setTimestamps(fields);

  let PlanHistorial = sequelize.define('plan_historial', fields, {
    timestamps: false,
    tableName: 'plan_historial'
  });

  return PlanHistorial;
};
