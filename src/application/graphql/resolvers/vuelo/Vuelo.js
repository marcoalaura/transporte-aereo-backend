'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Vuelo } = services;

  return {
    Query: {
      vuelos: async (_, args, context) => {
        permissions(context, 'vuelos:read|aeropuertos:read');

        let items = await Vuelo.findAll(args, context.rol, context.id_aeropuerto, context.id_operador);
        // console.log('vuelos', items.data.rows);
        return removeDots(items.data);
      },
      vuelosConexiones: async (_, args, context) => {
        permissions(context, 'vuelos:read|aeropuertos:read');
        let items = await Vuelo.findAllVuelosConexiones(args, context.rol, context.id_aeropuerto);
        return removeDots(items.data);
      },
      vuelosDashboard: async (_, args, context) => {
        let items = await Vuelo.findAll(args, context.rol, context.id_aeropuerto);
        return removeDots(items.data);
      },
      vuelo: async (_, args, context) => {
        permissions(context, 'vuelos:read');

        let item = await Vuelo.findById(args.id, context.rol, context.id_aeropuerto, context.id_operador);
        return removeDots(item.data);
      }
    },
    Mutation: {
      vueloAdd: async (_, args, context) => {
        permissions(context, 'vuelos:create');

        args.vuelo._user_created = context.id_usuario;
        let item = await Vuelo.createOrUpdate(args.vuelo);
        return removeDots(item.data);
      },
      vueloEdit: async (_, args, context) => {
        permissions(context, 'vuelos:update');

        args.vuelo._user_updated = context.id_usuario;
        args.vuelo._updated_at = new Date();
        args.vuelo.id = args.id;
        let item = await Vuelo.createOrUpdate(args.vuelo);
        return removeDots(item.data);
      },
      vueloDelete: async (_, args, context) => {
        permissions(context, 'vuelos:delete');

        let deleted = await Vuelo.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
