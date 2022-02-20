'use strict';

const test = require('ava');
const { errors, config } = require('../../common');
const domain = require('../');

let services;

test.beforeEach(async () => {
  if (!services) {
    services = await domain(config.db).catch(errors.handleFatalError);
  }
});

test.serial('Aeronave#sincronizar', async t => {
  const { Aeronave } = services;
  const idUsuario = 1;
  await Aeronave.sincronizar(idUsuario);

  t.true(true, 'Aeronaves sincronizadas');
});
