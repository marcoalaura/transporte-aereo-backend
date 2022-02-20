module.exports = {
  Query: `
    # Lista de aeropuertos
    aeropuertos(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String
      # Buscar por codigo_icao
      codigo_icao: String
      # Buscar por codigo_iata
      codigo_iata: String
      # Buscar por nombre
      nombre: String
      # Buscar por ciudad
      ciudad: String
      # Buscar por pais
      pais: String
      # Buscar por municipio
      municipio: String
      # Buscar por departamento
      departamento: String
      # Buscar por CertificadoAeródromo
      certificado_aerodromo: CertificadoAerodromoAeropuerto
      # Buscar por Clave de Referencia
      clave_referencia: String
      # Buscar por Categoria SSEI
      categoria_ssei: Int
      # Buscar por Lapso entre Despegues
      lapso_entre_despegues: Int
      # Buscar por estado
      estado: EstadoAeropuerto
      # Sin coordenadas
      mapa: Boolean
    ): Aeropuertos
    # Obtener un aeropuerto
    aeropuerto(id: Int!): Aeropuerto
  `,
  Mutation: `
    # Agregar aeropuerto
    aeropuertoAdd(aeropuerto: NewAeropuerto): Aeropuerto
    # Editar aeropuerto
    aeropuertoEdit(id: Int!, aeropuerto: EditAeropuerto): Aeropuerto
    # Eliminar aeropuerto
    aeropuertoDelete(id: Int!): Delete
  `
};
