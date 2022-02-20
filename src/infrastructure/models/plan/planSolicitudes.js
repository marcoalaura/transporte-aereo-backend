'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    fecha_desde: {
      type: DataTypes.DATEONLY,
      xlabel: lang.t('fields.fecha_desde')
    },
    fecha_hasta: {
      type: DataTypes.DATEONLY,
      xlabel: lang.t('fields.fecha_hasta')
    },
    nro_serie: {
      type: DataTypes.STRING(20),
      xlabel: lang.t('fields.nro_serie')
    },
    inf_suplementaria: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.inf_suplementaria')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['CREADO', 'SOLICITADO', 'APROBADO', 'RECHAZADO', 'OBSERVADO', 'APROBADO_AASANA', 'APROBADO_FELCN'],
      defaultValue: 'CREADO',
      xlabel: lang.t('fields.estado')
    },
    observacion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.observacion')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Solicitudes = sequelize.define('planSolicitudes', fields, {
    timestamps: false,
    tableName: 'plan_solicitudes'
  });

  return Solicitudes;
};
