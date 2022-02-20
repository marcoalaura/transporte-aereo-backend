'use strict';

const { permissions } = require('../../../lib/auth');
const { removeDots } = require('../../../lib/util');

module.exports = function setupResolver (services) {
  const { ItinerarioHistorial } = services;

  return {
    Query: {
      registrosHistorialSolicitudItinerario: async (_, args, context) => {
        permissions(context, 'solicitudes:read');

        let lista = await ItinerarioHistorial.findAll(args);
        return removeDots(lista.data);
      },
      registroHistorialSolicitudItinerario: async (_, args, context) => {
        permissions(context, 'solicitudes:read');

        let item = await ItinerarioHistorial.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      historialSolicitudItinerarioAdd: async (_, args, context) => {
        permissions(context, 'solicitudes:read');

        args.verificacionSolicitudItinerario._user_created = context.id_usuario;
        args.verificacionSolicitudItinerario.id_usuario = context.id_usuario;
        let item = await ItinerarioHistorial.createOrUpdate(args.verificacionSolicitudItinerario);
        return removeDots(item.data);
      },
      historialSolicitudItinerarioDelete: async (_, args, context) => {
        permissions(context, 'solicitudes:read');

        let deleted = await ItinerarioHistorial.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
