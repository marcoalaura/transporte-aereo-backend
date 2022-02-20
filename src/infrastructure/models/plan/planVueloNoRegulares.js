'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    cod_plan_vuelo: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.cod_plan_vuelo')
    },
    detalle: {
      type: DataTypes.JSON,
      xlabel: lang.t('fields.detalle')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['CREADO', 'APROBADO', 'RECHAZADO', 'OBSERVADO', 'APROBADO_FELCN'],
      defaultValue: 'CREADO',
      xlabel: lang.t('fields.campos')
    }
  };

  // Añadiendo campos para los logs
  fields = util.setTimestamps(fields);

  let PlanVuelosNoRegulares = sequelize.define('planVuelosRegulares', fields, {
    timestamps: false,
    tableName: 'plan_vuelo_no_regulares'
  });

  return PlanVuelosNoRegulares;
};
