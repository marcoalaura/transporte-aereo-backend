'use strict';

const domain = require('../domain');
const Params = require('app-params');
const Logs = require('app-logs');
const Iop = require('app-iop');
const Mopsv = require('app-mopsv');
const { config } = require('../common');
const Graphql = require('./graphql');
const { mergeGraphql } = require('./lib/util');

module.exports = async function setupModule (app) {
  try {
    // Cargando Capa del dominio
    let services = await domain(config.db);

    // Agregando parámetros a los servicios
    services.Parametro = await Params(config.db);

    // Agregando Logs a los servicios
    services.Log = await Logs(config.db);

    // Agregando Iop a los servicios
    services.Iop = await Iop(config.db);

    // Agregando Iop a los servicios
    services.Mopsv = await Mopsv(config.db);

    // Cargando GRAPHQL
    let graphql = Graphql(services);

    // Uniendo Graphql de usuarios con Graphql de parámetros
    mergeGraphql(graphql, services.Parametro.graphql, ['DateP']);

    // Uniendo Graphql de usuarios con Graphql de Logs
    mergeGraphql(graphql, services.Log.graphql, ['DateL']);

    // Uniendo Graphql de usuarios con Graphql de Iop
    mergeGraphql(graphql, services.Iop.graphql, ['DateI']);

    // Uniendo Graphql de usuarios con Graphql de Mopsv
    mergeGraphql(graphql, services.Mopsv.graphql, ['DateM']);

    return {
      services,
      graphql,
      _models: services._models,
      _repositories: services._repositories
    };
  } catch (err) {
    console.error(err);
    throw new Error(`Error al instanciar el módulo principal: ${err.message}`);
  }
};
