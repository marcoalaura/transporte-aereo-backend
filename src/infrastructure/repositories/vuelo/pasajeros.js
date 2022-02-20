'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');

module.exports = function pasajerosRepository (models, Sequelize) {
  const { aeronaves, aeropuertos, itinerarios, operadores, pasajeros, personas, tripulaciones, vuelos } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'nombres',
          'primer_apellido',
          'segundo_apellido',
          'nombre_completo',
          'tipo_documento',
          'tipo_documento_otro',
          'nro_documento',
          'fecha_nacimiento',
          'telefono',
          'movil',
          'nacionalidad',
          'pais_nacimiento',
          'genero',
          'estado',
          'observacion',
          'estado_verificacion'
        ],
        model: personas,
        as: 'persona'
      },
      {
        attributes: [
          'fecha_despegue',
          'fecha_aterrizaje',
          'hora_etd',
          'hora_eta',
          'motivo',
          'estado'
        ],
        model: vuelos,
        as: 'vuelo',
        include: [
          {
            attributes: [
              'id',
              'sigla',
              'razon_social'
            ],
            model: operadores,
            as: 'operador'
          },
          {
            attributes: [
              'id',
              'nro_vuelo',
              'estado',
              'tipo_vuelo'
            ],
            model: itinerarios,
            as: 'itinerario',
            include: [
              {
                attributes: [
                  'id',
                  'ciudad'
                ],
                model: aeropuertos,
                as: 'aeropuerto_salida'
              },
              {
                attributes: [
                  'id',
                  'ciudad'
                ],
                model: aeropuertos,
                as: 'aeropuerto_llegada'
              },
              {
                attributes: [
                  'id',
                  'matricula'
                ],
                model: aeronaves,
                as: 'aeronave'
              }
            ]
          }
        ]
      },
      {
        attributes: [
          'ciudad',
          'nro_licencia',
          'titulo',
          'vigencia',
          'estado'
        ],
        model: tripulaciones,
        as: 'tripulacion'
      }
    ];

    if (params.lugar_destino) {
      query.where.lugar_destino = {
        [Op.iLike]: `%${params.lugar_destino}%`
      };
    }

    if (params.email) {
      query.where.email = {
        [Op.iLike]: `%${params.email}%`
      };
    }

    if (params.lugar_origen) {
      query.where.lugar_origen = {
        [Op.iLike]: `%${params.lugar_origen}%`
      };
    }

    if (params.entidad_emisora_doc) {
      query.where.entidad_emisora_doc = {
        [Op.iLike]: `%${params.entidad_emisora_doc}%`
      };
    }

    if (params.nro_asiento) {
      query.where.nacionalidad = params.nro_asiento;
    }

    if (params.tipo_tripulacion) {
      query.where.tipo_tripulacion = params.tipo_tripulacion;
    }

    if (params.tipo_viajero) {
      query.where.tipo_viajero = params.tipo_viajero;
    }

    if (params.tipo) {
      query.where.tipo = params.tipo;
    }

    if (params.id_vuelo) {
      query.where.id_vuelo = params.id_vuelo;
    }

    if (params.id_persona) {
      query.where.id_persona = params.id_persona;
    }

    if (params.id_tripulacion) {
      query.where.id_tripulacion = params.id_tripulacion;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.nro_documento) {
      query.where['$persona.nro_documento$'] = params.nro_documento;
    }

    if (params.nombre_completo) {
      query.where[Op.or] = [
        {
          '$persona.nombre_completo$': {
            [Op.iLike]: `%${params.nombre_completo}%`
          }
        }
      ];
    }

    if (params.fecha_inicio) {
      if (params.fecha_fin) {
        query.where[Op.and] = [
          {
            '$vuelo.fecha_despegue$': {
              [Op.gte]: params.fecha_inicio
            }
          },
          {
            '$vuelo.fecha_aterrizaje$': {
              [Op.lte]: params.fecha_fin
            }
          }
        ];
      }
    }
    return pasajeros.findAndCountAll(query);
  }

  function findTripulante (params) {
    return pasajeros.findOne({
      where: {
        id_tripulacion: params.id_tripulacion,
        id_vuelo: params.id_vuelo
      }
    });
  }

  function findPasajero (params) {
    return pasajeros.findOne({
      where: {
        id_persona: params.id_persona,
        id_vuelo: params.id_vuelo,
        id_tripulacion: {
          [Op.eq]: null
        }
      }
    });
  }

  function findById (id) {
    return pasajeros.findOne({
      where: {
        id
      },
      include: [
        {
          attributes: [
            'nombres',
            'primer_apellido',
            'segundo_apellido',
            'nombre_completo',
            'tipo_documento',
            'tipo_documento_otro',
            'nro_documento',
            'fecha_nacimiento',
            'telefono',
            'movil',
            'nacionalidad',
            'pais_nacimiento',
            'genero',
            'estado',
            'observacion',
            'estado_verificacion'
          ],
          model: personas,
          as: 'persona'
        },
        {
          attributes: [
            'ciudad',
            'nro_licencia',
            'titulo',
            'vigencia',
            'estado'
          ],
          model: tripulaciones,
          as: 'tripulacion'
        }
      ],
      raw: true
    });
  }

  function buscarPorNroDocumento (params) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'nombres',
          'primer_apellido',
          'segundo_apellido',
          'nombre_completo',
          'tipo_documento',
          'tipo_documento_otro',
          'nro_documento',
          'fecha_nacimiento',
          'telefono',
          'movil',
          'nacionalidad',
          'pais_nacimiento',
          'genero',
          'estado',
          'observacion',
          'estado_verificacion'
        ],
        model: personas,
        as: 'persona'
      },
      {
        attributes: [
          'fecha_despegue',
          'fecha_aterrizaje',
          'hora_etd',
          'hora_eta',
          'motivo',
          'estado'
        ],
        model: vuelos,
        as: 'vuelo',
        include: [
          {
            attributes: [
              'id',
              'sigla',
              'razon_social'
            ],
            model: operadores,
            as: 'operador'
          },
          {
            attributes: [
              'id',
              'nro_vuelo',
              'estado',
              'tipo_vuelo'
            ],
            model: itinerarios,
            as: 'itinerario',
            include: [
              {
                attributes: [
                  'id',
                  'ciudad'
                ],
                model: aeropuertos,
                as: 'aeropuerto_salida'
              },
              {
                attributes: [
                  'id',
                  'ciudad'
                ],
                model: aeropuertos,
                as: 'aeropuerto_llegada'
              },
              {
                attributes: [
                  'id',
                  'matricula'
                ],
                model: aeronaves,
                as: 'aeronave'
              }
            ]
          }
        ]
      }
    ];

    if (params.nro_documento) {
      query.where['$persona.nro_documento$'] = params.nro_documento;
    }

    if (params.fecha_inicio) {
      if (params.fecha_fin) {
        query.where[Op.and] = [
          {
            '$vuelo.fecha_despegue$': {
              [Op.gte]: params.fecha_inicio
            }
          },
          {
            '$vuelo.fecha_aterrizaje$': {
              [Op.lte]: params.fecha_fin
            }
          }
        ];
      }
    }

    return pasajeros.findAndCountAll(query);
  }

  // function buscarPorNroDocumento (params) {
  //   console.log('***** pasajero - params : ', params);
  //   let cond = {
  //     where: {
  //       '$persona.nro_documento$': params.nro_documento
  //     },
  //     include: [
  //       {
  //         attributes: [
  //           'nombres',
  //           'primer_apellido',
  //           'segundo_apellido',
  //           'nombre_completo',
  //           'tipo_documento',
  //           'tipo_documento_otro',
  //           'nro_documento',
  //           'fecha_nacimiento',
  //           'telefono',
  //           'movil',
  //           'nacionalidad',
  //           'pais_nacimiento',
  //           'genero',
  //           'estado',
  //           'observacion',
  //           'estado_verificacion'
  //         ],
  //         model: personas,
  //         as: 'persona'
  //       },
  //       {
  //         attributes: [
  //           'fecha_despegue',
  //           'fecha_aterrizaje',
  //           'hora_etd',
  //           'hora_eta',
  //           'motivo',
  //           'estado'
  //         ],
  //         model: vuelos,
  //         as: 'vuelo',
  //         include: [
  //           {
  //             attributes: [
  //               'id',
  //               'nit',
  //               'codigo',
  //               'sigla',
  //               'razon_social'
  //             ],
  //             model: operadores,
  //             as: 'operador'
  //           },
  //           {
  //             attributes: [
  //               'id',
  //               'nro_vuelo',
  //               'estado',
  //               'tipo_vuelo'
  //             ],
  //             model: itinerarios,
  //             as: 'itinerario',
  //             include: [
  //               {
  //                 attributes: [
  //                   'id',
  //                   'codigo_icao',
  //                   'codigo_iata',
  //                   'ciudad',
  //                   'pais'
  //                 ],
  //                 model: aeropuertos,
  //                 as: 'aeropuerto_salida'
  //               },
  //               {
  //                 attributes: [
  //                   'id',
  //                   'codigo_icao',
  //                   'codigo_iata',
  //                   'ciudad',
  //                   'pais'
  //                 ],
  //                 model: aeropuertos,
  //                 as: 'aeropuerto_llegada'
  //               },
  //               {
  //                 attributes: [
  //                   'id',
  //                   'matricula',
  //                   'serie',
  //                   'marca',
  //                   'propietario'
  //                 ],
  //                 model: aeronaves,
  //                 as: 'aeronave'
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ],
  //     raw: true
  //   };

  //   // if (params.hora_salida) {
  //   //   cond.where.hora_etd = params.hora_salida;
  //   // }

  //   // return pasajeros.findOne(cond);
  //   return pasajeros.findAll(cond);
  // }

  async function createOrUpdate (pasajero, t) {
    const cond = {
      where: {
        id: pasajero.id
      }
    };

    const item = await pasajeros.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await pasajeros.update(pasajero, cond);
      } catch (e) {
        if (t) {
          t.rollback();
        }
        errorHandler(e);
      }
      return updated ? pasajeros.findOne(cond) : item;
    }

    let result;
    try {
      result = await pasajeros.create(pasajero, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, pasajeros);
  }

  return {
    findAll,
    findById,
    buscarPorNroDocumento,
    createOrUpdate,
    deleteItem,
    findTripulante,
    findPasajero
  };
};
