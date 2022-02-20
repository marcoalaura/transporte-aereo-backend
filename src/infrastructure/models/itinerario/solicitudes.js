'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    codigo: {
      type: DataTypes.STRING(20),
      unique: true,
      xlabel: lang.t('fields.codigo')
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      xlabel: lang.t('fields.fecha_inicio')
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      xlabel: lang.t('fields.fecha_fin')
    },
    observacion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.observacion')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['CREADO', 'SOLICITADO', 'APROBADO', 'PLAN_VUELO_CREADO', 'PLAN_VUELO_APROBADO', 'RECHAZADO', 'OBSERVADO'],
      defaultValue: 'CREADO',
      xlabel: lang.t('fields.estado')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Solicitudes = sequelize.define('solicitudes', fields, {
    timestamps: false,
    tableName: 'ite_solicitudes'
  });

  return Solicitudes;
};
