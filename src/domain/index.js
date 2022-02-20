'use strict';

const debug = require('debug')('app:domain');
const db = require('../infrastructure');
const { config, errors } = require('../common');
const util = require('./lib/util');
const path = require('path');
const Logs = require('app-logs');
const Params = require('app-params');
const Iop = require('app-iop');
const Mopsv = require('app-mopsv');

module.exports = async function () {
  // Obteniendo repositorios de la capa de infrastructura
  let repositories = await db(config.db).catch(errors.handleFatalError);

  // Cargando Parámetros
  repositories.Parametro = await Params(config.db);

  // Agregando servicio Iop a los repositorios
  repositories.Iop = await Iop(config.db);

  // Agregando Mopsv a los servicios
  repositories.Mopsv = await Mopsv(config.db);

  // Iniciando el módulo de logs
  const logs = await Logs(config.db).catch(errors.handleFatalError);
  repositories.Log = logs;

  // Cargando todos los servicios que se encuentran en la carpeta services y en sus subcarpetas, adjuntando logs
  let services = util.loadServices(path.join(__dirname, 'services'), repositories, {exclude: ['index.js', '[~|#]$', '.#']}, logs);
  services = util.convertLinealObject(services);
  debug('Capa del dominio - Servicios cargados');

  // Cargando modelos de la capa de infrastructura
  services._models = repositories._models;
  services._repositories = repositories;

  return services;
};
