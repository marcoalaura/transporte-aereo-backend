module.exports = {
  Query: `
    # Lista de conexiones
    conexiones(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String 
      # Buscar por id_itinerario_a
      id_itinerario_a: Int
      # Buscar por id_itinerario_b
      id_itinerario_b: Int
    ): Conexiones
    # Obtener una conexion
    conexion(id: Int!): Conexion
  `,
  Mutation: `
    # Agregar conexion
    conexionAdd(conexion: NewConexion): Conexion
    # Editar conexion
    conexionEdit(id: Int!, conexion: EditConexion): Conexion
    # Eliminar conexion
    conexionDelete(id: Int!): Delete
  `
};
