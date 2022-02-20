'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    campo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      xlabel: lang.t('fields.campo')
    },
    nuevo_valor: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.valor')
    },
    antiguo_valor: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.valor')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Cargas = sequelize.define('log_vuelos', fields, {
    timestamps: false,
    tableName: 'vue_log_vuelos'
  });

  return Cargas;
};
