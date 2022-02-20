'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    nro_puerta: {
      type: DataTypes.STRING(20),
      xlabel: lang.t('fields.nro_puerta')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO'],
      defaultValue: 'ACTIVO',
      xlabel: lang.t('fields.estado')
    },
    tipo_vuelo: {
      type: DataTypes.ENUM,
      values: ['NACIONAL', 'INTERNACIONAL'],
      defaultValue: 'NACIONAL',
      xlabel: lang.t('fields.tipo_vuelo')
    }
  };

  fields = util.setTimestamps(fields);

  let Puertas = sequelize.define('puertas', fields, {
    timestamps: false,
    tableName: 'ite_puertas'
  });

  return Puertas;
};
