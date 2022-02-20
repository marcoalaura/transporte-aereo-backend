const debug = require('debug')('app:api:vuelo');
const express = require('express');
const asyncify = require('express-asyncify');
const { loadRoutes } = require('../../lib/util');
let routes = asyncify(express.Router());

module.exports = function setupSystem (services) {
  debug('Iniciando rutas módulo vuelo');

  return loadRoutes(__dirname, { exclude: ['index.js'] }, services, routes);
};
