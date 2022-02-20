module.exports = {
  Query: `
    vuelos(
      limit: Int
      page: Int
      order: String
      estado: EstadoVuelo
      id_operador: Int
      id_itinerario: Int
      fecha_despegue: String
      nro_pasjeros: Int
      id_aeropuerto_salida: Int
      id_aeropuerto_llegada: Int
    ): Vuelos
    vuelosDashboard(
      limit: Int
      page: Int
      order: String
      estado: EstadoVuelo
      id_operador: Int
      id_itinerario: Int
      fecha_despegue: String
      nro_pasjeros: Int
      id_aeropuerto_salida: Int
      id_aeropuerto_llegada: Int
    ): Vuelos
    vuelosConexiones(
      limit: Int
      page: Int
      order: String
      estado: EstadoVuelo
      id_operador: Int
      id_itinerario: Int
      fecha_despegue: String
      nro_pasjeros: Int
      id_aeropuerto_salida: Int
      id_aeropuerto_llegada: Int
      conexion_a_id: Int
    ): Vuelos
    vuelo(id: Int!): Vuelo
  `,
  Mutation: `
    vueloAdd(vuelo: NewVuelo!): Vuelo
    vueloEdit(id: Int!, vuelo: EditVuelo!): Vuelo
    vueloDelete(id: Int!): Delete
  `
};
