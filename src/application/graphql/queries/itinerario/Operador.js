module.exports = {
  Query: `
    operadores(
      limit: Int
      page: Int
      order: String 
      nit: String
      sigla: String
      razon_social: String
      matricula_comercio: String
      licencia: String
      tipo: TipoOperador
      estado: EstadoOperador
    ): Operadores
    operador(id: Int!): Operador
  `,
  Mutation: `
    operadorAdd(operador: NewOperador): Operador
    operadorEdit(id: Int!, operador: EditOperador): Operador
    operadorDelete(id: Int!): Delete
  `
};
