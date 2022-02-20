'use strict';
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Equipaje } = services;

  return {
    Query: {
      equipajes: async (_, args, context) => {
        permissions(context, 'equipajes:read');

        let items = await Equipaje.findAll(args, context.id_equipaje);
        return items.data;
      },
      equipaje: async (_, args, context) => {
        permissions(context, 'equipajes:read');

        let items = await Equipaje.findById(args.id);
        return items.data;
      }
    },
    Mutation: {
      equipajeAdd: async (_, args, context) => {
        permissions(context, 'equipajes:create');

        args.equipaje._user_created = context.id_usuario;
        let item = await Equipaje.createOrUpdate(args.equipaje);
        return item.data;
      },
      equipajeEdit: async (_, args, context) => {
        permissions(context, 'equipajes:update');

        args.equipaje._user_updated = context.id_usuario;
        args.equipaje._updated_at = new Date();
        args.equipaje.id = args.id;
        let item = await Equipaje.createOrUpdate(args.equipaje);
        return item.data;
      },
      equipajeDelete: async (_, args, context) => {
        permissions(context, 'equipajes:delete');

        let deleted = await Equipaje.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
