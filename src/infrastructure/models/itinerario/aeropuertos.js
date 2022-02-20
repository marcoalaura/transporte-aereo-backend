'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    codigo_icao: {
      type: DataTypes.STRING(5),
      unique: true,
      allowNull: false,
      xlabel: lang.t('fields.codigo_icao')
    },
    codigo_iata: {
      type: DataTypes.STRING(5),
      xlabel: lang.t('fields.codigo_iata')
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      xlabel: lang.t('fields.nombre')
    },
    ciudad: {
      type: DataTypes.STRING(50),
      xlabel: lang.t('fields.ciudad')
    },
    pais: {
      type: DataTypes.STRING(150),
      xlabel: lang.t('fields.id_pais')
    },
    lat_grados: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.lat_grados')
    },
    lat_minutos: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.lat_minutos')
    },
    lat_segundos: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.lat_segundos')
    },
    lat_dir: {
      type: DataTypes.STRING(1),
      xlabel: lang.t('fields.lat_dir')
    },
    lon_grados: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.lon_grados')
    },
    lon_minutos: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.lon_minutos')
    },
    lon_segundos: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.lon_segundos')
    },
    lon_dir: {
      type: DataTypes.STRING(1),
      xlabel: lang.t('fields.lon_dir')
    },
    altitud: {
      type: DataTypes.INTEGER,
      xlabel: lang.t('fields.altitud')
    },
    lat_decimal: {
      type: DataTypes.DECIMAL,
      xlabel: lang.t('fields.lat_decimal')
    },
    lon_decimal: {
      type: DataTypes.DECIMAL,
      xlabel: lang.t('fields.lon_decimal')
    },
    municipio: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.municipio')
    },
    departamento: {
      type: DataTypes.STRING(50),
      xlabel: lang.t('fields.departamento')
    },
    clave_referencia: {
      type: DataTypes.STRING(2),
      xlabel: lang.t('fields.clave_referencia')
    },
    categoria_ssei: {
      type: DataTypes.INTEGER(2),
      xlabel: lang.t('fields.categoria_ssei')
    },
    certificado_aerodromo: {
      type: DataTypes.ENUM,
      values: ['NACIONAL', 'INTERNACIONAL'],
      xlabel: lang.t('fields.certificado_aerodromo')
    },
    lapso_entre_despegues: {
      type: DataTypes.INTEGER(11),
      xlabel: lang.t('fields.lapso_entre_despegues')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO'],
      defaultValue: 'ACTIVO',
      xlabel: lang.t('fields.estado')
    },
    _user_created: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      label: lang.t('fields._user_created')
    },
    _user_updated: {
      type: DataTypes.INTEGER,
      label: lang.t('fields._user_updated')
    },
    _created_at: {
      type: DataTypes.DATE,
      label: lang.t('fields._created_at'),
      defaultValue: DataTypes.NOW
    },
    _updated_at: {
      type: DataTypes.DATE,
      xlabel: lang.t('fields._updated_at')
    }
  };

  let Aeropuertos = sequelize.define('aeropuertos', fields, {
    timestamps: false,
    tableName: 'ite_aeropuertos'
  });

  return Aeropuertos;
};
