'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { DgacAeronave } = services;

  return {
    Query: {
      dgacAeronaves: async (_, args, context) => {
        permissions(context, 'aeronaves:read');

        let lista = await DgacAeronave.findAll(args, context.id_rol, context.id_entidad);
        return removeDots(lista.data);
      },
      dgacAeronave: async (_, args, context) => {
        permissions(context, 'aeronaves:read');

        let item = await DgacAeronave.findById(args.id);
        return removeDots(item.data);
      },
      searchDgacAeronave: async (_, args, context) => {
        permissions(context, 'aeronaves:read');

        let item = await DgacAeronave.findByMatricula(args.matricula);
        return removeDots(item.data);
      }
    },
    Mutation: {
      dgacAeronaveAdd: async (_, args, context) => {
        permissions(context, 'aeronaves:create');

        args.dgacAeronave._user_created = context.id_usuario;
        let item = await DgacAeronave.createOrUpdate(args.dgacAeronave);
        return removeDots(item.data);
      },
      dgacAeronaveEdit: async (_, args, context) => {
        permissions(context, 'aeronaves:update');

        args.dgacAeronave._user_updated = context.id_usuario;
        args.dgacAeronave._updated_at = new Date();
        args.dgacAeronave.id = args.id;
        let item = await DgacAeronave.createOrUpdate(args.dgacAeronave);
        return removeDots(item.data);
      },
      dgacAeronaveDelete: async (_, args, context) => {
        permissions(context, 'aeronaves:delete');

        let deleted = await DgacAeronave.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
