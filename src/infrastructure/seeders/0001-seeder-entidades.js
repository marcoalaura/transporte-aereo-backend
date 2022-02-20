'use strict';

const { setTimestampsSeeder } = require('../lib/util');

// Datos de producción
let items = [
  {
    nombre: 'Agencia de gobierno electrónico y tecnologías de la información y comunicación',
    descripcion: 'La AGETIC está acá para desarrollar tecnología, que permita modernizar el Estado, transformar la gestión pública y reducir la burocracia. Estas tareas son desarrolladas por bolivianas y bolivianos que trabajan investigando, innovando e implementando nuevas técnicas y tecnologías que permitan el desarrollo soberano de nuestra patria. Para esto, la AGETIC busca a los mejores profesionales, gente joven comprometida con su gente y el destino de su país.',
    sigla: 'AGETIC',
    email: 'contacto@agetic.gob.bo',
    telefonos: '(+591 -2) 2128706 - (+591 -2) 2128707',
    direccion: 'Sopocachi, Calle Pedro Salazar Nº 631, esq. Andrés Muñoz. Edificio del Fondo Nacional de Desarrollo Regional(FNDR).Pisos 4 y 5',
    web: 'https://agetic.gob.bo',
    estado: 'ACTIVO'
  },
  {
    nombre: 'Ministerio de Obras Públicas, Servicios y Vivienda',
    descripcion: '',
    sigla: 'OOPP',
    email: 'oopp@oopp.gob.bo',
    telefonos: '(591) - 2 - 2156600 Fax: 2156604',
    direccion: 'Av.Mariscal Santa Cruz Esq.Calle Oruro Edif.Centro de Comunicaciones La Paz 5to piso',
    web: 'https://www.oopp.gob.bo/',
    estado: 'ACTIVO'
  },
  {
    nombre: 'Dirección General de Aeronática Civil',
    descripcion: '',
    sigla: 'DGAC',
    email: 'dgacbol@dgac.gob.bo',
    telefonos: '(591-2) 2444450 Fax (591-2) 2119323',
    direccion: 'Av. Arce No2631 – Edificio Multicine Piso 9',
    web: 'https://www.dgac.gob.bo/',
    estado: 'ACTIVO'
  },
  {
    nombre: 'Servicios de Aeropuertos Bolivianos S.A.',
    descripcion: '',
    sigla: 'SABSA',
    email: 'sabsa@agetic.gob.bo',
    telefonos: '',
    direccion: 'Aeropuerto internacional de El Alto',
    web: 'http://www.sabsa.aero/',
    estado: 'ACTIVO'
  },
  {
    nombre: 'Administración de Aeropuertos y Servicios Auxiliares a la Navegación Aérea',
    descripcion: '',
    sigla: 'AASANA',
    email: 'info@aasana.bo',
    telefonos: '2370341',
    direccion: 'Calle Reyes Ortiz Esq. Federico Suazo # 74',
    web: 'http://aasana.bo/',
    estado: 'ACTIVO'
  },
  {
    nombre: 'Operador Aerolínea',
    descripcion: '',
    sigla: 'OPERADOR AEROLINEA',
    email: 'contacto@agetic.gob.bo',
    telefonos: '',
    direccion: '',
    web: '',
    estado: 'ACTIVO'
  },
  {
    nombre: 'Operador Bus',
    descripcion: '',
    sigla: 'OPERADOR BUS',
    email: 'contacto@agetic.gob.bo',
    telefonos: '',
    direccion: '',
    web: '',
    estado: 'ACTIVO'
  },
  {
    nombre: 'Fuerza Especial de Lucha Contra el Narcotráfico ',
    descripcion: 'La Fuerza Especial de Lucha Contra el Narcotráfico tiene por misión la represión e interdicción del tráfico ilícito de sustancias controladas.',
    sigla: 'FELCN',
    email: 'direccion@felcn.gob.bo',
    telefonos: ' +591 2-2410047',
    direccion: 'Zona Sopocachi calle Aranzaes No. 100, La Paz, BOLIVIA',
    web: 'http://www.felcn.gob.bo/',
    estado: 'ACTIVO'
  },
  {
    nombre: 'Autoridad de Regulación y Fiscalización de Telecomunicaciones y Transportes',
    descripcion: 'Promover el derecho al acceso equitativo, universal y con calidad a las Telecomunicaciones, Tecnologías de Información y Comunicación, Transportes y Servicio Postal para las y los bolivianos.',
    sigla: 'ATT',
    email: 'att@agetic.gob.bo',
    telefonos: ' +591 2772299 ',
    direccion: 'Calle 13 de Calacoto, entre Av. Los Sauces y Av. Costanera, N° 8260.',
    web: 'https://www.att.gob.bo/',
    estado: 'ACTIVO'
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_entidades', items, {});
  },

  down (queryInterface, Sequelize) { }
};
