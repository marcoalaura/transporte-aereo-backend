module.exports = `
  # Hisotrial RPL
  type HistorialRPL {
    id: ID!
    # Fecha de registro
    fecha: Date
    # Accion
    accion: HistorialAcciones
    # detalle de registro historial RPL
    detalle: String
    # id solicitud RPL
    id_solicitud: Int
    # solicitud_nro_serie
    solicitud_nro_serie: String
    # solicitud_estado
    solicitud_estado: String
    # id entidad 
    id_entidad: Int
    # entidad_nombre
    entidad_nombre: String
    # entidad_sigla
    entidad_sigla: String
    # id del usuario creador
    id_usuario: Int
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

  # Tipos de acciones Registro historial RPL
  enum HistorialAcciones {
    SOLICITADO
    APROBADO
    RECHAZADO
  }

  # Objeto para crear Plan historial RPL
  input NewHistorialRPL {
    fecha: Date
    accion: HistorialAcciones
    detalle: String
    id_solicitud: Int!
    id_entidad: Int!
    id_usuario: Int
  }

  # Objeto paginacion
  type RegistrosHistorialRPL {
    count: Int
    rows: [HistorialRPL]
  }
`;
