'use strict';

const { errors, config } = require('../src/common');
const domain = require('../src/domain');
const moment = require('moment');

(async () => {
  let services = await domain(config.db).catch(errors.handleFatalError);
  const { Aeronave, Tripulacion } = services;
  const idUsuario = 1;

  console.time('=========> TIEMPO TOTAL');

  try {
    console.log('========== SINCRONIZANDO AERONAVES ==========', moment().format('DD/MM/YYYY HH:mm:ss'));
    let aeronaves = await Aeronave.sincronizar(idUsuario);
    console.log('TOTAL AERONAVES:', aeronaves.data.total, aeronaves.message);
    console.log('-> TOTAL NUEVAS AERONAVES:', aeronaves.data.nuevos.length || 0);

    console.log('========== SINCRONIZANDO PILOTOS ==========', moment().format('DD/MM/YYYY HH:mm:ss'));
    let pilotos = await Tripulacion.sincronizarDgacPilotos(idUsuario);
    console.log('TOTAL PILOTOS:', pilotos.data.total, pilotos.message);
    console.log('-> TOTAL NUEVOS PILOTOS:', pilotos.data.nuevos.length || 0);

    console.log('========== SINCRONIZANDO TRIPULANTES DE CABINA ==========', moment().format('DD/MM/YYYY HH:mm:ss'));
    let tripulacion = await Tripulacion.sincronizarDgacTripulantes(idUsuario);
    console.log('TOTAL TRIPULACION:', tripulacion.data.total, tripulacion.message);
    console.log('-> TOTAL NUEVOS TRIPULANTES:', tripulacion.data.nuevos.length || 0);

    console.log('========== FIN DE LA SINCRONIZACIÓN ==========', moment().format('DD/MM/YYYY HH:mm:ss'));
  } catch (e) {
    console.error('ERROR EN LA SINCRONIZACIÓN:', e);
  }

  console.timeEnd('=========> TIEMPO TOTAL');
  process.exit();
})();
