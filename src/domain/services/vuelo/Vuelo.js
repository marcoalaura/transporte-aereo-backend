'use strict';

const debug = require('debug')('app:service:vuelo');
const { config } = require('../../../common');
const moment = require('moment');
const Mopsv = require('app-mopsv');

const { validarFecha, validarCodigoIata, validarHora, requiredFields, required, createError } = require('../../lib/validate');

module.exports = function vueloService (repositories, res) {
  const { vuelos, logVuelos, operadores, pasajeros, aeropuertos, transaction, conexiones } = repositories;

  async function findAll (params = {}, rol, idAeropuerto, idOperador) {
    let lista;
    try {
      switch (rol) {
        case 'AASANA_TORRE_CONTROL':
          params.id_aeropuerto = idAeropuerto;
          break;
        case 'OPERADOR_AVION_ADMIN': case 'OPERADOR_AVION':
          params.id_operador = idOperador;
          break;
      }
      lista = await vuelos.findAll(params);
    } catch (e) {
      return res.error(e);
    }
    if (!lista) {
      return res.error(new Error('Error al obtener la lista de vuelos'));
    }
    // await sincronizarVuelosConAASANA(params.id_operador);
    return res.success(lista);
  }

  async function sincronizarVuelosConAASANA () {
    const mopsv = await Mopsv(config.db);
    debug('Lista de vuelos|filtros');

    let fechaActual = moment().format('YYYY-MM-DD');
    let vuelosAASANA = await mopsv.aasana.planesNoRegulares.getDespeguesAterrizajes({
      decFiltro: 1,
      strDato1: 'movfic',
      strDato2: '',
      strDato3: fechaActual,
      strDato4: ''
    });
    vuelosAASANA = JSON.parse(vuelosAASANA.oResultado);
    let vuelosBD = await vuelos.findAll();
    let ops = await operadores.findAll();
    for (var k = 0; k < ops.rows.length; k++) {
      try {
        let operadorICAO = ops.rows[k].codigo_icao;
        let reICAO = '^(' + operadorICAO + ')';
        const regex = new RegExp(reICAO);

        let filtrados = vuelosAASANA.filter(function (vuelosAASANA) {
          if (regex.test(vuelosAASANA.nrovuelo)) {
            return vuelosAASANA.nrovuelo;
          }
        });
        let vuelosActualizados = [];
        for (var i = 0; i < vuelosBD.rows.length; i++) {
          for (var j = 0; j < filtrados.length; j++) {
            let vueloNro = operadorICAO + vuelosBD.rows[i]['itinerario.nro_vuelo'];
            if (vueloNro === filtrados[j].nrovuelo && vuelosBD.rows[i].fecha_despegue === moment(filtrados[j].fecha_origen, 'DD/MM/YYYY').format('YYYY-MM-DD') && vuelosBD.rows[i]['itinerario.aeropuerto_salida.codigo_icao'] === filtrados[j].procedencia) {
              vuelosActualizados.push(
                {
                  id: vuelosBD.rows[i].id,
                  nro_vuelo: filtrados[j].nrovuelo,
                  procedencia: filtrados[j].procedencia,
                  destino: filtrados[j].destino,
                  fecha_despegue: vuelosBD.rows[i].fecha_despegue,
                  hora_despegue: moment(filtrados[j].horadespegue, 'hh:mm:ss').format('hh:mm'),
                  fecha_aterrizaje: vuelosBD.rows[i].fecha_aterrizaje,
                  hora_arribo: moment(filtrados[j].horarribo, 'hh:mm:ss').format('hh:mm'),
                  matricula: filtrados[j].matriculadgac
                }
              );
              await vuelos.createOrUpdate({ id: vuelosBD.rows[i].id, hora_despegue: moment(filtrados[j].horadespegue, 'hh:mm:ss').format('hh:mm'), hora_aterrizaje: moment(filtrados[j].horarribo, 'hh:mm:ss').format('hh:mm') });
              filtrados.splice(j, 1);
              break;
            }
          }
        }
        console.log(`${ops.rows[k].sigla} - VUELOS ACTUALIZADOS: ${JSON.stringify(vuelosActualizados, null, 2)}`);
      } catch (e) {
        return res.error(e);
      }
    }
    if (!vuelosBD) {
      return res.error(new Error('Error al obtener la lista de vuelos'));
    }
    return res.success(vuelosBD);
  }

  async function findAllVuelosConexiones (params = {}, rol, idAeropuerto) {
    debug('Lista de vuelos filtros conexiones');
    let lista;
    try {
      if (rol === 'AASANA_TORRE_CONTROL') {
        params.id_aeropuerto = idAeropuerto;
      }
      lista = await vuelos.findAllVuelosConexiones(params);
      for (let i = 0; i < lista.rows.length; i++) {
        let array = [];
        let result = await conexiones.findAll({id_itinerario_a: lista.rows[i]['id_itinerario']});
        if (result.count > 0) {
          result.rows.forEach(item => {
            array.push(item['itinerarioB.aeropuerto_llegada.ciudad']);
          });
        }
        lista.rows[i]['conexiones'] = JSON.stringify(array);
        console.log('var: ', lista.rows[i]['conexiones']);
      }
    } catch (e) {
      return res.error(e);
    }
    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de vuelos`));
    }
    return res.success(lista);
  }

  async function findById (id, rol, idAeropuerto, idOperador) {
    debug('Buscando vuelo por ID');
    let vuelo;
    try {
      let params = {
        id
      };
      switch (rol) {
        case 'OPERADOR_AVION_ADMIN': case 'OPERADOR_AVION':
          params.id_operador = idOperador;
          break;
      }
      vuelo = await vuelos.findOne(params);
    } catch (e) {
      return res.error(e);
    }

    if (!vuelo) {
      return res.error(new Error(`vuelo ${id} not found`));
    }
    return res.success(vuelo);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar vuelo');

    let vuelo;
    let estadoPeticion = data.estado;
    let t = await transaction.create();
    try {
      /*
      if (data.fecha_despegue) {
        data.fecha_despegue = moment(data.fecha_despegue).format('YYYY-MM-DD');
      }
      if (data.fecha_aterrizaje) {
        data.fecha_aterrizaje = moment(data.fecha_aterrizaje).format('YYYY-MM-DD');
      }
       */
      if (data.id) {
        vuelo = await vuelos.findById(data.id);
        if (estadoPeticion) {
          if (estadoPeticion !== vuelo.estado) {
            await logVuelos.createOrUpdate({
              id_vuelo: data.id,
              campo: 'estado',
              nuevo_valor: estadoPeticion,
              antiguo_valor: data.estado,
              _user_created: data._user_updated
            }, t);
          }
        }
        if (data.hora_despegue) {
          if (data.hora_despegue !== vuelo.hora_despegue) {
            await logVuelos.createOrUpdate({
              id_vuelo: data.id,
              campo: 'hora_despegue',
              nuevo_valor: data.hora_despegue,
              antiguo_valor: vuelo.hora_despegue,
              _user_created: data._user_updated
            }, t);
          }
        }
        if (data.hora_aterrizaje) {
          if (data.hora_aterrizaje !== vuelo.hora_aterrizaje) {
            await logVuelos.createOrUpdate({
              id_vuelo: data.id,
              campo: 'hora_aterrizaje',
              nuevo_valor: data.hora_aterrizaje,
              antiguo_valor: vuelo.hora_aterrizaje,
              _user_created: data._user_updated
            }, t);
          }
        }
        if (data.hora_etd) {
          if (data.hora_etd !== vuelo['itinerario.hora_despegue']) {
            await logVuelos.createOrUpdate({
              id_vuelo: data.id,
              campo: 'hora_despegue',
              nuevo_valor: data.hora_etd,
              antiguo_valor: vuelo.hora_etd,
              _user_created: data._user_updated
            }, t);
            data.estado = 'REPROGRAMADO';
          }
        }
        if (data.hora_eta) {
          if (data.hora_eta !== vuelo['itinerario.hora_aterrizaje']) {
            await logVuelos.createOrUpdate({
              id_vuelo: data.id,
              campo: 'hora_aterrizaje',
              nuevo_valor: data.hora_eta,
              antiguo_valor: vuelo.hora_eta + '',
              _user_created: data._user_updated
            }, t);
            data.estado = 'REPROGRAMADO';
          }
        }
        if (data.fecha_despegue) {
          if (data.fecha_despegue !== vuelo.fecha_despegue) {
            await logVuelos.createOrUpdate({
              id_vuelo: data.id,
              campo: 'fecha_despegue',
              nuevo_valor: data.fecha_despegue,
              antiguo_valor: vuelo.fecha_despegue,
              _user_created: data._user_updated
            }, t);
            data.estado = 'REPROGRAMADO';
          }
        }
        if (data.fecha_aterrizaje) {
          if (data.fecha_aterrizaje !== vuelo.fecha_aterrizaje) {
            await logVuelos.createOrUpdate({
              id_vuelo: data.id,
              campo: 'fecha_aterrizaje',
              nuevo_valor: data.fecha_aterrizaje,
              antiguo_valor: vuelo.fecha_aterrizaje,
              _user_created: data._user_updated
            }, t);
            data.estado = 'REPROGRAMADO';
          }
        }
        if (data.motivo) {
          if (data.motivo !== vuelo.motivo) {
            await logVuelos.createOrUpdate({
              id_vuelo: data.id,
              campo: 'motivo',
              nuevo_valor: data.motivo,
              antiguo_valor: vuelo.motivo,
              _user_created: data._user_updated
            }, t);
            data.estado = 'REPROGRAMADO';
          }
        }
        if (data.descripcion) {
          if (data.descripcion !== vuelo.descripcion) {
            await logVuelos.createOrUpdate({
              id_vuelo: data.id,
              campo: 'descripcion',
              nuevo_valor: data.descripcion,
              antiguo_valor: vuelo.descripcion,
              _user_created: data._user_updated
            }, t);
            data.estado = 'REPROGRAMADO';
          }
        }
        if (data.nro_pasajeros) {
          if (data.nro_pasajeros !== vuelo.nro_pasajeros) {
            await logVuelos.createOrUpdate({
              id_vuelo: data.id,
              campo: 'nro_pasajeros',
              nuevo_valor: data.nro_pasajeros.toString(),
              antiguo_valor: vuelo.nro_pasajeros.toString(),
              _user_created: data._user_updated
            }, t);
          }
        }
      }

      /* Regla:
       - No se permite cancelar vuelos con al menos un pasajero registrado
       */
      let dataQueryPasajeros = { id_vuelo: data.id };
      let arrayPasajeros = await pasajeros.findAll(dataQueryPasajeros);
      if (arrayPasajeros.count > 0) {
        if (estadoPeticion === 'CANCELADO') {
          return res.error(new Error('No se permite cancelar vuelos con al menos un pasajero'));
        }
        // tal vez agregar otra regla para reprogramar vuelos
      }
      if (estadoPeticion === 'CANCELADO') {
        data.estado = estadoPeticion;
      }
      vuelo = await vuelos.createOrUpdate(data, t);
    } catch (e) {
      debug(`Error al modificar vuelo: ${e}`);
      transaction.rollback(t);
      return res.error(new Error(`Error al modificar el vuelo`));
    }

    if (!vuelo) {
      return res.error(new Error(`El vuelo no pudo ser creado`));
    }

    // escribiendo cambios
    transaction.commit(t);
    return res.success(vuelo);
  }

  async function generar (solicitud, itinerarios, idUsuario, t) {
    debug('Generando vuelos a partir del itinerario aprobado', solicitud);
    let items = [];
    try {
      // let fechaInicio = new Date(solicitud.fecha_inicio).getTime();
      // let fechaFin = solicitud.fecha_fin ? new Date(solicitud.fecha_fin).getTime() : addDays(fechaInicio, 30);
      let fechaInicio = moment(solicitud.fecha_inicio);
      let fechaFin = solicitud.fecha_fin ? moment(solicitud.fecha_fin) : fechaInicio.add(30, 'days');

      // const dias = moment(fechaFin).diff(moment(fechaInicio), 'days') + 1; // Obteniendo diferencias de días
      const dias = fechaFin.diff(fechaInicio, 'days') + 1; // Obteniendo diferencias de días
      console.log('NRO. DIAS', dias);
      console.log('ITINERARIOS', itinerarios);

      for (let k = 0; k < dias; k++) {
        for (let i in itinerarios) {
          // let dia = new Date(fechaInicio).getDay() + 1;
          let dia = fechaInicio.isoWeekday();// 1:lunes ... 7:domingo
          for (let j = 1; j <= 7; j++) {
            if (itinerarios[i][`dia_${j}`] && dia === j) {
              let vuelo = {
                id_itinerario: itinerarios[i].id,
                // fecha_despegue: new Date(fechaInicio),
                fecha_despegue: fechaInicio.format('YYYY-MM-DD'),
                // fecha_aterrizaje: itinerarios[i].hora_aterrizaje.indexOf('+') !== -1 ? new Date(addDays(fechaInicio, 1)) : new Date(fechaInicio),
                fecha_aterrizaje: itinerarios[i].hora_aterrizaje.indexOf('+') !== -1 ? fechaInicio.add(1, 'days').format('YYYY-MM-DD') : fechaInicio.format('YYYY-MM-DD'),
                hora_etd: itinerarios[i].hora_despegue,
                hora_eta: itinerarios[i].hora_aterrizaje,
                id_operador: itinerarios[i]['aeronave.id_operador'],
                _user_created: idUsuario
              };
              items.push(vuelo);
            }
          }
        }

        // fechaInicio = addDays(fechaInicio, 1);
        fechaInicio = fechaInicio.add(1, 'days');
      }
      let result = await vuelos.createAll(items, t);
      if (result) {
        return res.success(true);
      } else {
        return res.error(new Error('No se pudo crear los vuelos de la solicitud'));
      }
    } catch (e) {
      return res.error(e);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando vuelo');

    let deleted;
    try {
      deleted = await vuelos.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la vuelo`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La vuelo ya fue eliminado`));
    }

    return res.success(deleted > 0);
  }

  async function buscar (data, ignorar = []) {
    debug('Buscando vuelo');
    let requeridos = ['fecha_salida', 'hora_salida', 'nro_vuelo', 'aeropuerto_salida', 'aeropuerto_llegada'];
    for (let campo of ignorar) {
      let index = requeridos.indexOf(campo);
      if (index !== -1) {
        requeridos.splice(index, 1); // quitando el campo a ignorar
      }
    }
    let valid = requiredFields(data, requeridos);
    if (valid === true) {
      let errors = {};
      let iata = {};
      validarFecha(data, errors, 0, 'fecha_salida');
      await validarCodigoIata(data, 0, 'aeropuerto_salida', iata, errors, aeropuertos);
      await validarCodigoIata(data, 0, 'aeropuerto_llegada', iata, errors, aeropuertos);
      if (data.hora_salida) {
        validarHora(data, 0, 'hora_salida', errors);
      }
      console.log('errors:', errors);
      if (Object.keys(errors).length) {
        return res.success(errors[1]);
      }

      let vuelo;
      if (!data.hora_salida) {
        vuelo = await vuelos.find({
          fecha_salida: moment(data.fecha_salida, 'DD/MM/YYYY'),
          nro_vuelo: data.nro_vuelo,
          aeropuerto_salida: data.aeropuerto_salida,
          aeropuerto_llegada: data.aeropuerto_llegada
        });
        return vuelo;
      } else {
        vuelo = await vuelos.find({
          // fecha_salida: transformDate(data.fecha_salida),
          fecha_salida: moment(data.fecha_salida, 'DD/MM/YYYY'),
          hora_salida: data.hora_salida,
          // hora_llegada: data.hora_llegada,
          nro_vuelo: data.nro_vuelo,
          aeropuerto_salida: data.aeropuerto_salida,
          aeropuerto_llegada: data.aeropuerto_llegada
        });
      }

      if (vuelo && vuelo.id) {
        if (vuelo.id_operador !== data.id_operador) {
          return res.error(new Error('El vuelo no corresponde a su operador aéreo'));
        } else {
          return res.success({ id_vuelo: vuelo.id });
        }
      } else {
        console.log('VUELO NO ENCONTRADO', vuelo);
        return res.error(new Error('No existe el vuelo solicitado'));
      }
    }
  }

  function validarEstadoVuelo (data, errors, index) {
    if (required(data, errors, index, 'estado_vuelo')) {
      const estados = [
        'CONFIRMADO',
        'EN_HORARIO',
        'NUEVA_HORA',
        'PRE_EMBARQUE',
        'PREEMBARCANDO',
        'ABORDANDO',
        'CERRADO',
        'EN_TIERRA',
        'INFORMES',
        'DEMORADO',
        'ARRIBO',
        'CANCELADO',
        'RODAJE',
        'DESPEGUE',
        'ASCENSO',
        'CRUCERO',
        'DESCENSO',
        'APROXIMACION',
        'ATERRIZAJE'
      ];
      if (estados.indexOf(data.estado_vuelo) === -1) {
        createError(errors, index, 'estado', `El estado: <strong><em>${data.estado_vuelo}</em></strong> no es válido, solo se aceptan los valores ${estados.join(', ')}.`);
      }
    }
  }

  function validarMotivosReprogramacion (motivo) {
    const motivos = [
      'Problemas meteorológicos',
      'Conmociones sociales',
      'Actos de terrorismo o sabotaje',
      'Accidentes en infraestructuras que interfieran las operaciones',
      'Restricciones',
      'Contingencias técnicas',
      'Otros'
    ];
    if (motivos.indexOf(motivo) === -1) {
      return `El motivo: <srong><em>${motivo}</em></strong> no es válido, solo se aceptan los valores ${motivos.join(', ')}.`;
    }
    return true;
  }

  async function update (data, validate = [], ignore = []) {
    let errors = {};
    for (let i in validate) {
      if (validate[i] === 'estado_vuelo') {
        validarEstadoVuelo(data, errors, 0);
      }
    }
    let keys = Object.keys(errors);
    if (keys.length) {
      if (keys.length === 1) {
        errors = errors[keys[0]];
      }
      return res.success({ errors });
    }
    let vuelo;
    try {
      console.log(' \n\n data intentando buscar:', data);
      let result = await buscar(data);
      console.log('result buscar data', result);
      if (result.code === -1) {
        return res.error(new Error(result.message));
      } else {
        if (result.data && result.data.id_vuelo) {
          data.id = result.data.id_vuelo;
        } else {
          return res.success(result.data);
        }
      }
      console.log(' \n\n data intentando modificar:', data);
      vuelo = await createOrUpdate(data);
    } catch (e) {
      console.log('Error llamando createOrUpdate desde Update: ', e);
      return res.error(e);
    }
    return res.success(vuelo.data);
  }

  return {
    findAll,
    findAllVuelosConexiones,
    findById,
    createOrUpdate,
    deleteItem,
    generar,
    buscar,
    update,
    validarMotivosReprogramacion,
    sincronizarVuelosConAASANA
  };
};
