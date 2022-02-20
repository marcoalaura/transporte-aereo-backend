'use strict';

const { setTimestampsSeeder } = require('../lib/util');

let items = [
  {
    nombre: 'SUPERADMIN',
    descripcion: 'Super Administrador',
    path: 'entidades'
  },
  {
    nombre: 'MOPVS_ADMIN',
    descripcion: 'Administrador de MOPVS',
    path: 'sabsa'
  },
  {
    nombre: 'DGAC_ADMIN',
    descripcion: 'Administrador de DGAC',
    path: 'solicitudes'
  },
  {
    nombre: 'SABSA_ADMIN',
    descripcion: 'Administrador de SABSA',
    path: 'solicitudes'
  },
  {
    nombre: 'AASANA_ADMIN',
    descripcion: 'Administrador de AASANA',
    path: 'solicitudes'
  },
  {
    nombre: 'OPERADOR_AVION_ADMIN',
    descripcion: 'Administrador del Operador de la Aerolínea',
    path: 'usuarios'
  },
  {
    nombre: 'OPERADOR_AVION',
    descripcion: 'Usuario Operador de la Aerolínea',
    path: 'vuelos'
  },
  {
    nombre: 'OPERADOR_BUS_ADMIN',
    descripcion: 'Administrador del Operador de la empresa de Bus',
    path: 'usuarios'
  },
  {
    nombre: 'OPERADOR_BUS',
    descripcion: 'Usuario Operador de la empresa de Bus',
    path: 'viajes'
  },
  {
    nombre: 'FELCN_ADMIN',
    descripcion: 'Administrador de la FELCN',
    path: 'planSolicitudes'
  },
  {
    nombre: 'MOPVS',
    descripcion: 'Operador MOPVS',
    path: 'sabsa'
  },
  {
    nombre: 'DGAC',
    descripcion: 'Operador DGAC',
    path: 'solicitudes'
  },
  {
    nombre: 'SABSA',
    descripcion: 'Operador SABSA',
    path: 'solicitudes'
  },
  {
    nombre: 'AASANA',
    descripcion: 'Operador AASANA',
    path: 'solicitudes'
  },
  {
    nombre: 'FELCN',
    descripcion: 'Operador FELCN',
    path: 'planSolicitudes'
  },
  {
    nombre: 'AASANA_TORRE_CONTROL',
    descripcion: 'Operador de Torre de control',
    path: 'vuelos'
  },
  {
    nombre: 'ATT',
    descripcion: 'Autoridad de Regulación y Fiscalización de Telecomunicaciones y Transportes',
    path: 'solicitudes'
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_roles', items, {});
  },

  down (queryInterface, Sequelize) { }
};
