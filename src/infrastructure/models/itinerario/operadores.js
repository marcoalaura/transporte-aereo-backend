'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    nit: {
      type: DataTypes.STRING(20),
      unique: true,
      xlabel: lang.t('fields.nit')
    },
    codigo_iata: {
      type: DataTypes.STRING(2),
      xlabel: lang.t('fields.codigo_iata')
    },
    codigo_icao: {
      type: DataTypes.STRING(3),
      xlabel: lang.t('fields.codigo_icao')
    },
    sigla: {
      type: DataTypes.STRING(50),
      xlabel: lang.t('fields.sigla')
    },
    razon_social: {
      type: DataTypes.STRING(150),
      allowNull: false,
      xlabel: lang.t('fields.razon_social')
    },
    matricula_comercio: {
      type: DataTypes.STRING(20),
      xlabel: lang.t('fields.matricula_comercio')
    },
    departamento: {
      type: DataTypes.STRING(50),
      xlabel: lang.t('fields.departamento')
    },
    provincia: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.provincia')
    },
    municipio: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.municipio')
    },
    direccion: {
      type: DataTypes.STRING(255),
      xlabel: lang.t('fields.direccion')
    },
    telefonos: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.telefonos')
    },
    tipo: {
      type: DataTypes.ENUM,
      values: ['NACIONAL', 'INTERNACIONAL'],
      defaultValue: 'NACIONAL',
      xlabel: lang.t('fields.tipo')
    },
    tipo_transporte: {
      type: DataTypes.ENUM,
      values: ['AVION', 'BUS'],
      xlabel: lang.t('fields.tipo')
    },
    licencia: {
      type: DataTypes.STRING(50),
      xlabel: lang.t('fields.licencia')
    },
    fecha_vigencia: {
      type: DataTypes.DATEONLY,
      xlabel: lang.t('fields.fecha_vigencia')
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
    },
    usuario: {
      type: DataTypes.STRING(50),
      xlabel: lang.t('fields.usuario')
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      unique: true,
      xlabel: lang.t('fields.id_usuario')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Operadores = sequelize.define('operadores', fields, {
    timestamps: false,
    tableName: 'ite_operadores'
  });

  return Operadores;
};
