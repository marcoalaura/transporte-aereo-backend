'use strict';

const debug = require('debug')('app:api:solicitud');
const guard = require('express-jwt-permissions')();
const { csv } = require('../../lib/upload');
const { userData } = require('../../lib/auth');

module.exports = function setupAeronave (api, services) {
  const { Solicitud } = services;

  // Creación de solicitud de mediante servicio web
  api.post('/ws/crear_solicitud', async (req, res, next) => {
    debug('Creando solicitud de itinerarios - servicio web');
    try {
      let user = await userData(req, services);
      let data = req.body;
      data.id_usuario = user.id;
      data.id_operador = user.id_operador;
      data.id_entidad = user.id_entidad;
      data.usuario = user.usuario;
      const result = await Solicitud.create(data, 'SOLICITADO');
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo crear la solicitud con sus itinerarios'));
      }
    } catch (e) {
      return next(e);
    }
  });

  // Estado de solicitud de mediante servicio web
  api.get('/ws/estado_solicitud/:id', async (req, res, next) => {
    debug('Estado solicitud de itinerarios - servicio web');
    try {
      const { id } = req.params;
      const result = await Solicitud.estado(id);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo ver el estado de la solicitud con sus itinerarios'));
      }
    } catch (e) {
      return next(e);
    }
  });

  // Creación de solicitud de itinerarios mediante CSV
  api.post('/solicitud/crear_solicitud', guard.check(['solicitudes:read']), async (req, res, next) => {
    debug('Validando datos CSV');
    let user = await userData(req, services);

    if (!req.files) {
      return next(new Error('Debe adjuntar el archivo CSV'));
    }

    const { csvFile } = req.files;
    const data = req.body;
    const headers = ['EQV', 'VLO', 'ORI', 'DES', 'ETD', 'ETA', 'DIA', 'OBS'];
    try {
      let items = await csv(csvFile.data, headers);

      data.itinerarios = items;
      data.id_usuario = user.id;
      const result = await Solicitud.create(data);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        return res.send(result.data);
      } else {
        return next(new Error('No se pudo crear la solicitud con sus itinerarios'));
      }
    } catch (err) {
      return next(err);
    }
  });

  // Aprobar solicitud y crear vuelos para el itinerario
  api.post('/solicitud/aprobar/:idSolicitud', guard.check(['solicitudes:update']), async (req, res, next) => {
    debug('Aprobando solicitud y creando vuelos');

    const { idSolicitud } = req.params;
    let user = await userData(req, services);

    try {
      let result = await Solicitud.aprobar(idSolicitud, user.id);

      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo aprobar y crear los vuelos del itinerario.'));
      }
    } catch (err) {
      return next(err);
    }
  });

  return api;
};
