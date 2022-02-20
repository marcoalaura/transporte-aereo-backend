module.exports = {
  Query: `
    # Lista de tripulaciones
    tripulaciones(
      # Límite de la consulta para la paginación
      limit: Int 
      # Nro. de página para la paginación
      page: Int 
      # Campo a ordenar, "-campo" ordena DESC
      order: String
      # Buscar por estado
      estado: EstadoTripulacion
      # Buscar por ID persona
      id_persona: Int
      # Buscar por nro. de licencia
      nro_licencia: String
      # Buscar por tipo de tripulación
      tipo: TipoTripulacion
      # Buscar por nro. licencia y nombre
      search: String
      # Buscar por ID operador
      id_operador: Int

    ): Tripulaciones
    # Obtener un tripulacion
    tripulacion(id: Int!): Tripulacion
  `,
  Mutation: `
    # Agregar tripulacion
    tripulacionAdd(tripulacion: NewTripulacion): Tripulacion
    # Editar tripulacion
    tripulacionEdit(id: Int!, tripulacion: EditTripulacion): Tripulacion
    # Quitar operador asignado a tripulacion
    tripulacionUnassign(id: Int!): Tripulacion
    # Actualizar tripulacion
    tripulacionUpdate(id: Int!, tripulacion: EditTripulacion): Tripulacion
    # Eliminar tripulacion
    tripulacionDelete(id: Int!): Delete
  `
};
