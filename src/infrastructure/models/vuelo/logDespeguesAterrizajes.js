'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      xlabel: lang.t('fields.fecha_inicio')
    },
    fecha_fin: {
      type: DataTypes.DATE,
      xlabel: lang.t('fields.fecha_fin')
    },
    url_consulta: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.url')
    },
    datos: {
      type: DataTypes.JSONB,
      xlabel: lang.t('fields.datos')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let logDespeguesAterrizajes = sequelize.define('log_despegues_aterrrizajes', fields, {
    timestamps: false,
    tableName: 'vue_log_despegues_aterrizajes'
  });

  return logDespeguesAterrizajes;
};
