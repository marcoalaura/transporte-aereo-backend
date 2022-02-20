module.exports = `
  # AeropuertoSalidas
  type AeropuertoSalida {
    # ID del aeropuertoSalida
    id: ID!
    # ID de la solicitud
    id_solicitud: Int!
    # ID del aeropuerto
    id_aeropuerto: Int!
    # Id de la persona que creo el registro
    _user_created: Int
    # Usuario que actualizó el registro
    _user_updated: Int
    # Fecha de creación del registro
    _created_at: Date
    # Fecha de actualización del registro
    _updated_at: Date
  }

  # Objeto para crear aeropuertoSalida
  input NewAeropuertoSalida {
    id_solicitud: Int!
    id_aeropuerto: Int!
  }

  # Objeto para editar un aeronave
  input EditAeropuertoSalida {
    id_solicitud: Int!
    id_aeropuerto: Int!
  }

  # Objeto de paginación para aeronave
  type AeropuertoSalidas {
    count: Int 
    rows: [AeropuertoSalida]
  }
`;
