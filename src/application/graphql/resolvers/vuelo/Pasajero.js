'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Pasajero } = services;

  return {
    Query: {
      pasajeros: async (_, args, context) => {
        permissions(context, 'pasajeros:read');
        let lista = await Pasajero.findAll(args, context.id_rol, context.id_entidad);
        return removeDots(lista.data);
      },
      pasajero: async (_, args, context) => {
        permissions(context, 'pasajeros:read');
        let item = await Pasajero.findById(args.id);
        return removeDots(item.data);
      },
      buscarPasajeroPorNroDocumento: async (_, args, context) => {
        permissions(context, 'pasajeros:read');
        let lista = await Pasajero.buscarPorNroDocumento(args);
        return removeDots(lista.data);
      }
    },
    Mutation: {
      pasajeroAdd: async (_, args, context) => {
        permissions(context, 'pasajeros:create');

        args.pasajero._user_created = context.id_usuario;
        let item = await Pasajero.create(args.pasajero, context.id_operador);
        return removeDots(item.data);
      },
      pasajeroEdit: async (_, args, context) => {
        permissions(context, 'pasajeros:update');

        args.pasajero._user_updated = context.id_usuario;
        args.pasajero._updated_at = new Date();
        args.pasajero.id = args.id;
        let item = await Pasajero.createOrUpdate(args.pasajero);
        return removeDots(item.data);
      },
      pasajeroDelete: async (_, args, context) => {
        permissions(context, 'pasajeros:delete');

        let deleted = await Pasajero.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
