module.exports = {
  Query: ` 
  # Lista de puertas
  puertas(
  # Límite de la consulta para la paginación
  limit: Int
  # Nro. de página para la paginación
  page: Int
  # Campo a ordenar, "-campo" ordena DESC
  order: String 
  # Buscar por numero de puerta
  nro_puerta: String
  # Buscar por estado puerta
  estado: EstadoPuerta
  # Buscar por tipo de vuelo
  tipo_vuelo: TipoVuelo
  # Buscar por Aeropuerto
    id_aeropuerto: Int
  ): Puertas
  # Obtener una puerta
  puerta(id: Int!): Puerta
  `,
  Mutation: `
  # Agregar puerta
  puertaAdd(puerta: NewPuerta): Puerta
  # Editar puerta
  puertaEdit(id: Int!, puerta: EditPuerta): Puerta
  # Eliminar puerta
  puertaDelete(id: Int!): Delete
  `
};
