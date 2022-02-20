module.exports = {
  Query: `
    # lista planVuelos
    planVuelos(
      # Limite de la consulta para paginación
      limit: Int
      # Nro de pagina para la paginacion
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String
      # Buscar por id solicitud
      id_solicitud: Int
      # Buscar por fecha_desde
      fecha_desde: Date
      # Buscar por fecha_hasta
      fecha_hasta: Date
      # Buscar por dia1
      dia_1: Boolean
      # Buscar por dia2
      dia_2: Boolean
      # Buscar por dia3
      dia_3: Boolean
      # Buscar por dia4
      dia_4: Boolean
      # Buscar por dia5
      dia_5: Boolean
      # Buscar por dia6
      dia_6: Boolean
      # Buscar por dia7
      dia_7: Boolean
      # Buscar por hora_salida
      hora_salida: String
      # Buscar por velocidad_crucero
      velocidad_crucero: String
      # Buscar por ruta
      ruta: String
      # Buscar po nivel_crucero
      nivel_crucero: String
      # Buscar por duracion_total
      duracion_total: Int
      # Buscar por observacion
      observacion: String
      # Buscar categoria estela
      categoria_estela: String
      # Buscar por matricula
      matricula: String
      # Buscar por estado planVuelo
      estado: EstadoPlanVuelo
    ): PlanVuelos
    # Obtener planVuelo por id
    planVuelo(id: Int!): PlanVuelo
    # Obtener Objeto de formulario de plan de Vuelos Repetitivos
    planVuelosRepetitivosFormGeneral(id_solicitud: Int!): PlanVuelosRepetitivosFormGeneral
    # Obtener objeto formulario de plan de vuelos repetitivos detallado
    planVuelosRepetitivosFormDetallado(id_solicitud: Int!): PlanVuelosRepetitivosFormDetallado
  `,
  Mutation: `
    # Agregar planVuelo
    planVueloAdd(planVuelo: NewPlanVuelo): PlanVuelo
    # Editar planVuelo
    planVueloEdit(id: Int!, planVuelo: EditPlanVuelo): PlanVuelo
    # Eliminar planVuelo
    planVueloDelete(id: Int!): Delete
  `
};
