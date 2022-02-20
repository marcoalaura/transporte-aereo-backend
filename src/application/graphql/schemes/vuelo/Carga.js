module.exports = `
  # Cargas del sistema
  type Carga {
    # ID de la Carga
    id: ID!
    # peso
    peso: Float
    # volumen
    volumen: Float
    # estado
    estado: EstadoCarga
    # _user_created de Carga
    _user_created: Int
    # _user_updated de Carga
    _user_updated: Int
    # _created_at de Carga
    _created_at: Date
    # _updated_at de Carga
    _updated_at: Date
  }

  # Estado de la carga
  enum EstadoCarga {
    ACTIVO
    INACTIVO
  }

  # Objeto para crear un Carga
  input NewCarga {
    peso: Float!
    volumen: Float
  }

  # Objeto para editar un Carga
  input EditCarga {
    peso: Float
    volumen: Float
    estado: EstadoCarga
  }

  # Objeto de paginación para Carga
  type Cargas {
    count: Int 
    rows: [Carga]
  }
`;
