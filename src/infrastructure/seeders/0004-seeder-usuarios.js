'use strict';

const { setTimestampsSeeder } = require('../lib/util');
const { text } = require('../../common');
const contrasena = text.encrypt('123456');

// Datos de producción
let items = [
  {
    usuario: 'admin',
    contrasena,
    email: 'admin@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 1,
    id_entidad: 1
  },
  {
    usuario: 'oopp',
    contrasena,
    email: 'oopp@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 2,
    id_entidad: 2
  },
  {
    usuario: 'dgac',
    contrasena,
    email: 'dgac@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 3,
    id_entidad: 3
  },
  {
    usuario: 'sabsa',
    contrasena,
    email: 'sabsa@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 4,
    id_entidad: 4
  },
  {
    usuario: 'aasana',
    contrasena,
    email: 'aasana@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 5,
    id_entidad: 5
  },
  {
    usuario: 'felcn',
    contrasena,
    email: 'felcn@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 10,
    id_entidad: 8,
    id_aeropuerto: 9292
  },
  {
    usuario: 'att',
    contrasena,
    email: 'att@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 17,
    id_entidad: 8,
    id_aeropuerto: 9292
  },
  {
    usuario: 'boa',
    contrasena,
    email: 'boa@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 1
  },
  {
    usuario: 'amaszonas',
    contrasena,
    email: 'amaszonas@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 2
  },
  {
    usuario: 'ecojet',
    contrasena,
    email: 'ecojet@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 3
  },
  {
    usuario: 'austral',
    contrasena,
    email: 'austral@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 4,
    id_aeropuerto: 9292
  },
  {
    usuario: 'aerogal',
    contrasena,
    email: 'aerogal@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 5,
    id_aeropuerto: 9292
  },
  {
    usuario: 'aerolineasargentinas',
    contrasena,
    email: 'aerolineasargentinas@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 6,
    id_aeropuerto: 9292
  },
  {
    usuario: 'aireuropa',
    contrasena,
    email: 'aireuropa@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 7,
    id_aeropuerto: 9292
  },
  {
    usuario: 'americanairlines',
    contrasena,
    email: 'americanairlines@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 8,
    id_aeropuerto: 9292
  },
  {
    usuario: 'avianca',
    contrasena,
    email: 'avianca@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 5,
    id_operador: 9,
    id_aeropuerto: 9292
  },
  {
    usuario: 'copaairlines',
    contrasena,
    email: 'copaairlines@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 10,
    id_aeropuerto: 9292
  },
  {
    usuario: 'golvrg',
    contrasena,
    email: 'golvrg@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 11,
    id_aeropuerto: 9292
  },
  {
    usuario: 'latamairlines',
    contrasena,
    email: 'latamairlines@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 12,
    id_aeropuerto: 9292
  },
  {
    usuario: 'lanperu',
    contrasena,
    email: 'lanperu@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 13,
    id_aeropuerto: 9292
  },
  {
    usuario: 'peruvian',
    contrasena,
    email: 'peruvian@agetic.gob.bo',
    estado: 'ACTIVO',
    cargo: 'Profesional',
    id_persona: 1,
    id_rol: 7,
    id_entidad: 6,
    id_operador: 14,
    id_aeropuerto: 9292
  }
];

// Agregando datos aleatorios para desarrollo
if (typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production') {
  let usuarios = [
    {
      usuario: 'bolivar',
      contrasena,
      email: 'bolivar@agetic.gob.bo',
      estado: 'ACTIVO',
      cargo: 'Profesional',
      id_persona: 1,
      id_rol: 9,
      id_entidad: 7
    },
    {
      usuario: 'torre',
      contrasena,
      email: 'torre@agetic.gob.bo',
      estado: 'ACTIVO',
      cargo: 'Profesional',
      id_persona: 1,
      id_rol: 16,
      id_entidad: 5,
      id_aeropuerto: 9292
    },
    {
      usuario: 'xvdfsfwerw01',
      contrasena,
      email: 'yalitza@yopmail.com',
      estado: 'ACTIVO',
      cargo: 'Profesional',
      id_persona: 2,
      id_rol: 6,
      id_entidad: 6,
      id_operador: 1
    }
  ];

  items = items.concat(usuarios);
}

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_usuarios', items, {});
  },

  down (queryInterface, Sequelize) { }
};
