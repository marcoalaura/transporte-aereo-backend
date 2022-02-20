'use strict';

const debug = require('debug')('app:service:planVueloNoRegular');

module.exports = function PlanVueloNoRegularService (repositories, res) {
  const { planVueloNoRegulares, aeropuertos } = repositories;

  async function findAll (params = {}) {
    debug('Lista de planes de vuelos no regulares');

    let lista;
    try {
      lista = await planVueloNoRegulares.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error('Error al obtener la lista de planes de vuelo no regulares'));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando el plan de vuelo no regular por ID');

    let planVueloNoRegular;
    try {
      planVueloNoRegular = await planVueloNoRegulares.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!planVueloNoRegular) {
      return res.error(new Error('Plan de vuelo no regular no encontrado'));
    }

    return res.success(planVueloNoRegular);
  }

  async function findByCodigoPlanVuelo (codplanvuelo) {
    debug(`Buscando vuelo por codigo de plan de vuelo`);

    let item;
    try {
      let items = await findAll({ cod_plan_vuelo: codplanvuelo });
      if (items.data.count === 0) {
        debug(`Plan de vuelo regular con codigo ${codplanvuelo} no encontrado`);
        return null;
      }
      item = items.data.rows[0];
      return res.success(item);
    } catch (e) {
      return res.error(new Error(`Plan de vuelo regular con codigo ${codplanvuelo} no encontrado: ${e}`));
    }
  }

  async function listaPendientesAprobacion (planVueloNoRegular) {
    /*
     Retorna una lista de con los id pendientes del FPL buscando por el aeropuerto de salida, en formato:
     [{ id: item.id, 
        icao: item.codigo_icao, 
        iata: item.codigo_iata,
        nombre: item.nombre 
      }, ...
     ];
     - Si el FPL no esta registrado en la BD retorna []
     */
    debug(`Obteniendo la lista de pendientes de aprobacion del plan FPL`);
    // analizando el aeropuerto de salida
    let item;
    let icao = '' + planVueloNoRegular.codaerodromo.sigla;
    try {
      item = await aeropuertos.findByIcao(icao);
      if (!item) {
        // item = await aeropuertos.findByIata(planVueloNoRegular.codaerodromo.sigla);
        // if (!item) {
        //   debug(`No se ha podido encontrar aeropuerto con codigo ${planVueloNoRegular.codaerodromo.sigla}`);
        // return [];
        //}
        debug(`No se ha podido encontrar aeropuerto con codigo oaci ${icao}`);
        return [];
      }
    } catch (e) {
      debug(`Error consultando aeropuertos con codigo oaci ${planVueloNoRegular.codaerodromo.sigla}: ${e}`);
      return [];
    }
    // para FPLs solo se tiene un aeropuerto de salida por lo que la lista es siempre de un elemento
    return [{ id: item.id, icao: item.codigo_icao, iata: item.codigo_iata, nombre: item.nombre }];
  }

  async function usuarioPuedeAprobarFpl (user, listaPendientesAprobacion) {
    /* Comprueba si el usuario dado puede aprobar el FPL */
    for (let i = 0; i < listaPendientesAprobacion.length; i++) {
      let item = listaPendientesAprobacion[i];
      if (user.id_aeropuerto === item.id && user['rol.nombre'] === 'FELCN') {
        return true;
      }
    }
    return false;
  }
  
  async function createOrUpdate (data) {
    debug('Creando o actualizando plan de vuelo no regular');

    let planVueloNoRegular;
    try {
      planVueloNoRegular = await planVueloNoRegulares.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!planVueloNoRegular) {
      return res.error(new Error('El plan de vuelo no regular no pudo ser creado o actualizado'));
    }

    return res.success(planVueloNoRegular);
  }

  async function actualizarEstado (codPlanVuelo, estado, idUsuario) {
    let planVueloNoRegular;
    try {
      let items = await findAll({ cod_plan_vuelo: codPlanVuelo });
      if (items.data.count === 0) {
        return null;
      }
      planVueloNoRegular = items.data.rows[0];
    } catch (e) {
      debug(`No se pudo encontrar el plan de vuelo ${codPlanVuelo}: ${e}`);
      return null;
    }

    let result;
    try {
      planVueloNoRegular.estado = estado;
      result = await planVueloNoRegulares.createOrUpdate(planVueloNoRegular);
      if (!result) {
        debug(`No se pudo actualizar el plan de vuelo ${planVueloNoRegular} a estado ${estado}`);
        return null;
      }
    } catch (e) {
      debug(`No se pudo actualizar el plan de vuelo ${codPlanVuelo} - ${planVueloNoRegular}: ${e}`);
      return null;
    }
    return res.success(result);
  }

  async function deleteItem (id) {
    debug('Eliminando plan de vuelo regular');
    let deleted;

    try {
      deleted = await planVueloNoRegulares.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error('No existe el plan de vuelo no regular'));
    }

    if (deleted === 0) {
      return res.error(new Error('No existe el plan de vuelo no regular'));
    }

    return res.success(deleted > 0);
  }

  return {
    findAll,
    findById,
    findByCodigoPlanVuelo,
    createOrUpdate,
    actualizarEstado,
    listaPendientesAprobacion,
    usuarioPuedeAprobarFpl,
    deleteItem
  };
};
