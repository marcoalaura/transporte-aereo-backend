module.exports = {
  Query: `
    # Lista Registros Historial RPL
    registrosHistorialRPL (
      # Limite de la consulta para paginacion
      limit: Int
      # nro de pagina
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String
      # Buscar por fecha
      fecha: Date
      # Buscar por Accion
      accion: HistorialAcciones
      # Buscar por id_solicitud
      id_solicitud: Int
      # Buscar por id_entidad
      id_entidad: Int
      # Buscar por id_usuario
      id_usuario: Int
    ): RegistrosHistorialRPL
    # Obtener registro historial RPL por id
    registroHistorialRPL(id: Int!): HistorialRPL
  `,
  Mutation: `
    # Agregar Registro historial RPL
    historialRPLAdd(historialRPL: NewHistorialRPL): HistorialRPL
    # Eliminar Registro historial RPL
    historialRPLDelete(id: Int!): Delete
  `
};
