'use strict';

const { setTimestampsSeeder } = require('../lib/util');
const templateCorreo = require('./templates/correo-tmpl');

let items = [
  { nombre: 'JWT_TOKEN_EXPIRATION', valor: 240, label: 'Tiempo de expiración del Token', descripcion: 'Tiempo de expiración del Token JWT en minutos' },
  { nombre: 'EMAIL_ORIGEN', valor: 'correo@agetic.gob.bo', label: 'Remitente', descripcion: 'Email del remitente del sistema para envío de correos' },
  { nombre: 'EMAIL_HOST', valor: 'smtp.agetic.gob.bo', label: 'Host', descripcion: 'Host del servicio de correos para envío de correos' },
  { nombre: 'EMAIL_PORT', valor: 587, label: 'Puerto', descripcion: 'Puerto para envío de correos' },
  { nombre: 'TEMPLATE_CORREO_BASE', valor: templateCorreo, label: 'Template base para el correo', descripcion: 'Template base para el correo electrónico' },
  { nombre: 'URL_ADMIN', valor: `http://localhost:8888/#/`, label: 'URL del administrador', descripcion: 'URL para acceder al administrador' },
  { nombre: 'URL_PORTAL', valor: `http://localhost:8080/#/`, label: 'URL del portal', descripcion: 'URL para acceder al portal' },
  { nombre: 'TIEMPO_BLOQUEO', valor: 10, label: 'Tiempo de bloqueo', descripcion: 'Tiempo cuando un usuario sea bloqueado en minutos' },
  { nombre: 'NRO_MAX_INTENTOS', valor: 3, label: 'Número máximo de intentos', descripcion: 'Número máximo de intentos que un usuario puede realizar el login' },
  { nombre: 'VALIDAR_SEGIP', valor: `SI`, label: 'Validar con el SEGIP', descripcion: 'Validar con el SEGIP en la importación de csv y el servicio web de pasajeros' },
  { nombre: 'USER_OOPP', valor: `agetic`, label: 'login usuario para OOPP', descripcion: 'Usuario de pruebas para servicios OOPP' },
  { nombre: 'PASS_OOPP', valor: `83nniLRkkCoQ588`, label: 'password para OOPP', descripcion: 'Password de pruebas para servicios OOPP' },
  { nombre: 'TOKEN_OPP', valor: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzA5MzMwNzYsInVzZXJuYW1lIjoiYWdldGljIiwidXNlcl9pZCI6NSwiZW1haWwiOiJhZ2V0aWNAYWdldGljLm9vcHAuZ29iLmJvIn0.0b7-mvNVTmRlUemSUYtgOl9GBF-LlUl7IeXOscs73Cg`, label: 'Token OOPP', descripcion: 'token para usar servicios OOPP' },
  { nombre: 'LAPSO_ENTRE_DESPEGUES', valor: 5, label: 'Lapso entre despegues', descripcion: 'Tiempo por defecto entre despegues de aviones' },
  { nombre: 'DIAS_ANTICIPACION_CREACION_RPL', valor: 15, label: 'Días de anticipación para la creación de un RPL', descripcion: 'Días de anticipación requeridos para permitir crear un plan RPL' },
  { nombre: 'TIEMPO_DESPEGUE_VUELO', valor: 10, label: 'Vuelo en panel luego de despegue', descripcion: 'Tiempo de duracion del vuelo en el panel luego de haber despegado' },
  { nombre: 'ENVIAR_NOTIFICACIONES_ELECTRONICAS', valor: 0, label: 'Enviar notificaciones electrónicas o apagarlas', descripcion: 'Controla si se envian notificaciones electrónicas, con cualquier valor distinto de 0 se envían' }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('parametros', items, {});
  },

  down (queryInterface, Sequelize) { }
};
