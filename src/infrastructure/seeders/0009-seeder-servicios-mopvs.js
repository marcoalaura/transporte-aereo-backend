'use strict';

const { setTimestampsSeeder } = require('../lib/util');

let items = [
  {
    codigo: 'DGAC-01',
    metodo: 'Lista de aeronaves',
    descripcion: 'Servicio que lista todas las aeronaves registradas por la DGAC',
    entidad: 'DGAC',
    url: 'http://interoperabilidad.oopp.gob.bo/v1/dgac/aeronaves/',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJFT2phRHhIeU9tVVp5QW9zMEYwMkE3MHp2cVR2czczeiIsInVzZXIiOiJhcm1pbiJ9.Iek8cDDJRaCItK7kX_hDubM6IFGGueFiVF_hmACwrmo',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'DGAC-02',
    metodo: 'Lista de pilotos',
    descripcion: 'Servicio que lista todos los pilotos registradas por la DGAC',
    entidad: 'DGAC',
    url: 'http://interoperabilidad.oopp.gob.bo/v1/dgac/pilotos/',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJFT2phRHhIeU9tVVp5QW9zMEYwMkE3MHp2cVR2czczeiIsInVzZXIiOiJhcm1pbiJ9.Iek8cDDJRaCItK7kX_hDubM6IFGGueFiVF_hmACwrmo',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'DGAC-03',
    metodo: 'Lista de tripulantes',
    descripcion: 'Servicio que lista todos los tripulantes registradas por la DGAC',
    entidad: 'DGAC',
    url: 'http://interoperabilidad.oopp.gob.bo/v1/dgac/tripulantes/',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJFT2phRHhIeU9tVVp5QW9zMEYwMkE3MHp2cVR2czczeiIsInVzZXIiOiJhcm1pbiJ9.Iek8cDDJRaCItK7kX_hDubM6IFGGueFiVF_hmACwrmo',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'SABSA-01',
    metodo: 'Itinerarios en tiempo real',
    descripcion: 'Servicio que lista todos los los itinerarios en tiempo real de SABSA',
    entidad: 'SABSA',
    url: 'http://www.sabsa.aero/itinerario/quick',
    token: '',
    tipo: 'PUBLICO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'SABSA-02',
    metodo: 'Reporte de Aterrizajes',
    descripcion: 'Servicio que obteniene el reporte de Aterrizajes de SABSA',
    entidad: 'SABSA',
    url: 'http://186.121.253.130/WS_REST_SABSAAERO/ESTADISTICO_MOPSV/REST_ESTADISTICO_MOPSV.svc/ESTADISTICO_ATZ/',
    token: '',
    tipo: 'PUBLICO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'SABSA-03',
    metodo: 'Reporte de Pasajeros',
    descripcion: 'Servicio que obteniene el reporte de Pasajeros de SABSA',
    entidad: 'SABSA',
    url: 'http://186.121.253.130/WS_REST_SABSAAERO/ESTADISTICO_MOPSV/REST_ESTADISTICO_MOPSV.svc/ESTADISTICO_PAX/',
    token: '',
    tipo: 'PUBLICO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'SABSA-04',
    metodo: 'Reporte de Aterrizajes',
    descripcion: 'Servicio que obtiene el reporte de Aterrizajes de SABSA',
    entidad: 'SABSA',
    url: 'http://186.121.253.130/WS_REST_SABSAAERO/ESTADISTICO_MOPSV/REST_ESTADISTICO_MOPSV.svc/ESTADISTICO_ATERRIZAJE_OCUPACION_SEMANA/',
    token: '',
    tipo: 'PUBLICO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'SABSA-05',
    metodo: 'Reporte de Pasajeros',
    descripcion: 'Servicio que obtiene el reporte de Pasajeros de SABSA',
    entidad: 'SABSA',
    url: 'http://186.121.253.130/WS_REST_SABSAAERO/ESTADISTICO_MOPSV/REST_ESTADISTICO_MOPSV.svc/ESTADISTICO_PAX_OCUPACION_SEMANA/',
    token: '',
    tipo: 'PUBLICO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'OOPP-01',
    metodo: 'Token para acceder a los otros servicios',
    descripcion: 'Servicio que obtiene el token para servicios MOPSV tracking',
    entidad: 'MOPSV',
    url: 'http://sitaws.oopp.gob.bo/get_token/',
    token: '',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'OOPP-02',
    metodo: 'Lista de numeros de vuelos',
    descripcion: 'Servicio para obtener la lista de numeros de vuelos',
    entidad: 'MOPSV',
    url: 'http://sitaws.oopp.gob.bo/api/tracking/ruta/',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzA5MzMwNzYsInVzZXJuYW1lIjoiYWdldGljIiwidXNlcl9pZCI6NSwiZW1haWwiOiJhZ2V0aWNAYWdldGljLm9vcHAuZ29iLmJvIn0.0b7-mvNVTmRlUemSUYtgOl9GBF-LlUl7IeXOscs73Cg',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'OOPP-03',
    metodo: 'Detalle del numero de vuelo',
    descripcion: 'Servicio para ver el detalle del numero de vuelo',
    entidad: 'MOPSV',
    url: 'http://sitaws.oopp.gob.bo/api/tracking/ruta/',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzA5MzMwNzYsInVzZXJuYW1lIjoiYWdldGljIiwidXNlcl9pZCI6NSwiZW1haWwiOiJhZ2V0aWNAYWdldGljLm9vcHAuZ29iLmJvIn0.0b7-mvNVTmRlUemSUYtgOl9GBF-LlUl7IeXOscs73Cg',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'OOPP-04',
    metodo: 'Lista de coordenadas del numero de vuelo',
    descripcion: 'Servicio para obtener la lista de cooredenadas del numero de vuelo',
    entidad: 'MOPSV',
    url: 'http://sitaws.oopp.gob.bo/api/tracking/ruta/',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzA5MzMwNzYsInVzZXJuYW1lIjoiYWdldGljIiwidXNlcl9pZCI6NSwiZW1haWwiOiJhZ2V0aWNAYWdldGljLm9vcHAuZ29iLmJvIn0.0b7-mvNVTmRlUemSUYtgOl9GBF-LlUl7IeXOscs73Cg',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'OOPP-05',
    metodo: 'Lista de coordenadas del numero de vuelo  por páginas',
    descripcion: 'Servicio para obtener la lista de cooredenadas del numero de vuelo por páginas',
    entidad: 'MOPSV',
    url: 'http://sitaws.oopp.gob.bo/api/v2/tracking/ruta',
    token: '',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'AASANA-01',
    metodo: 'Lista de planes de vuelo no regulares',
    descripcion: 'Servicio para obtener la lista de planes de vuelo no regulares FPL',
    entidad: 'AASANA',
    url: 'http://efpl.aasana.bo/efplws/webresources/entity.plan_de_vuelo/planes_por_aprobar_policia/',
    token: '',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'AASANA-02',
    metodo: 'Obtener detalles del plan de vuelo no regular por codigo de plan de vuelo',
    descripcion: 'Servicio para obtener detalles del plan de vuelo no regulares',
    entidad: 'AASANA',
    url: 'http://efpl.aasana.bo/efplws/webresources/entity.plan_de_vuelo/',
    token: '',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  },
  {
    codigo: 'AASANA-03',
    metodo: 'Obtener detalles de horas de despegue y aterrizaje de vuelos por rango de fechas',
    descripcion: 'Servcio para obtener detalles de hora despegue y aterrizaje de vuelos civiles por rango de fechas',
    entidad: 'AASANA',
    url: 'http://200.87.120.60:9523/IntegracionANH/WSAasana/IntegracionAASANA',
    token: 'EBF8FDEFA7ED24CF8C47EE0B149FD4F5',
    tipo: 'CONVENIO',
    estado: 'ACTIVO',
    _user_created: 1
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('servicios_mopsv', items, {});
  },

  down (queryInterface, Sequelize) { }
};
