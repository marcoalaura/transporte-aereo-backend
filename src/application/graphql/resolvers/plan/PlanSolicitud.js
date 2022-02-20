'use strict';

const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { PlanSolicitud } = services;

  return {
    Query: {
      planSolicitudes: async (_, args, context) => {
        permissions(context, 'planSolicitudes:read');

        args.id_usuario = context.id_usuario;
        let lista = await PlanSolicitud.findAll(args, context.rol);
        return removeDots(lista.data);
      },
      planSolicitud: async (_, args, context) => {
        permissions(context, 'planSolicitudes:read');

        let item = await PlanSolicitud.findById(args.id);
        return removeDots(item.data);
      },
      planSolicitudItinerario: async (_, args, context) => {
        permissions(context, 'planSolicitudes:read');

        let item = await PlanSolicitud.findByIdItinerario(args.id);
        return removeDots(item.data);
      },
      planSolicitudItinerarioLatest: async (_, args, context) => {
        permissions(context, 'planSolicitudes:read');

        let item = await PlanSolicitud.findLatestByIdItinerario(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      planSolicitudAdd: async (_, args, context) => {
        permissions(context, 'planSolicitudes:create');

        args.planSolicitud._user_created = context.id_usuario;
        let item = await PlanSolicitud.createOrUpdate(args.planSolicitud);
        return removeDots(item.data);
      },
      planSolicitudEdit: async (_, args, context) => {
        permissions(context, 'planSolicitudes:update');

        args.planSolicitud._user_updated = context.id_usuario;
        args.planSolicitud._updated_at = new Date();
        args.planSolicitud.id = args.id;
        let item = await PlanSolicitud.createOrUpdate(args.planSolicitud);
        return removeDots(item.data);
      },
      planSolicitudDelete: async (_, args, context) => {
        permissions(context, 'planSolicitudes:delete');

        let deleted = await PlanSolicitud.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
