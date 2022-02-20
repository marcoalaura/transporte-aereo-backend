'use strict';
// const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { AeropuertoSalida } = services;

  return {
    Query: {
      aeropuertoSalidas: async (_, args, context) => {
        permissions(context, 'planVuelos:read');

        let lista = await AeropuertoSalida.findAll(args);
        return lista.data;
      },
      aeropuertoSalida: async (_, args, context) => {
        permissions(context, 'planVuelos:read');

        let item = await AeropuertoSalida.findById(args.id);
        return item.data;
      }
    },
    Mutation: {
      aeropuertoSalidaAdd: async (_, args, context) => {
        permissions(context, 'planVuelos:create');

        args.aeropuertoSalida._user_created = context.id_usuario;
        let item = await AeropuertoSalida.createorUpdate(args.aeropuertoSalida);
        return item.data;
      },
      aeropuertoSalidaEdit: async (_, args, context) => {
        permissions(context, 'planVuelos:update');

        args.aeropuertoSalida._user_updated = context.id_usuario;
        args.aeropuertoSalida._updated_at = new Date();
        args.aeropuertoSalida.id = args.id;
        let item = await AeropuertoSalida.createorUpdate(args.aeropuertoSalida);
        return item.data;
      },
      aeropuertoSalidaDelete: async (_, args, context) => {
        permissions(context, 'planVuelos:delete');

        let deleted = await AeropuertoSalida.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
