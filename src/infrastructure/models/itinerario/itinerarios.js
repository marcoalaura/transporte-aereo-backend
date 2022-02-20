'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    nro_vuelo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      xlabel: lang.t('fields.nro_vuelo')
    },
    hora_despegue: {
      type: DataTypes.STRING(10),
      allowNull: false,
      xlabel: lang.t('fields.hora_despegue')
    },
    hora_aterrizaje: {
      type: DataTypes.STRING(10),
      allowNull: false,
      xlabel: lang.t('fields.hora_aterrizaje')
    },
    dia_1: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      xlabel: lang.t('fields.dia1')
    },
    dia_2: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      xlabel: lang.t('fields.dia2')
    },
    dia_3: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      xlabel: lang.t('fields.dia3')
    },
    dia_4: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      xlabel: lang.t('fields.dia4')
    },
    dia_5: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      xlabel: lang.t('fields.dia5')
    },
    dia_6: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      xlabel: lang.t('fields.dia6')
    },
    dia_7: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      xlabel: lang.t('fields.dia7')
    },
    observacion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.observacion')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['APROBADO', 'OBSERVADO', 'CREADO', 'REPROGRAMADO'],
      defaultValue: 'CREADO',
      xlabel: lang.t('fields.estado')
    },
    tipo_vuelo: {
      type: DataTypes.ENUM,
      values: ['NACIONAL', 'INTERNACIONAL'],
      defaultValue: 'NACIONAL',
      xlabel: lang.t('fields.tipo_vuelo')
    },
    plan_vuelo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      xlabel: lang.t('fields.plan_vuelo')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Itinerarios = sequelize.define('itinerarios', fields, {
    timestamps: false,
    tableName: 'ite_itinerarios'
  });

  return Itinerarios;
};
