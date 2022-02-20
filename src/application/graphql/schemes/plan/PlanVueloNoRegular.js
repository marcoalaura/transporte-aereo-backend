module.exports = `
  # PlanVueloNoRegulares
  type PlanVueloNoRegular {
    # ID del planVueloNoRegular
    id: ID!
    # Codigo de plan de vuelo no regular
    cod_plan_vuelo: Int!
    # Detalle de plan de vuelo no regular
    detalle: JSON
    # Estado de plan de vuelo no regular
    estado: EstadoPlanVueloNoRegular
    # Id creador planVueloNoRegular
    _user_created: Int
    # Id actualizados planVueloNoRegular
    _user_updated: Int
    # Fecha creacion planVueloNoRegular
    _created_at: Date
    # Fecha actuaizacion planVueloNoRegular
    _updated_at: Date
  }

  # Estados planVueloNoRegular
  enum EstadoPlanVueloNoRegular {
    CREADO
    APROBADO
    RECHAZADO
    OBSERVADO
  }

  # Objeto para crear planVueloNoRegular 
  input NewPlanVueloNoRegular {
    cod_plan_vuelo: Int
    detalle: JSON
    estado: EstadoPlanVueloNoRegular
  }

  # Objeto para editar planVueloNoRegular
  input EditPlanVueloNoRegular {
    cod_plan_vuelo: Int
    detalle: JSON
    estado: EstadoPlanVueloNoRegular
  }

  # Objeto paginacion para planVueloNoRegular
  type PlanVueloNoRegulares {
    count: Int
    rows: [PlanVueloNoRegular]
  }
`;
