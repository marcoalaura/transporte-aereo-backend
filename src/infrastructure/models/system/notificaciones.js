'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    tipo: {
      type: DataTypes.ENUM,
      values: ['INTERNO', 'CIUDADANIA', 'CORREO'],
      defaultValue: 'INTERNO',
      allowNull: false,
      xlabel: lang.t('fields.tipo')
    },
    titulo: {
      type: DataTypes.STRING(255),
      xlabel: lang.t('fields.titulo')
    },
    mensaje: {
      type: DataTypes.TEXT,
      xlabel: lang.t('fields.mensaje')
    },
    email_receptor: {
      type: DataTypes.STRING(255),
      xlabel: lang.t('fields.email_receptor'),
      validate: {
        isEmail: true
      }
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['ENVIADO', 'NO_ENVIADO'],
      defaultValue: "ENVIADO",
      xlabel: lang.t('fields.estado')
    },
    visto: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      xlabel: lang.t('fields.visto'),
      defaultValue: false
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Notificaciones = sequelize.define('notificaciones', fields, {
    timestamps: false,
    tableName: 'sys_notificaciones'
  });

  return Notificaciones;
};
