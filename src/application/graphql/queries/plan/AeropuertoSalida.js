module.exports = {
  Query: `
    # Lista de aeropuertoSalidas
    aeropuertoSalidas(
      # Límite de la consulta para paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String
      # Buscar por solicitud
      id_solicitud: Int
      # Buscar por aeropuerto
      id_aeropuerto: Int
    ): AeropuertoSalidas

    # Obtener un aeropuertoSalida por id
    aeropuertoSalida(id: Int!): AeropuertoSalida
  `,
  Mutation: `
    # Agregar aeropuertoSalida
    aeropuertoSalidaAdd(aeropuertoSalida: NewAeropuertoSalida): AeropuertoSalida
    # Editar aeropuertoSalida
    aeropuertoSalidaEdit(id: Int!, aeropuertoSalida: EditAeropuertoSalida): AeropuertoSalida
    # Eliminar aeropuertoSalida
    aeropuertoSalidaDelete(id: Int!): Delete
  `
};
