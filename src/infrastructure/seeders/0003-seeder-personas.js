'use strict';

// const casual = require('casual');
const { setTimestampsSeeder } = require('../lib/util');

// Datos de producción
let items = [
  {
    nombres: 'Administrador',
    primer_apellido: '',
    segundo_apellido: '',
    nombre_completo: 'Administrador',
    tipo_documento_otro: '',
    nro_documento: '',
    telefono: '',
    movil: '',
    nacionalidad: 'BOLIVIANA',
    pais_nacimiento: 'BOLIVIA',
    genero: 'F',
    estado: 'ACTIVO'
  }
];

// Agregando datos aleatorios para desarrollo
if (typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production') {
  let personas = [
    {
      nombres: 'YALITZA',
      primer_apellido: 'PEREZ',
      segundo_apellido: 'GAREY',
      nombre_completo: 'YALITZA PEREZ GAREY',
      nro_documento: '4427018',
      fecha_nacimiento: '2001-12-24',
      telefono: '',
      movil: '',
      nacionalidad: 'BOLIVIANA',
      pais_nacimiento: 'BOLIVIA',
      genero: 'F',
      estado: 'ACTIVO'
    }
  ];
  items = items.concat(personas);
}

// // Agregando datos aleatorios para desarrollo
// if (typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production') {
//   let personas = Array(9).fill().map((_, i) => {
//     let item = {
//       nombres: casual.first_name,
//       primer_apellido: casual.last_name,
//       segundo_apellido: casual.last_name,
//       nombre_completo: casual.full_name,
//       tipo_documento: casual.random_element(['CI', 'PASAPORTE', 'EXTRANJERO']),
//       tipo_documento_otro: '',
//       nro_documento: casual.integer(7, 10),
//       fecha_nacimiento: casual.date('YYYY-MM-DD'),
//       telefono: casual.phone,
//       movil: casual.phone,
//       nacionalidad: 'BOLIVIANA',
//       pais_nacimiento: 'BOLIVIA',
//       genero: casual.random_element(['F', 'F', 'OTRO']),
//       estado: casual.random_element(['ACTIVO', 'INACTIVO'])
//     };

//     return item;
//   });

//   items = items.concat(personas);
// }

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_personas', items, {});
  },

  down (queryInterface, Sequelize) { }
};
