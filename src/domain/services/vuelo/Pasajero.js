'use strict';

const debug = require('debug')('app:service:pasajero');
const { transformDate } = require('../../lib/time');
const { empty, required, validarFecha, validarEmail, createError } = require('../../lib/validate');
const moment = require('moment');

module.exports = function userService (repositories, res) {
  const { pasajeros, personas, vuelos, tripulaciones, transaction, Parametro } = repositories;
  const Persona = require('../system/Persona')(repositories, res);
  const Tripulacion = require('./Tripulacion')(repositories, res);
  const Vuelo = require('./Vuelo')(repositories, res);

  async function findAll (params = {}, idRol, idEntidad) {
    debug('Lista de pasajeros|filtros');
    let lista;
    try {
      lista = await pasajeros.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de pasajeros`));
    }

    return res.success(lista);
  }

  // buscar por numero doc
  async function buscarPorNroDocumento (nroDocumento) {
    debug('Buscando pasajero por nro_documento: ', nroDocumento);
    let lista;
    try {
      lista = await pasajeros.buscarPorNroDocumento(nroDocumento);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`No exite registro de pasajero con Nro. documento: ${nroDocumento}`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando pasajero por ID');
    let user;
    try {
      user = await pasajeros.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`pasajero ${id} not found`));
    }

    return res.success(user);
  }

  async function createOrUpdate (data, t, segip = false) {
    debug('Crear o actualizar pasajero');
    let item;
    let person = null;
    let commit = true;
    let soloEdicion = false;
    if (!t) {
      t = await transaction.create();
    } else {
      commit = false;
    }
    try {
      let persona = {
        nombres: data.nombres,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        nombre_completo: data.nombre_completo,
        tipo_documento: data.tipo_documento,
        tipo_documento_otro: data.tipo_documento_otro,
        nro_documento: data.nro_documento,
        fecha_nacimiento: data.fecha_nacimiento,
        movil: data.movil,
        nacionalidad: data.nacionalidad,
        pais_nacimiento: data.pais_nacimiento,
        genero: data.genero,
        telefono: data.telefono
      };

      if (data.id_persona) { // Actualizando persona
        persona.id = data.id_persona;
        persona.estado = data.estado_persona;
        persona._user_updated = data._user_updated;
        persona._updated_at = data._updated_at;

        person = await personas.findById(persona.id);
      } else {
        persona._user_created = data._user_created;
      }

      if (segip) {
        // Validando contrastación de datos con el SEGIP
        if (person === null || (person && person.estado_verificacion !== 'VERIFICADO_SEGIP')) {
          if (persona.tipo_documento === 'CI') {
            console.log('FECHA NACIMIENTO', persona, persona.fecha_nacimiento, typeof persona.fecha_nacimiento);
            if (typeof persona.fecha_nacimiento !== 'string') {
              persona.fecha_nacimiento = moment(persona.fecha_nacimiento).format('YYYY-MM-DD');
            }

            let result = await Persona.contrastacion(persona, data.tipo_viajero === 'EXTRANJERO' ? 2 : 1);
            persona.observacion = result.data;
            persona.estado_verificacion = result.estado;
          }
        }
      }

      persona = await personas.createOrUpdate(persona, t);

      let pasajero = {
        tipo: data.tipo,
        tipo_viajero: data.tipo_viajero,
        tipo_tripulacion: data.tipo_tripulacion,
        nro_asiento: data.nro_asiento,
        fecha_vencimiento_doc: data.fecha_vencimiento_doc,
        entidad_emisora_doc: data.entidad_emisora_doc,
        lugar_origen: data.lugar_origen,
        lugar_destino: data.lugar_destino,
        email: data.email,
        estado: data.estado,
        id_vuelo: data.id_vuelo,
        id_persona: persona.id,
        id_tripulacion: data.id_tripulacion,
        observacion: data.observacion
      };

      if (!data.id) {
        if (data.id_tripulacion) {
          // Verificamos si el tripulante ya está registrado en la BD para actualizarlo
          let tripulante = await pasajeros.findTripulante({ id_vuelo: data.id_vuelo, id_tripulacion: data.id_tripulacion });
          if (tripulante) {
            data.id = tripulante.id;
          }
        } else {
          // Verificamos si el pasajero ya está registrado en la BD para actualizarlo
          let pasajero = await pasajeros.findPasajero({ id_vuelo: data.id_vuelo, id_persona: data.id_persona });
          if (pasajero) {
            data.id = pasajero.id;
          }
        }
      }

      if (data.id) {
        pasajero.id = data.id;
        pasajero.estado = data.estado;
        pasajero._user_updated = data._user_updated;
        pasajero._updated_at = data._updated_at;
        soloEdicion = true;
      } else {
        pasajero._user_created = data._user_created;
      }

      item = await pasajeros.createOrUpdate(pasajero, t);

      if (commit) {
        // Contando cantidad de pasajeros en el vuelo
        await vuelos.createOrUpdate({ id: data.id_vuelo }, t);
        transaction.commit(t);

        // actualizando nro de pasajeros
        let items = await pasajeros.findAll({ id_vuelo: data.id_vuelo });
        let nroPasajeros = soloEdicion ? items.rows.length : items.rows.length + 1;
        await vuelos.createOrUpdate({ id: data.id_vuelo, nro_pasajeros: nroPasajeros });
      }
    } catch (e) {
      console.log('ERROR CREAR/EDITAR PASAJERO', e);
      if (commit) {
        transaction.rollback(t);
      }
      return res.error(e);
    }

    if (!item) {
      return res.error(new Error(`El pasajero no pudo ser creado`));
    }

    return res.success(item);
  }

  async function create (pasajero, idOperador) {
    debug('Creando pasajero', pasajero, idOperador);
    console.log('***** pasajero: ', JSON.stringify(pasajero, null, 2));
    try {
      const t = await transaction.create();

      if (pasajero.id_tripulacion && idOperador) {
        let tripulante = await tripulaciones.findById(pasajero.id_tripulacion);
        if (!tripulante) {
          transaction.rollback(t);
          return res.error(new Error('No existe el tripulante'));
        }
        // Actualizando operador del tripulante si este no está asignado a algún operador
        if (!tripulante.id_operador) {
          await tripulaciones.createOrUpdate({
            id: pasajero.id_tripulacion,
            id_operador: idOperador
          }, t);
        }
      }

      // Creando pasajero
      let result = await createOrUpdate(pasajero, t, true);
      if (result.code === -1) {
        transaction.rollback(t);
        return res.error(new Error(result.message));
      }
      let items = await pasajeros.findAll({ id_vuelo: pasajero.id_vuelo });
      await vuelos.createOrUpdate({ id: pasajero.id_vuelo, nro_pasajeros: items.count + 1 }, t);
      transaction.commit(t);
      return res.success(result.data);
    } catch (e) {
      return res.error(e);
    }
  }

  async function createAll (data) {
    debug('Creando y asignando pasajeros al vuelo', data);

    const { pasajeros: items, idUsuario, idOperador } = data;
    let idVuelo = parseInt(data.id_vuelo);

    if (!idVuelo) { // Si no existe el idVuelo la función funciona como un servicio web
      data.id_operador = idOperador;
      let result = await Vuelo.buscar(data);
      if (result.code === -1) {
        return res.error(new Error(result.message));
      } else {
        if (result.data && result.data.id_vuelo) {
          idVuelo = parseInt(result.data.id_vuelo);
        } else {
          return res.success(result.data);
        }
      }
    }

    let validate = await validar(items, idOperador, idVuelo);
    if (validate.code === 1) {
      if (validate.data.pasajeros) {
        console.log('PASAJERO VALIDADOS', validate.data.pasajeros);
        const { pasajeros: items } = validate.data;
        // Creando transacción
        const t = await transaction.create();

        let validarSegip = false;
        const segip = await Parametro.getParam('VALIDAR_SEGIP');
        if (segip && segip.valor && segip.valor === 'SI') {
          validarSegip = true;
        }

        for (let i in items) {
          let item = items[i];
          item.id_vuelo = idVuelo;
          item._user_updated = idUsuario;
          item._user_created = idUsuario;
          item._updated_at = new Date();
          item.fecha_vencimiento_doc = item.fecha_vencimiento_doc ? transformDate(item.fecha_vencimiento_doc) : null;
          item.fecha_nacimiento = item.fecha_nacimiento ? transformDate(item.fecha_nacimiento) : null;
          item.tipo = empty(item.tipo) ? null : item.tipo;
          item.tipo_viajero = empty(item.tipo_viajero) ? null : item.tipo_viajero;
          item.tipo_tripulacion = empty(item.tipo_tripulacion) ? null : item.tipo_tripulacion;
          item.genero = empty(item.genero) ? null : item.genero;
          if (item.estado !== 'A_BORDO') {
            item.estado = item.tipo === 'TRIPULANTE' ? 'ASIGNADO' : item.estado;
          }
          console.log('PASAJERO VALIDADO', item);

          // Actualizando operador del tripulante si este no está asignado a algún operador
          if (item.id_tripulacion && item.asignar_tripulacion) {
            await tripulaciones.createOrUpdate({
              id: item.id_tripulacion,
              id_operador: idOperador
            }, t);
          }

          // Creando o actualizando pasajero
          let pasajero = await createOrUpdate(item, t, validarSegip);
          if (pasajero.code === -1) {
            return res.error(new Error(pasajero.message));
          }
        }
        transaction.commit(t);
        console.log('>Pasajeros obtenidos', await pasajeros.findAll({ id_vuelo: idVuelo }));
        // Actualizando total de pasajeros en el vuelo
        const t2 = await transaction.create();
        let total = await pasajeros.findAll({ id_vuelo: idVuelo });
        await vuelos.createOrUpdate({ id: idVuelo, nro_pasajeros: total.count }, t2);
        transaction.commit(t2);

        return res.success({ success: true });
      } else {
        return res.success(validate.data);
      }
    } else {
      return res.error(new Error('Ocurrió un error al validar los datos ' + validate.message));
    }
  }

  async function validar (pasajeros, idOperador, idVuelo) {
    let vuelo = await vuelos.findById(idVuelo);
    let errors = {};
    try {
      for (let i in pasajeros) {
        let pasajero = pasajeros[i];
        validarTipoPasajero(pasajero, errors, i);
        validarEstado(pasajero, errors, i);
        let tipo = validarTipoDocumento(pasajero, errors, i);
        let numero = validarNroDocumento(pasajero, errors, i);
        let fecha = validarFechaNacimiento(pasajero, errors, i);
        if (required(pasajero, errors, i, 'tipo')) {
          if (tipo && numero && fecha) {
            pasajero = await validarPasajero(pasajero, errors, i);
          }
          pasajero = await validarTripulante(pasajero, errors, i, idOperador, vuelo);
        }
        if (!empty(pasajero.fecha_vencimiento_doc)) {
          validarFecha(pasajero, errors, i, 'fecha_vencimiento_doc');
        }
        if (!empty(pasajero.email)) {
          validarEmail(pasajero, errors, i, 'email');
        }
        if (!empty(pasajero.genero)) {
          if (['M', 'F', 'OTRO'].indexOf(pasajero.genero) === -1) {
            createError(errors, i, 'genero', `El genero: <strong><em>${pasajero.genero}</em></strong> no es válido, solo se aceptan los valores 'M', 'F', 'OTRO'.`);
          }
        }
        if (required(pasajero, errors, i, 'nombres')) {
          if (pasajero.nombres.length > 100) {
            createError(errors, i, 'nombres', `El nombre o nombres: <strong><em>${pasajero.nombres}</em></strong> solo puede tener 100 carácteres como máximo.`);
          }
        }
        if (required(pasajero, errors, i, 'primer_apellido')) {
          if (pasajero.primer_apellido.length > 100) {
            createError(errors, i, 'primer_apellido', `El primer apellido: <strong><em>${pasajero.primer_apellido}</em></strong> solo puede tener 100 carácteres como máximo.`);
          }
        }
        if (!empty(pasajero.segundo_apellido) && pasajero.segundo_apellido.length > 100) {
          createError(errors, i, 'segundo_apellido', `El segundo apellido: <strong><em>${pasajero.segundo_apellido}</em></strong> solo puede tener 100 carácteres como máximo.`);
        }
        pasajeros[i] = pasajero;
      }
      if (Object.keys(errors).length) {
        return res.success({ errors });
      }
      return res.success({ pasajeros });
    } catch (e) {
      console.log('ERROR PASAJEROS', e);
      return res.error(e);
    }
  }

  function validarEstado (data, errors, index) {
    if (required(data, errors, index, 'estado')) {
      const estados = ['CHECKING', 'PRE_EMBARQUE', 'A_BORDO', 'VUELO_PERDIDO', 'CANCELADO', 'PAGADO', 'RESERVADO', 'ASIGNADO'];
      if (estados.indexOf(data.estado) === -1) {
        createError(errors, index, 'estado', `El estado: <strong><em>${data.estado}</em></strong> no es válido, solo se aceptan los valores ${estados.join(', ')}.`);
      }
    }
  }

  function validarTipoPasajero (data, errors, index) {
    if (['PASAJERO', 'TRIPULANTE'].indexOf(data.tipo) === -1) {
      createError(errors, index, 'tipo', `El tipo de pasajero: <strong><em>${data.tipo}</em></strong> no es válido, solo se aceptan los valores 'PASAJERO', 'TRIPULANTE'.`);
    }
  }

  async function validarPasajero (data, errors, index) {
    if (data.tipo === 'PASAJERO') {
      if (['NACIONAL', 'EXTRANJERO'].indexOf(data.tipo_viajero) === -1) {
        createError(errors, index, 'tipo_documento', `El tipo de viajero: <strong><em>${data.tipo_viajero}</em></strong> no es válido, solo se aceptan los valores 'NACIONAL', 'EXTRANJERO'.`);
      } else {
        let persona = await personas.find({
          nro_documento: data.nro_documento,
          tipo_documento: data.tipo_documento,
          fecha_nacimiento: transformDate(data.fecha_nacimiento)
        });
        if (persona) {
          data.id_persona = persona.id;
        }
      }
    }
    return data;
  }

  async function validarTripulante (data, errors, index, idOperador, vuelo) {
    if (data.tipo === 'TRIPULANTE') {
      if (validarNroLicencia(data, errors, index)) {
        if (['PILOTO', 'TRIPULANTE_DE_CABINA'].indexOf(data.tipo_tripulacion) === -1) {
          createError(errors, index, 'tipo', `El tipo de tripulación: <strong><em>${data.tipo_viajero}</em></strong> no es válido, solo se aceptan los valores 'PILOTO', 'TRIPULANTE_DE_CABINA'.`);
        } else {
          let tripulante = await tripulaciones.findByLicencia(data.nro_licencia);
          console.log('TRIPULANTE ENCONTRADO', tripulante);
          console.log('TIPO VUELO:', vuelo['itinerario.tipo_vuelo']);
          if (tripulante) {
            if (tripulante.id_operador) { // Si el tripulante ya está asignado a un operador
              if (tripulante.id_operador === idOperador) {
                data.id_tripulacion = tripulante.id;
                data.id_persona = tripulante.id_persona;

                // Comprobando si el tripulante tiene alguna observación
                let result = await Tripulacion.validar(null, null, vuelo, { tipo_vuelo: vuelo['itinerario.tipo_vuelo'] }, tripulante);
                if (result.code === 1 && result.data && result.data.observacion) {
                  data.observacion = result.data.observacion;
                }
              } else {
                createError(errors, index, 'nro_licencia', `El tripulante con Número de licencia: <strong><em>${data.nro_licencia}</em></strong> ya está asignado a otro operador.`);
              }
            } else { // El tripulante no está asignado a un operador
              data.id_tripulacion = tripulante.id;
              data.id_persona = tripulante.id_persona;
              data.asignar_tripulacion = true;

              // Comprobando si el tripulante tiene alguna observación
              let result = await Tripulacion.validar(null, null, vuelo, { tipo_vuelo: vuelo['itinerario.tipo_vuelo'] }, tripulante);
              if (result.code === 1 && result.data && result.data.observacion) {
                data.observacion = result.data.observacion;
              }
            }
          } else {
            createError(errors, index, 'nro_licencia', `El tripulante con Número de licencia: <strong><em>${data.nro_licencia}</em></strong> no está registrado en la DGAC.`);
          }
        }
      }
    }
    return data;
  }

  function validarTipoDocumento (data, errors, index) {
    if (required(data, errors, index, 'tipo_documento')) {
      if (['CI', 'PASAPORTE', 'OTRO'].indexOf(data.tipo_documento) === -1) {
        createError(errors, index, 'tipo_documento', `El tipo de documento: <strong><em>${data.tipo_documento}</em></strong> no es válido, solo se aceptan los valores 'CI', 'PASAPORTE', 'OTRO'.`);
        return false;
      }
      return true;
    }
    return false;
  }

  function validarFechaNacimiento (data, errors, index) {
    if (required(data, errors, index, 'fecha_nacimiento')) {
      return validarFecha(data, errors, index, 'fecha_nacimiento');
    }
    return false;
  }

  function validarNroDocumento (data, errors, index) {
    if (required(data, errors, index, 'nro_documento')) {
      if (data.nro_documento.length > 30) {
        createError(errors, index, 'nro_documento', `El número de documento: <strong><em>${data.nro_documento}</em></strong> solo puede tener 30 carácteres como máximo.`);
        return false;
      }
      return true;
    }
    return false;
  }

  function validarNroLicencia (data, errors, index) {
    if (required(data, errors, index, 'nro_licencia')) {
      if (data.nro_licencia.length > 30) {
        createError(errors, index, 'nro_licencia', `El número de licencia: <strong><em>${data.nro_licencia}</em></strong> solo puede tener 30 carácteres como máximo.`);
        return false;
      }
      return true;
    }
    return false;
  }

  async function update (data) {
    debug('Actualizar pasajero');

    if (!data.id) {
      return res.error(new Error(`Se necesita el ID del pasajero para actualizar el registro`));
    }

    let user;
    try {
      user = await pasajeros.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`El pasajero no pudo ser actualizado`));
    }

    return res.success(user);
  }

  async function deleteItem (id) {
    debug('Eliminando pasajero');

    // reduciendo el contador de pasajaeros en la tabla Vuelo
    try {
      let pasajero = await pasajeros.findById(id);
      let vuelo = await vuelos.findById(pasajero.id_vuelo);
      vuelo.nro_pasajeros -= 1;
      await vuelos.createOrUpdate(vuelo);
    } catch (e) {
      debug('No se pudo actualizar el contador de pasajeros en la tabal Vuelo');
    }
    let deleted;
    try {
      deleted = await pasajeros.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe el pasajero`));
    }

    if (deleted === 0) {
      return res.error(new Error(`El pasajero ya fue eliminado`));
    }

    return res.success(deleted > 0);
  }

  async function getUser (pasajero, include = true) {
    debug('Buscando pasajero por nombre de pasajero');

    let user;
    try {
      user = await pasajeros.findByUsername(pasajero, include);
    } catch (e) {
      return res.error(e);
    }

    if (!user) {
      return res.error(new Error(`pasajero ${pasajero} not found`));
    }

    return res.success(user);
  }

  return {
    findAll,
    findById,
    buscarPorNroDocumento,
    createOrUpdate,
    createAll,
    create,
    deleteItem,
    getUser,
    update
  };
}
;
