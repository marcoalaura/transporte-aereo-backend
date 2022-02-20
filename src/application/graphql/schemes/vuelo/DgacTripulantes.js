module.exports = `
  # DgacTripulantes - aerolíneas
  type DgacTripulante {
    # ID del aeronave
    id: ID!
    # apPaterno
    apPaterno: String
    # apMaterno
    apMaterno: String
    # nombre
    nombre: String
    # ciudad
    ciudad: String
    # nroLicencia
    nroLicencia: String
    # titulo
    titulo: String
    # vigencia
    vigencia: String
    # Id de la persona que creo el registro
    _user_created: Int
    # DgacTripulantes que actualizó el registro
    _user_updated: Int
    # Fecha de creación del registro
    _created_at: Date
    # Fecha de actualización del registro
    _updated_at: Date
  }

  # Objeto para crear un aeronave
  input NewDgacTripulante {
    apPaterno: String
    apMaterno: String
    nombre: String
    ciudad: String
    nroLicencia: String
    titulo: String
    vigencia: String
  }

  # Objeto para editar un aeronave
  input EditDgacTripulante {
    apPaterno: String
    apMaterno: String
    nombre: String
    ciudad: String
    nroLicencia: String
    titulo: String
    vigencia: String
  }

  # Objeto de paginación para aeronave
  type DgacTripulantes {
    count: Int 
    rows: [DgacTripulante]
  }
`;
