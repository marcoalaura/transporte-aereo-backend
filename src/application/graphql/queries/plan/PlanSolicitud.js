module.exports = {
  Query: `
    # Lista planSolicitudes
    planSolicitudes(
      # Limite de la consulta para paginacion
      limit: Int
      # Nro de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String
      # Buscar por numero de serie
      nro_serie: String
      # Buscar por información suplementaria
      inf_suplementaria: String
      # Buscar por estado
      estado: EstadoPlanSolicitud
      # Buscar por Operador
      id_operador: Int
      # Buscar por Solicitud de Itinerario
      id_solicitud_itinerario: Int
      # Buscar desde fecha 'AAAA/MM/DD'
      desde_fecha: String
      # Buscar hasta fecha 'AAAA/MM/DD'
      hasta_fecha: String
    ): PlanSolicitudes
    # Obtener planSolicitud por id
    planSolicitud(id: Int!): PlanSolicitud
    # Obtener planSolicitud por itinerario
    planSolicitudItinerario(id: Int!): PlanSolicitud
    # Obtener el ultimo plan de solicitud por itinerario
    planSolicitudItinerarioLatest(id: Int!): PlanSolicitud
  `,
  Mutation: `
    # Agregar planSolicitud
    planSolicitudAdd(planSolicitud: NewPlanSolicitud): PlanSolicitud
    # Editar planSolicitud
    planSolicitudEdit(id: Int!, planSolicitud: EditPlanSolicitud): PlanSolicitud
    # Eliminar planSolicitud
    planSolicitudDelete(id: Int!): Delete
  `
};
