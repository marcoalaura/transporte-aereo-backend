'use strict';

const { permissions } = require('../../../lib/auth');
const { removeDots } = require('../../../lib/util');

module.exports = function setupResolver (services) {
  const { PlanVuelo } = services;

  return {
    Query: {
      planVuelos: async (_, args, context) => {
        permissions(context, 'planVuelos:read');

        args.id_usuario = context.id_usuario;
        let lista = await PlanVuelo.findAll(args, context.rol, context.id_operador);
        return removeDots(lista.data);
      },
      planVuelo: async (_, args, context) => {
        permissions(context, 'planVuelos:read');

        let item = await PlanVuelo.findById(args.id);
        return removeDots(item.data);
      },
      planVuelosRepetitivosFormGeneral: async (_, args, context) => {
        permissions(context, 'planVuelos:create');
        let item = await PlanVuelo.planVuelosRepetitivosFormGeneral(args.id_solicitud);
        return removeDots(item.data);
      },
      planVuelosRepetitivosFormDetallado: async (_, args, context) => {
        permissions(context, 'planVuelos:create');
        let lista = await PlanVuelo.planVuelosRepetitivosFormDetallado(args.id_solicitud);
        return removeDots(lista.data);
      }
    },
    Mutation: {
      planVueloAdd: async (_, args, context) => {
        permissions(context, 'planVuelos:create');

        args.planVuelo._user_created = context.id_usuario;
        let item = await PlanVuelo.createOrUpdate(args.planVuelo);
        return removeDots(item.data);
      },
      planVueloEdit: async (_, args, context) => {
        permissions(context, 'planVuelos:update');

        args.planVuelo._user_updated = context.id_usuario;
        args.planVuelo._updated_at = new Date();
        args.planVuelo.id = args.id;
        let item = await PlanVuelo.createOrUpdate(args.planVuelo);
        return removeDots(item.data);
      },
      planVueloDelete: async (_, args, context) => {
        permissions(context, 'planVuelos:delete');

        let deleted = await PlanVuelo.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
