module.exports = `
  # historial de cambios en dgac Aeronaves
  type DgacAeronaveHistorial {
    id: ID!
    id_dgac_aeronave: Int
    id_usuario: Int
    campo: String
    valor_anterior: String
    valor_actual: String
    _user_created: Int
    _user_updated: Int
    _created_at: Date
    _updated_at: Date
  }

  input NewDgacAeronaveHistorial {
    id_dgac_aeronave: Int!
    id_usuario: Int
    campo: String!
    valor_anterior: String!
    valor_actual: String!
  }

  type RegistrosDgacAeronaveHistorial {
    count: Int
    rows: [DgacAeronaveHistorial]
  }
`;
