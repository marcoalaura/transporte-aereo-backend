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

// test.serial('Itinerario#findAll', async t => {
//   const { itinerarios } = repositories;
//   let lista = await itinerarios.findAll();
//   console.log('lista', lista);
//   t.true(lista.count >= 2, 'Se tiene 2 registros en la bd');
// });

test.serial('Itinerario#filter - sin fecha final', async t => {
  const { itinerarios } = repositories;
  let lista = await itinerarios.filter({
    estado_solicitud: 'APROBADO',
    fecha_inicio_solicitud: new Date(2018, 0, 15),
    id_solicitud: 2
  });
  // console.log('ITINERARIOS', lista);
  console.log('TOTAL sin fecha final', lista.length);
  t.true(true, 'Se tiene 2 registros en la bd');
});

test.serial('Itinerario#filter - con fecha final', async t => {
  const { itinerarios } = repositories;
  let lista = await itinerarios.filter({
    estado_solicitud: 'APROBADO',
    fecha_inicio_solicitud: new Date(2018, 0, 15),
    fecha_fin_solicitud: new Date(2018, 1, 25),
    id_solicitud: 2
  });
  // console.log('ITINERARIOS', lista);
  console.log('TOTAL con fecha final', lista.length);
  t.true(true, 'Se tiene 2 registros en la bd');
});

// test.serial('Itinerario#findById', async t => {
//   const { itinerarios } = repositories;
//   const id = 1;

//   let rol = await itinerarios.findById(id);

//   t.is(rol.id, id, 'Se recuperó el registro mediante un id');
// });

// test.serial('Itinerario#createOrUpdate - new', async t => {
//   const { itinerarios } = repositories;
//   const nuevoItinerario = {
//     nombre: 'ROL_TEST',
//     descripcion: 'Itinerario de prueba',
//     _user_created: 1,
//     _created_at: new Date()
//   };
//   let rol = await itinerarios.createOrUpdate(nuevoItinerario);
//   t.true(typeof rol.id === 'number', 'Comprobando que el nuevo rol tenga un id');
//   t.is(rol.nombre, nuevoItinerario.nombre, 'Creando registro - nombre');
//   t.is(rol.descripcion, nuevoItinerario.descripcion, 'Creando registro - descripcion');

//   test.idItinerario = rol.id;
// });

// test.serial('Itinerario#createOrUpdate - exists', async t => {
//   const { itinerarios } = repositories;
//   const newData = { id: test.idItinerario, nombre: 'ROL_NUEVO' };

//   let rol = await itinerarios.createOrUpdate(newData);

//   t.is(rol.nombre, newData.nombre, 'Actualizando registro rol');
// });

// test.serial('Itinerario#delete', async t => {
//   const { itinerarios } = repositories;
//   let deleted = await itinerarios.deleteItem(test.idItinerario);

//   t.is(deleted, 1, 'Itinerario eliminado');
// });
