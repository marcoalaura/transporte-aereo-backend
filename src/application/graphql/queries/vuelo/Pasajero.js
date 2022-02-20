module.exports = {
  Query: `
    pasajeros(
      limit: Int 
      page: Int 
      order: String
      estado: EstadoPasajero,
      id_persona: Int
      email: String
      nro_documento: String
      nombre_completo: String
      id_vuelo: Int
      tipo: String
      fecha_inicio: String
      fecha_fin: String
    ): Pasajeros
    pasajero(id: Int!): Pasajero
    buscarPasajeroPorNroDocumento(nro_documento: String): Pasajeros
  `,
  Mutation: `
    pasajeroAdd(pasajero: NewPasajero): Pasajero
    pasajeroEdit(id: Int!, pasajero: EditPasajero): Pasajero
    pasajeroDelete(id: Int!): Delete
  `
};
