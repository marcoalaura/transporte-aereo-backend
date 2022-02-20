'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Aeropuerto } = services;

  return {
    Query: {
      aeropuertos: async (_, args, context) => {
        permissions(context, 'aeropuertos:read|itinerarios:read');

        let lista = await Aeropuerto.findAll(args, context.id_rol, context.id_entidad);
        return removeDots(lista.data);
      },
      aeropuerto: async (_, args, context) => {
        permissions(context, 'aeropuertos:read');

        let item = await Aeropuerto.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      aeropuertoAdd: async (_, args, context) => {
        permissions(context, 'aeropuertos:create');

        args.aeropuerto._user_created = context.id_usuario;
        let item = await Aeropuerto.createOrUpdate(args.aeropuerto);
        return removeDots(item.data);
      },
      aeropuertoEdit: async (_, args, context) => {
        permissions(context, 'aeropuertos:update');

        args.aeropuerto._user_updated = context.id_usuario;
        args.aeropuerto._updated_at = new Date();
        args.aeropuerto.id = args.id;
        let item = await Aeropuerto.createOrUpdate(args.aeropuerto);
        return removeDots(item.data);
      },
      aeropuertoDelete: async (_, args, context) => {
        permissions(context, 'aeropuertos:delete');

        let deleted = await Aeropuerto.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
