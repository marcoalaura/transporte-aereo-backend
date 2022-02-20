'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Puerta } = services;

  return {
    Query: {
      puertas: async (_, args, context) => {
        permissions(context, 'puertas:read');
        let lista = await Puerta.findAll(args, context.rol, context.id_aeropuerto);
        return removeDots(lista.data);
      },
      puerta: async (_, args, context) => {
        permissions(context, 'puertas:read');
        let item = await Puerta.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      puertaAdd: async (_, args, context) => {
        permissions(context, 'puertas:create');
        args.puerta._user_created = context.id_usuario;
        let item = await Puerta.createOrUpdate(args.puerta);
        return removeDots(item.data);
      },
      puertaEdit: async (_, args, context) => {
        permissions(context, 'puertas:update');
        args.puerta._user_updated = context.id_usuario;
        args.puerta._updated_at = new Date();
        args.puerta.id = args.id;
        let item = await Puerta.createOrUpdate(args.puerta);
        return removeDots(item.data);
      },
      puertaDelete: async (_, args, context) => {
        permissions(context, 'puertas:delete');
        let deleted = await Puerta.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
