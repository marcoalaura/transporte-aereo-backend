module.exports = `
  # PlanVuelos
  type PlanVuelo {
    # ID del planVuelo
    id: ID!
    # Fecha desde
    fecha_desde: Date
    # Fecha hasta
    fecha_hasta: Date
    # Dia1 planVuelo
    dia_1: Boolean
    # Dia2 planVuelo
    dia_2: Boolean
    # Dia3 planVuelo
    dia_3: Boolean
    # Dia4 planVuelo
    dia_4: Boolean
    # Dia5 planVuelo
    dia_5: Boolean
    # Dia6 planVuelo
    dia_6: Boolean
    # Dia7 planVuelo
    dia_7: Boolean
    # Hora salida planVuelo
    hora_salida: String
    # Velocidad Crucero
    velocidad_crucero: String
    # Ruta planVuelo
    ruta: String
    # Nivel crucero
    nivel_crucero: String
    # Volumen Referencial
    volumen_referencial: Float
    # Duracion total planVuelo
    duracion_total: Int
    # Observacion planVuelo
    observacion: String
    # Estado planVuelo
    estado: EstadoPlanVuelo
    # ID Solicitud
    id_solicitud: Int
    # ID Aeronave
    id_aeronave: Int
    # ID AeropuertoSalida
    id_aeropuerto_salida: Int
    # ID AeropuertoDestino
    id_aeropuerto_destino: Int
    # Id creador planVuelo
    _user_created: Int
    # Id actualizados planVuelo
    _user_updated: Int
    # Fecha creacion planVuelo
    _created_at: Date
    # aeronave_matricula 
    aeronave_matricula: String
    # aeronave_tipo_aeronave
    aeronave_tipo_aeronave: String
    # aeronave_categoria_estela
    aeronave_categoria_estela: String
    # aeronave_estado
    aeronave_estado: EstadoAeronave
    # solicitud_estado
    solicitud_estado: String
    # aeropuerto_salida_codigo_iata
    aeropuerto_salida_codigo_icao: String
    # aeropuerto_salida_estado
    aeropuerto_salida_estado: EstadoAeropuerto
    # aeropuerto_destino_codigo_iata
    aeropuerto_destino_codigo_icao: String
    # aeropuerto_destino_estado
    aeropuerto_destino_estado: EstadoAeropuerto
    # Fecha actuaizacion planVuelo
    _updated_at: Date
  }

  # Estados planVuelo
  enum EstadoPlanVuelo {
    CREADO
    SOLICITADO
    APROBADO
    RECHAZADO
    OBSERVADO
    APROBADO_AASANA
    APROBADO_FELCN
  }

  # Objeto para crear planVuelo
  input NewPlanVuelo {
    fecha_desde: Date
    fecha_hasta: Date
    dia_1: Boolean
    dia_2: Boolean
    dia_3: Boolean
    dia_4: Boolean
    dia_5: Boolean
    dia_6: Boolean
    dia_7: Boolean
    hora_salida: String
    velocidad_crucero: String
    volumen_referencial: Float
    ruta: String
    nivel_crucero: String
    duracion_total: Int
    observacion: String
    estado: EstadoPlanVuelo
    id_solicitud: Int
    id_aeronave: Int
    id_aeropuerto_salida: Int
    id_aeropuerto_destino: Int
  }

  # Objeto para editar planVuelo
  input EditPlanVuelo {
    fecha_desde: Date
    fecha_hasta: Date
    dia_1: Boolean
    dia_2: Boolean
    dia_3: Boolean
    dia_4: Boolean
    dia_5: Boolean
    dia_6: Boolean
    dia_7: Boolean
    hora_salida: String
    velocidad_crucero: String
    volumen_referencial: Float
    ruta: String
    nivel_crucero: String
    duracion_total: Int
    observacion: String
    estado: EstadoPlanVuelo
    id_solicitud: Int
    id_aeronave: Int
    id_aeropuerto_salida: Int
    id_aeropuerto_destino: Int
  }

  # Objeto paginacion para planVuelo
  type PlanVuelos {
    count: Int
    rows: [PlanVuelo]
  }

  # Objeto con datos para formulario de planes de vuelos
  type PlanVuelosRepetitivosFormGeneral {
    # Operador
    explorador: String
    # id del Operador
    id_operador: Int
    # Num. Serie solicitud
    num_serie: String
    # codigo ICAO del aeropuerto de salida
    aeropuertos_salida: [AeropuertosIdsCodigosIata]
  }

  type AeropuertosIdsCodigosIata {
    id: Int
    codigo_iata: String
  }

  # Objeto detalles solicitudes de vuelo repetitivos
  type PlanVuelosRepetitivosDetallado {
    # Objeto plan de vuelo
    plan_de_vuelo: PlanVuelo
    # aeronave matricula
    aeronave_matricula: String
    # aeronave tipo
    aeronave_tipo: String
    # aeronave categoria estela
    aeronave_categoria_estela: String
    # aerodromo de salida codigo iata
    aerodromo_salida_iata: String
    # aerodromo de destino codigo iata
    aerodromo_destino_iata: String
  }

  type PlanVuelosRepetitivosFormDetallado {
    # Objetos plan de vuelos
    planes_de_vuelo: [PlanVuelosRepetitivosDetallado]
  }
`;
