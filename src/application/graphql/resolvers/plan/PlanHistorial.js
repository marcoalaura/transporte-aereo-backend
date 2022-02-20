'use strict';

const { permissions } = require('../../../lib/auth');
const { removeDots } = require('../../../lib/util');

module.exports = function setupResolver (services) {
  const { PlanHistorial } = services;

  return {
    Query: {
      registrosHistorialRPL: async (_, args, context) => {
        permissions(context, 'planSolicitudes:read');
        console.log('\n\n', args);
        let lista = await PlanHistorial.findAll(args);
        return removeDots(lista.data);
      },
      registroHistorialRPL: async (_, args, context) => {
        permissions(context, 'planSolicitudes:read');

        let item = await PlanHistorial.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      historialRPLAdd: async (_, args, context) => {
        permissions(context, 'planSolicitudes:read');

        args.verificacionRPL._user_created = context.id_usuario;
        args.verificacionRPL.id_usuario = context.id_usuario;
        let item = await PlanHistorial.createOrUpdate(args.verificacionRPL);
        return removeDots(item.data);
      },
      historialRPLDelete: async (_, args, context) => {
        permissions(context, 'planSolicitudes:read');

        let deleted = await PlanHistorial.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
