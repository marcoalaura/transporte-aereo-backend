module.exports = {
  Query: `
    usuarios(
      limit: Int 
      page: Int 
      order: String
      usuario: String, 
      email: String, 
      nombre_completo: String,
      estado: EstadoUsuario,
      id_rol: Int,
      id_entidad: Int
    ): Usuarios
    usuario(id: Int!): Usuario
    usuarioOnlyToken(id: Int!): Usuario
  `,
  Mutation: `
    usuarioAdd(usuario: NewUsuario): Usuario
    usuarioEdit(id: Int!, usuario: EditUsuario): Usuario
    usuarioUpdate(id: Int!, usuario: EditUsuario): Usuario
    usuarioDelete(id: Int!): Delete
  `
};
