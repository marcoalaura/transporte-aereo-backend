module.exports = `
  # Equipajes del sistema
  type Equipaje {
    # ID de la Equipaje
    id: ID!
    # peso
    peso: Float
    # descripcion
    descripcion: String
    # estado
    estado: EstadoEquipaje
    # _user_created de Equipaje
    _user_created: Int
    # _user_updated de Equipaje
    _user_updated: Int
    # _created_at de Equipaje
    _created_at: Date
    # _updated_at de Equipaje
    _updated_at: Date
  }

  # Estado de la carga
  enum EstadoEquipaje {
    ACTIVO
    INACTIVO
  }

  # Objeto para crear un Equipaje
  input NewEquipaje {
    peso: Float!
    descripcion: String
  }

  # Objeto para editar un Equipaje
  input EditEquipaje {
    peso: Float
    descripcion: String
    estado: EstadoEquipaje
  }

  # Objeto de paginación para Equipaje
  type Equipajes {
    count: Int 
    rows: [Equipaje]
  }
`;
