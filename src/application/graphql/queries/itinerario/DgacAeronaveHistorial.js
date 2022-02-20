module.exports = {
  Query: `
    dgacAeronavesHistorial(
      limit: Int
      page: Int
      order: String
      campo: String
    ): RegistrosDgacAeronaveHistorial
    
    dgacAeronaveHistorial(id: Int!): DgacAeronaveHistorial
  `,
  Mutation: `
    dgacAeronaveHistorialAdd(dgacAeronaveHistorial: NewDgacAeronaveHistorial): DgacAeronaveHistorial
  `
  // no hay necesidad de editar registros de esta tabla
};
