module.exports = `
  # Rols del sistema
  type Rol {
    # ID de la Rol
    # id de Rol
    id: ID!
    # nombre de Rol
    nombre: String!
    # path de Rol
    path: String
    # descripcion de Rol
    descripcion: String
    # _user_created de Rol
    _user_created: Int
    # _user_updated de Rol
    _user_updated: Int
    # _created_at de Rol
    _created_at: Date
    # _updated_at de Rol
    _updated_at: Date
  }

  # Objeto para crear un Rol
  input NewRol {
    nombre: String
    descripcion: String
    path: String
  }

  # Objeto para editar un Rol
  input EditRol {
    nombre: String!
    descripcion: String
    path: String
  }

  # Objeto de paginación para Rol
  type Roles {
    count: Int 
    rows: [Rol]
  }
`;
