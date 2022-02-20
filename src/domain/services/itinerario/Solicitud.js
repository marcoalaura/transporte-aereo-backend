'use strict';

const debug = require('debug')('app:service:solicitud');
const moment = require('moment');
const { transform } = require('../../lib/time');
const ClienteNotificaciones = require('app-notificaciones');

module.exports = function solicitudService (repositories, res) {
  const { solicitudes, itinerarios, itinerarioHistorial, usuarios, planSolicitudes, Parametro, transaction, entidades, operadores, Iop, notificaciones } = repositories;
  const Itinerario = require('./Itinerario')(repositories, res);
  const Vuelo = require('../vuelo/Vuelo')(repositories, res);

  async function findAll (params = {}, rol, idOperador) {
    debug('Lista de solicitudes|filtros');

    let lista;
    try {
      switch (rol) {
        case 'OPERADOR_AVION_ADMIN': case 'OPERADOR_AVION':
          params.id_operador = idOperador;
          if (params.plan) {
            params.estados = ['APROBADO', 'PLAN_VUELO_CREADO', 'PLAN_VUELO_APROBADO'];
          } else {
            params.estados = ['CREADO', 'SOLICITADO', 'APROBADO', 'PLAN_VUELO_CREADO', 'PLAN_VUELO_APROBADO', 'RECHAZADO', 'OBSERVADO'];
          }
          break;
        case 'DGAC_ADMIN': case 'DGAC': case 'SABSA_ADMIN': case 'SABSA': case 'AASANA_ADMIN': case 'AASANA':
          params.estados = ['SOLICITADO', 'APROBADO', 'OBSERVADO', 'PLAN_VUELO_CREADO', 'PLAN_VUELO_APROBADO', 'RECHAZADO'];
          break;
      }
      lista = await solicitudes.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de solicitudes`));
    }

    return res.success(lista);
  }

  async function findById (id, rol, idOperador) {
    debug('Buscando solicitud por ID');

    let solicitud;
    try {
      let params = {
        id
      };
      switch (rol) {
        case 'OPERADOR_AVION_ADMIN': case 'OPERADOR_AVION':
          params.id_operador = idOperador;
          break;
      }
      solicitud = await solicitudes.findOne(params);
    } catch (e) {
      return res.error(e);
    }

    if (!solicitud) {
      return res.error(new Error(`No existe la solicitud ${id}`));
    }

    return res.success(solicitud);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar solicitud de itinerarios');
    const dat = Object.assign({}, data);
    console.log('\n\nORIGINAL', dat);

    let usuario;
    try {
      usuario = await usuarios.findById(data._user_updated);
    } catch (e) {
      debug(`No se ha podido encontrar el usuario con id ${data._user_updated}: ${e}`);
    }

    let solicitud;
    try {
      solicitud = await solicitudes.findById(data.id);
    } catch (e) {
      debug(`No se ha podido encontrar la solicitud con id ${data.id}: ${e}`);
    }

    // creando registro en tabla ite_historial solo si se cambia de estado a la solicitud
    if (data.id && data.estado !== solicitud.estado) {
      await llenarHistorial(data, usuario);
    }
    try {
      if (data.fecha_fin) {
        console.log('--------------', moment(data.fecha_fin).format('YYYY-MM-DD'));
        // data.fecha_fin = moment(data.fecha_fin).utcOffset(0).format('YYYY-MM-DD');
        data.fecha_fin = moment(data.fecha_fin).format('YYYY-MM-DD');
      }
      if (data.fecha_inicio) {
        console.log('-------------', moment(data.fecha_inicio).format('YYYY-MM-DD'));
        // data.fecha_inicio = moment(data.fecha_inicio).utcOffset(0).format('YYYY-MM-DD');
        data.fecha_inicio = moment(data.fecha_inicio).format('YYYY-MM-DD');
      }
      solicitud = await solicitudes.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!solicitud) {
      return res.error(new Error(`La solicitud no pudo ser creado`));
    }

    // preparando para notificar electronicamente
    if (data.estado === 'SOLICITADO' || data.estado === 'OBSERVADO') {
      let op = await operadores.findById(solicitud.id_operador);
      let usuarioOperador = await usuarios.findById(op.id_usuario);
      
      let destinatarios = [];
      let asunto = 'Plataforma de transporte aéreo (test): ';
      let mensaje = '';
      let idRemitente; // fuente de la notificacion
      
      if (data.estado === 'SOLICITADO') {
        let siglasEntidades = await entidadesQueApruebanSolicitudItinerarios(solicitud);
        for (let i = 0; i < siglasEntidades.length; i++) {
          let entidad = await entidades.findBySigla(siglasEntidades[i]);
          console.log('sigla (entidad encontrada):::', siglasEntidades[i]);
          console.log('   email:', entidad.email);
          // para destinatarios de notificaciones
          let userItem;
          try {
            if (entidad.sigla === 'DGAC') {
              userItem = await usuarios.findByUsername('dgac');
            } else if (entidad.sigla === 'AASANA') {
              userItem = await usuarios.findByUsername('aasana');
            } else if (entidad.sigla === 'SABSA') {
              userItem = await usuarios.findByUsername('sabsa');
            } else if (entidad.sigla === 'ATT') {
              userItem = await usuarios.findByUsername('sabsa');
            }
            destinatarios.push({
              email: entidad.email ? entidad.email : '',
              idUsuario: userItem.id
            });
          } catch (e) {
            // .. excepcion
          }
        }
        if (usuarioOperador) {
          destinatarios.push({ email: usuarioOperador.email, idUsuario: usuarioOperador.id });
        }
        asunto += `Nueva solicitud de itinerario de '${op.razon_social}' (${op.sigla})`;
        mensaje = `<p>El operador aéreo <strong>${op.razon_social}</strong> ha enviado una nueva solicitud de itinerario. (identificador de solicitud <strong>${solicitud.id}</strong>)</p><p>La solicitud se ha enviado en fecha: ${solicitud._updated_at}, ingrese a la plataforma para comprobar la solicitud de itinerarios.</p>`;

        idRemitente = usuarioOperador.id;
      } else if (data.estado === 'OBSERVADO') {
        if (usuarioOperador) {
          destinatarios.push({ email: usuarioOperador.email, idUsuario: usuarioOperador.id });
        }
        asunto += `Observación a solicitud de itinerario de '${op.razon_social}' (${op.sigla})`;
        mensaje = `<p>La solicitud de itinerario <strong>${solicitud.id}</strong> ha sido observada.</p><p>La observación se ha hecho en fecha ${solicitud._updated_at}, ingrese a la plataforma para comprobar la observación.</p>`;
        
        idRemitente = data._user_updated;
      }
      // temporal
      console.log('destinatarios::-::-::-::-::\n', destinatarios, '\n');
      // destinatarios = [];
      destinatarios.push({ email: 'rgarcia@agetic.gob.bo', idUsuario: 1 });
      
      // enviando las notificaciones electronicas
      for (let i = 0; i < destinatarios.length; i++) {
        let result = await notificaciones.crearNotificacion(true,
                                                            idRemitente,
                                                            destinatarios[i].idUsuario, // usuario receptor
                                                            'CORREO', // tipo notificacion
                                                            asunto,
                                                            mensaje,
                                                            destinatarios[i].email);
        console.log('Resultado del correo enviado:::::', result);
      }
    }
    return res.success(solicitud);
  }

  async function comprobarIntentoAprobacion (solicitud, usuarioQueAprueba) {
    /* dada la solicitud y el usuario que  *intenta* aprobarla retorna [] cuando la aprueben
     todas las instancias involucradas

     En caso de que no se cumpla el flujo requerido retorna una lista con las aprobaciones requeridas
     por ej:
     ['SABSA', 'DGAC']
     ['AASANA', 'DGAC']
     ['DGAC']
     */
    let compruebaSabsa = false;
    let compruebaAasana = false;

    let items;
    try {
      items = await itinerarios.findAll({ id_solicitud: solicitud.id });
    } catch (e) {
      debug(`No se pudo encontrar los itinerarios para solicitud ${solicitud.id}: ${e}`);
    }
    let pendientes = {'DGAC': true};
    for (let i = 0; i < items.rows.length; i++) {
      let aeropuertoSalida = items.rows[i]['aeropuerto_salida.codigo_iata'];
      if (aeropuertoSalida === 'LPB' || aeropuertoSalida === 'VVI' || aeropuertoSalida === 'CBB') {
        compruebaSabsa = true;
        pendientes['SABSA'] = true;
      } else {
        compruebaAasana = true;
        pendientes['AASANA'] = true;
      }
    }

    let historialItems;
    let intentaDGAC = false;
    try {
      historialItems = await itinerarioHistorial.findAll({
        id_solicitud: solicitud.id,
        order: '-fecha',
        limit: 3
      });
      historialItems.rows.forEach(item => {
        if (item.accion === 'APROBADO' || item.accion.indexOf('VISTO_BUENO') !== -1) {
          if (item['entidad.sigla'] === 'AASANA' && compruebaAasana) {
            delete pendientes['AASANA'];
          }
          if (item['entidad.sigla'] === 'SABSA' && compruebaSabsa) {
            delete pendientes['SABSA'];
          }
          // se supone que DGAC es la ultim entidad en aprobar
          if (item['entidad.sigla'] === 'DGAC') {
            intentaDGAC = true;
            // delete pendientes['DGAC'];
          }
        }
      });
      // DGAC deberia ser el ultimo en aprobar (tarea#117)
      if (intentaDGAC && Object.keys(pendientes).length === 1) {
        delete pendientes['DGAC'];
      }
      // se comprueban todas las instancias de aprobacion
      if (Object.keys(pendientes).length === 0) {
        return [];
      }
      return Object.keys(pendientes);
    } catch (e) {
      debug(`No se pudo encontrar historial para solicitud ${solicitud.id}: ${e}`);
    }
    return Object.keys(pendientes);
  }

  async function aprobar (idSolicitud, idUsuario) {
    debug('Aprobar solicitud entera');

    let usuario;
    let vuelos;
    try {
      usuario = await usuarios.findById(parseInt(idUsuario));
    } catch (e) {
      debug(`No se ha podido encontrar el usuario con id ${idUsuario}: ${e}`);
    }
    let solicitud;
    try {
      solicitud = await solicitudes.findById(parseInt(idSolicitud));
    } catch (e) {
      debug(`No se ha encontrado la solicitud ${idSolicitud}: ${e}`);
      return res.error(e);
    }

    let accionEstado;
    if (usuario['rol.nombre'] === 'AASANA' || usuario['rol.nombre'] === 'AASANA_ADMIN') {
      accionEstado = 'VISTO_BUENO_AASANA';
    } else if (usuario['rol.nombre'] === 'SABSA' || usuario['rol.nombre'] === 'SABSA_ADMIN') {
      accionEstado = 'VISTO_BUENO_SABSA';
    } else if (usuario['rol.nombre'] === 'DGAC' || usuario['rol.nombre'] === 'DGAC_ADMIN') {
      accionEstado = 'VISTO_BUENO_DGAC';
    }

    try {
      await llenarHistorial({ id: parseInt(idSolicitud), estado: accionEstado }, usuario);
    } catch (e) {
      debug(`Error registrando la accion en el historial ${idSolicitud}: ${e}`);
      return res.error(e);
    }

    let flujoAprobacion = await comprobarIntentoAprobacion(solicitud, usuario);
    console.log('flujo de aprobacion:', flujoAprobacion);
    if (flujoAprobacion.length > 0) {
      return res.success(JSON.stringify({ pendientes: flujoAprobacion }));
    }

    const t = await transaction.create();
    try {
      let codigoAprobacion = await obtenerCodigoAprobacionItinerario();
      solicitud.estado = 'APROBADO';
      solicitud._user_updated = idUsuario;
      solicitud._updated_at = new Date();
      solicitud.codigo = codigoAprobacion;
      let result;
      try {
        result = await solicitudes.createOrUpdate(solicitud, t);
      } catch (e) {
        console.log(`No se ha podido modificar la solicitud de itinerario: ${e}`);
      }
      console.log('\n\nsolicitud resultante', result);
      if (!result) {
        // transaction.rollback(t);
        console.log('No se ha podido modificar la solicitud');
        return res.error(new Error(`La solicitud no pudo ser aprobada`));
      }
      // registra aprobacion TOTAL
      await llenarHistorial({
        id: result.id,
        estado: 'APROBADO',
        detalle: `Flujo de aprobación completado`
      }, usuario, t);
      // cambiando estado de los itinerarios a aprobados
      let items = await itinerarios.findAll({ id_solicitud: result.id });
      for (let i = 0; i < items.rows.length; i++) {
        await itinerarios.createOrUpdate({
          id: items.rows[i].id,
          estado: 'APROBADO',
          _user_updated: idUsuario,
          _updated_at: new Date()
        }, t);
      }
      let paraAprobar = items.rows;
      console.log('\n\nPara aprobar', paraAprobar);
      vuelos = await Vuelo.generar(result, paraAprobar, idUsuario, t);
      console.log('\n\nVuelos: ', vuelos.code, vuelos.data, '\n\n');
      if (vuelos.code === 1 && vuelos.data === true) {
        transaction.commit(t);
      } else {
        transaction.rollback(t);
        return res.error(new Date(vuelos.message));
      }
    } catch (e) {
      transaction.rollback(t);
      return res.error(e);
    }

    // notificaciones
    let op = await operadores.findById(solicitud.id_operador);
    let usuarioOperador = await usuarios.findById(op.id_usuario);

    let destinatarios = [];
    let asunto = 'Plataforma de transporte aéreo (test): ';
    let mensaje = '';
    let idRemitente;

    let siglasEntidades = await entidadesQueApruebanSolicitudItinerarios(solicitud);
    for (let i = 0; i < siglasEntidades.length; i++) {
      let entidad = await entidades.findBySigla(siglasEntidades[i]);
      console.log('sigla (entidad encontrada):::', siglasEntidades[i]);
      console.log('   email:', entidad.email);
      let userItem;
      try {
        if (entidad.sigla === 'DGAC') {
          userItem = await usuarios.findByUsername('dgac');
        } else if (entidad.sigla === 'AASANA') {
          userItem = await usuarios.findByUsername('aasana');
        } else if (entidad.sigla === 'SABSA') {
          userItem = await usuarios.findByUsername('sabsa');
        } else if (entidad.sigla === 'ATT') {
          userItem = await usuarios.findByUsername('sabsa');
        }
        destinatarios.push({
          email: entidad.email ? entidad.email : '',
          idUsuario: userItem.id
        });
      } catch (e) {
        console.log(`Ocurrió una excepcion: ${e}`);
      }
    }
    console.log('Existe usuario operador:::::::', usuarioOperador);
    if (usuarioOperador) {
      destinatarios.push({ email: usuarioOperador.email, idUsuario: usuarioOperador.id });
    }
    asunto += `Aprobación de solicitud de itinerario`;
    mensaje = `<p>La solicitud de itinerario <strong>${solicitud.id}</strong> ha sido aprobada</p><p>La aprobación se ha realizado en fecha ${solicitud._updated_at}, ingrese a la plataforma para crear el plan de vuelos.</p>`;

    idRemitente = destinatarios[0].idUsuario;
    destinatarios.push({ email: 'rgarcia@agetic.gob.bo', idUsuario: usuarioOperador.id }); // temporal
    console.log('destinatarios::-::-::-::-::', destinatarios);

    // enviando las notificaciones electronicas
    for (let i = 0; i < destinatarios.length; i++) {
      let result = await notificaciones.crearNotificacion(true,
                                                          idRemitente,
                                                          destinatarios[i].idUsuario,
                                                          'CORREO',
                                                          asunto,
                                                          mensaje,
                                                          destinatarios[i].email);
      console.log('Resultado del correo enviado:::::', result);
    }

    return res.success(vuelos);
  }

  async function aprobarItinerarios (idSolicitud, idUsuario, itinerariosIds) {
    debug('Aprobar itinerarios individualmente');

    // verifica si existen itinerarios aprobados y les cambia el estado
    let modificados = [];
    try {
      for (let i = 0; i < itinerariosIds.length; i++) {
        let item = await itinerarios.createOrUpdate({id: itinerariosIds[i], estado: 'APROBADO'});
        if (item && item.id) {
          modificados.push(itinerariosIds[i]);
        }
      }
    } catch (e) {
      return res.error(e);
    }
    // comprobando que todos los itinerarios de una solicitud hayan sido aprobados
    let todoAprobado = true;
    let items = await itinerarios.findAll({ id_solicitud: idSolicitud });
    if (itinerariosIds.length < items.rows.length) {
      for (let i = 0; i < items.count; i++) {
        if (items.rows[i].estado !== 'APROBADO') {
          todoAprobado = false;
          break;
        }
      }
    }
    console.log('\n\n TODO aprobado', todoAprobado, '\n Modificados\n', modificados);
    if (todoAprobado) {
      let usuario;
      try {
        usuario = await usuarios.findById(parseInt(idUsuario));
      } catch (e) {
        debug(`No se puede obtener el usuario con id ${idUsuario}: ${e}`);
        return res.error(e);
      }
      // llama a la funcion de aprobacion entera del itinerario
      let result = await aprobar(idSolicitud, usuario.id);
      console.log('\n:::::::Resultado encontrado', result);
    }
    return res.success(modificados);
  }

  async function create (datos, estado = 'CREADO') {
    debug('Creando solicitud de itinerarios');

    try {
      datos.id_operador = parseInt(datos.id_operador);
      console.log('itinerarios', datos.itinerarios);

      // Validando que los itinerarios tenga la información correcta
      let validate = await Itinerario.validar(datos.itinerarios, datos.id_operador, datos.id_usuario);
      console.log('validate', validate);
      
      if (validate.code === 1) {
        if (validate.data.iata && validate.data.matriculas) {
          const { iata, matriculas } = validate.data;
          // Creando transacción
          const t = await transaction.create();

          // Creando solicitud
          let data = {
            fecha_inicio: datos.fecha_inicio,
            fecha_fin: datos.fecha_fin ? datos.fecha_fin : null,
            codigo: datos.codigo || null,
            id_operador: datos.id_operador,
            _user_created: datos.id_usuario,
            estado
          };
          let solicitud = await solicitudes.createOrUpdate(data, t);

          let historial = true;
          // Creando historial para el servicio web
          if (estado === 'SOLICITADO') {
            historial = await llenarHistorial(solicitud, {
              id: datos.id_usuario,
              id_entidad: datos.id_entidad,
              usuario: datos.usuario
            }, t);
          }

          if (solicitud && solicitud.id && historial) {
            // Creando itinerarios
            let items = [];
            datos.itinerarios.map(item => {
              data = {
                id_solicitud: solicitud.id,
                nro_vuelo: item.vlo,
                id_aeronave: matriculas[item.eqv],
                id_aeropuerto_salida: iata[item.ori],
                id_aeropuerto_llegada: iata[item.des],
                hora_despegue: item.etd,
                hora_aterrizaje: item.eta,
                _user_created: datos.id_usuario
              };
              let dias = item.dia.split('-');
              if (dias.length) {
                dias.map((dia) => {
                  data[`dia_${dia}`] = true;
                });
              }
              items.push(data);
            });
            let result = await itinerarios.createAll(items, t);
            if (result && historial) {
              transaction.commit(t);
              return res.success({ id_solicitud: solicitud.id });
            } else {
              transaction.rollback(t);
              return res.error(new Error('No se pudo crear la solicitud'));
            }
          } else {
            return res.error(new Error('No se pudo crear la solicitud'));
          }
        } else {
          return res.success(validate.data);
        }
      } else {
        return res.error(new Error('Ocurrió un error al validar el csv.' + validate.message));
      }
    } catch (e) {
      return res.error(e);
    }
  }

  async function validar (idSolicitud, usuario) {
    if (!idSolicitud) {
      return res.error(new Error('El ID de la solicitud es requerido'));
    }
    try {
      let solicitud = await solicitudes.findById(idSolicitud);

      if (!solicitud) {
        return res.error(new Error('No existe la solicitud'));
      }

      let aprobados = await filter(solicitud);
      let dias = {};
      for (let j in aprobados) {
        let item = aprobados[j];
        for (let i = 1; i <= 7; i++) {
          if (item[`dia_${i}`]) {
            if (!dias[`${i}`]) {
              dias[`${i}`] = [];
            }
            dias[`${i}`].push(item);
          }
        }
      }
      // console.log('****** aprobados *******\n\n', aprobados, '\n\n');
      // console.log('dias', dias);

      let items = await itinerarios.findAll({ id_solicitud: idSolicitud });
      items = await validandoAprobados(items.rows, dias, solicitud);
      // .. hacer la comprobacion con items
      items.comprobacionFlujo = await comprobarIntentoAprobacion(solicitud, usuario);

      return res.success(items);
    } catch (e) {
      return res.error(e);
    }
  }

  async function validandoAprobados (items, aprobados, solicitud) {
    const lapso = await Parametro.getParam('LAPSO_ENTRE_DESPEGUES');

    let lista = {};
    let errors = 0;
    for (let i in items) {
      if (!lista[items[i]['aeronave.matricula']]) {
        lista[items[i]['aeronave.matricula']] = [];
      }
      lista[items[i]['aeronave.matricula']].push(items[i]);
    }
    // console.log('LISTA', lista);
    for (let i in lista) {
      let dias = {};
      let vuelos = lista[i];
      for (let j in vuelos) {
        let vuelo = vuelos[j];
        for (let k = 1; k <= 7; k++) {
          if (vuelo[`dia_${k}`]) {
            if (!dias[`${k}`]) {
              dias[`${k}`] = [];
            }
            let dia = {
              id: vuelo.id,
              nro_vuelo: vuelo.nro_vuelo,
              hora_despegue: vuelo.hora_despegue,
              hora_aterrizaje: vuelo.hora_aterrizaje,
              estado: vuelo.estado,
              dia_semana: k,
              'solicitud.fecha_inicio': vuelo['solicitud.fecha_inicio'],
              'solicitud.fecha_fin': vuelo['solicitud.fecha_fin'],
              'aeronave.matricula': vuelo['aeronave.matricula'],
              'aeropuerto_salida.codigo_iata': vuelo['aeropuerto_salida.codigo_iata'],
              'aeropuerto_llegada.codigo_iata': vuelo['aeropuerto_llegada.codigo_iata']
            };

            // Algoritmo de pistas libres
            if (solicitud.estado !== 'APROBADO' && aprobados[k]) {
              let ini = transform(dia.hora_despegue);
              let fin = transform(dia.hora_aterrizaje);
              let aprobado = aprobados[k];
              console.log('===== ', vuelo.id, ' ---------------- DIA:', k, dia.hora_despegue, ini, dia.hora_aterrizaje, fin);
              // console.log('vuelo:', vuelo);
              for (let l in aprobado) {
                // verificando solo el aeropuerto de salida
                if (aprobado[l]['aeropuerto_salida.id'] === vuelo['aeropuerto_salida.id']) {
                  let hi = transform(aprobado[l].hora_despegue);
                  let hf = transform(aprobado[l].hora_aterrizaje);

                  const rango = parseInt(vuelo['aeropuerto_salida.lapso_entre_despegues'] || lapso.valor); // en minutos TODO: sacar a variable el timepo por defecto
                  // console.log('=========================  horaDespegue', aprobado[l].hora_despegue, (hi - rango), ini, (hi + rango));

                  let a = (hi - rango) < ini;
                  let b = ((hi + rango)) > ini;

                  if (a && b) {
                    console.log(aprobado[l].id, aprobado[l].hora_despegue, hi, aprobado[l].hora_aterrizaje, hf, aprobado[l]['solicitud.operador.sigla']);
                    if (!dia.items) {
                      dia.items = [];
                    }
                    dia.items.push(aprobado[l]);
                    errors++;
                  }
                }
              }
            }
            dias[`${k}`].push(dia);
          }
        }
      }
      lista[i] = dias;
    }

    return {
      items: lista,
      errors
    };
  }

  async function entidadesQueApruebanSolicitudItinerarios (solicitud) {
    /*
     Retorna una lista con las entidades que pueden aprobar la solicitud de itinerarios
     ej:
     ['SABSA', 'DGAC']
     ['AASANA', 'DGAC', 'SABSA']
     */
    try {
      let items = await itinerarios.findAll({ id_solicitud: solicitud.id });
      let pendientes = ['DGAC'];
      for (let i = 0; i < items.rows.length; i++) {
        let aeropuertoSalida = items.rows[i]['aeropuerto_salida.codigo_iata'];
        if (aeropuertoSalida === 'LPB' || aeropuertoSalida === 'VVI' || aeropuertoSalida === 'CBB') {
          if (pendientes.indexOf('SABSA') === -1) {
            pendientes.push('SABSA');
          }
        } else {
          if (pendientes.indexOf('AASANA') === -1) {
            pendientes.push('AASANA');
          }
        }
      }
      return pendientes;
    } catch (e) {
      debug(`No se pudo encontrar los itinerarios para solicitud ${solicitud.id}: ${e}`);
      return [];
    }
  }
  
  async function filter (solicitud) {
    let items = await itinerarios.filter({
      estado_solicitud: ['APROBADO', 'PLAN_VUELO_CREADO', 'PLAN_VUELO_APROBADO'],
      fecha_inicio_solicitud: solicitud.fecha_inicio,
      fecha_fin_solicitud: solicitud.fecha_fin,
      id_solicitud: solicitud.id
    });

    return items;
  }

  async function deleteItem (id) {
    debug('Eliminando solicitud');

    let deleted;
    try {
      // eliminando itinerarios asociados a esta solicitud
      let params = { id_solicitud: id };
      let itinerariosArray = await itinerarios.findAll(params);
      for (let i = 0; i < itinerariosArray.count; i++) {
        await itinerarios.deleteItem(itinerariosArray.rows[i].id);
      }
      deleted = await solicitudes.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la solicitud`));
    }

    if (deleted === 0) {
      return res.error(new Error(`La solicitud ya fue eliminado`));
    }

    return res.success(deleted > 0);
  }

  async function llenarHistorial (data, usuarioQueActua, t) {
    debug(`Registrando historial de solicitud de itinerario`);
    if (data.estado === 'CREADO') {
      return false;
    }
    try {
      let obj = {
        id_solicitud: data.id,
        id_entidad: usuarioQueActua.id_entidad,
        _user_created: usuarioQueActua.id,
        nombre_usuario: usuarioQueActua.usuario,
        id_usuario: usuarioQueActua.id,
        fecha: moment().format('YYYY/MM/DD HH:mm:ss'),
        accion: data.estado,
        detalle: data.detalle === undefined ? `${usuarioQueActua.usuario} realiza la acción ${data.estado}` : data.detalle
      };
      let historial;
      if (t) {
        historial = await itinerarioHistorial.createOrUpdate(obj, t);
      } else {
        historial = await itinerarioHistorial.createOrUpdate(obj);
      }
      debug(`Registrado historial de solicitud de itinerario ${historial}`);
    } catch (e) {
      debug(`No se pudo registrar el historial de solicitud de itinerario ${data}: ${e}`);
      console.log('\n------ ', data);
      console.log(usuarioQueActua);
      return false;
    }
    return true;
  }

  async function habilitadaCreacionRPL (solicitud) {
    /* Comprueba las condiciones de fechas para crear una nueva solicitud de planes de
     vuelo repetitivos (RPL) de acuerdo a la solicitud de itinerario dada.
     */
    const diasAnticipacionCreacionSolicitud = await Parametro.getParam('DIAS_ANTICIPACION_CREACION_RPL');

    let solicitudesRPL;
    try {
      // TODO: comprobar si existen solicitudes RPL pendientes
      // ..

      // TODO: incluir en el query el estado 'APROBADO'
      solicitudesRPL = await planSolicitudes.findAll({ id_solicitud_itinerario: solicitud.id, order: '-_created_at', limit: 1, estado: 'APROBADO_AASANA' });

      if (solicitudesRPL.rows.length === 0) {
        // no existen solicitudes RPL creadas solo comprobar la fecha desde
        const desde = moment(solicitud.fecha_inicio);
        const hasta = moment(solicitud.fecha_fin);
        return (moment() <= hasta) && (moment() < desde.add(diasAnticipacionCreacionSolicitud, 'days'));
      }
    } catch (e) {
      debug(`No se pudo obtener los planes de solicitud RPL para la solicitud de itinerario ${solicitud.id}: ${e}`);
      return false;
    }

    /* controla:
     - que la fecha de finalizacion solicitada no sea superior a la fecha de finalizacion del Plan de solicitudes aprobado
     - que la fecha de inicio sea al menos x dias menor que la fecha del ultimo plan de vuelos RPL aprobado
     */
    let hasta = moment(solicitud.fecha_fin);
    const desde = moment(solicitudesRPL.rows[0].fecha_hasta);
    const ahora = moment();
    console.log(solicitud.id, '>>>>>>>>>>>>>>>> desd', desde, 'hasta', hasta, ' : ', ahora < desde.subtract(diasAnticipacionCreacionSolicitud, 'days'), ' : ', (ahora <= hasta));
    return (ahora < desde.subtract(diasAnticipacionCreacionSolicitud, 'days')) && (ahora <= hasta);
  }

  async function creacionRPLHabilitadas () {
    let items = await solicitudes.findAll();
    let arreglo = [];
    for (let i = 0; i < items.rows.length; i++) {
      let idstr = items.rows[i].id + '';
      let obj = {};
      obj.id = idstr;
      obj.can = await habilitadaCreacionRPL(items.rows[i]);
      arreglo.push(obj);
    }
    return arreglo;
  }

  async function obtenerCodigoAprobacionItinerario () {
    /* Obtiene un numero secuencial para el itinerario aprobado en el formato:
     DGAC/ITI/XXX/YYYY
     - XXX: numero secuencial por gestion
     - YYYY: Gestion
     */
    let gestion = (new Date()).getFullYear();
    try {
      let items = await solicitudes.findAll({
        desde_fecha: gestion + '-01-01',
        estados: ['APROBADO', 'PLAN_VUELO_CREADO', 'PLAN_VUELO_APROBADO']
      });

      let cantidad = items.rows.length;
      console.log('\n\n** * CODIGO:                        DGAC/ITI/' + (cantidad + 1) + '/' + gestion);
      return 'DGAC/ITI/' + (cantidad + 1) + '/' + gestion;
    } catch (e) {
      debug(`No se ha podido consultar solicitudes por gestion: ${e}`);
      return '';
    }
  }

  async function estado (id) {
    try {
      let solicitud = await solicitudes.findById(id);
      let items = await itinerarios.findAll({ id_solicitud: id });
      let respuesta = {
        'fecha_inicio': solicitud.fecha_inicio,
        'fecha_fin': solicitud.fecha_fin,
        'estado': solicitud.estado
      };
      let array = [];
      items.rows.map(item => {
        array.push({
          'id': item.id,
          'nro_vuelo': item.nro_vuelo,
          'hora_despegue': item.hora_despegue,
          'hora_aterrizaje': item.hora_aterrizaje,
          'dia_1': item.dia_1,
          'dia_2': item.dia_2,
          'dia_3': item.dia_3,
          'dia_4': item.dia_4,
          'dia_5': item.dia_5,
          'dia_6': item.dia_6,
          'dia_7': item.dia_7,
          'observacion': item.observacion,
          'estado': item.estado,
          'tipo_vuelo': item.tipo_vuelo,
          'matricula': item['aeronave.matricula'],
          'aeropuerto_salida': item['aeropuerto_salida.codigo_iata'],
          'aeropuerto_llegada': item['aeropuerto_llegada.codigo_iata']
        });
      });
      respuesta.itinerarios = array;

      return res.success(respuesta);
    } catch (e) {
      return res.error(e);
    }
  }

  return {
    estado,
    findAll,
    findById,
    createOrUpdate,
    create,
    validar,
    deleteItem,
    aprobar,
    aprobarItinerarios,
    llenarHistorial,
    comprobarIntentoAprobacion,
    habilitadaCreacionRPL,
    creacionRPLHabilitadas
  };
};
