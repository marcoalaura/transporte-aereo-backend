'use strict';

const debug = require('debug')('app:api:vuelo');
const guard = require('express-jwt-permissions')();
const { userData } = require('../../lib/auth');
const { csv } = require('../../lib/upload');

module.exports = function setupAeronave (api, services) {
  const { Pasajero } = services;

  // Subiendo archivo CSV de pasajeros
  api.post('/pasajero/upload', guard.check(['pasajeros:read']), async (req, res, next) => {
    debug('Subiendo archivo CSV de pasajeros');
    try {
      let user = await userData(req, services);

      if (!req.files) {
        return next(new Error('Debe enviar el archivo CSV'));
      }

      const { csvFile } = req.files;
      const data = req.body;
      const headers = ['TIPO', 'TIPO_VIAJERO', 'TIPO_TRIPULACION', 'NRO_ASIENTO', 'FECHA_VENCIMIENTO_DOC', 'ENTIDAD_EMISORA_DOC', 'LUGAR_ORIGEN', 'LUGAR_DESTINO', 'EMAIL', 'NRO_LICENCIA', 'NOMBRES', 'PRIMER_APELLIDO', 'SEGUNDO_APELLIDO', 'TIPO_DOCUMENTO', 'NRO_DOCUMENTO', 'FECHA_NACIMIENTO', 'TELEFONO', 'MOVIL', 'NACIONALIDAD', 'PAIS_NACIMIENTO', 'GENERO', 'ESTADO'];

      try {
        let items = await csv(csvFile.data, headers);

        data.pasajeros = items;
        data.idUsuario = user.id;
        data.idOperador = user.id_operador;
        const result = await Pasajero.createAll(data);
        if (result.code === -1) {
          return next(new Error(result.message));
        }
        if (result.data) {
          return res.send(result.data);
        } else {
          return next(new Error('No se pudo agregar los pasajeros al vuelo'));
        }
      } catch (err) {
        return next(err);
      }
    } catch (e) {
      return next(e);
    }
  });

  // Subir pasajeros a un vuelo - Servicio web
  api.post('/ws/cargar_pasajeros', async (req, res, next) => {
    debug('Subir pasajeros a un vuelo - Servicio web');
    try {
      let user = await userData(req, services);
      let data = req.body;
      data.idUsuario = user.id;
      data.idOperador = user.id_operador;
      const result = await Pasajero.createAll(data);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo agregar los pasajeros al vuelo'));
      }
    } catch (e) {
      return next(e);
    }
  });

  return api;
};
