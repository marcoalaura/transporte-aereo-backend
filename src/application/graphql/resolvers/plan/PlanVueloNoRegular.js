'use strict';

const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { PlanVueloNoRegular } = services;

  return {
    Query: {
      planVueloNoRegulares: async (_, args, context) => {
        permissions(context, 'planVuelos:read');

        args.id_usuario = context.id_usuario;
        let lista = await PlanVueloNoRegular.findAll(args);
        return removeDots(lista.data);
      },
      planVueloNoRegular: async (_, args, context) => {
        permissions(context, 'planVuelos:read');

        let item = await PlanVueloNoRegular.findById(args.id);
        return removeDots(item.data);
      }/* ,
      planVueloNoRegularByCodPlanVuelo: async (_, args, context) => {
        permissions(context, 'planVuelos:read');

        let item = await PlanVueloNoRegular.findByCodPlanVuelo(args.id);
        return removeDots(item.data);
      } */
    },
    Mutation: {
      planVueloNoRegularAdd: async (_, args, context) => {
        permissions(context, 'planVuelos:create');

        args.planVueloNoRegular._user_created = context.id_usuario;
        let item = await PlanVueloNoRegular.createOrUpdate(args.planVueloNoRegular);
        return removeDots(item.data);
      },
      planVueloNoRegularEdit: async (_, args, context) => {
        permissions(context, 'planVuelos:update');

        args.planVueloNoRegular._user_updated = context.id_usuario;
        args.planVueloNoRegular._updated_at = new Date();
        args.planVueloNoRegular.id = args.id;
        let item = await PlanVueloNoRegular.createOrUpdate(args.planVueloNoRegular);
        return removeDots(item.data);
      },
      planVueloNoRegularDelete: async (_, args, context) => {
        permissions(context, 'planVuelos:delete');

        let deleted = await PlanVueloNoRegular.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
