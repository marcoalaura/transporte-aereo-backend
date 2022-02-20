'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Tripulacion } = services;

  return {
    Query: {
      tripulaciones: async (_, args, context) => {
        permissions(context, 'tripulaciones:read');

        let lista = await Tripulacion.findAll(args, context.rol, context.id_operador);
        return removeDots(lista.data);
      },
      tripulacion: async (_, args, context) => {
        permissions(context, 'tripulaciones:read');

        let item = await Tripulacion.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      tripulacionAdd: async (_, args, context) => {
        permissions(context, 'tripulaciones:create');

        args.tripulacion._user_created = context.id_usuario;
        let item = await Tripulacion.createOrUpdate(args.tripulacion, context.id_usuario);
        return removeDots(item.data);
      },
      tripulacionEdit: async (_, args, context) => {
        permissions(context, 'tripulaciones:update');

        args.tripulacion._user_updated = context.id_usuario;
        args.tripulacion._updated_at = new Date();
        args.tripulacion.id = args.id;
        let item = await Tripulacion.createOrUpdate(args.tripulacion, context.id_usuario);
        return removeDots(item.data);
      },
      tripulacionUnassign: async (_, args, context) => {
        let item = await Tripulacion.unassign(args.id);
        return item.data;
      },
      tripulacionUpdate: async (_, args, context) => {
        permissions(context, 'tripulaciones:update');

        args.tripulacion._user_updated = context.id_usuario;
        args.tripulacion._updated_at = new Date();
        args.tripulacion.id = args.id;
        let item = await Tripulacion.update(args.tripulacion, context.id_usuario);
        return removeDots(item.data);
      },
      tripulacionDelete: async (_, args, context) => {
        permissions(context, 'tripulaciones:delete');

        let deleted = await Tripulacion.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
