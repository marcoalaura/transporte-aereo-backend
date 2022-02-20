module.exports = `
  # Aeropuertos - aerolíneas
  type Aeropuerto {
    # ID del operador
    id: ID!
    # codigo_icao
    codigo_icao: String!
    # codigo_iata
    codigo_iata: String
    # nombre
    nombre: String!
    # ciudad
    ciudad: String
    # pais
    pais: String
    # lat_grados
    lat_grados: Int
    # lat_minutos
    lat_minutos: Int
    # lat_segundos
    lat_segundos: Int
    # lat_dir
    lat_dir: String
    # lon_grados
    lon_grados: Int
    # lon_minutos
    lon_minutos: Int
    # lon_segundos
    lon_segundos: Int
    # lon_dir
    lon_dir: String
    # altitud
    altitud: Int
    # lat_decimal
    lat_decimal: Float
    # lon_decimal
    lon_decimal: Float
    # municipio
    municipio: String
    # departamento
    departamento: String
    # certificado_aerodromo
    certificado_aerodromo: CertificadoAerodromoAeropuerto
    # clave de referencia
    clave_referencia: String
    # categoria_ssei
    categoria_ssei: Int
    # Lapso entre despegues
    lapso_entre_despegues: Int
    # estado
    estado: EstadoAeropuerto
    # Id de la persona que creo el registro
    _user_created: Int
    # Aeropuerto que actualizó el registro
    _user_updated: Int
    # Fecha de creación del registro
    _created_at: Date
    # Fecha de actualización del registro
    _updated_at: Date
  }

  # Estados del operador
  enum EstadoAeropuerto {
    # Aeropuerto activo
    ACTIVO
    # Aeropuerto inactivo
    INACTIVO
  }

  # Tipos de operador
  enum CertificadoAerodromoAeropuerto {
    # Aeropuerto nacional
    NACIONAL
    # Aeropuerto internacional
    INTERNACIONAL
  }

  # Objeto para crear un operador
  input NewAeropuerto {
    codigo_icao: String!
    codigo_iata: String
    nombre: String!
    ciudad: String
    pais: String
    lat_grados: Int
    lat_minutos: Int
    lat_segundos: Int
    lat_dir: String
    lon_grados: Int
    lon_minutos: Int
    lon_segundos: Int
    lon_dir: String
    altitud: Int
    lat_decimal: Float
    lon_decimal: Float
    municipio: String
    departamento: String
    certificado_aerodromo: CertificadoAerodromoAeropuerto
    clave_referencia: String
    categoria_ssei: Int
    lapso_entre_despegues: Int
  }

  # Objeto para editar un operador
  input EditAeropuerto {
    codigo_icao: String
    codigo_iata: String
    nombre: String
    ciudad: String
    pais: String
    lat_grados: Int
    lat_minutos: Int
    lat_segundos: Int
    lat_dir: String
    lon_grados: Int
    lon_minutos: Int
    lon_segundos: Int
    lon_dir: String
    altitud: Int
    lat_decimal: Float
    lon_decimal: Float
    municipio: String
    departamento: String
    certificado_aerodromo: CertificadoAerodromoAeropuerto
    clave_referencia: String
    categoria_ssei: Int
    lapso_entre_despegues: Int
    estado: EstadoAeropuerto
  }

  # Objeto de paginación para operador
  type Aeropuertos {
    count: Int 
    rows: [Aeropuerto]
  }
`;
