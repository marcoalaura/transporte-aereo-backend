module.exports = `
  # historial de cambios en tripulaciones
  type TripulacionHistorial {
    id: ID!
    id_tripulacion: Int
    id_usuario: Int
    campo: String
    valor_anterior: String
    valor_actual: String
    _user_created: Int
    _user_updated: Int
    _created_at: Date
    _updated_at: Date
  }

  input NewTripulacionHistorial {
    id_tripulacion: Int!
    campo: String!
    valor_anterior: String!
    valor_actual: String!
    id_usuario: Int
    _user_created: Int
  }

  type RegistrosTripulacionHistorial {
    count: Int
    rows: [TripulacionHistorial]
  }
`;
