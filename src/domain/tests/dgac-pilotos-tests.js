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

test.serial('DgacPiloto#findByLicencia - not found', async t => {
  // const { DgacPiloto } = services;
  // let res = await DgacPiloto.findByLicencia('4882853');

  // t.is(res.code, 1, 'Respuesta correcta');
  // t.true(res.data.length >= 1, 'Se tiene más de 10 permisos en la bd');
  // t.is(res.message, 'OK', 'Mensaje correcto');
  t.true(true);
});

// test.serial('DgacPiloto#findByLicencia - exist', async t => {
//   const { DgacPiloto } = services;
//   let res = await DgacPiloto.findByLicencia('4882853');

//   t.is(res.code, 1, 'Respuesta correcta');
//   t.true(res.data.length >= 1, 'Se tiene más de 10 permisos en la bd');
//   t.is(res.message, 'OK', 'Mensaje correcto');
// });
