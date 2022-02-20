'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Itinerario } = services;

  return {
    Query: {
      itinerarios: async (_, args, context) => {
        permissions(context, 'itinerarios:read');
        let lista = await Itinerario.findAll(args, context.id_rol, context.id_entidad);
        return removeDots(lista.data);
      },
      itinerario: async (_, args, context) => {
        permissions(context, 'itinerarios:read');

        let item = await Itinerario.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      itinerarioAdd: async (_, args, context) => {
        permissions(context, 'itinerarios:create');
        args.itinerario._user_created = context.id_usuario;
        let item = await Itinerario.createOrUpdate(args.itinerario);
        return removeDots(item.data);
      },
      itinerarioEdit: async (_, args, context) => {
        permissions(context, 'itinerarios:update');
        args.itinerario._user_updated = context.id_usuario;
        args.itinerario._updated_at = new Date();
        args.itinerario.id = args.id;
        let item = await Itinerario.createOrUpdate(args.itinerario);
        return removeDots(item.data);
      },
      itinerarioDelete: async (_, args, context) => {
        permissions(context, 'itinerarios:delete');
        let deleted = await Itinerario.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
