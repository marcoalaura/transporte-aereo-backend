module.exports = {
  Query: `
    # Lista Registros Historial SolicitudItinerario
    registrosHistorialSolicitudItinerario (
      # Limite de la consulta para paginacion
      limit: Int
      # nro de pagina
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String
      # Buscar por fecha
      fecha: Date
      # Buscar por Accion
      accion: String
      # Buscar por id_solicitud
      id_solicitud: Int
      # Buscar por id_entidad
      id_entidad: Int
      # Buscar por id de usuario
      id_usuario: Int
      # Buscar por nombre de usuario
      nombre_usuario: String
    ): RegistrosHistorialSolicitudItinerario
    # Obtener registro historial SolicitudItinerario por id
    registroHistorialSolicitudItinerario(id: Int!): HistorialSolicitudItinerario
  `,
  Mutation: `
    # Agregar Registro historial SolicitudItinerario
    historialSolicitudItinerarioAdd(historialSolicitudItinerario: NewHistorialSolicitudItinerario): HistorialSolicitudItinerario
    # Eliminar Registro historial SolicitudItinerario
    historialSolicitudItinerarioDelete(id: Int!): Delete
  `
};
