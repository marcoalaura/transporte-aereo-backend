'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes, models) => {
  let fields = {
    id: util.pk,
    fecha_despegue: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      xlabel: lang.t('fields.fecha_despegue')
    },
    hora_etd: {
      type: DataTypes.STRING(150),
      allowNull: false,
      xlabel: lang.t('fields.hora_etd')
    },
    hora_despegue: {
      type: DataTypes.STRING(150),
      xlabel: lang.t('fields.hora_despegue')
    },
    fecha_aterrizaje: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      xlabel: lang.t('fields.fecha_aterrizaje')
    },
    hora_eta: {
      type: DataTypes.STRING(150),
      allowNull: false,
      xlabel: lang.t('fields.hora_eta')
    },
    hora_aterrizaje: {
      type: DataTypes.STRING(150),
      xlabel: lang.t('fields.hora_aterrizaje')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['PROGRAMADO', 'REPROGRAMADO', 'CANCELADO'],
      defaultValue: 'PROGRAMADO',
      xlabel: lang.t('fields.estado')
    },
    estado_vuelo: {
      type: DataTypes.ENUM,
      values: [ // blink green-blink blink-animated
        'CONFIRMADO', // > 60 && < 120 LLEGADAS
        'EN_HORARIO',
        'NUEVA_HORA',
        'PRE_EMBARQUE',
        'PREEMBARCANDO',
        'ABORDANDO', // blink verde, blick rojo cuando este 5min antes de la hora
        'CERRADO',
        'EN_TIERRA', // blink < -15 && > 0 LLEGADAS
        'INFORMES',
        'DEMORADO',
        'ARRIBO',
        'CANCELADO',
        'RODAJE',
        'DESPEGUE',
        'ASCENSO',
        'CRUCERO',
        'DESCENSO',
        'APROXIMACION',
        'ATERRIZAJE'
      ],
      defaultValue: 'EN_HORARIO',
      xlabel: lang.t('fields.estado')
    },
    nro_pasajeros: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      xlabel: lang.t('fields.nro_pasajeros')
    },
    motivo: {
      type: DataTypes.STRING(150),
      xlabel: lang.t('fields.motivo')
    },
    descripcion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.descripcion')
    },
    observacion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.observacion')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Vuelos = sequelize.define('vuelos', fields, {
    timestamps: false,
    tableName: 'vue_vuelos'
  });

  return Vuelos;
};
