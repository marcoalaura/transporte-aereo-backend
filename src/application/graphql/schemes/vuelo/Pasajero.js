module.exports = `
  type Pasajero {
    id: ID!
    tipo_viajero: TipoViajero
    tipo_tripulacion: String
    nro_asiento: String
    fecha_vencimiento_doc: Date
    entidad_emisora_doc: String
    lugar_origen: String
    lugar_destino: String
    email: String
    observacion: String
    tipo: TipoPasajero
    estado: EstadoPasajero
    id_persona: Int
    id_tripulacion: Int

    persona_nombres: String!
    persona_primer_apellido: String
    persona_segundo_apellido: String
    persona_nombre_completo: String
    persona_tipo_documento: TipoDocPersona
    persona_tipo_documento_otro: String
    persona_nro_documento: String
    persona_fecha_nacimiento: Date
    persona_movil: String
    persona_nacionalidad: String
    persona_pais_nacimiento: String
    persona_genero: GeneroPersona
    persona_telefono: String    
    persona_estado: EstadoPersona!
    persona_observacion: String
    persona_estado_verificacion: EstadoVerificacionPersona

    tripulacion_ciudad: String
    tripulacion_nro_licencia: String
    tripulacion_titulo: String
    tripulacion_vigencia: String
    tripulacion_estado: EstadoTripulacion

    vuelo_fecha_despegue: Date
    vuelo_fecha_aterrizaje: Date
    vuelo_hora_etd: String
    vuelo_hora_eta: String
    vuelo_estado: String
    vuelo_operador_sigla: String
    vuelo_itinerario_nro_vuelo: Int
    vuelo_itinerario_aeropuerto_salida_ciudad: String
    vuelo_itinerario_aeropuerto_llegada_ciudad: String
    vuelo_itinerario_aeronave_matricula: String

    _user_created: Int
    _user_updated: Int
    _created_at: Date
    _updated_at: Date
  }

  enum TipoPasajero {
    TRIPULANTE
    PASAJERO
  }

  enum TipoViajero {
    NACIONAL
    EXTRANJERO
  }  

  enum EstadoPasajero {
    CHECKING
    PRE_EMBARQUE
    A_BORDO
    VUELO_PERDIDO
    CANCELADO
    PAGADO
    RESERVADO
    ASIGNADO
  }

  input NewPasajero {
    tipo: TipoPasajero!
    tipo_viajero: TipoViajero
    tipo_tripulacion: String
    nro_asiento: String
    fecha_vencimiento_doc: Date
    entidad_emisora_doc: String
    lugar_origen: String
    lugar_destino: String
    email: String
    observacion: String
    estado: String
    nombres: String!
    primer_apellido: String
    segundo_apellido: String
    nombre_completo: String
    tipo_documento: TipoDocPersona!
    tipo_documento_otro: String
    nro_documento: String!
    fecha_nacimiento: Date
    movil: String
    nacionalidad: String
    pais_nacimiento: String
    genero: GeneroPersona
    telefono: String
    id_vuelo: Int
    id_persona: Int
    id_tripulacion: Int
  }

  input EditPasajero {
    tipo: TipoPasajero
    tipo_viajero: TipoViajero
    tipo_tripulacion: String
    nro_asiento: String
    fecha_vencimiento_doc: Date
    entidad_emisora_doc: String
    lugar_origen: String
    lugar_destino: String
    email: String
    observacion: String
    estado: String
    nombres: String
    primer_apellido: String
    segundo_apellido: String
    nombre_completo: String
    tipo_documento: TipoDocPersona
    tipo_documento_otro: String
    nro_documento: String
    fecha_nacimiento: Date
    movil: String
    nacionalidad: String
    pais_nacimiento: String
    genero: GeneroPersona
    telefono: String
    id_vuelo: Int
    id_persona: Int
    id_tripulacion: Int
  }

  type Pasajeros {
    count: Int 
    rows: [Pasajero]
  }
`;
