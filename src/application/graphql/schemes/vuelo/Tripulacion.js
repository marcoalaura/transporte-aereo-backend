module.exports = `
  # Tripulaciones del sistema
  type Tripulacion {
    # ID del usuario
    id: ID!
    # ciudad
    ciudad: String
    # nro_licencia
    nro_licencia: String
    # titulo
    titulo: String
    # vigencia
    vigencia: String
    # tipo
    tipo: TipoTripulacion
    # estado
    estado: EstadoTripulacion
    # Sincronizado
    sincronizado: Boolean
    # Observacion
    observacion: String
    # Id de persona
    id_persona: Int!
    # Nombres del persona
    persona_nombres: String!
    # Primer apellido
    persona_primer_apellido: String
    # Segundo apellido
    persona_segundo_apellido: String
    # nombre_completo
    persona_nombre_completo: String
    # tipo_documento
    persona_tipo_documento: TipoDocPersona
    # tipo_documento_otro
    persona_tipo_documento_otro: String
    # nro_documento
    persona_nro_documento: String
    # fecha_nacimiento
    persona_fecha_nacimiento: Date
    # movil
    persona_movil: String
    # nacionalidad
    persona_nacionalidad: String
    # pais_nacimiento
    persona_pais_nacimiento: String
    # genero
    persona_genero: GeneroPersona
    # Teléfono del persona
    persona_telefono: String    
    # Estado del persona
    persona_estado: EstadoPersona!
    # observacion
    persona_observacion: String
    # estado_verificacion
    persona_estado_verificacion: EstadoVerificacionPersona
    # Nombre del operador
    operador_razon_social: String
    # Nombre del operador
    operador_sigla: String
    # operador_estado
    operador_estado: EstadoOperador 
    # Id de la persona que creo el registro
    _user_created: Int
    # Tripulacion que actualizó el registro
    _user_updated: Int
    # Fecha de creación del registro
    _created_at: Date
    # Fecha de actualización del registro
    _updated_at: Date
  }

  # Tipos de estado del usuario
  enum EstadoTripulacion {
    # Tripulacion activo
    ACTIVO
    # Tripulacion inactivo
    INACTIVO
  }

  # Tipos de tripulación
  enum TipoTripulacion {
    PILOTO
    TRIPULANTE_DE_CABINA
  }

  # Objeto para crear un usuario
  input NewTripulacion {
    ciudad: String
    nro_licencia: String
    titulo: String
    tipo: String
    sincronizado: Boolean
    vigencia: String
    nombres: String!
    primer_apellido: String
    segundo_apellido: String
    nombre_completo: String
    tipo_documento: TipoDocPersona!
    tipo_documento_otro: String
    nro_documento: String!
    fecha_nacimiento: Date!
    movil: String
    nacionalidad: String
    pais_nacimiento: String
    genero: GeneroPersona
    telefono: String
    observacion: String
  }

  # Objeto para editar un usuario
  input EditTripulacion {
    ciudad: String
    nro_licencia: String
    titulo: String
    vigencia: Date
    estado: EstadoTripulacion
    id_persona: Int
    nombres: String
    primer_apellido: String
    segundo_apellido: String
    tipo_documento: TipoDocPersona
    nro_documento: String
    fecha_nacimiento: Date
    movil: String
    nacionalidad: String
    pais_nacimiento: String
    genero: GeneroPersona
    telefono: String
    sincronizado: Boolean
    observacion: String
  }

  # Objeto de paginación para usuario
  type Tripulaciones {
    count: Int 
    rows: [Tripulacion]
  }
`;
