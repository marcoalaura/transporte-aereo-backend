module.exports = `
  # Aeronaves - aerolíneas
  type Aeronave {
    # ID del aeronave
    id: ID!
    # matricula
    matricula: String!
    # serie
    serie: String!
    # marca
    marca: String!
    # modelo
    modelo: String
    # fecha_inscripcion
    fecha_inscripcion: Date
    # propietario
    propietario: String!
    # Modelo genérico
    modelo_generico: String
    # observaciones
    observaciones: String
    # fecha_actualizacion
    fecha_actualizacion: Date
    # capacidad_maxima_asientos
    capacidad_maxima_asientos: Int
    # capacidad_carga
    capacidad_carga: Float
    # ads_b
    ads_b: Boolean
    # descripcion
    descripcion: String
    # tipo_aeronave
    tipo_aeronave: String
    # categoria_estela
    categoria_estela: CategoriaEstela
    # estado
    estado: EstadoAeronave
    # estado DGAC
    estado_dgac: String
    # Id operador
    id_operador: Int!
    # nit operador
    operador_nit: String
    # operador_sigla operador
    operador_sigla: String
    # razon_social operador
    operador_razon_social: String
    # matricula_comercio operador
    operador_matricula_comercio: String
    # tipo operador
    operador_tipo: TipoOperador
    # estado operador
    operador_estado: EstadoOperador
    # Id de la persona que creo el registro
    _user_created: Int
    # Aeronave que actualizó el registro
    _user_updated: Int
    # Fecha de creación del registro
    _created_at: Date
    # Fecha de actualización del registro
    _updated_at: Date
  }

  # Estados del aeronave
  enum EstadoAeronave {
    # Aeronave activo
    ACTIVO
    # Aeronave inactivo
    INACTIVO,
    # Aeronave en mantenimiento
    MANTENIMIENTO
  }
  
  enum CategoriaEstela {
    # CategoriaEstela H
    H
    # CategoriaEstela M
    M
    # CategoriaEstela L
    L
  }

  # Objeto para crear un aeronave
  input NewAeronave {
    matricula: String!
    serie: String!
    marca: String!
    modelo: String
    fecha_inscripcion: Date
    propietario: String!
    modelo_generico: String
    observaciones: String
    fecha_actualizacion: Date
    capacidad_maxima_asientos: Int
    capacidad_carga: Float
    ads_b: Boolean
    descripcion: String
    id_operador: Int!
    tipo_aeronave: String
    categoria_estela: CategoriaEstela
    estado_dgac: String
  }

  # Objeto para editar un aeronave
  input EditAeronave {
    matricula: String
    serie: String
    marca: String
    modelo: String
    fecha_inscripcion: Date
    propietario: String
    modelo_generico: String
    observaciones: String
    fecha_actualizacion: Date
    capacidad_maxima_asientos: Int
    capacidad_carga: Float
    ads_b: Boolean
    descripcion: String
    estado: EstadoAeronave
    id_operador: Int
    tipo_aeronave: String
    categoria_estela: CategoriaEstela
    estado_dgac: String
  }

  # Objeto de paginación para aeronave
  type Aeronaves {
    count: Int 
    rows: [Aeronave]
  }
`;
