'use strict';
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Carga } = services;

  return {
    Query: {
      cargas: async (_, args, context) => {
        permissions(context, 'cargas:read');

        let items = await Carga.findAll(args, context.id_carga);
        return items.data;
      },
      carga: async (_, args, context) => {
        permissions(context, 'cargas:read');

        let items = await Carga.findById(args.id);
        return items.data;
      }
    },
    Mutation: {
      cargaAdd: async (_, args, context) => {
        permissions(context, 'cargas:create');

        args.carga._user_created = context.id_usuario;
        let item = await Carga.createOrUpdate(args.carga);
        return item.data;
      },
      cargaEdit: async (_, args, context) => {
        permissions(context, 'cargas:update');

        args.carga._user_updated = context.id_usuario;
        args.carga._updated_at = new Date();
        args.carga.id = args.id;
        let item = await Carga.createOrUpdate(args.carga);
        return item.data;
      },
      cargaDelete: async (_, args, context) => {
        permissions(context, 'cargas:delete');

        let deleted = await Carga.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
