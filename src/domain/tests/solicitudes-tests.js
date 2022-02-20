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

test.serial('Solicitud#validar', async t => {
  const { Solicitud } = services;
  const idSolicitud = 2;
  let itinerario = await Solicitud.validar(idSolicitud);

  console.dir(itinerario.data);
  t.true(true, 'Solicitud validada');
});
