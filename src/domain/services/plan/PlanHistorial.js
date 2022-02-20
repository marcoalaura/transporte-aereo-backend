'use strict';

const debug = require('debug')('app:service:planHistorial');

module.exports = function PlanHistorialService (repositories, res) {
  const { planHistorial } = repositories;

  async function findAll (params = {}) {
    debug('Lista de registros en el historial de planes de vuelo repetitivos');

    let lista;
    try {
      lista = await planHistorial.findAll(params);
    } catch (e) {
      return res.error(e);
    }

    if (!lista) {
      return res.error(new Error('Error al obtener la lista de registros en historial RPL'));
    }

    return res.success(lista);
  }

  async function findById (id) {
    debug('Buscando la historial RPL por ID');

    let historial;
    try {
      historial = await planHistorial.findById(id);
    } catch (e) {
      return res.error(e);
    }

    if (!historial) {
      return res.error(new Error(`Plan Historial ${id} no encontrada`));
    }

    return res.success(planHistorial);
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar historial RPL');
    let historial;
    try {
      historial = await planHistorial.createOrUpdate(data);
    } catch (e) {
      return res.error(e);
    }

    if (!historial) {
      return res.error(new Error('El planHistorial RPL no pudo ser creado'));
    }

    return res.success(planHistorial);
  }

  async function deleteItem (id) {
    debug('Eliminando planHistorial RPL');

    let deleted;
    try {
      deleted = await planHistorial.deleteItem(id);
    } catch (e) {
      return res.error(e);
    }

    if (deleted === -1) {
      return res.error(new Error('No existe el historial RPL'));
    }
    if (deleted === 0) {
      return res.error(new Error('No existe el historial RPL'));
    }

    return res.success(deleted > 0);
  }

  async function cumpleFlujoAprobacion (idSolicitud, accionFutura, entidadSigla) {
    /* consulta el historial registrado y la `accionFutura' que se quiere tomar, devuelve
     true en caso de que se cumpla las condiciones para terminar el flujo de aprobacion RPL */
    const params = {
      id_solicitud: parseInt(idSolicitud),
      order: '-fecha',
      limit: 1
    };
    try {
      let items = await planHistorial.findAll(params);
      if (items.rows[0]['entidad.sigla'] === 'FELCN' && items.rows[0].accion === 'APROBADO' && accionFutura === 'APROBAR' && entidadSigla === 'AASANA') {
        return true;
      }
      return false;
    } catch (e) {
      return res.error(new Error(`No se pudo realizar la consulta historial RPL: ${e}`));
    }
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem,
    cumpleFlujoAprobacion
  };
};
