module.exports = {
  Query: `
    tripulacionHistorialRegistros (
      limit: Int
      page: Int
      order: String
      campo: String
    ): RegistrosTripulacionHistorial

    tripulacionHistorial(id: Int!): TripulacionHistorial
  `,
  Mutation: `
    tripulacionHistorialAdd(tripulacionHistorial: NewTripulacionHistorial): TripulacionHistorial
  `
  // no hay necesidad de editar registros en esta tabla
};
