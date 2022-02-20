module.exports = {
  Query: `
    # Lista de cargas
    cargas(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String, 
    ): Cargas
    # Obtener un carga
    carga(id: Int!): Carga
  `,
  Mutation: `
    # Agregar carga
    cargaAdd(carga: NewCarga!): Carga
    # Editar carga
    cargaEdit(id: Int!, carga: EditCarga!): Carga
    # Eliminar carga
    cargaDelete(id: Int!): Delete
  `
};
