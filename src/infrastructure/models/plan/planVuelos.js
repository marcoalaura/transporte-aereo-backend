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
    hora_salida: {
      type: DataTypes.STRING(8),
      xlabel: lang.t('fields.hora_salida')
    },
    velocidad_crucero: {
      type: DataTypes.STRING(20),
      xlabel: lang.t('fields.velocidad_crucero')
    },
    ruta: {
      type: DataTypes.STRING(255),
      xlabel: lang.t('fields.ruta')
    },
    nivel_crucero: {
      type: DataTypes.STRING(10),
      xlabel: lang.t('fields.nivel_crucero')
    },
    duracion_total: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.duracion_total')
    },
    observacion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.observacion')
    },
    volumen_referencial: {
      type: DataTypes.DECIMAL(10, 2),
      xlabel: lang.t('fields.volumen_referencial')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['CREADO', 'SOLICITADO', 'APROBADO', 'RECHAZADO', 'OBSERVADO', 'APROBADO_AASANA', 'APROBADO_FELCN'],
      defaultValue: 'CREADO',
      xlabel: lang.t('fields.estado')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Vuelos = sequelize.define('planVuelos', fields, {
    timestamps: false,
    tableName: 'plan_vuelos'
  });

  return Vuelos;
};
