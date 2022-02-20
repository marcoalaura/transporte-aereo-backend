module.exports = `
  # Hisotrial Solicitudes Itinerario
  type HistorialSolicitudItinerario {
    id: ID!
    # Fecha de registro
    fecha: Date
    # Accion
    accion: String
    # detalle de registro historial SolicitudItinerario
    detalle: String
    # id solicitud SolicitudItinerario
    id_solicitud: Int
    # solicitud_nro_serie
    solicitud_nro_serie: String
    # solicitud_estado
    solicitud_estado: String
    # id entidad 
    id_entidad: Int
    # id usuario
    id_usuario: Int
    # entidad_nombre
    entidad_nombre: String
    # entidad_sigla
    entidad_sigla: String
    # entidad estado
    entidad_estado: EstadoEntidad
    # nombre del usuario creador
    nombre_usuario: String
    # id creador de registro
    _user_created: Int
    # Id usuario que actualizó el registro
    _user_updated: Int
    # Fecha de creacion de registro
    _created_at: Date
    # Fecha de actualizacion de registro
    _updated_at: Date
  }

  # Objeto para crear Plan historial SolicitudItinerario
  input NewHistorialSolicitudItinerario {
    fecha: Date
    accion: String
    detalle: String
    id_solicitud: Int!
    id_entidad: Int!
    id_usuario: Int
    nombre_usuario: String
  }

  # Objeto paginacion
  type RegistrosHistorialSolicitudItinerario {
    count: Int
    rows: [HistorialSolicitudItinerario]
  }
`;
