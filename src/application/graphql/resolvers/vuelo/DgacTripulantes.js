'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { DgacTripulantes } = services;

  return {
    Query: {
      dgacTripulantes: async (_, args, context) => {
        permissions(context, 'tripulaciones:read');

        let lista = await DgacTripulantes.findAll(args, context.id_rol, context.id_entidad);
        return removeDots(lista.data);
      },
      dgacTripulante: async (_, args, context) => {
        permissions(context, 'tripulaciones:read');

        let item = await DgacTripulantes.findById(args.id);
        return item.data;
      },
      searchDgacTripulantes: async (_, args, context) => {
        permissions(context, 'tripulaciones:read');

        let item = await DgacTripulantes.findByLicencia(args.nroLicencia);
        return item.data;
      }
    },
    Mutation: {
      dgacTripulantesAdd: async (_, args, context) => {
        permissions(context, 'tripulaciones:create');

        args.dgacTripulantes._user_created = context.id_usuario;
        let item = await DgacTripulantes.createOrUpdate(args.dgacTripulantes);
        return removeDots(item.data);
      },
      dgacTripulantesEdit: async (_, args, context) => {
        permissions(context, 'tripulaciones:update');

        args.dgacTripulantes._user_updated = context.id_usuario;
        args.dgacTripulantes._updated_at = new Date();
        args.dgacTripulantes.id = args.id;
        let item = await DgacTripulantes.createOrUpdate(args.dgacTripulantes);
        return removeDots(item.data);
      },
      dgacTripulantesDelete: async (_, args, context) => {
        permissions(context, 'tripulaciones:delete');

        let deleted = await DgacTripulantes.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
