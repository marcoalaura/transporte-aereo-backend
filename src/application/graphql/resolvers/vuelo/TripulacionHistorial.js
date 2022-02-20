'use strict';
const { permissions } = require('../../../lib/auth');
const { removeDots } = require('../../../lib/util');

module.exports = function setupResolver (services) {
  const { TripulacionHistorial } = services;

  return {
    Query: {
      tripulacionHistorialRegistros: async (_, args, context) => {
        permissions(context, 'tripulaciones:read');

        let lista = await TripulacionHistorial.findAll(args);
        return removeDots(lista.data);
      },
      tripulacionHistorial: async (_, args, context) => {
        permissions(context, 'tripulaciones:read');

        let item = await TripulacionHistorial.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      tripulacionHistorialAdd: async (_, args, context) => {
        permissions(context, 'tripulaciones:read');

        args.tripulacionHistorial._user_created = context.id_usuario;
        args.tripulacionHistorial.id_usuario = context.id_usuario;
        let item = await TripulacionHistorial.createOrUpdate(args.dgacAeronaveHistorial);
        return removeDots(item.data);
      }
    }
  };
};
