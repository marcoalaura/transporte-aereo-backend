'use strict';

const { permissions } = require('../../../lib/auth');
const { removeDots } = require('../../../lib/util');

module.exports = function setupResolver (services) {
  const { Conexion } = services;

  return {
    Query: {
      conexiones: async (_, args, context) => {
        permissions(context, 'itinerarios:read');

        let lista = await Conexion.findAll(args);
        return removeDots(lista.data);
      },
      conexion: async (_, args, context) => {
        permissions(context, 'itinerarios:read');

        let item = await Conexion.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      conexionAdd: async (_, args, context) => {
        permissions(context, 'itinerarios:read');

        args.conexion._user_created = context.id_usuario;
        let item = await Conexion.createOrUpdate(args.conexion);
        return removeDots(item.data);
      },
      conexionEdit: async (_, args, context) => {
        permissions(context, 'itinerarios:update');

        args.conexion._user_updated = context.id_usuario;
        args.conexion._updated_at = new Date();
        args.conexion.id = args.id;
        let item = await Conexion.createOrUpdate(args.conexion);
        return removeDots(item.data);
      },
      conexionDelete: async (_, args, context) => {
        permissions(context, 'itinerarios:read');

        let deleted = await Conexion.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
