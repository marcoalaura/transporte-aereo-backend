module.exports = `
  # Itinerarios
  type Itinerario {
    # ID del itinerario
    id: ID!
    # nro_vuelo
    nro_vuelo: String!
    # hora_despegue
    hora_despegue: String!
    # hora_aterrizaje
    hora_aterrizaje: String!
    # dia_1
    dia_1: Boolean!
    # dia_2
    dia_2: Boolean!
    # dia_3
    dia_3: Boolean!
    # dia_4
    dia_4: Boolean!
    # dia_5
    dia_5: Boolean!
    # dia_6
    dia_6: Boolean!
    # dia_7
    dia_7: Boolean!
    # observacion
    observacion: String
    # estado
    estado: EstadoItinerario  
    # id_aeronave
    id_aeronave: Int!
    # id_solicitud
    id_solicitud: Int!
    # id_aeropuerto_salida
    id_aeropuerto_salida: Int!
    # id_aeropuerto_llegada
    id_aeropuerto_llegada: Int!
    # solicitud_codigo
    solicitud_codigo: String
    # solicitud_fecha_inicio
    solicitud_fecha_inicio: Date
    # solicitud_fecha_fin
    solicitud_fecha_fin: Date
    # solicitud_estado
    solicitud_estado: EstadoSolicitud
    # solicitud_id_operador
    solicitud_id_operador: Int
    # aeronave_matricula
    aeronave_matricula: String
    # aeronave_serie
    aeronave_serie: String
    # aeronave_marca
    aeronave_marca: String
    # aeronave_modelo
    aeronave_modelo: String
    # aeronave_estado
    aeronave_estado: EstadoAeronave
    # aeropuerto_salida_codigo_icao
    aeropuerto_salida_codigo_icao: String
    # aeropuerto_salida_codigo_iata
    aeropuerto_salida_codigo_iata: String
    # aeropuerto_salida_nombre
    aeropuerto_salida_nombre: String
    # aeropuerto_salida_ciudad
    aeropuerto_salida_ciudad: String
    # aeropuerto_salida_pais
    aeropuerto_salida_pais: String
    # lat_decimal
    aeropuerto_salida_lat_decimal: Float
    # lon_decimal
    aeropuerto_salida_lon_decimal: Float
    # aeropuerto_salida_estado
    aeropuerto_salida_estado: EstadoAeropuerto
    # aeropuerto_llegada_codigo_icao
    aeropuerto_llegada_codigo_icao: String
    # aeropuerto_llegada_codigo_iata
    aeropuerto_llegada_codigo_iata: String
    # aeropuerto_llegada_nombre
    aeropuerto_llegada_nombre: String
    # aeropuerto_llegada_ciudad
    aeropuerto_llegada_ciudad: String
    # aeropuerto_llegada_pais
    aeropuerto_llegada_pais: String
    # lat_decimal
    aeropuerto_llegada_lat_decimal: Float
    # lon_decimal
    aeropuerto_llegada_lon_decimal: Float
    # aeropuerto_llegada_estado
    aeropuerto_llegada_estado: EstadoAeropuerto
    # Id de la persona que creo el registro
    _user_created: Int
    # Itinerario que actualizó el registro
    _user_updated: Int
    # Fecha de creación del registro
    _created_at: Date
    # Fecha de actualización del registro
    _updated_at: Date
    # Tipo de vuelos
    tipo_vuelo: TipoVuelo
  }

  # Estados del itinerario
  enum EstadoItinerario {
    # Itinerario CREADO
    CREADO
    # Itinerario APROBADO
    APROBADO
    # Itinerario OBSERVADO
    OBSERVADO
    # Itinerario REPROGRAMADO
    REPROGRAMADO
  }

  # Tipos de vuelo
  enum TipoVuelo {
    # Vuelo nacional
    NACIONAL
    # Vuelo internacional
    INTERNACIONAL
  }

  # Objeto para crear un itinerario
  input NewItinerario {
    nro_vuelo: String!
    hora_despegue: String!
    hora_aterrizaje: String!
    dia_1: Boolean
    dia_2: Boolean
    dia_3: Boolean
    dia_4: Boolean
    dia_5: Boolean
    dia_6: Boolean
    dia_7: Boolean
    observacion: String
    id_aeronave: Int!
    id_solicitud: Int!
    id_aeropuerto_salida: Int!
    id_aeropuerto_llegada: Int!
  }

  # Objeto para editar un itinerario
  input EditItinerario {
    nro_vuelo: String
    hora_despegue: String
    hora_aterrizaje: String
    dia_1: Boolean
    dia_2: Boolean
    dia_3: Boolean
    dia_4: Boolean
    dia_5: Boolean
    dia_6: Boolean
    dia_7: Boolean
    observacion: String
    estado: EstadoItinerario
    id_aeronave: Int
    id_solicitud: Int
    id_aeropuerto_salida: Int
    id_aeropuerto_llegada: Int
  }

  # Objeto de paginación para itinerario
  type Itinerarios {
    count: Int 
    rows: [Itinerario]
  }
`;
