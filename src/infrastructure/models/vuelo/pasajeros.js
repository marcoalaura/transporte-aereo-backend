'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    tipo: {
      type: DataTypes.ENUM,
      values: ['TRIPULANTE', 'PASAJERO'],
      xlabel: lang.t('fields.tipo_viajero')
    },
    tipo_viajero: {
      type: DataTypes.ENUM,
      values: ['NACIONAL', 'EXTRANJERO'],
      xlabel: lang.t('fields.tipo_viajero')
    },
    tipo_tripulacion: {
      type: DataTypes.ENUM,
      values: ['PILOTO', 'TRIPULANTE_DE_CABINA'],
      xlabel: lang.t('fields.tipo_tripulacion')
    },
    nro_asiento: {
      type: DataTypes.STRING(10),
      xlabel: lang.t('fields.nro_asiento')
    },
    fecha_vencimiento_doc: {
      type: DataTypes.DATEONLY,
      xlabel: lang.t('fields.fecha_vencimiento_doc')
    },
    entidad_emisora_doc: {
      type: DataTypes.STRING(255),
      xlabel: lang.t('fields.entidad_emisora_doc')
    },
    lugar_origen: {
      type: DataTypes.STRING(150),
      xlabel: lang.t('fields.lugar_origen')
    },
    lugar_destino: {
      type: DataTypes.STRING(150),
      xlabel: lang.t('fields.lugar_destino')
    },
    email: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.email')
    },
    observacion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.observacion')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['CHECKING', 'PRE_EMBARQUE', 'A_BORDO', 'VUELO_PERDIDO', 'CANCELADO', 'PAGADO', 'RESERVADO', 'ASIGNADO'],
      defaultValue: 'RESERVADO',
      xlabel: lang.t('fields.estado')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Pasajeros = sequelize.define('pasajeros', fields, {
    timestamps: false,
    tableName: 'vue_pasajeros'
  });

  return Pasajeros;
};
