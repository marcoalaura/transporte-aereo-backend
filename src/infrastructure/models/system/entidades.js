'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      xlabel: lang.t('fields.nombre')
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      xlabel: lang.t('fields.descripcion')
    },
    sigla: {
      type: DataTypes.STRING(20),
      xlabel: lang.t('fields.sigla')
    },
    email: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.email')
    },
    telefonos: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.telefonos')
    },
    direccion: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.direccion')
    },
    web: {
      type: DataTypes.STRING(100),
      xlabel: lang.t('fields.web')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO'],
      defaultValue: 'ACTIVO',
      allowNull: false,
      xlabel: lang.t('fields.estado')
    },
    info: {
      type: DataTypes.JSON,
      xlabel: lang.t('fields.info')
    },
    subdomain: {
      type: DataTypes.STRING(20),
      xlabel: lang.t('fields.subdomain')
    },
    codigo_portal: {
      type: DataTypes.STRING(20),
      unique: true,
      xlabel: lang.t('fields.codigo_portal')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Entidades = sequelize.define('entidades', fields, {
    timestamps: false,
    tableName: 'sys_entidades'
  });

  return Entidades;
};
