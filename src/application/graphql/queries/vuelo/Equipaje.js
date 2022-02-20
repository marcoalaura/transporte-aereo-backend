module.exports = {
  Query: `
    # Lista de equipajes
    equipajes(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena DESC
      order: String, 
    ): Equipajes
    # Obtener un equipaje
    equipaje(id: Int!): Equipaje
  `,
  Mutation: `
    # Agregar equipaje
    equipajeAdd(equipaje: NewEquipaje!): Equipaje
    # Editar equipaje
    equipajeEdit(id: Int!, equipaje: EditEquipaje!): Equipaje
    # Eliminar equipaje
    equipajeDelete(id: Int!): Delete
  `
};
