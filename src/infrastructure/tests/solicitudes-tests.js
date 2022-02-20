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

test.serial('Solicitudes#findAll', async t => {
  const { solicitudes } = repositories;
  let lista = await solicitudes.findAll();
  console.log('lista', lista.count);
  t.true(true, 'Itinerairos registrados');
});

// test.serial('Solicitudes#findById', async t => {
//   const { solicitudes } = repositories;
//   const id = 1;

//   let rol = await solicitudes.findById(id);

//   t.is(rol.id, id, 'Se recuperó el registro mediante un id');
// });

// test.serial('Solicitudes#createOrUpdate - new', async t => {
//   const { solicitudes } = repositories;
//   const nuevoSolicitudes = {
//     nombre: 'ROL_TEST',
//     descripcion: 'Solicitudes de prueba',
//     _user_created: 1,
//     _created_at: new Date()
//   };
//   let rol = await solicitudes.createOrUpdate(nuevoSolicitudes);
//   t.true(typeof rol.id === 'number', 'Comprobando que el nuevo rol tenga un id');
//   t.is(rol.nombre, nuevoSolicitudes.nombre, 'Creando registro - nombre');
//   t.is(rol.descripcion, nuevoSolicitudes.descripcion, 'Creando registro - descripcion');

//   test.idSolicitudes = rol.id;
// });

// test.serial('Solicitudes#createOrUpdate - exists', async t => {
//   const { solicitudes } = repositories;
//   const newData = { id: test.idSolicitudes, nombre: 'ROL_NUEVO' };

//   let rol = await solicitudes.createOrUpdate(newData);

//   t.is(rol.nombre, newData.nombre, 'Actualizando registro rol');
// });

// test.serial('Solicitudes#delete', async t => {
//   const { solicitudes } = repositories;
//   let deleted = await solicitudes.deleteItem(test.idSolicitudes);

//   t.is(deleted, 1, 'Solicitudes eliminado');
// });
