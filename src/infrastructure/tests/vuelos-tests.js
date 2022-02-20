'use strict';

const test = require('ava');
const { config, errors } = require('../../common');
const db = require('../');

let repositories;

test.beforeEach(async () => {
  if (!repositories) {
    repositories = await db(config.db).catch(errors.handleFatalError);
  }
});

test.serial('Vuelos#findAll', async t => {
  const { vuelos } = repositories;
  let lista = await vuelos.findAll();
  console.log('lista', lista.count);
  t.true(true, 'Vuelos registrados');
});
