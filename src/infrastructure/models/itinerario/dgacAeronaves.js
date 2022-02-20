'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    nroMatricula: {
      type: DataTypes.STRING(15)
    },
    nroSerie: {
      type: DataTypes.STRING(20)
    },
    marca: {
      type: DataTypes.STRING(100)
    },
    modelo: {
      type: DataTypes.STRING(100)
    },
    modeloGenerico: {
      type: DataTypes.STRING(50)
    },
    fechaInscripcion: {
      type: DataTypes.STRING(20)
    },
    propietario: {
      type: DataTypes.STRING(150)
    },
    estado: {
      type: DataTypes.STRING(50)
    },
    observaciones: {
      type: DataTypes.TEXT
    },
    volumenReferencial: {
      type: DataTypes.DECIMAL
    },
    fechaActualizacion: {
      type: DataTypes.STRING(20)
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let DgacAeronaves = sequelize.define('dgac_aeronaves', fields, {
    timestamps: false,
    tableName: 'dgac_aeronaves'
  });

  return DgacAeronaves;
};
