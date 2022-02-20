'use strict';

const debug = require('debug')('app:service:itinerario');
const moment = require('moment');
const { diff, transform } = require('../../lib/time');
const { validarCodigoIata, validarHora, createError } = require('../../lib/validate');

module.exports = function itinerarioService (repositories, res) {
  const { itinerarios, aeropuertos, aeronaves, dgacAeronaves, solicitudes, Parametro } = repositories;

  async function findAll (params = {}) {
    debug('Lista de itinerarios|filtros');

    let lista;
    try {
      lista = await itinerarios.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de itinerarios`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando itinerario por ID');

    let itinerario;
    try {
      itinerario = await itinerarios.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!itinerario) {
      return res.error(new Error(`Itinerario ${id} not found`));
    }

    return res.success(itinerario);
  }

  async function findByIdOperadorYRangoFechas (idOperador, fechaInicio, fechaFin) {
    debug(`Buscando por idOperador ${idOperador}, desde ${fechaInicio} hasta ${fechaFin}`);

    if (moment(fechaInicio).format('YYYY-MM-DD') === 'Invalid date') {
      fechaInicio = moment('1970-01-01').format('YYYY-MM-DD');
    } else {
      fechaInicio = moment(fechaInicio).format('YYYY-MM-DD');
    }
    if (moment(fechaFin).format('YYYY-MM-DD') === 'Invalid date') {
      fechaFin = moment().format('YYYY-MM-DD');
    } else {
      fechaFin = moment(fechaFin).format('YYYY-MM-DD');
    }

    const lista = await itinerarios.findByIdOperadorYRangoFechas(idOperador, fechaInicio, fechaFin);
    console.log('elementos encontrados::::', lista.length);
    let listaSolicitudes = [];
    // agrupando itinerarios por solicitudes
    for (let item of lista) {
      let i = parseInt(item['solicitud.id']);
      if (!listaSolicitudes[i]) {
        listaSolicitudes[i] = {
          id_solicitud: item['solicitud.id'],
          fecha_inicio: item['solicitud.fecha_inicio'],
          fecha_fin: item['solicitud.fecha_fin'],
          estado: item['solicitud.estado'],
          itinerarios: [
            {
              id: item.id,
              hora_despegue: item.hora_despegue,
              hora_aterrizaje: item.hora_aterrizaje,
              nro_vuelo: item.nro_vuelo,
              estado: item.estado,
              dia_1: item.dia_1,
              dia_2: item.dia_2,
              dia_3: item.dia_3,
              dia_4: item.dia_4,
              dia_5: item.dia_5,
              dia_6: item.dia_6,
              dia_7: item.dia_7,
              observacion: item.observacion,
              aeropuerto_salida_codigo_iata: item['aeropuerto_salida.codigo_iata'],
              aeropuerto_salida_codigo_icao: item['aeropuerto_salida.codigo_icao'],
              aeropuerto_llegada_codigo_iata: item['aeropuerto_llegada.codigo_iata'],
              aeropuerto_llegada_codigo_icao: item['aeropuerto_salida.codigo_icao'],
              matricula: item['aeronave.matricula']
            }
          ]
        };
      } else {
        listaSolicitudes[i].itinerarios.push({
          id: item.id,
          hora_despegue: item.hora_despegue,
          hora_aterrizaje: item.hora_aterrizaje,
          nro_vuelo: item.nro_vuelo,
          estado: item.estado,
          dia_1: item.dia_1,
          dia_2: item.dia_2,
          dia_3: item.dia_3,
          dia_4: item.dia_4,
          dia_5: item.dia_5,
          dia_6: item.dia_6,
          dia_7: item.dia_7,
          observacion: item.observacion,
          aeropuerto_salida_codigo_iata: item['aeropuerto_salida.codigo_iata'],
          aeropuerto_salida_codigo_icao: item['aeropuerto_salida.codigo_icao'],
          aeropuerto_llegada_codigo_iata: item['aeropuerto_llegada.codigo_iata'],
          aeropuerto_llegada_codigo_icao: item['aeropuerto_salida.codigo_icao'],
          matricula: item['aeronave.matricula']
        });
      }
    }
    let noNulos = listaSolicitudes.filter(function (obj) {
      return obj!=null;
    });
    return noNulos;
  }

  async function createAll (items, idUsuario) {
    debug('Creando itinerarios', items);

    let result;
    try {
      let aeropuertosBolivia = await aeropuertos.findAll({ pais: 'BOLIVIA', mapa: true });
      let rutas = [];
      for (var i = 0; i < aeropuertosBolivia.rows.length; i++) {
        rutas.push(aeropuertosBolivia.rows[i].id);
      }

      let verificarSalida = parseInt(items[0].id_aeropuerto_salida);
      let verificarLlegada = parseInt(items[0].id_aeropuerto_llegada);

      let salida = rutas.includes(verificarSalida);
      let llegada = rutas.includes(verificarLlegada);

      const idAeronaves = [];
      const idAeropuertos = [];

      // filtrando solo aeropuertos activos
      for (let i = 0; i < items.length ; i++) {
        let item = items[i];
        const activoSalida = await esAeropuertoActivo(item.id_aeropuerto_salida);
        const activoLlegada = await esAeropuertoActivo(item.id_aeropuerto_llegada);
        if (activoSalida === false || activoLlegada === false) {
          items.splice(i, 1);
        }
      }
      if (items.length === 0) {
        return res.error(new Error('Debe seleccionar aeropuertos existentes y activos'));
      }
      
      items.map(item => {
        item.dias_semana.map(dia => {
          item[`dia_${dia}`] = true;
        });
        item.tipo_vuelo = salida && llegada ? 'NACIONAL' : 'INTERNACIONAL'; // Asignamos vuelo
        item._user_created = idUsuario;
        delete item.id;
        delete item.dias_semana;
        idAeronaves.push(item.id_aeronave);
        idAeropuertos.push(item.id_aeropuerto_salida);
        idAeropuertos.push(item.id_aeropuerto_llegada);
        return item;
      });
      
      let aAeronaves = await aeronaves.findByIds({ id: idAeronaves });
      let aAeropuertos = await aeropuertos.findByIds({ id: idAeropuertos });
      await validarHorariosCreate(items, aAeropuertos, aAeronaves);

      result = await itinerarios.createAll(items);
    } catch (e) {
      return res.error(e);
    }

    if (!result) {
      return res.error(new Error(`No se pudo guardar los itinerarios`));
    }

    return res.success(result);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar itinerario');

    let itinerario;
    try {
      // si ya existe se hacen algunas comprobaciones de edición
      itinerario = await itinerarios.findById(data.id);
      if (itinerario) {
        await validarHorariosUpdate(data, itinerario);

        let solicitud = await solicitudes.findById(itinerario.solicitud_id);

        if (solicitud) {
          if (itinerario.estado === 'CREADO' && itinerario.estado !== 'OBSERVADO' && solicitud.estado !== 'CREADO') {
            data.estado = 'REPROGRAMADO';
            console.log('existe');
          }
        }
      }
    } catch (e) {
      return res.error(e);
    }

    try {
      itinerario = await itinerarios.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!itinerario) {
      return res.error(new Error(`El itinerario no pudo ser creado`));
    }

    return res.success(itinerario);
  }

  async function deleteItem (id) {
    debug('Eliminando itinerario');

    let deleted;
    try {
      deleted = await itinerarios.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la itinerario`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La itinerario ya fue eliminado`));
    }

    return res.success(deleted > 0);
  }

  async function validar (items, idOperador, idUsuario) {
    let iata = {};
    let matriculas = {};
    let errors = {};
    try {
      for (let i in items) {
        await validarMatricula(items[i], i, matriculas, errors, idOperador, idUsuario);
        validarVuelo(items[i], i, errors);
        await validarCodigoIata(items[i], i, 'ori', iata, errors, aeropuertos);
        await validarCodigoIata(items[i], i, 'des', iata, errors, aeropuertos);
        validarHora(items[i], i, 'etd', errors);
        validarHora(items[i], i, 'eta', errors, true);
        validarDias(items[i], i, errors);
        await validarAeropuertoActivos(items[i], i, errors);
        
        if (diff(items[i].etd, items[i].eta) <= 0) {
          createError(errors, i, 'etd', `La hora ETD <strong><em>${items[i].etd}</em></strong> tiene que ser menor a la hora ETA <strong><em>${items[i].eta}</em></strong>`);
        }
      }
      await validarHorariosImport(items, errors);
      if (Object.keys(errors).length) {
        return res.success({ errors });
      }
      return res.success({ iata, matriculas });
    } catch (e) {
      return res.error(e);
    }
  }

  async function validarAeropuertoActivos (item, i, errors) {
    console.log('item::::::', item, i, errors);
    const activoSalida = await esAeropuertoActivo(item.ori, 'iata');
    const activoLlegada = await esAeropuertoActivo(item.des, 'iata');
    if (activoSalida === false) {
      createError(errors, i, 'aeropuerto_salida', `El aeropueto de salida ${item.ori} está inactivo`);
    }
    if (activoLlegada === false) {
      createError(errors, i, 'aeropuerto_llegada', `El aeropueto de llegada ${item.des} está inactivo`);
    }
    console.log(`activo salida >>>>>>>>>> ${activoSalida} activoLegada >>>> ${activoLlegada}`);
  }
  
  async function validarHorariosImport (items, errors) {
    const lapso = await Parametro.getParam('LAPSO_ENTRE_DESPEGUES');

    let idAeropuertos = [];
    for (let i in items) {
      idAeropuertos.push(items[i].ori.toUpperCase().trim());
    }
    let aAeropuertos = await aeropuertos.findByIds({ codigo_iata: idAeropuertos });

    let dias = {};
    for (let k in items) {
      let item = items[k];
      let dia = item.dia.split('-');
      if (dia.length) {
        dia.map((dia) => {
          item[`dia_${dia}`] = true;
        });
      }

      item['hora_despegue'] = item.etd;
      item['hora_aterrizaje'] = item.eta;
      item['nro_vuelo'] = item.vlo;
      item['aeropuerto_salida.codigo_iata'] = item.ori;
      const aSalida = aAeropuertos.find(a => a.codigo_iata === item.ori);
      item['aeropuerto_salida.lapso_entre_despegues'] = aSalida.lapso_entre_despegues;
      item['id_aeropuerto_salida'] = item.ori;
      item['aeropuerto_llegada.codigo_iata'] = item.des;
      item['aeronave.matricula'] = item.eqv;

      if (Object.keys(dias).length > 0) {
        let e = validarAceptados(item, dias, lapso && lapso.valor ? lapso.valor : 5);
        if (e.errors && e.errors > 0) {
          createError(errors, k, 'conflictos', e.message);
        }
      }
      dias = diasPush(item, dias);
    }
  }

  async function validarHorariosUpdate (data, itinerario) {
    const lapso = await Parametro.getParam('LAPSO_ENTRE_DESPEGUES');

    let parametros = {
      id: data.id,
      id_solicitud: itinerario.id_solicitud,
      id_aeropuerto_salida: data.id_aeropuerto_salida
    };
    const aprobados = await itinerarios.findBySolicitud(parametros);

    let dias = {};
    for (let j in aprobados) {
      dias = diasPush(aprobados[j], dias);
    }

    if (Object.keys(dias).length > 0) {
      let aSalida = await aeropuertos.findById(data.id_aeropuerto_salida);
      let aLlegada = await aeropuertos.findById(data.id_aeropuerto_llegada);
      let aAeronave = await aeronaves.findById(data.id_aeronave);
      
      data['aeronave.matricula'] = aAeronave.matricula;
      data['aeropuerto_salida.codigo_iata'] = aSalida.codigo_iata;
      data['aeropuerto_salida.lapso_entre_despegues'] = aSalida.lapso_entre_despegues;
      data['aeropuerto_llegada.codigo_iata'] = aLlegada.codigo_iata;
      // console.log('-------------------------------data', data);

      let e = validarAceptados(data, dias, lapso.valor);
      if (e.errors && e.errors > 0) {
        throw new Error(`Tiene conflictos con los vuelos:<br>${e.message}.`);
      }
    }
  }

  async function validarHorariosCreate (items, aAeropuertos, aAeronaves) {
    const lapso = await Parametro.getParam('LAPSO_ENTRE_DESPEGUES');

    let errors = ``;
    let parametros = {
      id_solicitud: parseInt(items[0].id_solicitud)
    };
    const aprobados = await itinerarios.findBySolicitud(parametros);
    let dias = {};
    for (let j in aprobados) {
      dias = diasPush(aprobados[j], dias);
    }

    for (let k in items) {
      let item = items[k];
      const aSalida = aAeropuertos.find(a => a.id === parseInt(item.id_aeropuerto_salida));
      const aLlegada = aAeropuertos.find(a => a.id === parseInt(item.id_aeropuerto_llegada));
      const aeronave = aAeronaves.find(a => a.id === parseInt(item.id_aeronave));
      item['aeropuerto_salida.codigo_iata'] = aSalida.codigo_iata;
      item['aeropuerto_salida.lapso_entre_despegues'] = aSalida.lapso_entre_despegues;
      item['aeropuerto_llegada.codigo_iata'] = aLlegada.codigo_iata;
      item['aeronave.matricula'] = aeronave.matricula;
      // console.log('-------------------------------item', item);

      console.log('entrar a validar aceptados???', Object.keys(dias).length);
      if (Object.keys(dias).length > 0) {
        let e = validarAceptados(item, dias, lapso.valor);
        if (e.errors && e.errors > 0) {
          errors = `${errors}<br>${e.message}`;
        }
      }
      dias = diasPush(item, dias);
    }

    if (errors !== '') {
      throw new Error(`Tiene conflictos con los vuelos:${errors}.`);
    }
  }

  function validarAceptados (vuelo, aprobados, lapso) {
    let errors = 0;
    let message = `Vuelo en conflicto: ${vuelo['aeronave.matricula']} - ${vuelo.nro_vuelo} - ${vuelo['aeropuerto_salida.codigo_iata']} - ${vuelo['aeropuerto_llegada.codigo_iata']} - <strong>${vuelo.hora_despegue}</strong> - ${vuelo.hora_aterrizaje}`;

    for (let k = 1; k <= 7; k++) {
      if (vuelo[`dia_${k}`]) {
        if (aprobados[k]) {
          let ini = transform(vuelo.hora_despegue);
          let aprobado = aprobados[k];
          // console.log('===== ', vuelo.nro_vuelo, ' ---------------- vuelo:', k, vuelo.hora_despegue, ini, vuelo.hora_aterrizaje);

          for (let l in aprobado) {
            let row = aprobado[l];
            // verificando solo aeropuerto de salida
            if (`${row['id_aeropuerto_salida']}` === `${vuelo['id_aeropuerto_salida']}`) {
              let hi = transform(row.hora_despegue);
              const rango = parseInt(vuelo['aeropuerto_salida.lapso_entre_despegues'] || lapso);
              // console.log('=========================  horaDespegue', row.hora_despegue, (hi - rango), ini, (hi + rango));

              let a = (hi - rango) < ini;
              let b = ((hi + rango)) > ini;

              if (a && b) {
                errors++;
                message = `${message}<br> - <small>${row['aeronave.matricula']} - ${row.nro_vuelo} - ${row['aeropuerto_salida.codigo_iata']} - ${row['aeropuerto_llegada.codigo_iata']} - <strong>${row.hora_despegue}</strong> - ${row.hora_aterrizaje} - día ${k}</small>`;
              }
            }
          }
        }
      }
    }

    return {
      errors,
      message
    };
  }

  function diasPush (item, dias) {
    for (let i = 1; i <= 7; i++) {
      if (item[`dia_${i}`]) {
        if (!dias[`${i}`]) {
          dias[`${i}`] = [];
        }
        dias[`${i}`].push(item);
      }
    }
    return dias;
  }

  async function validarMatricula (data, index, matriculas, errors, idOperador, idUsuario) {
    if (data.eqv && data.eqv.length) {
      if (data.eqv.length > 20) {
        createError(errors, index, 'eqv', `Solo puede ingresar un máximo de 20 carácteres`);
      } else {
        let matricula = data.eqv.toUpperCase().trim();
        if (matriculas[matricula] === undefined) {
          let item = await aeronaves.findByMatricula(matricula);
          if (item) { // Comprobando que exista la matrícula en la tabla ite_aeronaves
            if (item.id_operador !== idOperador) {
              createError(errors, index, 'evq', `La aeronave <strong><em>${data.eqv}</em></strong> no corresponde a su operador aéreo`);
            } else if (item.estado === 'INACTIVO' || item.estado === 'MANTENIMIENTO') {
              createError(errors, index, 'evq', `La aeronave <strong><em>${data.eqv}</em></strong> se encuentra ${item.estado === 'INACTIVO' ? '' : 'en'} <strong><em>${item.estado}</em></strong> para realizar vuelos`);
            } else {
              matriculas[matricula] = item.id;
            }
          } else {
            item = await dgacAeronaves.findByMatricula(matricula);
            if (item) { // Comprobando que exista la matrícula en la tabla dgacAeronaves
              item = {
                matricula: item.nroMatricula || '',
                serie: item.nroSerie || '',
                marca: item.marca || '',
                modelo: item.modelo,
                // fecha_inscripcion: transformDate(item.fechaInscripcion),
                fecha_inscripcion: moment(item.fechaInscripcion, 'DD/MM/YYYY'),
                propietario: item.propietario || '',
                observaciones: item.observaciones,
                ciudad: item.ciudad,
                modelo_generico: item.modeloGenerico,
                estado_dgac: item.estado,
                // fecha_actualizacion: item.fechaActualizacion ? new Date(item.fechaActualizacion) : null,
                fecha_actualizacion: item.fechaActualizacion ? moment(item.fechaActualizacion, 'YYYY-MM-DD') : null,
                _user_created: idUsuario,
                id_operador: idOperador
              };
              debug('Solicitud - agregando nueva aeronave al sistema', item);
              // Si existe se agrega la matrícula a las aeronaves del sistema
              let aeronave = await aeronaves.createOrUpdate(item);
              if (aeronave && aeronave.id) {
                matriculas[matricula] = aeronave.id;
              } else {
                createError(errors, index, 'evq', `La aeronave <strong><em>${data.eqv}</em></strong> no pudo ser creada`);
              }
            } else {
              createError(errors, index, 'evq', `No existe la matrícula <strong><em>${data.eqv}</em></strong> o su aeronave no se encuentra registrada en la DGAC.`);
            }
          }
        }
      }
    } else {
      createError(errors, index, 'eqv', `Dato obligatorio`);
    }
  }

  function validarVuelo (item, index, errors) {
    if (item.vlo && item.vlo.length) {
      if (item.vlo.length > 20) {
        createError(errors, index, 'vlo', `Solo puede ingresar un máximo de 20 carácteres`);
      }
    } else {
      createError(errors, index, 'vlo', `Dato obligatorio`);
    }
  }

  async function esAeropuertoActivo (valor, campo = 'id') {
    let aeropuerto;
    if (campo === 'id') {
      aeropuerto = await aeropuertos.findById(valor);
    } else if (campo === 'iata'){
      aeropuerto = await aeropuertos.findByIata(valor);
    } else if (campo === 'icao') {
      aeropuerto = await aeropuertos.findByIcao(valor);
    }
    return aeropuerto.estado === 'ACTIVO';
  }
  
  function validarDias (item, index, errors) {
    if (item.dia && item.dia.length) {
      if (item.dia.length > 13) {
        createError(errors, index, 'dia', `Solo puede ingresar un máximo de 13 carácteres`);
      } else {
        if (!/^[1-7]{1}([-][1-7]{1})?([-][1-7]{1})?([-][1-7]{1})?([-][1-7]{1})?([-][1-7]{1})?([-][1-7]{1})?$/g.test(item.dia)) {
          createError(errors, index, 'dia', `Día(s) incorrecto(s) <strong><em>${item.dia}</em></strong> el formato de días es d o d-d-d donde d=día del 1 al 7 sin guiones al principio o al final`);
        }
      }
    } else {
      createError(errors, index, 'dia', `Dato obligatorio`);
    }
  }

  return {
    findAll,
    findById,
    findByIdOperadorYRangoFechas,
    esAeropuertoActivo,
    createOrUpdate,
    deleteItem,
    validar,
    createAll
  };
};
