'use strict';
const { permissions } = require('../../../lib/auth');
const { removeDots } = require('../../../lib/util');

module.exports = function setupResolver (services) {
  const { DgacAeronaveHistorial } = services;

  return {
    Query: {
      dgacAeronavesHistorial: async (_, args, context) => {
        permissions(context, 'aeronave:read');

        let lista = await DgacAeronaveHistorial.findAll(args);
        return removeDots(lista.data);
      },
      dgacAeronaveHistorial: async (_, args, context) => {
        permissions(context, 'aeronave:read');

        let item = await DgacAeronaveHistorial.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      dgacAeronaveHistorialAdd: async (_, args, context) => {
        permissions(context, 'aeronave:read');

        args.dgacAeronaveHistorial_user_created = context.id_usuario;
        args.dgacAeronaveHistorial.id_usuario = context.id_usuario;
        let item = await DgacAeronaveHistorial.createOrUpdate(args.dgacAeronaveHistorial);
        return removeDots(item.data);
      }
    }
  };
};
