module.exports = `
  # Conexiones
  type Conexion {
    # ID de la conexion
    id: ID!
    # id_itinerario_a
    id_itinerario_a: Int!
    # itinerarioA_nro_vuelo
    itinerarioA_nro_vuelo: String
    # itinerarioA_hora_despegue
    itinerarioA_hora_despegue: String
    # itinerarioA_hora_aterrizaje
    itinerarioA_hora_aterrizaje: String
    # itinerarioA_estado
    itinerarioA_estado: String
    # itinerarioA_tipo_vuelo
    itinerarioA_tipo_vuelo: TipoVuelo
    # itinerarioA_id_aeropuerto_salida
    itinerarioA_id_aeropuerto_salida: Int
    # itinerarioA_id_aeropuerto_llegada 
    itinerarioA_id_aeropuerto_llegada: Int 
    # id_itinerario_b
    id_itinerario_b: Int!
    # itinerarioB_nro_vuelo
    itinerarioB_nro_vuelo: String
    # itinerarioB_hora_despegue
    itinerarioB_hora_despegue: String
    # itinerarioB_hora_aterrizaje
    itinerarioB_hora_aterrizaje: String
    # itinerarioB_estado
    itinerarioB_estado: String
    # itinerarioB_tipo_vuelo
    itinerarioB_tipo_vuelo: TipoVuelo
    # itinerarioB_id_aeropuerto_salida
    itinerarioB_id_aeropuerto_salida: Int
    # itinerarioB_id_aeropuerto_llegada 
    itinerarioB_id_aeropuerto_llegada: Int 
    # itinerarioB ciudad 
    itinerarioB_aeropuerto_llegada_ciudad: String
    # Id de la persona que creo el registro
    _user_created: Int
    # Itinerario que actualizó el registro
    _user_updated: Int
    # Fecha de creación del registro
    _created_at: Date
    # Fecha de actualización del registro
    _updated_at: Date
  }

  # Objeto para crear una conexion
  input NewConexion {
    id_itinerario_a: Int!
    id_itinerario_b: Int!
  }

  # Objeto para editar una conexion
  input EditConexion {
    id_itinerario_a: Int!
    id_itinerario_b: Int!
  }

  # Objeto de paginación para conexion
  type Conexiones {
    count: Int 
    rows: [Conexion]
  }
`;
