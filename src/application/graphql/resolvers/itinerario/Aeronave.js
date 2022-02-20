'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Aeronave } = services;

  return {
    Query: {
      aeronaves: async (_, args, context) => {
        permissions(context, 'aeronaves:read|solicitudes:read');

        let lista = await Aeronave.findAll(args, context.rol, context.id_operador);
        return removeDots(lista.data);
      },
      aeronave: async (_, args, context) => {
        permissions(context, 'aeronaves:read');

        let item = await Aeronave.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      aeronaveAdd: async (_, args, context) => {
        permissions(context, 'aeronaves:create');

        args.aeronave._user_created = context.id_usuario;
        let item = await Aeronave.createOrUpdate(args.aeronave);
        return removeDots(item.data);
      },
      aeronaveEdit: async (_, args, context) => {
        permissions(context, 'aeronaves:update');

        args.aeronave._user_updated = context.id_usuario;
        args.aeronave._updated_at = new Date();
        args.aeronave.id = args.id;
        let item = await Aeronave.createOrUpdate(args.aeronave);
        return removeDots(item.data);
      },
      aeronaveDelete: async (_, args, context) => {
        permissions(context, 'aeronaves:delete');

        let deleted = await Aeronave.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
