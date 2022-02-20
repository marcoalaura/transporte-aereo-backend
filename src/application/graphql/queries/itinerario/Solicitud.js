module.exports = {
  Query: `
    solicitudes(
      limit: Int
      page: Int
      order: String 
      codigo: String
      observacion: String
      tipo: TipoOperador
      estado: EstadoSolicitud
      id_operador: Int
      plan: Boolean
      desde_fecha: String
      hasta_fecha: String
    ): Solicitudes
    solicitudesAll(
      limit: Int
      page: Int
      order: String 
      codigo: String
      observacion: String
      tipo: TipoOperador
      estado: EstadoSolicitud
      id_operador: Int
      plan: Boolean
      desde_fecha: String
      hasta_fecha: String
    ): Solicitudes
    solicitud(id: Int!): Solicitud
  `,
  Mutation: `
    solicitudAdd(solicitud: NewSolicitud): Solicitud
    solicitudEdit(id: Int!, solicitud: EditSolicitud): Solicitud    
    solicitudDelete(id: Int!): Delete
    aprobarItinerarios(id_solicitud: Int!, id_usuaro: Int, ids_itinerarios: [Int]!): IdsItinerarios
  `
};
