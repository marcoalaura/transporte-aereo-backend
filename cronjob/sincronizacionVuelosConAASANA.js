'use strict';

const { errors, config } = require('../src/common');
const domain = require('../src/domain');
// const moment = require('moment');
// const Mopsv = require('app-mopsv');

(async () => {
  let services = await domain(config.db).catch(errors.handleFatalError);
  const { Vuelo } = services;
  // const idUsuario = 1;
  try {
    await Vuelo.sincronizarVuelosConAASANA();
  } catch (e) {
    console.error('ERROR EN LA SINCRONIZACIÓN:', e.message);
  }
  process.exit();
})();
