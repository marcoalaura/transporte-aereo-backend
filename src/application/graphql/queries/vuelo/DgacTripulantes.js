module.exports = {
  Query: `
    # Lista de dgacTripulantes
    dgacTripulantes (
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String
      # Buscar por nro licencia y nombre completo
      search: String
    ): DgacTripulantes
    # Obtener un dgacTripulantes por id
    dgacTripulante (id: Int!): DgacTripulantes
    # Obtener un dgacTripulantes por matrícula
    searchDgacTripulantes(nroLicencia: String!): DgacTripulante
  `,
  Mutation: `
    # Agregar dgacTripulantes
    dgacTripulantesAdd(dgacTripulantes: NewDgacTripulante): DgacTripulante
    # Editar dgacTripulantes
    dgacTripulantesEdit(id: Int!, dgacTripulantes: EditDgacTripulante): DgacTripulante
    # Eliminar dgacTripulantes
    dgacTripulantesDelete(id: Int!): Delete
  `
};
