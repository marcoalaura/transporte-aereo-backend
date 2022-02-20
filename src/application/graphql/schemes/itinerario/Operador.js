module.exports = `
  type Operador {
    id: ID!
    nit: String 
    sigla: String 
    codigo_iata: String 
    codigo_icao: String 
    razon_social: String!  
    matricula_comercio: String  
    departamento: String
    provincia: String
    municipio: String
    direccion: String
    telefonos: String
    tipo: TipoOperador  
    licencia: String  
    fecha_vigencia: Date  
    descripcion: String 
    estado: EstadoOperador  
    _user_created: Int
    _user_updated: Int
    _created_at: Date
    _updated_at: Date
  }

  enum EstadoOperador {
    ACTIVO
    INACTIVO
  }

  enum TipoOperador {
    NACIONAL
    INTERNACIONAL
  }

  input NewOperador {
    nit: String
    sigla: String
    razon_social: String! 
    matricula_comercio: String 
    codigo: String 
    departamento: String
    provincia: String
    municipio: String
    direccion: String
    telefonos: String
    tipo: TipoOperador 
    licencia: String 
    fecha_vigencia: Date 
    descripcion: String
  }

  input EditOperador {
    nit: String
    sigla: String
    razon_social: String
    matricula_comercio: String 
    codigo: String 
    departamento: String
    provincia: String
    municipio: String
    direccion: String
    telefonos: String
    tipo: TipoOperador 
    licencia: String 
    fecha_vigencia: Date 
    descripcion: String
    estado: EstadoOperador 
  }

  type Operadores {
    count: Int 
    rows: [Operador]
  }
`;
