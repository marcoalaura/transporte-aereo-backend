module.exports = `
  # Solicitudes - puertas
  type Puerta {
    # ID de la solicitud
    id: ID!
    # Numero de puerta
    nro_puerta: String
    # Estado de puerta
    estado: EstadoPuerta
    # Tipo de vuelo
    tipo_vuelo: TipoVueloPuerta
    # Aeropuerto
    id_aeropuerto: Int
  }

  # Tipos de vuelo
  enum TipoVueloPuerta {
    # Vuelo NACIONAL
    NACIONAL
    # Vuelo INTERNACIONAL
    INTERNACIONAL
  }
  
  enum EstadoPuerta {
    # Puerta disponible
    ACTIVO
    # Puerta no disponible
    INACTIVO
  }

  # Objeto para crear una puerta
  input NewPuerta {
    nro_puerta: String
    estado: EstadoPuerta
    tipo_vuelo: TipoVueloPuerta
    id_aeropuerto: Int
  }

  # Objeto para editar una puerta
  input EditPuerta {
    nro_puerta: String
    estado: EstadoPuerta
    tipo_vuelo: TipoVueloPuerta
    id_aeropuerto: Int
  }

  # Objeto de paginación para solicitud
  type Puertas {
    count: Int 
    rows: [Puerta]
  }
`;
