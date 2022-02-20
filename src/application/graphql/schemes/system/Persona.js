module.exports = `
  type Persona {
    id: ID!    
    nombres: String!
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
    estado: EstadoPersona!    
    observacion: String
    estado_verificacion: EstadoVerificacionPersona
    _user_created: Int
    _user_updated: Int
    _created_at: Date
    _updated_at: Date
  }

  enum EstadoVerificacionPersona {
    VERIFICADO_SEGIP
    OBSERVADO_SEGIP
    NO_EXISTE_SEGIP
    POR_VERIFICAR
    VERIFICADO
  }

  enum EstadoPersona {
    ACTIVO
    INACTIVO
  }

  enum TipoDocPersona {
    CI
    PASAPORTE
    EXTRANJERO
  }
  enum GeneroPersona {
    M
    F
    OTRO
  }

  input NewPersona {
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
  }

  input EditPersona {    
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
    estado: EstadoPersona
  }

  type Personas {
    count: Int 
    rows: [Persona]
  }
`;
