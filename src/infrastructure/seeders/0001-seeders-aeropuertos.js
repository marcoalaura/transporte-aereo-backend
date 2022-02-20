'use strict';

let items = require('./sql/aeropuertosJson');
const { setTimestampsSeeder } = require('../lib/util');

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ite_aeropuertos', items, {});
  },

  down (queryInterface, Sequelize) { }
};
