'use strict';

const { setTimestampsSeeder } = require('../lib/util');

let items = [
  // USUARIOS
  {
    'ruta': 'config',
    'label': 'Configuraciones',
    'icono': 'settings',
    'orden': 1,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': null,
    'id_seccion': null
  },
  {
    'ruta': 'entidades',
    'label': 'Entidades',
    'icono': null,
    'orden': 2,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 1,
    'id_seccion': null
  },
  {
    'ruta': 'personas',
    'label': 'Personas',
    'icono': null,
    'orden': 3,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 1,
    'id_seccion': null
  },
  {
    'ruta': 'usuarios',
    'label': 'Usuarios',
    'icono': null,
    'orden': 4,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 1,
    'id_seccion': null
  },
  {
    'ruta': 'modulos',
    'label': 'Módulos y permisos',
    'icono': null,
    'orden': 5,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 1,
    'id_seccion': null
  },
  {
    'ruta': 'parametros',
    'label': 'Preferencias',
    'icono': null,
    'orden': 6,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 1,
    'id_seccion': null
  },
  {
    'ruta': 'permisos',
    'label': 'Permisos',
    'icono': null,
    'orden': 7,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 1,
    'id_seccion': null
  },
  {
    'ruta': 'roles',
    'label': 'Roles',
    'icono': null,
    'orden': 8,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 1,
    'id_seccion': null
  },
  {
    'ruta': 'logs',
    'label': 'Logs del sistema',
    'icono': null,
    'orden': 9,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 1,
    'id_seccion': null
  },
  {
    'ruta': 'serviciosIop',
    'label': 'Servicios Iop',
    'icono': null,
    'orden': 10,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 1,
    'id_seccion': null
  },
  {
    'ruta': 'ite',
    'label': 'Itinerarios',
    'icono': 'date_range',
    'orden': 11,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': null,
    'id_seccion': null
  },
  {
    'ruta': 'operadores',
    'label': 'Operadores',
    'icono': null,
    'orden': 12,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 11,
    'id_seccion': null
  },
  {
    'ruta': 'aeronaves',
    'label': 'Aeronaves',
    'icono': null,
    'orden': 13,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 11,
    'id_seccion': null
  },
  {
    'ruta': 'aeropuertos',
    'label': 'Aeropuertos',
    'icono': null,
    'orden': 14,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 11,
    'id_seccion': null
  },
  {
    'ruta': 'solicitudes',
    'label': 'Solicitudes',
    'icono': null,
    'orden': 15,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 11,
    'id_seccion': null
  },
  {
    'ruta': 'itinerarios',
    'label': 'Itinerarios',
    'icono': null,
    'orden': 16,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 11,
    'id_seccion': null
  },
  {
    'ruta': 'vue',
    'label': 'Vuelos',
    'icono': 'flight_takeoff',
    'orden': 17,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': null,
    'id_seccion': null
  },
  {
    'ruta': 'vuelos',
    'label': 'Vuelos programados',
    'icono': null,
    'orden': 18,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 17,
    'id_seccion': null
  },
  {
    'ruta': 'pasajeros',
    'label': 'Pasajeros',
    'icono': null,
    'orden': 19,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 17,
    'id_seccion': null
  },
  {
    'ruta': 'tripulaciones',
    'label': 'Tripulación',
    'icono': null,
    'orden': 20,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 17,
    'id_seccion': null
  },
  {
    'ruta': 'equipajes',
    'label': 'Equipajes',
    'icono': null,
    'orden': 21,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 17,
    'id_seccion': null
  },
  {
    'ruta': 'cargas',
    'label': 'Cargas',
    'icono': null,
    'orden': 22,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 17,
    'id_seccion': null
  },
  {
    'ruta': 'reportes',
    'label': 'Reportes',
    'icono': 'assessment',
    'orden': 23,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': null,
    'id_seccion': null
  },
  {
    'ruta': 'sabsa',
    'label': 'Sabsa',
    'icono': '',
    'orden': 24,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 23,
    'id_seccion': null
  },
  {
    'ruta': 'serviciosMopsv',
    'label': 'ServiciosMopsv',
    'icono': '',
    'orden': 25,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 1,
    'id_seccion': null
  },
  {
    'ruta': 'plan',
    'label': 'Plan de vuelos',
    'icono': 'local_airport',
    'orden': 26,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': null,
    'id_seccion': null
  },
  {
    'ruta': 'planSolicitudes',
    'label': 'Repetitivos',
    'icono': '',
    'orden': 27,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 26,
    'id_seccion': null
  },
  {
    'ruta': 'planVuelos',
    'label': 'Plan de vuelo',
    'icono': '',
    'orden': 28,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 26,
    'id_seccion': null
  },
  {
    'ruta': 'tracking',
    'label': 'Tracking',
    'icono': '',
    'orden': 29,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 23,
    'id_seccion': null
  },
  {
    'ruta': 'planNoRegulares',
    'label': 'No Regulares',
    'icono': '',
    'orden': 30,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 26,
    'id_seccion': null
  },
  {
    'ruta': 'puertas',
    'label': 'Puertas',
    'icono': '',
    'orden': 31,
    'estado': 'ACTIVO',
    'visible': false,
    'id_modulo': 11,
    'id_seccion': null
  },
  {
    'ruta': 'buscarPasajeros',
    'label': 'Pasajeros',
    'icono': '',
    'orden': 32,
    'estado': 'ACTIVO',
    'visible': true,
    'id_modulo': 23,
    'id_seccion': null
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_modulos', items, {});
  },

  down (queryInterface, Sequelize) { }
};
