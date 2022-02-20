'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    nro_licencia: {
      type: DataTypes.STRING(50),
      unique: true,
      xlabel: lang.t('fields.nro_licencia')
    },
    titulo: {
      type: DataTypes.STRING(255),
      xlabel: lang.t('fields.titulo')
    },
    vigencia: {
      type: DataTypes.DATEONLY,
      xlabel: lang.t('fields.vigencia')
    },
    ciudad: {
      type: DataTypes.STRING(150),
      xlabel: lang.t('fields.ciudad')
    },
    tipo: {
      type: DataTypes.ENUM,
      values: ['PILOTO', 'TRIPULANTE_DE_CABINA'],
      xlabel: lang.t('fields.tipo_tripulacion')
    },
    sincronizado: {
      type: DataTypes.BOOLEAN,
      xlabel: lang.t('fields.sincronizado')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO'],
      defaultValue: 'ACTIVO',
      xlabel: lang.t('fields.estado')
    },
    observacion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.observacion')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Tripulaciones = sequelize.define('tripulaciones', fields, {
    timestamps: false,
    tableName: 'vue_tripulaciones'
  });

  return Tripulaciones;
};
