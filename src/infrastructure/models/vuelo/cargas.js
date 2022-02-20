'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    peso: {
      type: DataTypes.DECIMAL(10, 2),
      xlabel: lang.t('fields.peso')
    },
    volumen: {
      type: DataTypes.DECIMAL(10, 2),
      xlabel: lang.t('fields.volumen')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO'],
      defaultValue: 'ACTIVO',
      xlabel: lang.t('fields.estado')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Cargas = sequelize.define('cargas', fields, {
    timestamps: false,
    tableName: 'vue_cargas'
  });

  return Cargas;
};
