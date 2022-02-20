'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Operador } = services;

  return {
    Query: {
      operadores: async (_, args, context) => {
        permissions(context, 'operadores:read|solicitudes:read');

        let lista = await Operador.findAll(args, context.id_rol, context.id_entidad);
        return removeDots(lista.data);
      },
      operador: async (_, args, context) => {
        permissions(context, 'operadores:read');

        let item = await Operador.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      operadorAdd: async (_, args, context) => {
        permissions(context, 'operadores:create');

        args.operador._user_created = context.id_usuario;
        let item = await Operador.createOrUpdate(args.operador);
        return removeDots(item.data);
      },
      operadorEdit: async (_, args, context) => {
        permissions(context, 'operadores:update');

        args.operador._user_updated = context.id_usuario;
        args.operador._updated_at = new Date();
        args.operador.id = args.id;
        let item = await Operador.createOrUpdate(args.operador);
        return removeDots(item.data);
      },
      operadorDelete: async (_, args, context) => {
        permissions(context, 'operadores:delete');

        let deleted = await Operador.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
