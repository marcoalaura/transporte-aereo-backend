module.exports = `
  # Vuelos del sistema
  type Vuelo {
    # ID del Vuelo
    id: ID!
    # fecha_despegue
    fecha_despegue: Date!
    # hora_etd
    hora_etd: String!
    # hora_despegue
    hora_despegue: String
    # fecha_aterrizaje
    fecha_aterrizaje: Date!
    # hora_eta
    hora_eta: String!
    # hora_aterrizaje
    hora_aterrizaje: String
    # observación
    observacion: String
    # estado
    estado: EstadoVuelo
    # estado del vuelo
    estado_vuelo: EstadoDelVuelo
    # matricula
    matricula: String
    # nro_vuelo
    nro_vuelo: String
    # Num de pasajeros
    nro_pasajeros: Int
    # Id itinerario
    id_itinerario: Int
    # nro_vuelo Itinerario
    itinerario_nro_vuelo: String
    # hora_despegue Itinerario
    itinerario_hora_despegue: String
    # hora_aterrizaje Itinerario
    itinerario_hora_aterrizaje: String
    # dia_1 Itinerario
    itinerario_dia_1: Boolean
    # dia_2 Itinerario
    itinerario_dia_2: Boolean
    # dia_3 Itinerario
    itinerario_dia_3: Boolean
    # dia_4 Itinerario
    itinerario_dia_4: Boolean
    # dia_5 Itinerario
    itinerario_dia_5: Boolean
    # dia_6 Itinerario
    itinerario_dia_6: Boolean
    # dia_7 Itinerario
    itinerario_dia_7: Boolean
    # estado Itinerario
    itinerario_estado: EstadoItinerario  
    # id_aeronave Itinerario
    itinerario_id_aeronave: Int
    # id_solicitud Itinerario
    itinerario_id_solicitud: Int
    # id_aeropuerto_salida Itinerario
    itinerario_id_aeropuerto_salida: Int
    # id_aeropuerto_llegada Itinerario
    itinerario_id_aeropuerto_llegada: Int
    # itinerario_aeronave_matricula
    itinerario_aeronave_matricula: String
    # itinerario_aeronave_serie
    itinerario_aeronave_serie: String
    # itinerario_aeronave_marca
    itinerario_aeronave_marca: String
    # itinerario_aeronave_modelo
    itinerario_aeronave_modelo: String
    # itinerario_aeronave_estado
    itinerario_aeronave_estado: EstadoAeronave
    # itinerario_aeropuerto_salida_codigo_icao
    itinerario_aeropuerto_salida_codigo_icao: String
    # itinerario_aeropuerto_salida_codigo_iata
    itinerario_aeropuerto_salida_codigo_iata: String
    # itinerario_aeropuerto_salida_nombre
    itinerario_aeropuerto_salida_nombre: String
    # itinerario_aeropuerto_salida_ciudad
    itinerario_aeropuerto_salida_ciudad: String
    # itinerario_aeropuerto_salida_pais
    itinerario_aeropuerto_salida_pais: String
    # itinerario_aeropuerto_salida_estado
    itinerario_aeropuerto_salida_estado: EstadoAeropuerto
    # itinerario_aeropuerto_llegada_codigo_icao
    itinerario_aeropuerto_llegada_codigo_icao: String
    # itinerario_aeropuerto_llegada_codigo_iata
    itinerario_aeropuerto_llegada_codigo_iata: String
    # itinerario_aeropuerto_llegada_nombre
    itinerario_aeropuerto_llegada_nombre: String
    # itinerario_aeropuerto_llegada_ciudad
    itinerario_aeropuerto_llegada_ciudad: String
    # itinerario_aeropuerto_llegada_pais
    itinerario_aeropuerto_llegada_pais: String
    # itinerario_aeropuerto_llegada_estado
    itinerario_aeropuerto_llegada_estado: EstadoAeropuerto
    # codigo_icao Aeropuerto escala
    aeropuerto_escala_codigo_icao: String
    # codigo_iata Aeropuerto escala
    aeropuerto_escala_codigo_iata: String
    # nombre Aeropuerto escala
    aeropuerto_escala_nombre: String
    # ciudad Aeropuerto escala
    aeropuerto_escala_ciudad: String
    # pais Aeropuerto escala
    aeropuerto_escala_pais: String
    # aeropuerto_escala_estado
    aeropuerto_escala_estado: EstadoAeropuerto
    # Usuario que creo el registro Itinerario
    _user_created: Int
    # Usuario que actualizó el registro
    _user_updated: Int
    # Fecha de creación del registro
    _created_at: Date
    # Fecha de actualización del registro
    _updated_at: Date
    # Motivo reprogramacion de vuelo
    motivo: String
    # Descripcion reprogramacion de vuelo
    descripcion: String
    # aeropuerto llegada latitud aeropuerto 
    itinerario_aeropuerto_llegada_lat_decimal: Float
    # aeropuerto llegada longitud aeropuerto  
    itinerario_aeropuerto_llegada_lon_decimal: Float
    # aeropuerto salida latitud aeropuerto
    itinerario_aeropuerto_salida_lat_decimal: Float
    # aeropuerto salida longitud aeropuerto
    itinerario_aeropuerto_salida_lon_decimal: Float
    # razon social operador vuelo
    operador_razon_social: String
    # operador_estado
    operador_estado: EstadoOperador
    # Id puerta salida vuelo
    id_puerta_salida: Int
    # Id puerta llegada vuelo
    id_puerta_llegada: Int
    # Nro puerta salida vuelo
    puerta_salida_nro_puerta: String
    # Nro puerta llegada vuelo
    puerta_llegada_nro_puerta: String
    # sigla operador vuelo
    operador_sigla: String
    # Array conexiones
    conexiones: String

    # # pais aeropuertos salida
    # itinerario_pais_aeropuerto_salida: String
    # # pais aeropuertos llegada
    # itinerario_pais_aeropuerto_llegada: String
  }

  # Tipos de estado del Vuelo
  enum EstadoVuelo {
    PROGRAMADO
    REPROGRAMADO
    CANCELADO
  }

  enum EstadoDelVuelo {
    CONFIRMADO
    EN_HORARIO
    NUEVA_HORA
    PRE_EMBARQUE
    PREEMBARCANDO
    ABORDANDO
    CERRADO
    EN_TIERRA
    INFORMES
    DEMORADO
    ARRIBO
    CANCELADO
    RODAJE
    DESPEGUE
    ASCENSO
    CRUCERO
    DESCENSO
    APROXIMACION
    ATERRIZAJE
  }

  input NewVuelo {
    fecha_despegue: Date!
    hora_etd: String!
    hora_despegue: String!
    fecha_aterrizaje: Date!
    hora_eta: String
    hora_aterrizaje: String
    estado: EstadoVuelo
    nro_pasajeros: Int    
  }

  input EditVuelo {
    fecha_despegue: Date
    hora_etd: String
    hora_despegue: String
    fecha_aterrizaje: Date
    hora_eta: String
    hora_aterrizaje: String
    estado: EstadoVuelo
    nro_pasjeros: Int
    motivo: String
    descripcion: String
    id_puerta_salida: Int
    id_puerta_llegada: Int
  }

  type Vuelos {
    count: Int 
    rows: [Vuelo]
  }
`;
