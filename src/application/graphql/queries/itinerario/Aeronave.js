module.exports = {
  Query: ` 
    # Lista de aeronaves
    aeronaves(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String 
      # Buscar por matricula
      matricula: String
      # Buscar por serie
      serie: String
      # Buscar por marca
      marca: String
      # Buscar por modelo
      modelo: String
      # Buscar por propietario
      propietario: String
      # Buscar por modelo genérico
      modelo_generico: String
      # tipo_aeronave
      tipo_aeronave: String
      # categoria_estela
      categoria_estela: CategoriaEstela
      # Buscar por ads_b
      ads_b: Boolean
      # Buscar por Operador
      id_operador: Int
      # Buscar por estado
      estado: EstadoAeronave
    ): Aeronaves
    # Obtener un aeronave
    aeronave(id: Int!): Aeronave
  `,
  Mutation: `
    # Agregar aeronave
    aeronaveAdd(aeronave: NewAeronave): Aeronave
    # Editar aeronave
    aeronaveEdit(id: Int!, aeronave: EditAeronave): Aeronave
    # Eliminar aeronave
    aeronaveDelete(id: Int!): Delete
  `
};
