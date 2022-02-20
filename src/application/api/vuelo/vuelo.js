'use strict';

const debug = require('debug')('app:api:vuelo');
const guard = require('express-jwt-permissions')();
const moment = require('moment');
const { userData } = require('../../lib/auth');

module.exports = function setupAeronave (api, services) {
  const { Mopsv, Vuelo } = services;

  api.get('/sabsa/reporte/aterrizajes/:ini/:fin', guard.check(['tracking:read']), async (req, res, next) => {
    debug('Obteniendo reporte de aterrizajes desde sabsa');
    try {
      const { ini, fin } = req.params;

      if (ini > fin) {
        return res.status(412).send({ error: 'La gestión inicial tiene que ser menor a la gestión final.' });
      }

      const result = await Mopsv.sabsa.aterrizajesReporte.getAterrizajesReporte2(ini, fin);
      res.send(result);
    } catch (e) {
      if (e.message && (e.message.indexOf('getaddrinfo') !== -1 || e.message.indexOf('ECONNREFUSED') !== -1)) {
        return res.status(412).send({ warning: 'No se puede obtener el reporte de aterrizajes en estos momentos, inténtelo en más tarde.' });
      }
      return next(e);
    }
  });

  api.get('/sabsa/reporte/pasajeros/:ini/:fin', guard.check(['tracking:read']), async (req, res, next) => {
    debug('Obteniendo reporte de pasajeros desde sabsa');
    try {
      const { ini, fin } = req.params;

      if (ini > fin) {
        return res.status(412).send({ warning: 'La gestión inicial tiene que ser menor a la gestión final.' });
      }

      const result = await Mopsv.sabsa.pasajerosReporte.getPasajerosReporte2(ini, fin);
      res.send(result);
    } catch (e) {
      if (e.message && (e.message.indexOf('getaddrinfo') !== -1 || e.message.indexOf('ECONNREFUSED') !== -1)) {
        return res.status(412).send({ error: 'No se puede obtener el reporte de pasajeros en estos momentos, inténtelo en más tarde.' });
      }
      return next(e);
    }
  });

  api.get('/mopsv/oopp/reporte/token', guard.check(['tracking:read']), async (req, res, next) => {
    debug('Obteniendo token de autenticación para servicios MOPSV - OOPP');
    try {
      const token = await Mopsv.oopp.token();
      res.send(token);
    } catch (e) {
      if (e.message && (e.message.indexOf('getaddrinfo') !== -1 || e.message.indexOf('ECONNREFUSED') !== -1)) {
        return res.status();
      }
    }
  });

  api.get('/mopsv/oopp/reporte/vuelos/lista', async (req, res, next) => {
    debug('Obteniendo lista de numeros de vuelos servicios MOPSV - OOPP');
    try {
      const lista = await Mopsv.oopp.vuelo.getVuelos();
      res.send(lista);
    } catch (e) {
      if (e.message && (e.message.indexOf('getaddrinfo') !== -1 || e.message.indexOf('ECONNREFUSED') !== -1)) {
        return res.status();
      }
    }
  });

  api.get('/mopsv/oopp/reporte/vuelos/detalle/:vuelo', guard.check(['tracking:read']), async (req, res, next) => {
    debug('Obteniendo detalles de vuelo MOPSV - OOPP');
    try {
      const { vuelo } = req.params;
      const lista = await Mopsv.oopp.vuelo.getDetalleVuelo(vuelo);
      res.send(lista);
    } catch (e) {
      if (e.message && (e.message.indexOf('getaddrinfo') !== -1 || e.message.indexOf('ECONNREFUSED') !== -1)) {
        return res.status();
      }
    }
  });

  api.get('/mopsv/oopp/reporte/vuelos/coordenadas/:vuelo', guard.check(['tracking:read']), async (req, res, next) => {
    debug('Obteniendo lista de coordendas de vuelo MOPSV - OOPP');
    try {
      const { vuelo } = req.params;
      const lista = await Mopsv.oopp.vuelo.getListaCoordenadasVuelo(vuelo);
      res.send(lista);
    } catch (e) {
      if (e.message && (e.message.indexOf('getaddrinfo') !== -1 || e.message.indexOf('ECONNREFUSED') !== -1)) {
        return res.status();
      }
    }
  });

  api.get('/mopsv/oopp/reporte/vuelos/lista/tamPag/:tamPagina/numPag/:numPag/ordCampo/:ordCampo/ordAsc/:ordAsc', guard.check(['tracking:read']), async (req, res, next) => {
    debug('Obteniendo lista de numeros de vuelos servicios MOPSV - OOPP');
    try {
      const { tamPagina, numPag, ordCampo, ordAsc } = req.params;
      let ord;
      if (ordAsc === 'true' || ordAsc === '1' || ordAsc === 'True') {
        ord = true;
      } else {
        ord = false;
      }
      const lista = await Mopsv.oopp.vuelo.getListaVuelosPaginados({ tamPagina: tamPagina, numPagina: numPag, ordCampo: ordCampo, ordAsc: ord });
      res.send(lista);
    } catch (e) {
      if (e.message && (e.message.indexOf('getaddrinfo') !== -1 || e.message.indexOf('ECONNREFUSED') !== -1)) {
        return res.status();
      }
    }
  });

  api.put('/aasana/despegue/:idVuelo', guard.check(['vuelos:read']), async (req, res, next) => {
    debug('Registrar despegue de aerolínea');
    try {
      const { idVuelo } = req.params;
      let user = await userData(req, services);

      const result = await Vuelo.createOrUpdate({
        id: idVuelo,
        hora_despegue: moment().format('HH:mm:ss'),
        _user_updated: user.id,
        _updated_at: moment().format('YYYY-MM-DD')
      });

      res.send(result);
    } catch (e) {
      return next(e);
    }
  });

  api.put('/aasana/aterrizaje/:idVuelo', guard.check(['vuelos:read']), async (req, res, next) => {
    debug('Registrar despegue de aerolínea');
    try {
      const { idVuelo } = req.params;
      let user = await userData(req, services);

      const result = await Vuelo.createOrUpdate({
        id: idVuelo,
        hora_aterrizaje: moment().format('HH:mm:ss'),
        _user_updated: user.id,
        _updated_at: moment().format('YYYY-MM-DD')
      });

      res.send(result);
    } catch (e) {
      return next(e);
    }
  });

  // Servicio parar actualizar el estado del vuelo
  api.post('/ws/actualizar_estado', async (req, res, next) => {
    // TODO: revisar que no cambie a reprogramado el estado ...
    debug('Subir pasajeros a un vuelo - Servicio web');
    try {
      let user = await userData(req, services);
      let data = req.body;
      data.id_operador = user.id_operador;
      data._user_updated = user.id;
      data._updated_at = moment().format('YYYY-MM-DD');
      const result = await Vuelo.update(data, ['estado_vuelo']);
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        if (result.data.id) {
          res.send({ success: true });
        } else {
          res.send(result.data);
        }
      } else {
        return next(new Error('No se pudo actualizar el vuelo'));
      }
    } catch (e) {
      return next(e);
    }
  });

  // servicio para reprogramar vuelo
  api.post('/ws/reprogramar', async (req, res, next) => {
    debug(`Reprogramar vuelo - Servicio web`);
    let data = req.body;
    if (!data.fecha_salida ||
        !data.hora_salida ||
        !data.hora_aterrizaje ||
        !data.nro_vuelo ||
        !data.aeropuerto_salida ||
        !data.aeropuerto_llegada ||
        !data.motivo ||
        !data.descripcion) {
      return res.send({ error: 'Argumentos incompletos' });
    }

    try {
      let user = await userData(req, services);
      data.id_operador = user.id_operador;
      data._user_updated = user.id;
      data._updated_at = moment().format('YYYY-MM-DD');
    } catch (e) {
      return next(e);
    }
    // validando la formato de hora
    if (!/^([0-1]?[0-9]|2[0-3])(:[0-5][0-9])$/g.test(data.hora_salida) ||
        !/^([0-1]?[0-9]|2[0-3])(:[0-5][0-9])$/g.test(data.hora_aterrizaje)) {
      res.send({ error: 'Formato de hora inválido' });
      return next(new Error('Formato de hora inválido'));
    }
    // Aqui podria ir comprobacion de tiempo limite de reprogramacion de vuelo
    // ...
    // validando motivos para reprogramacion de vuelos
    let v = Vuelo.validarMotivosReprogramacion(data.motivo);
    if (v !== true) {
      return res.send({ error: v });
    }
    try {
      let vuelo = await Vuelo.buscar({
        fecha_salida: moment(data.fecha_salida, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        nro_vuelo: data.nro_vuelo,
        aeropuerto_llegada: data.aeropuerto_llegada,
        aeropuerto_salida: data.aeropuerto_salida,
        id_operador: data.id_operador
      }, ['hora_salida']);
      if (!vuelo || vuelo === undefined) {
        return res.send({ error: 'No se ha encontrado el vuelo' });
      }
      let result = await Vuelo.createOrUpdate({
        id: vuelo.id,
        nro_vuelo: data.nro_vuelo,
        hora_despegue: data.hora_salida,
        hora_aterrizaje: data.hora_aterrizaje,
        motivo: data.motivo,
        descripcion: data.descripcion,
        _user_updated: data._user_updated
      });
      if (!result) {
        debug(`Error al actualizar intentar reprogramar vuelo: datos entrantes: ${data}`);
      }
      // return res.send(result.data);
      return res.send({ success: true });
    } catch (e) {
      res.send({ error: e });
      return next(e);
    }
  });

  // servicio para cancelar vuelo
  api.post('/ws/cancelar', async (req, res, next) => {
    debug(`Cancelar vuelo - Servicio web`);

    let data = req.body;
    if (!data.fecha_salida ||
        !data.nro_vuelo ||
        !data.aeropuerto_salida ||
        !data.aeropuerto_llegada ||
        !data.motivo ||
        !data.descripcion) {
      return res.send({ error: 'Argumentos incompletos' });
    }
    try {
      let user = await userData(req, services);
      data.id_operador = user.id_operador;
      data._user_updated = user.id;
      data._updated_at = moment().format('YYYY-MM-DD');
    } catch (e) {
      return next(e);
    }
    let v = Vuelo.validarMotivosReprogramacion(data.motivo);
    if (v !== true) {
      return res.send({ error: v });
    }

    try {
      let vuelo = await Vuelo.buscar({
        fecha_salida: moment(data.fecha_salida, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        nro_vuelo: data.nro_vuelo,
        aeropuerto_llegada: data.aeropuerto_llegada,
        aeropuerto_salida: data.aeropuerto_salida,
        id_operador: data.id_operador
      }, ['hora_salida']);
      if (!vuelo || vuelo === undefined) {
        return res.send({ error: 'No se ha encontrado el vuelo' });
      }
      let result = await Vuelo.createOrUpdate({
        id: vuelo.id,
        nro_vuelo: data.nro_vuelo,
        motivo: data.motivo,
        estado: 'CANCELADO',
        descripcion: data.descripcion,
        _user_updated: data._user_updated
      });

      if (!result) {
        debug(`Error al actualizar intentar reprogramar vuelo: datos entrantes: ${data}`);
      }
      return res.send({ success: true });
    } catch (e) {
      return res.send({ error: e });
    }
  });

  return api;
};
