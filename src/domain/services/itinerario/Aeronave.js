'Use strict';

const debug = require('debug')('app:service:aeronave');
const moment = require('moment');

module.exports = function aeronaveService (repositories, res) {
  const { aeronaves, dgacAeronaves, dgacAeronavesHistorial, Mopsv } = repositories;

  async function findAll (params = {}, rol, idOperador) {
    debug('Lista de aeronaves|filtros');

    let lista;
    try {
      switch (rol) {
        case 'OPERADOR_AVION_ADMIN': case 'OPERADOR_AVION':
          params.id_operador = idOperador;
          break;
      }
      lista = await aeronaves.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error(`Error al obtener la lista de aeronaves`));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando aeronave por ID');

    let aeronave;
    try {
      aeronave = await aeronaves.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!aeronave) {
      return res.error(new Error(`Aeronave ${id} not found`));
    }

    return res.success(aeronave);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar aeronave');

    let aeronave;
    try {
      aeronave = await aeronaves.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!aeronave) {
      return res.error(new Error(`La aeronave no pudo ser creado`));
    }

    return res.success(aeronave);
  }

  async function createAll (matriculas, idOperador, idUsuario) {
    debug('service::Creando Aeronaves');
    let result;
    try {
      let listaAeronaves = [];
      for (let i in matriculas) {
        debug('OBTENIENDO MATRICULA:: ', matriculas[i]);
        let result = await dgacAeronaves.findByMatricula(matriculas[i]);
        debug('Nave obtenida:: ', result);
        let aeronave = {};
        aeronave.matricula = result.nroMatricula;
        aeronave.serie = result.nroSerie;
        aeronave.marca = result.marca;
        aeronave.modelo = result.modelo;
        aeronave.modelo_generico = result.modeloGenerico;
        aeronave.fecha_inscripcion = moment(result.fechaInscripcion, 'DD/MM/YYYY').format('YYYY-MM-DD');
        aeronave.propietario = result.propietario;
        aeronave.fecha_actualizacion = result.fechaActualizacion;
        aeronave.estado_dgac = result.estado;
        aeronave.capacidad_maxima_asientos = 0;
        aeronave.capacidad_carga = 0;
        aeronave.id_operador = idOperador;
        aeronave._user_created = idUsuario;
        debug('PUSHEANDO AERONAVE:: ', aeronave);
        listaAeronaves.push(aeronave);
      }
      result = await aeronaves.createAll(listaAeronaves);
    } catch (e) {
      return res.error(e);
    }

    if (!result) {
      return res.error(new Error('No se pudo guardar las aeronaves'));
    }

    return res.success(result);
  }

  async function sincronizar (idUsuario) {
    debug('Sincronizando aeronaves de DGAC');
    let aeronaves;
    try {
      // Obteniendo el servicio
      let items = await Mopsv.dgac.aeronaves();
      // let count = items.length;

      if (!Array.isArray(items)) {
        return res.error(new Error('Error al obtener la lista aeronaves desde la Plataforma del Mopsv'));
      }

      aeronaves = await dgacAeronaves.findAll();

      if (!aeronaves) {
        return res.error(new Error(`Error al obtener la lista de aeronaves para sincronizar`));
      }

      // Registrando todas las aeronaves de DGAC si no se tiene registros en la tabla dgacAeronaves
      if (aeronaves.count !== undefined && aeronaves.count === 0) {
        debug('Sincronización - Registrando todas las aeronaves de DGAC');
        let nuevos = [];
        items.map(item => {
          item._user_created = idUsuario;
          nuevos.push(item.nroMatricula);
          return item;
        });

        await dgacAeronaves.createAll(items);

        return res.success({ nuevos, total: items.length });
      } else { // Actualizando registros de tabla dgacAeronaves
        debug('Sincronización - Actualizando las aeronaves de DGAC en dgacAeronaves');
        let nuevas = {};
        items.map(item => {
          item._user_created = idUsuario;
          nuevas[item.nroMatricula] = item;
        });

        let antiguas = {};
        aeronaves.rows.map(item => (antiguas[item.nroMatricula] = item));
        let matriculas = [];
        for (let matricula in nuevas) {
          let item = nuevas[matricula];
          if (antiguas[matricula]) {
            item.id = antiguas[matricula].id;
            // verificando cambios en registro local vs servicios sincronizacion DGAC.
            let cambios = verificarCambioDgacAeronave(antiguas[matricula], item);
            if (Object.keys(cambios).length !== 0) {
              debug(`Cambio detectado en dgacAeronave ${matricula}`);
              await registrarCambioDgacAeronaves(cambios, idUsuario);
            }
          }
          debug(`Sincronización - ${item.id ? 'Actualizando ID:' + item.id : 'Creando'} aeronave DGAC`);
          await dgacAeronaves.createOrUpdate(item);
          if (!item.id) {
            matriculas.push(matricula);
          }
        }
        aeronaves = await dgacAeronaves.findAll();

        return res.success({ nuevos: matriculas, total: aeronaves.count });
      }
    } catch (e) {
      return res.error(e);
    }
  }

  function verificarCambioDgacAeronave (local, dgac) {
    /* Compara ambos objetos y devuelve los campos que han cambiado */
    let cambios = {};
    if (local.nroMatricula !== dgac.nroMatricula) {
      cambios.nroMatricula = { anterior: local.nroMatricula, actual: dgac.nroMatricula };
    }
    if (local.nroSerie !== dgac.nroSerie) {
      cambios.nroSerie = { anterior: local.nroSerie, actual: dgac.nroSerie };
    }
    if (local.marca !== dgac.marca) {
      cambios.marca = { anterior: local.marca, actual: dgac.marca };
    }
    if (local.modelo !== dgac.modelo) {
      cambios.modelo = { anterior: local.modelo, actual: dgac.modelo };
    }
    if (local.modeloGenerico !== dgac.modeloGenerico) {
      cambios.modeloGenerico = { anterior: local.modeloGenerico, actual: dgac.modeloGenerico };
    }
    if (local.fechaInscripcion !== dgac.fechaInscripcion) {
      cambios.fechaInscripcion = { anterior: local.fechaInscripcion, actual: dgac.fechaInscripcion };
    }
    if (local.propietario !== dgac.propietario) {
      cambios.propietario = { anterior: local.propietario, actual: dgac.propietario };
    }
    if (local.estado !== dgac.estado) {
      cambios.estado = { anterior: local.estado, actual: dgac.estado };
    }
    // if (local.observaciones !== dgac.observaciones) {
    //   cambios.observaciones = { anterior: local.observaciones, actual: dgac.observaciones };
    // }
    // }
    // if (local.fechaActulizacion !== dgac.fechaActulizacion) {
    //   cambios.fechaActulizacion = { anterior: local.fechaActulizacion, actual: dgac.fechaActulizacion };
    // }
    if (Object.keys(cambios).length > 0) {
      cambios['id_dgac_aeronave'] = local.id;
    }
    return cambios;
  }

  async function registrarCambioDgacAeronaves (cambios, idUsuario) {
    Object.keys(cambios).forEach(async (campo) => {
      let cambio = cambios[campo];
      try {
        if (campo !== 'id_dgac_aeronave') {
          await dgacAeronavesHistorial.createOrUpdate({
            id_dgac_aeronave: cambios['id_dgac_aeronave'],
            campo: campo,
            valor_anterior: cambio.anterior,
            valor_actual: cambio.actual,
            id_usuario: idUsuario,
            _user_created: idUsuario
          });
        }
      } catch (e) {
        debug(`No se ha podido registrar dgacAeronaveHistorial ${cambio['id_dgac_aeronave']}: ${e}`);
      }
    });
  }
  async function deleteItem (id) {
    debug('Eliminando aeronave');

    let deleted;
    try {
      deleted = await aeronaves.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error(`No existe la aeronave`));
    }

    if (deleted === 0) {
      return res.warning(new Error(`La aeronave ya fue eliminado`));
    }

    return res.success(deleted > 0);
  }

  return {
    findAll,
    findById,
    sincronizar,
    createOrUpdate,
    deleteItem,
    createAll
  };
};
