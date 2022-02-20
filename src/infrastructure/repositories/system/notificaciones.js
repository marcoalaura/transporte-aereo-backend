'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');
const { text, config } = require('../../../common');
const Params = require('app-params');
const Iop = require('app-iop');
const ClienteNotificaciones = require('app-notificaciones');

module.exports = function notificacionesRepository (models, Sequelize) {
  const { notificaciones, usuarios } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}, idEntidadRemitente, idEntidadReceptora) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: ['nombre', 'email', 'id_entidad'],
        model: usuarios,
        as: 'usuario_remitente'
      },
      {
        attributes: ['nombre', 'email', 'id_entidad'],
        model: usuarios,
        as: 'usuario_receptor'
      }
    ];

    if (params.id_remitente) {
      query.where.id_remitente = params.id_remitente;
    }

    if (params.id_receptor) {
      query.where.id_receptor = params.id_receptor;
    }

    if (params.tipo) {
      query.where.tipo = params.tipo;
    }
    
    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.email_receptor) {
      query.where.email_receptor = params.email_receptor;
    }

    if (params.visto) {
      query.where.visto = params.visto;
    }
    
    if (idEntidadRemitente) {
      query.where['$usuario_remitente.id_entidad$'] = idEntidadRemitente;
    }

    if (idEntidadReceptora) {
      query.where['$usuario_receptor.id_entidad$'] = idEntidadReceptora;
    }

    return usuarios.findAndCountAll(query);
  }

  function findById (id) {
    return notificaciones.findById(id, {
      include: [
        {
          attributes: ['nombre', 'email', 'id_entidad'],
          model: usuarios,
          as: 'usuario_remitente'
        },
        {
          attributes: ['nombre', 'email', 'id_entidad'],
          model: usuarios,
          as: 'usuario_receptor'
        }
      ],
      raw: true
    });
  }

  async function createOrUpdate (notificacion, t) {
    const cond = {
      where: {
        id: notificacion.id
      }
    };

    const item = await notificaciones.findOne(cond);

    if (item) {
      let updated;
      try {
        if (notificacion.contrasena) {
          notificacion.contrasena = text.encrypt(notificacion.contrasena);
        }
        if (t) {
          cond.transaction = t;
        }
        updated = await notificaciones.update(notificacion, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? usuarios.findOne(cond) : item;
    }

    let result;
    try {
      notificaciones.contrasena = text.encrypt(notificacion.contrasena);
      result = await usuarios.create(notificacion, t ? { transaction: t } : {});
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function crearNotificacion (registrarEnBd = true, idRemitente = null, idReceptor = null, tipo = null, titulo = null, mensaje = null, emailReceptor = null) {
    /**
     * @param {boolean} registrarEnBd: `true' o `false' segun se quiera registrar en BD.
     * @param {int} idRemitente: Id del usuario remitente (solo necesario si se quiere registrar en la BD)
     * @param {int} idReceptor: Id del usuario receptor (solo necesario si se quiere registrar en la BD)
     * @param {string} tipo: Puede ser 'INTERNO', 'CIUDADANIA', 'CORREO'
     * @param {string} titulo: Si se envia email se usa como asunto
     * @param {string} mensaje: Si se envia email se usa como cuerpo
     * @param {string} emailReceptor: Si no es null se envia un email a este distinatario
     * @return {object} { code: 0 , // si se proceso sin errores, -1 si hay errores
     *    error: "Mensaje con el error"  // solo cuando se genera un error
     * }
     */
    const Parametro = await Params(config.db);
    const iop = await Iop(config.db);
    const notificar = await Parametro.getParam('ENVIAR_NOTIFICACIONES_ELECTRONICAS');

    let enviado = true;
    let error = '';
    if (notificar.valor !== '0') {
      try {
        // enviando notificacion electronica por correo
        let pne = await iop.findByCode('PNE-01');
        let cli = new ClienteNotificaciones(pne.token, pne.url);
        let correo = await cli.correo({
          para: [emailReceptor], // enviando como array 
          asunto: titulo,
          contenido: mensaje
        });
        console.log('Resultado de enviar el correo::::::::', correo);
      } catch (e) {
        console.log(`::::::: Error al notificar: ${e}`);
        error = e;
        enviado = false;
      }
    } else {
      enviado = false;
    }
    if (registrarEnBd) {
      if (!idRemitente || !idReceptor || !titulo || !mensaje) {
        return {
          code: -1,
          error: `Hay un campo obligatorio null: idRemitente: ${idRemitente}, idReceptor: ${idReceptor}, tipo: ${tipo}, titulo: ${titulo}, mensaje: ${mensaje}`
        };
      }

      // por cada email que debe recibir el mensaje se crea un registro en la BD
      try {
        let notificacion = {
          id_remitente: parseInt(idRemitente),
          id_receptor: parseInt(idReceptor),
          tipo: tipo,
          titulo: titulo,
          mensaje: mensaje,
          email_receptor: emailReceptor,
          estado: enviado === true ? 'ENVIADO' : 'NO_ENVIADO',
          _user_created: parseInt(idRemitente)
        };
        await notificaciones.create(notificacion);
      } catch (e) {
        console.log(`Error al crear registro de notificaciones: ${e}`);
        return {
          code: -1,
          error: `Error al crear registro de notificaciones en BD: ${e}`
        };
      }
    }
    if (enviado === false) {
      return { code: -1, mensaje: error + '' };
    }
    return { code: 0 };
  };
  
  
  async function deleteItem (id) {
    return deleteItemModel(id, notificaciones);
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    crearNotificacion,
    deleteItem
  };
};
