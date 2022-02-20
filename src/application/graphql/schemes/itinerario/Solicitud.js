module.exports = `
  type Solicitud {
    id: ID!
    codigo: String
    fecha_inicio: Date!
    fecha_fin: Date
    observacion: String
    estado: EstadoSolicitud
    id_operador: Int!

    operador_nit: String
    operador_codigo_iata: String
    operador_codigo_icao: String
    operador_razon_social: String
    operador_matricula_comercio: String
    operador_sigla: String
    operador_tipo: TipoOperador
    operador_estado: EstadoOperador
    
    _user_created: Int
    _user_updated: Int
    _created_at: Date
    _updated_at: Date
  }

  enum EstadoSolicitud {
    CREADO
    SOLICITADO
    APROBADO
    PLAN_VUELO_CREADO
    PLAN_VUELO_APROBADO
    RECHAZADO
    OBSERVADO
  }
  
  enum TipoSolicitud {
    NACIONAL
    INTERNACIONAL
  }

  input NewSolicitud {
    codigo: String
    fecha_inicio: Date!
    fecha_fin: Date
    observacion: String
    id_operador: Int!
  }

  input EditSolicitud {
    codigo: String
    fecha_inicio: Date
    fecha_fin: Date
    observacion: String
    estado: EstadoSolicitud
  }

  type Solicitudes {
    count: Int 
    rows: [Solicitud]
  }

  type IdsItinerarios {
    count: Int
    rows: [Int]
  }
`;
