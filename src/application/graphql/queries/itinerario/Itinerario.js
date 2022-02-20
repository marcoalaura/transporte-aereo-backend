module.exports = {
  Query: `
    # Lista de itinerarios
    itinerarios(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String 
      # Buscar por nro_vuelo
      nro_vuelo: String
      # Buscar por hora_despegue
      hora_despegue: String
      # Buscar por hora_aterrizaje
      hora_aterrizaje: String
      # Buscar por dia_1
      dia_1: Boolean
      # Buscar por dia_2
      dia_2: Boolean
      # Buscar por dia_3
      dia_3: Boolean
      # Buscar por dia_4
      dia_4: Boolean
      # Buscar por dia_5
      dia_5: Boolean
      # Buscar por dia_6
      dia_6: Boolean
      # Buscar por dia_7
      dia_7: Boolean
      # Buscar por id_aeronave
      id_aeronave: Int
      # Buscar por id_solicitud
      id_solicitud: Int
      # Buscar por id_aeropuerto_salida
      id_aeropuerto_salida: Int
      # Buscar por id_aeropuerto_llegada
      id_aeropuerto_llegada: Int
      # Buscar por estado
      estado: EstadoItinerario
      # Buscar por tipo de vuelo 'NACIONAL'
      tipo_vuelo: TipoVuelo
    ): Itinerarios
    # Obtener un itinerario
    itinerario(id: Int!): Itinerario
  `,
  Mutation: `
    # Agregar itinerario
    itinerarioAdd(itinerario: NewItinerario): Itinerario
    # Editar itinerario
    itinerarioEdit(id: Int!, itinerario: EditItinerario): Itinerario
    # Eliminar itinerario
    itinerarioDelete(id: Int!): Delete
  `
};
