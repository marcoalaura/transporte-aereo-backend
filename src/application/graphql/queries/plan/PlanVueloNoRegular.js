module.exports = {
  Query: `
    # Lista planVueloNoRegulares
    planVueloNoRegulares(
      # Limite de la consulta para paginacion
      limit: Int
      # Nro de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String
      # Buscar por codigo de plan de vuelo
      cod_plan_vuelo: Int
    ): PlanVueloNoRegulares
    # Obtener planVueloNoRegular por id
    planVueloNoRegular(id: Int!): PlanVueloNoRegular
  `,
  Mutation: `
    # Agregar planVueloNoRegular
    planVueloNoRegularAdd(planVueloNoRegular: NewPlanVueloNoRegular): PlanVueloNoRegular
    # Editar planVueloNoRegular
    planVueloNoRegularEdit(id: Int!, planVueloNoRegular: EditPlanVueloNoRegular): PlanVueloNoRegular
    # Eliminar planVueloNoRegular
    planVueloNoRegularDelete(id: Int!): Delete
  `
};
