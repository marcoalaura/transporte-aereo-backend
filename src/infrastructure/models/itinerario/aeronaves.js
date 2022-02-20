'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    matricula: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      xlabel: lang.t('fields.matricula')
    },
    serie: {
      type: DataTypes.STRING(50),
      allowNull: false,
      xlabel: lang.t('fields.serie')
    },
    marca: {
      type: DataTypes.STRING(100),
      allowNull: false,
      xlabel: lang.t('fields.marca')
    },
    modelo: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.modelo')
    },
    modelo_generico: {
      type: DataTypes.STRING(50),
      xlabel: lang.t('fields.modelo_generico')
    },
    fecha_inscripcion: {
      type: DataTypes.DATEONLY,
      xlabel: lang.t('fields.fecha_inscripcion')
    },
    propietario: {
      type: DataTypes.STRING(150),
      allowNull: false,
      xlabel: lang.t('fields.propietario')
    },
    observaciones: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.observaciones')
    },
    fecha_actualizacion: {
      type: DataTypes.DATEONLY,
      xlabel: lang.t('fields.fecha_actualizacion')
    },
    capacidad_maxima_asientos: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.capacidad_maxima_asientos')
    },
    capacidad_carga: {
      type: DataTypes.DECIMAL,
      xlabel: lang.t('fields.capacidad_carga')
    },
    ads_b: {
      type: DataTypes.BOOLEAN,
      xlabel: lang.t('fields.ads_b')
    },
    descripcion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.descripcion')
    },
    estado_dgac: {
      type: DataTypes.STRING(150)
    },
    // volumen_referencial: {
    //   type: DataTypes.DECIMAL
    // },
    tipo_aeronave: {
      type: DataTypes.STRING(255),
      xlabel: lang.t('fields.tipo_aeronave')
    },
    categoria_estela: {
      type: DataTypes.ENUM,
      values: ['H', 'M', 'L'],
      xlabel: lang.t('fields.categoria_estela')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO', 'MANTENIMIENTO'],
      defaultValue: 'ACTIVO',
      xlabel: lang.t('fields.estado')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Aeronaves = sequelize.define('aeronaves', fields, {
    timestamps: false,
    tableName: 'ite_aeronaves'
  });

  return Aeronaves;
};
