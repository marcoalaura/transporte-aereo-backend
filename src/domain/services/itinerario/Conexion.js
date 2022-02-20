'use strict';

const debug = require('debug')('app:service:conexion');

module.exports = function conexionService (repositories, res) {
  const { conexiones, itinerarios } = repositories;

  async function findAll (params = {}) {
    debug('Lista de conexiones|filtros');
    let lista;
    try {
      lista = await conexiones.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de conexiones`));
    }

    return res.success(lista);
  }

  async function findItinerariosDestino (idItinerarioA) {
    let itinerariosDestino = [];
    let lista;
    try {
      lista = await conexiones.findAll({ id_itinerario_a: idItinerarioA, order: 'id' });
      let destinos = lista.rows;
      for (let i in destinos) {
        let data = {};
        let item = await itinerarios.findById(destinos[i].id_itinerario_b);
        data.nro_vuelo = item.nro_vuelo;
        data.hora_despegue = item.hora_despegue;
        data.hora_aterrizaje = item.hora_aterrizaje;
        data.aeropuerto_salida = item['aeropuerto_salida.codigo_iata'];
        data.aeropuerto_llegada = item['aeropuerto_llegada.codigo_iata'];
        data.id_conexion = destinos[i].id;
        data.id_itinerario_a = destinos[i].id_itinerario_a;
        data.itinerarioA_id_aeropuerto_salida = destinos[i].itinerarioA_id_aeropuerto_salida;
        data.itinerarioA_id_aeropuerto_llegada = destinos[i].itinerarioA_id_aeropuerto_llegada;
        data.id_itinerario_b = destinos[i].id_itinerario_b;
        data.itinerarioB_id_aeropuerto_salida = destinos[i].itinerarioB_id_aeropuerto_salida;
        data.itinerarioB_id_aeropuerto_llegada = destinos[i].itinerarioB_id_aeropuerto_llegada;
        itinerariosDestino.push(data);
      }
    } catch (e) {
      return res.error(e);
    }

    return res.success(itinerariosDestino);
  }

  async function itinerariosPermitidos (idItinerarioA) {
    let listaConexiones;
    let itinerarioSeleccionado;
    let listaItinerarios;
    let itesPermitidos = [];
    try {
      listaConexiones = await conexiones.findAll({ id_itinerario_a: idItinerarioA, order: 'id' });
      let conexionesActuales = listaConexiones.rows;
      itinerarioSeleccionado = await itinerarios.findById(idItinerarioA);
      listaItinerarios = await itinerarios.findAll({
        id_aeropuerto_salida: itinerarioSeleccionado.id_aeropuerto_llegada,
        estado: 'APROBADO',
        order: 'nro_vuelo'
      });
      let permitidos = listaItinerarios.rows;
      for (let j in permitidos) {
        let result = conexionesActuales.find(ite => ite.id_itinerario_b === permitidos[j].id);
        let data = {};
        if (result === undefined) {
          data.id = permitidos[j].id;
          data.nro_vuelo = permitidos[j].nro_vuelo;
          data.hora_despegue = permitidos[j].hora_despegue;
          data.hora_aterrizaje = permitidos[j].hora_aterrizaje;
          data.id_aeropuerto_llegada = permitidos[j].id_aeropuerto_llegada;
          data.aeropuerto_llegada_codigo_iata = permitidos[j]['aeropuerto_llegada.codigo_iata'];
          data.aeropuerto_llegada_ciudad = permitidos[j]['aeropuerto_llegada.ciudad'];
          data.aeropuerto_llegada_pais = permitidos[j]['aeropuerto_llegada.pais'];
          itesPermitidos.push(data);
        }
      }
    } catch (e) {
      return res.error(e);
    }

    return res.success(itesPermitidos);
  }

  async function findById (id) {
    debug('Buscando itinerario por ID');

    let conexion;
    try {
      conexion = await conexiones.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!conexion) {
      return res.error(new Error(`conexion ${id} no encontrado`));
    }

    return res.success(conexion);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar conexion');

    let conexion;
    try {
      conexion = await conexiones.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!conexion) {
      return res.error(new Error(`La conexion no pudo ser creada`));
    }

    return res.success(conexion);
  }

  async function deleteItem (id) {
    debug('Eliminando conexion');

    let deleted;
    try {
      deleted = await conexiones.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la conexion`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La conexion ya fue eliminada`));
    }

    return res.success(deleted > 0);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem,
    findItinerariosDestino,
    itinerariosPermitidos
  };
};
