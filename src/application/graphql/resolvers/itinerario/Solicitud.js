'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Solicitud } = services;

  return {
    Query: {
      solicitudes: async (_, args, context) => {
        permissions(context, 'solicitudes:read');

        let lista = await Solicitud.findAll(args, context.rol, context.id_operador);
        return removeDots(lista.data);
      },
      solicitudesAll: async (_, args, context) => {
        let lista = await Solicitud.findAll(args, context.rol, context.id_operador);
        return removeDots(lista.data);
      },
      solicitud: async (_, args, context) => {
        permissions(context, 'solicitudes:read');

        let item = await Solicitud.findById(args.id, context.rol, context.id_operador);
        return removeDots(item.data);
      }
    },
    Mutation: {
      solicitudAdd: async (_, args, context) => {
        permissions(context, 'solicitudes:create');

        console.log('CONVERTIDO', args);

        args.solicitud._user_created = context.id_usuario;
        let item = await Solicitud.createOrUpdate(args.solicitud);
        return removeDots(item.data);
      },
      solicitudEdit: async (_, args, context) => {
        permissions(context, 'solicitudes:update');

        args.solicitud._user_updated = context.id_usuario;
        args.solicitud._updated_at = new Date();
        args.solicitud.id = args.id;
        let item = await Solicitud.createOrUpdate(args.solicitud);
        return removeDots(item.data);
      },
      solicitudDelete: async (_, args, context) => {
        permissions(context, 'solicitudes:delete');

        let deleted = await Solicitud.deleteItem(args.id);
        return { deleted: deleted.data };
      },
      aprobarItinerarios: async (_, args, context) => {
        permissions(context, 'solicitudes:update');
        args.id_usuario = context.id_usuario;
        let ids = await Solicitud.aprobarItinerarios(args.id_solicitud, args.id_usuario, args.ids_itinerarios);
        return removeDots(ids.data);
      }
    }
  };
};
