module.exports = {
  Query: `
    # Lista de dgacAeronaves
    dgacAeronaves(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String 
      # Buscar por matricula
      nroMatricula: String
    ): DgacAeronaves
    # Obtener un dgacAeronave por id
    dgacAeronave(id: Int!): DgacAeronave
    # Obtener un dgacAeronave por matrícula
    searchDgacAeronave(matricula: String!): DgacAeronave
  `,
  Mutation: `
    # Agregar dgacAeronave
    dgacAeronaveAdd(dgacAeronave: NewDgacAeronave): DgacAeronave
    # Editar dgacAeronave
    dgacAeronaveEdit(id: Int!, dgacAeronave: EditDgacAeronave): DgacAeronave
    # Eliminar dgacAeronave
    dgacAeronaveDelete(id: Int!): Delete
  `
};
