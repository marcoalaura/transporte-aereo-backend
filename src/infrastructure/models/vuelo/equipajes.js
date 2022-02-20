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
    descripcion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.descripcion')
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

  let Equipajes = sequelize.define('equipajes', fields, {
    timestamps: false,
    tableName: 'vue_equipajes'
  });

  return Equipajes;
};
