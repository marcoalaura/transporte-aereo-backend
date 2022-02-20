module.exports = `
  # DgacAeronaves - aerolíneas
  type DgacAeronave {
    # ID del aeronave
    id: ID!
    # nroMatricula
    nroMatricula: String
    # nroSerie
    nroSerie: String
    # marca
    marca: String
    # modelo
    modelo: String
    # modelo genérico
    modeloGenerico: String
    # fechaInscripcion
    fechaInscripcion: String
    # propietario
    propietario: String
    # ciudad
    ciudad: String
    # estado
    estado: String
    # observaciones
    observaciones: String
    # volumenReferencial
    volumenReferencial: Int
    # fechaActualizacion
    fechaActualizacion: String
    # Id de la persona que creo el registro
    _user_created: Int
    # DgacAeronave que actualizó el registro
    _user_updated: Int
    # Fecha de creación del registro
    _created_at: Date
    # Fecha de actualización del registro
    _updated_at: Date
  }

  # Objeto para crear un aeronave
  input NewDgacAeronave {
    nroMatricula: String
    nroSerie: String
    marca: String
    modelo: String
    modeloGenerico: String
    fechaInscripcion: String
    propietario: String
    ciudad: String
    estado: String
    observaciones: String
    volumenReferencial: Int
    fechaActualizacion: String
  }

  # Objeto para editar un aeronave
  input EditDgacAeronave {
    nroMatricula: String
    nroSerie: String
    marca: String
    modelo: String
    modeloGenerico: String
    fechaInscripcion: String
    propietario: String
    ciudad: String
    estado: String
    observaciones: String
    volumenReferencial: Int
    fechaActualizacion: String
  }

  # Objeto de paginación para aeronave
  type DgacAeronaves {
    count: Int 
    rows: [DgacAeronave]
  }
`;
