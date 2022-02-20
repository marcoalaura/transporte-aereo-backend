'use strict';

const debug = require('debug')('app:service:tripulacion');
const moment = require('moment');

module.exports = function userService (repositories, res) {
  const { tripulaciones, tripulacionesHistorial, personas, vuelos, itinerarios, Mopsv } = repositories;
  const Persona = require('../system/Persona')(repositories, res);

  async function findAll (params = {}, rol, idOperador) {
    debug('Lista de tripulaciones|filtros', rol);
    let lista;
    try {
      switch (rol) {
        case 'OPERADOR_AVION_ADMIN': case 'OPERADOR_AVION':
          if (params.id_operador && params.id_operador === -1) {
            params.id_operador = null;
          } else {
            params.id_operador = idOperador;
          }
          break;
        case 'DGAC_ADMIN': case 'DGAC':
          if (params.id_operador && params.id_operador === -1) {
            params.id_operador = null;
          }
          break;
      }
      lista = await tripulaciones.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de tripulaciones`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando tripulacion por ID');

    let user;
    try {
      user = await tripulaciones.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`tripulacion ${id} not found`));
    }

    return res.success(user);
  }

  async function validar (idVuelo, idTripulante, vuelo, itinerario, tripulacion) {
    try {
      if (!vuelo) {
        vuelo = await vuelos.findById(idVuelo);
      }
      let fechaDespegue = moment(vuelo.fecha_despegue);
      let idItinerario = vuelo.id_itinerario;

      if (!itinerario) {
        itinerario = await itinerarios.findById(idItinerario);
      }
      if (!tripulacion) {
        tripulacion = await tripulaciones.findById(idTripulante);
      }
      let fechaValidez = moment(tripulacion.vigencia);

      const tipos = {
        'PILOTO': 'PILOTO',
        'TRIPULANTE_DE_CABINA': 'TRIPULANTE DE CABINA'
      };

      if (fechaValidez.diff(fechaDespegue, 'days') < 0) {
        return res.success({ observacion: 'El certificado médico del ' + tipos[tripulacion.tipo] + ' expira antes de la fecha de despegue del vuelo.' });
      }
      if (itinerario.tipo_vuelo === 'NACIONAL' &&
        (tripulacion.titulo !== 'PILOTO COMERCIAL AVIÓN' && tripulacion.titulo !== 'PILOTO TRANSPORTE LÍNEA AÉREA AVIÓN')) {
        return res.success({ observacion: `El título '${tripulacion.titulo}' del tripulante no cumple los requisitos para un vuelo ${itinerario.tipo_vuelo}` });
      }
      if (itinerario.tipo_vuelo === 'INTERNACIONAL' && tripulacion.titulo !== 'PILOTO TRANSPORTE LÍNEA AÉREA AVIÓN') {
        return res.success({ observacion: `El título '${tripulacion.titulo}' del tripulante no cumple los requisitos para un vuelo ${itinerario.tipo_vuelo}` });
      }
      return res.success({ valid: true });
    } catch (e) {
      return res.error(e);
    }
  }

  async function createOrUpdate (data, idUsuario) {
    debug('Crear o actualizar tripulacion');

    let user;
    try {
      let persona = {
        nombre_completo: data.nombre_completo,
        nombres: typeof data.nombres === 'string' ? data.nombres.trim() : null,
        primer_apellido: typeof data.primer_apellido === 'string' ? data.primer_apellido.trim() : null,
        segundo_apellido: typeof data.segundo_apellido === 'string' ? data.segundo_apellido.trim() : null,
        nro_documento: typeof data.nro_documento === 'string' ? data.nro_documento.trim() : null,
        tipo_documento: data.tipo_documento,
        tipo_documento_otro: data.tipo_documento_otro,
        fecha_nacimiento: data.fecha_nacimiento,
        movil: data.movil,
        nacionalidad: data.nacionalidad,
        pais_nacimiento: data.pais_nacimiento,
        genero: data.genero,
        telefono: data.telefono
      };

      if (data.id_persona) { // Actualizando persona
        persona.id = data.id_persona;
        persona._user_updated = idUsuario;
        persona._updated_at = new Date();
      } else {
        let item = await personas.find(persona);
        if (item) {
          persona.id = item.id;
          persona._user_updated = idUsuario;
          persona._updated_at = new Date();
        } else {
          persona._user_created = idUsuario;
        }
      }

      persona = await personas.createOrUpdate(persona);

      let tripulacion = {
        nro_licencia: data.nro_licencia,
        titulo: data.titulo,
        vigencia: data.vigencia,
        ciudad: data.ciudad,
        tipo: data.tipo,
        id_persona: persona.id,
        sincronizado: data.sincronizado,
        estado_verificacion: data.estado_verificacion,
        observacion: data.observacion
      };

      if (data.id) {
        tripulacion.id = data.id;
        // tripulacion.estado = data.estado;
        tripulacion._user_updated = idUsuario;
        tripulacion._updated_at = new Date();
      } else {
        tripulacion._user_created = idUsuario;
      }

      user = await tripulaciones.createOrUpdate(tripulacion);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`El tripulacion no pudo ser creado`));
    }

    return res.success(user);
  }

  async function sincronizarDgacPilotos (idUsuario) {
    debug('Sincronizando pilotos de DGAC');
    let tripulacionesItems;
    try {
      // Obteniendo el servicio de pilotos para agregar a la tabla de tripulación
      let items = await Mopsv.dgac.pilotos();

      if (!Array.isArray(items)) {
        return res.error(new Error('Error al obtener la lista de pilotos desde la Plataforma del Mopsv'));
      }

      tripulacionesItems = await tripulaciones.findAll({ tipo: 'PILOTO' });

      if (!tripulacionesItems) {
        return res.error(new Error(`Error al obtener la lista de tripulaciones para sincronizar`));
      }

      // Registrando todas las tripulaciones de DGAC si no se tiene registros en la tabla tripulaciones
      if (tripulacionesItems.count !== undefined && tripulacionesItems.count === 0) {
        debug('Sincronización - Registrando todas las tripulaciones de DGAC');
        let nuevos = [];

        for (let i in items) {
          let data = {
            nombres: items[i].nombre, // obtenido desde DGAC
            primer_apellido: items[i].apPaterno, // obtenido desde DGAC
            segundo_apellido: items[i].apMaterno, // obtenido desde DGAC
            tipo_documento: isNaN(items[i].nroLicencia) ? 'PASAPORTE' : 'CI',
            nro_documento: items[i].nroLicencia.trim(), // obtenido desde DGAC
            nro_licencia: items[i].nroLicencia.trim(), // obtenido desde DGAC
            titulo: items[i].titulo, // obtenido desde DGAC
            vigencia: moment(items[i].vigencia, 'DD/MM/YYYY'), // obtenido desde DGAC
            tipo: 'PILOTO',
            sincronizado: true,
            fecha_nacimiento: items[i].fechaNacimiento ? moment(items[i].fechaNacimiento, 'DD/MM/YYYY') : null, // obtenido desde DGAC
            nacionalidad: (items[i].nacionalidad + '').trim() // obtenido desde DGAC
          };
          nuevos.push(data.nro_licencia);

          let tripulacion = await createOrUpdate(data, idUsuario);
          
          if (tripulacion.code === -1) {
            res.error(new Error(tripulacion.message));
          }
        }

        return res.success({ nuevos, total: items.length });
      } else { // Actualizando registros de tabla tripulaciones
        debug('Sincronización - Actualizando los pilotos de DGAC en la tabla tripulaciones');
        let dgacPilotos = {}; // Pilotos del servicio de la DGAC
        items.map(item => (dgacPilotos[item.nroLicencia] = item));

        let bdPilotos = {}; // Pilotos guardados en la BD
        tripulacionesItems.rows.map(item => (bdPilotos[item.nro_licencia] = item));

        let cambiados = []; // temporal
        let nuevasLicencias = [];
        for (let licencia in dgacPilotos) {
          let item = dgacPilotos[licencia];
          if (bdPilotos[licencia]) {
            item.id = bdPilotos[licencia].id;
            item.id_persona = bdPilotos[licencia].id_persona;
            // comparando si existe el registro de pilotos o se ha modificado en la BD
            let cambios = verificarCambioTripulacion(bdPilotos[licencia], item);
            if (Object.keys(cambios).length > 0) {
              await registrarCambiosTripulaciones(cambios, idUsuario);
              cambiados.push(cambios);
            }
          } else {
            nuevasLicencias.push(licencia);
          }
          debug(`Sincronización - ${item.id ? 'Actualizando ID:' + item.id : 'Creando'} tripulacion DGAC`);
          let data = {
            id: item.id,
            id_persona: item.id_persona,
            nombres: item.nombre,
            primer_apellido: item.apPaterno,
            segundo_apellido: item.apMaterno,
            tipo_documento: isNaN(item.nroLicencia) ? 'PASAPORTE' : 'CI',
            nro_documento: item.nroLicencia.trim(),
            nro_licencia: item.nroLicencia.trim(),
            titulo: item.titulo,
            vigencia: moment(item.vigencia, 'DD/MM/YYYY'),
            ciudad: item.ciudad,
            tipo: 'PILOTO',
            sincronizado: true,
            fecha_nacimiento: item.fechaNacimiento ? moment(item.fechaNacimiento, 'DD/MM/YYYY') : null,
            nacionalidad: item.nacionalidad
          };
          // comprobar cambios en tripulacion (persona)
          let persona = {
            nombre_completo: data.nombre_completo,
            nombres: typeof data.nombres === 'string' ? data.nombres.trim() : null,
            primer_apellido: typeof data.primer_apellido === 'string' ? data.primer_apellido.trim() : null,
            segundo_apellido: typeof data.segundo_apellido === 'string' ? data.segundo_apellido.trim() : null,
            nro_documento: typeof data.nro_documento === 'string' ? data.nro_documento.trim() : null,
            tipo_documento: data.tipo_documento,
            tipo_documento_otro: data.tipo_documento_otro,
            fecha_nacimiento: data.fecha_nacimiento,
            movil: data.movil,
            nacionalidad: data.nacionalidad,
            pais_nacimiento: data.pais_nacimiento,
            genero: data.genero,
            telefono: data.telefono
          };
          let personaEncontrada;
          try {
            personaEncontrada = await personas.find(persona);
            let cambios = verificarCambiosTripulacionPersona(personaEncontrada, data);
            if (Object.leys(cambios).length > 0) {
              // console.log('::::: persona cambios detectados', cambios);
              let res = await registrarCambiosTripulaciones(cambios, idUsuario);
              cambiados.push(cambios);
            }
          } catch (e) {
          }
          
          let tripulacion = await createOrUpdate(data, idUsuario);
          if (tripulacion.code === -1) {
            res.error(new Error(tripulacion.message));
          }
        }

        const tripulacionesDB = await tripulaciones.findAll();
        console.log('\n\nRegistros cambiados', cambiados, '\ntotal', cambiados.length);
        return res.success({ nuevos: nuevasLicencias, total: tripulacionesDB.count });
      }
    } catch (e) {
      return res.error(e);
    }
  }

  async function sincronizarDgacTripulantes (idUsuario) {
    debug('Sincronizando tripulantes de DGAC');
    let tripulacionesItems;
    try {
      // Obteniendo el servicio de tripulantes para agregar a la tabla de tripulación
      let items = await Mopsv.dgac.tripulantes();

      if (!Array.isArray(items)) {
        return res.error(new Error('Error al obtener la lista de tripulantes desde la Plataforma del Mopsv'));
      }

      tripulacionesItems = await tripulaciones.findAll({ tipo: 'TRIPULANTE_DE_CABINA' });

      if (!tripulacionesItems) {
        return res.error(new Error(`Error al obtener la lista de tripulaciones para sincronizar`));
      }

      // Registrando todas las tripulaciones de DGAC si no se tiene registros en la tabla tripulaciones
      if (tripulacionesItems.count !== undefined && tripulacionesItems.count === 0) {
        debug('Sincronización - Registrando todas las tripulaciones de DGAC');
        let nuevos = [];

        for (let i in items) {
          let data = {
            nombres: items[i].nombre,
            primer_apellido: items[i].apPaterno,
            segundo_apellido: items[i].apMaterno,
            tipo_documento: isNaN(items[i].nroLicencia) ? 'PASAPORTE' : 'CI',
            nro_documento: items[i].nroLicencia.trim(),
            nro_licencia: items[i].nroLicencia.trim(),
            titulo: items[i].titulo,
            vigencia: moment(items[i].vigencia, 'DD/MM/YYYY'),
            tipo: 'TRIPULANTE_DE_CABINA',
            sincronizado: true,
            fecha_nacimiento: items[i].fechaNacimiento ? moment(items[i].fechaNacimiento, 'DD/MM/YYYY') : null,
            nacionalidad: (items[i].nacionalidad + '').trim()
          };
          nuevos.push(data.nro_licencia);

          let tripulacion = await createOrUpdate(data, idUsuario);
          if (tripulacion.code === -1) {
            res.error(new Error(tripulacion.message));
          }
        }

        return res.success({ nuevos, total: items.length });
      } else {
        debug('Sincronización - Actualizando los tripulantes de DGAC en la tabla tripulaciones');
        let dgacPilotos = {};
        items.map(item => (dgacPilotos[item.nroLicencia] = item));
        let bdPilotos = {};
        tripulacionesItems.rows.map(item => (bdPilotos[item.nro_licencia] = item));

        let nuevasLicencias = [];
        let cambiados = [];
        for (let licencia in dgacPilotos) {
          let item = dgacPilotos[licencia];
          if (bdPilotos[licencia]) {
            item.id = bdPilotos[licencia].id;
            item.id_persona = bdPilotos[licencia].id_persona;
            // comprobando si existe el registro de tripulantes o se ha modificado en la BD
            let cambios = await verificarCambioTripulacion(bdPilotos[licencia], item);
            if (Object.keys(cambios).length > 0) {
              await registrarCambiosTripulaciones(cambios, idUsuario);
              cambiados.push(cambios);
            }
          } else {
            nuevasLicencias.push(licencia);
          }
          debug(`Sincronización - ${item.id ? 'Actualizando ID:' + item.id : 'Creando'} tripulacion DGAC`);
          let data = {
            id: item.id,
            id_persona: item.id_persona,
            nombres: item.nombre,
            primer_apellido: item.apPaterno,
            segundo_apellido: item.apMaterno,
            tipo_documento: isNaN(item.nroLicencia) ? 'PASAPORTE' : 'CI',
            nro_documento: item.nroLicencia.trim(),
            nro_licencia: item.nroLicencia.trim(),
            titulo: item.titulo,
            vigencia: moment(item.vigencia, 'DD/MM/YYYY'),
            ciudad: item.ciudad,
            tipo: 'TRIPULANTE_DE_CABINA',
            sincronizado: true,
            fecha_nacimiento: item.fechaNacimiento ? moment(item.fechaNacimiento, 'DD/MM/YYYY') : null,
            nacionalidad: item.nacionalidad
          };
          // comprobar cambios en tripulacion (persona)
          let persona = {
            nombre_completo: data.nombre_completo,
            nombres: typeof data.nombres === 'string' ? data.nombres.trim() : null,
            primer_apellido: typeof data.primer_apellido === 'string' ? data.primer_apellido.trim() : null,
            segundo_apellido: typeof data.segundo_apellido === 'string' ? data.segundo_apellido.trim() : null,
            nro_documento: typeof data.nro_documento === 'string' ? data.nro_documento.trim() : null,
            tipo_documento: data.tipo_documento,
            tipo_documento_otro: data.tipo_documento_otro,
            fecha_nacimiento: data.fecha_nacimiento,
            movil: data.movil,
            nacionalidad: data.nacionalidad,
            pais_nacimiento: data.pais_nacimiento,
            genero: data.genero,
            telefono: data.telefono
          };
          let personaEncontrada;
          try {
            personaEncontrada = await personas.find(persona);
            let cambios = await verificarCambiosTripulacionPersona(personaEncontrada, data);
            if (Object.leys(cambios).length > 0) {
              // console.log('::::: persona cambios detectados', cambios);
              let res = await registrarCambiosTripulaciones(cambios, idUsuario);
              cambiados.push(cambios);
            }
          } catch (e) {
            debug(`No se ha encontrado persona ${persona}: ${e}`);
          }
          console.log('cambios registrados', cambiados, '\ntotal:', cambiados.length);

          let tripulacion = await createOrUpdate(data, idUsuario);
          if (tripulacion.code === -1) {
            res.error(new Error(tripulacion.message));
          }
        }

        const tripulacionesDB = await tripulaciones.findAll();

        return res.success({ nuevos: nuevasLicencias, total: tripulacionesDB.count });
      }
    } catch (e) {
      return res.error(e);
    }
  }

  async function unassign (idTripulacion) {
    let tripulante = await findById(idTripulacion);
    tripulante.data.id_operador = null;
    let datos = Object.assign({}, tripulante.data);
    debug('Tripulacion actualizada:: ', datos);
    let result = await update(datos);

    return result;
  }

  async function assign (tripulantes, idOperador) {
    for (let i in tripulantes) {
      let idTripulante = tripulantes[i];
      let tripulante = await tripulaciones.findById(idTripulante);

      if (tripulante) {
        // Validando contrastación de datos con el SEGIP
        if (tripulante['persona.estado_verificacion'] !== 'VERIFICADO_SEGIP') {
          if (tripulante['persona.tipo_documento'] === 'CI') {
            const data = {
              numero_documento: tripulante['persona.nro_documento'],
              fecha_nacimiento: moment(tripulante['persona.fecha_nacimiento']).format('YYYY-MM-DD'),
              primer_apellido: tripulante['persona.primer_apellido'],
              segundo_apellido: tripulante['persona.segundo_apellido'],
              nombres: tripulante['persona.nombres']
            };
            let result = await Persona.contrastacion(data);
            await personas.createOrUpdate({
              id: tripulante.id_persona,
              observacion: result.data,
              estado_verificacion: result.estado
            });
          }
        }

        await tripulaciones.createOrUpdate({ id: idTripulante, id_operador: idOperador });
      }
    }
    return res.success({ success: true });
  }

  async function update (data) {
    debug('services->Tripulacion.js ::: Actualizar tripulacion');

    if (!data.id) {
      return res.error(new Error(`Se necesita el ID del tripulacion para actualizar el registro`));
    }

    let user;
    try {
      user = await tripulaciones.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`El tripulacion no pudo ser actualizado`));
    }

    return res.success(user);
  }

  async function deleteItem (id) {
    debug('Eliminando tripulacion');

    let deleted;
    try {
      deleted = await tripulaciones.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe el tripulacion`));
    }

    if (deleted === 0) {
      return res.error(new Error(`El tripulacion ya fue eliminado`));
    }

    return res.success(deleted > 0);
  }

  async function getUser (tripulacion, include = true) {
    debug('Buscando tripulacion por nombre de tripulacion');

    let user;
    try {
      user = await tripulaciones.findByUsername(tripulacion, include);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`tripulacion ${tripulacion} not found`));
    }

    return res.success(user);
  }

  function verificarCambioTripulacion (enBd, item) {
    /* Compara ambos objetos y retorna los campos que han cambiado */
    let cambios = {};
    if (enBd.id_persona !== item.id_persona) {
      cambios.id_persona = { anterior: enBd.id_persona, actual: item.id_persona };
    }
    if (enBd.id_operador !== item.id_operador && enBd.id_operador !== null) {
      cambios.id_operador = { anterior: enBd.id_operador, actual: item.id_operador };
    }
    if (enBd.nro_licencia !== item.nro_licencia && item.nro_licencia !== undefined) {
      cambios.nro_licencia = { anterior: enBd.nro_licencia, actual: item.nro_licencia };
    }
    if (enBd.titulo !== item.titulo && item.titulo !== undefined) {
      cambios.titulo = { anterior: enBd.titulo, actual: item.titulo };
    }
    if (enBd.vigencia !== moment(item.vigencia, ['DD/MM/YYYY']).format('YYYY-MM-DD') && item.vigencia !== undefined) {
      cambios.vigencia = { anterior: enBd.vigencia, actual: moment(item.vigencia, ['DD/MM/YYYY']).format('YYYY-MM-DD') };
    }
    if (enBd.ciudad !== item.ciudad && item.ciudad !== undefined) {
      cambios.ciudad = { anterior: enBd.ciudad, actual: item.ciudad };
    }
    // if (enBd.tipo !== item.tipo) {
    //   cambios.tipo = { anterior: enBd.tipo, actual: item.tipo };
    // }
    // if (enBd.sincronizado !== item.sincronizado) {
    //   cambios.sincronizado = { anterior: enBd.sincronizado + '', actual: item.sincronizado + '' };
    // }
    // if (enBd.estado !== item.estado) {
    //   cambios.estado = { anterior: enBd.estado, actual: item.estado };
    // }
    // if (enBd.observacion !== item.observacion) {
    //   cambios.observacion = { anterior: enBd.observacion, actual: item.observacion };
    // }
    if (Object.keys(cambios).length > 0) {
      cambios['id_tripulacion'] = enBd.id;
    }
    return cambios;
  }

  function verificarCambiosTripulacionPersona (enBd, item) {
    /* cambios relacionados a persona (no son propios de la tabla tripulacion y enBd es una instancia de la tabla persona) */
    let cambios = {};
    if (enBd.id_persona !== item.id_persona) {
      cambios.id_persona = { anterior: enBd.id_persona, actual: item.id_persona };
    }
    if (enBd.nombres !== item.nombre) {
      cambios.nombres = { anterior: enBd.nombres, actual: item.nombre };
    }
    if (enBd.primer_apellido !== item.apPaterno) {
      cambios.primer_apellido = { anterior: enBd.primer_apellido, actual: item.apPaterno };
    }
    if (enBd.segundo_apellido !== item.apMaterno) {
      cambios.segundo_apellido = { anterior: enBd.segundo_apellido, actual: item.apMaterno };
    }
    if (enBd.tipo_documento !== item.tipo_documento) {
      cambios.tipo_documento = { anterior: enBd.tipo_documento, actual: isNaN(item.nroLicencia) ? 'PASAPORTE' : 'CI' };
    }
    if (enBd.titulo !== item.titulo) {
      cambios.titulo = { anterior: enBd.titulo, actual: item.titulo };
    }
    if (enBd.vigencia !== item.vigencia) {
      cambios.vigencia = { anterior: enBd.vigencia, actual: moment(item.vigencia, 'YYYY-MM-DD') };
    }
    if (enBd.fecha_nacimiento !== item.fechaNacimiento) {
      cambios.fecha_nacimiento = { anterior: enBd.nacimiento, actual: moment(item.fechaNacimiento, 'DD/MM/YYYY') };
    }
    if (enBd.nacionalidad !== item.nacionalidad) {
      cambios.nacionalidad = { anterior: enBd.nacionalidad, actual: item.nacionalidad };
    }
    if (Object.keys(cambios).length > 0) {
      cambios['id_tripulacion'] = enBd.id;
      cambios['id_persona'] = enBd.id_persona;
    }
    return cambios;
  }

  async function registrarCambiosTripulaciones (cambios, idUsuario) {
    Object.keys(cambios).forEach(async (campo) => {
      let cambio = cambios[campo];
      try {
        if (campo !== 'id_tripulacion') {
          let res = await tripulacionesHistorial.createOrUpdate({
            id_tripulacion: cambios['id_tripulacion'],
            campo: campo,
            valor_anterior: cambio.anterior,
            valor_actual: cambio.actual,
            _user_created: idUsuario,
            id_usuario: idUsuario
          });
          console.log('>>>>> cambio efectuado', res);
        }
      } catch (e) {
        debug(`No se ha podido registrar TripulacionesHistorial ${cambio}: ${e}`);
      }
    });
  }
  
  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem,
    getUser,
    update,
    sincronizarDgacPilotos,
    sincronizarDgacTripulantes,
    unassign,
    assign,
    validar
  };
};
