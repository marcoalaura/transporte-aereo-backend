module.exports = `
  # PlanSolicitudes
  type PlanSolicitud {
    # ID del planSolicitud
    id: ID!
    # Fecha_desde planSolicitud
    fecha_desde: Date
    # Fecha_hasta planSolicitud
    fecha_hasta: Date
    # Número de serie
    nro_serie: String
    # Información Suplementaria
    inf_suplementaria: String
    # observación
    observacion: String
    # Estado planSolicitud
    estado: EstadoPlanSolicitud
    # ID Operador
    id_operador: Int
    # operador_sigla
    operador_sigla: String
    # operador_razon_social
    operador_razon_social: String
    # operador_tipo
    operador_tipo: String
    # operador_ni
    operador_nit: String
    # ID Solicitd de Itinerario
    id_solicitud_itinerario: Int
    # solicitud_itinerario_codigo
    solicitud_itinerario_codigo: String
    # solicitud_itinerario_estado
    solicitud_itinerario_estado: String
    # Id creador de registro
    _user_created: Int
    # Id usuario que actualizó el registro
    _user_updated: Int
    # Fecha de creacion de registro
    _created_at: Date
    # Fecha de actualizacion de registro
    _updated_at: Date
  }

  # Tipos de Estado PlanSolicitud
  enum EstadoPlanSolicitud {
    CREADO
    SOLICITADO
    APROBADO
    RECHAZADO
    OBSERVADO
    APROBADO_AASANA
    APROBADO_FELCN
  }

  # Objeto para crear planSolicitud
  input NewPlanSolicitud {
    fecha_desde: Date!
    fecha_hasta: Date!
    nro_serie: String
    inf_suplementaria: String!
    estado: EstadoPlanSolicitud
    id_operador: Int
    id_solicitud_itinerario: Int
  }

  # Objeto para editar planSolicitud
  input EditPlanSolicitud {
    fecha_desde: Date
    fecha_hasta: Date
    nro_serie: String
    inf_suplementaria: String
    estado: EstadoPlanSolicitud
    id_operador: Int
    id_solicitud_itinerario: Int
  }

  # Objeto paginación para planSolicitud
  type PlanSolicitudes {
    count: Int
    rows: [PlanSolicitud]
  }
`;
