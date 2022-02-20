'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');
const moment = require('moment');

module.exports = function vuelosRepository (models, Sequelize) {
  const { vuelos, itinerarios, aeropuertos, aeronaves, operadores, puertas } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params, [ 'matricula', 'nro_vuelo' ]);
    query.where = {};

    query.include = [
      {
        attributes: [
          'nro_vuelo',
          'hora_despegue',
          'hora_aterrizaje',
          'tipo_vuelo',
          'dia_1',
          'dia_2',
          'dia_3',
          'dia_4',
          'dia_5',
          'dia_6',
          'dia_7',
          'id_aeronave',
          'id_aeropuerto_salida',
          'id_aeropuerto_llegada',
          'estado'
        ],
        model: itinerarios,
        as: 'itinerario',
        raw: true,
        include: [
          {
            attributes: [
              'matricula',
              'serie',
              'marca',
              'modelo',
              'estado'
            ],
            model: aeronaves,
            as: 'aeronave'
          },
          {
            attributes: [
              'id',
              'codigo_icao',
              'codigo_iata',
              'nombre',
              'ciudad',
              'pais',
              'lat_decimal',
              'lon_decimal',
              'estado'
            ],
            model: aeropuertos,
            as: 'aeropuerto_salida'
          },
          {
            attributes: [
              'id',
              'codigo_icao',
              'codigo_iata',
              'nombre',
              'ciudad',
              'pais',
              'lat_decimal',
              'lon_decimal',
              'estado'
            ],
            model: aeropuertos,
            as: 'aeropuerto_llegada'
          }
        ]
      },
      {
        attributes: [
          'codigo_icao',
          'codigo_iata',
          'nombre',
          'ciudad',
          'pais',
          'estado'
        ],
        model: aeropuertos,
        as: 'aeropuerto_escala'
      },
      {
        attributes: [
          'razon_social',
          'sigla',
          'estado'
        ],
        model: operadores,
        as: 'operador'
      },
      {
        attributes: [
          'nro_puerta',
          'tipo_vuelo'
        ],
        model: puertas,
        as: 'puerta_salida'
      },
      {
        attributes: [
          'nro_puerta',
          'tipo_vuelo'
        ],
        model: puertas,
        as: 'puerta_llegada'
      }
    ];

    if (params.fecha_despegue) {
      query.where.fecha_despegue = {
        [Op.iLike]: `%${params.fecha_despegue}%`
      };
    }

    if (params.fecha_aterrizaje) {
      query.where.fecha_aterrizaje = {
        [Op.iLike]: `%${params.fecha_aterrizaje}%`
      };
    }

    if (params.id_aeropuerto_escala_pais) {
      query.where.id_aeropuerto_escala_pais = params.id_aeropuerto_escala_pais;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.id_operador) {
      query.where.id_operador = params.id_operador;
    }

    if (params.fecha_despegue) {
      // query.where.fecha_despegue = new Date(params.fecha_despegue);
      query.where.fecha_despegue = moment(params.fecha_despegue);
    }

    if (params.id_aeropuerto_salida) {
      query.where['$itinerario.id_aeropuerto_salida$'] = params.id_aeropuerto_salida;
    }

    if (params.id_aeropuerto_llegada) {
      query.where['$itinerario.id_aeropuerto_llegada$'] = params.id_aeropuerto_llegada;
    }

    if (params.nro_pasajeros) {
      query.where.nro_pasajeros = params.nro_pasajeros;
    }

    if (params.id_aeropuerto) {
      query.where[Op.or] = [
        { '$itinerario.id_aeropuerto_salida$': params.id_aeropuerto },
        { '$itinerario.id_aeropuerto_llegada$': params.id_aeropuerto }
      ];
    }

    if (params.nro_vuelo) {
      query.where['$itinerario.nro_vuelo$'] = params.nro_vuelo;
    }

    if (params.aeropuerto_salida_codigo_iata) {
      query.where['$aeropuerto_salida.codigo_iata$'] = params.aeropuerto_salida_codigo_iata;
    }

    if (params.aeropuerto_llegada_codigo_iata) {
      query.where['$aeropuerto_llegada.codigo_iata$'] = params.aeropuerto_llegada_codigo_iata;
    }
    return vuelos.findAndCountAll(query);
  }

  function findAllVuelosConexiones (params = {}) {
    let query = getQuery(params, []);
    query.where = {};

    query.include = [
      {
        attributes: [
          'nro_vuelo',
          'hora_despegue',
          'hora_aterrizaje',
          'tipo_vuelo',
          'id_aeropuerto_salida',
          'id_aeropuerto_llegada'
        ],
        model: itinerarios,
        as: 'itinerario',
        raw: true,
        include: [
          {
            attributes: [
              'id',
              'codigo_icao',
              'codigo_iata',
              'nombre',
              'ciudad',
              'pais'
            ],
            model: aeropuertos,
            as: 'aeropuerto_salida'
          },
          {
            attributes: [
              'id',
              'codigo_icao',
              'codigo_iata',
              'nombre',
              'ciudad',
              'pais'
            ],
            model: aeropuertos,
            as: 'aeropuerto_llegada'
          }
        ]
      },
      {
        attributes: [
          'razon_social',
          'sigla'
        ],
        model: operadores,
        as: 'operador'
      },
      {
        attributes: [
          'nro_puerta',
          'tipo_vuelo'
        ],
        model: puertas,
        as: 'puerta_salida'
      },
      {
        attributes: [
          'nro_puerta',
          'tipo_vuelo'
        ],
        model: puertas,
        as: 'puerta_llegada'
      }
    ];

    if (params.fecha_despegue) {
      query.where.fecha_despegue = {
        [Op.iLike]: `%${params.fecha_despegue}%`
      };
    }

    if (params.fecha_aterrizaje) {
      query.where.fecha_aterrizaje = {
        [Op.iLike]: `%${params.fecha_aterrizaje}%`
      };
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.id_operador) {
      query.where.id_operador = params.id_operador;
    }

    if (params.fecha_despegue) {
      query.where.fecha_despegue = moment(params.fecha_despegue);
    }

    if (params.id_aeropuerto_salida) {
      query.where['$itinerario.id_aeropuerto_salida$'] = params.id_aeropuerto_salida;
    }

    if (params.id_aeropuerto_llegada) {
      query.where['$itinerario.id_aeropuerto_llegada$'] = params.id_aeropuerto_llegada;
    }

    if (params.nro_pasajeros) {
      query.where.nro_pasajeros = params.nro_pasajeros;
    }

    if (params.id_aeropuerto) {
      query.where[Op.or] = [
        { '$itinerario.id_aeropuerto_salida$': params.id_aeropuerto },
        { '$itinerario.id_aeropuerto_llegada$': params.id_aeropuerto }
      ];
    }
    // if (params.fecha_despegue) {
    //   query.where.fecha_despegue = {
    //     [Op.lte]: new Date(params.fecha_despegue),
    //     [Op.gte]: new Date(new Date(params.fecha_despegue) - 24 * 60 * 60 * 1000)
    //   };
    // }
    return vuelos.findAndCountAll(query);
  }

  function find (params) {
    let cond = {
      where: {
        fecha_despegue: params.fecha_salida,
        // hora_etd: params.hora_salida,
        // hora_eta: params.hora_llegada,
        '$itinerario.nro_vuelo$': params.nro_vuelo,
        '$itinerario.aeropuerto_salida.codigo_iata$': params.aeropuerto_salida,
        '$itinerario.aeropuerto_llegada.codigo_iata$': params.aeropuerto_llegada
      },
      include: [
        {
          attributes: [
            'nro_vuelo',
            'id_aeropuerto_salida',
            'id_aeropuerto_llegada',
            'estado'
          ],
          model: itinerarios,
          as: 'itinerario',
          raw: true,
          include: [
            {
              attributes: [
                'codigo_icao',
                'codigo_iata',
                'estado'
              ],
              model: aeropuertos,
              as: 'aeropuerto_salida'
            },
            {
              attributes: [
                'codigo_icao',
                'codigo_iata',
                'estado'
              ],
              model: aeropuertos,
              as: 'aeropuerto_llegada'
            }
          ]
        }
      ],
      raw: true
    };

    if (params.hora_salida) {
      cond.where.hora_etd = params.hora_salida;
    }

    return vuelos.findOne(cond);
  }

  function findById (id) {
    return vuelos.findOne({
      where: {
        id
      },
      include: [
        {
          attributes: [
            'nro_vuelo',
            'hora_despegue',
            'hora_aterrizaje',
            'tipo_vuelo',
            'dia_1',
            'dia_2',
            'dia_3',
            'dia_4',
            'dia_5',
            'dia_6',
            'dia_7',
            'id_aeronave',
            'id_aeropuerto_salida',
            'id_aeropuerto_llegada',
            'estado'
          ],
          model: itinerarios,
          as: 'itinerario',
          raw: true,
          include: [
            {
              attributes: [
                'matricula',
                'serie',
                'marca',
                'modelo',
                'estado'
              ],
              model: aeronaves,
              as: 'aeronave'
            },
            {
              attributes: [
                'id',
                'codigo_icao',
                'codigo_iata',
                'nombre',
                'ciudad',
                'pais',
                'estado'
              ],
              model: aeropuertos,
              as: 'aeropuerto_salida'
            },
            {
              attributes: [
                'id',
                'codigo_icao',
                'codigo_iata',
                'nombre',
                'ciudad',
                'pais',
                'estado'
              ],
              model: aeropuertos,
              as: 'aeropuerto_llegada'
            }
          ]
        },
        {
          attributes: [
            'codigo_icao',
            'codigo_iata',
            'nombre',
            'ciudad',
            'pais',
            'estado'
          ],
          model: aeropuertos,
          as: 'aeropuerto_escala'
        },
        {
          attributes: [
            'id',
            'nro_puerta'
          ],
          model: puertas,
          as: 'puerta_salida'
        },
        {
          attributes: [
            'id',
            'nro_puerta'
          ],
          model: puertas,
          as: 'puerta_llegada'
        }
      ],
      raw: true
    });
  }

  function findOne (where) {
    console.log('WHERE', where);
    return vuelos.findOne({
      where,
      include: [
        {
          attributes: [
            'nro_vuelo',
            'hora_despegue',
            'hora_aterrizaje',
            'tipo_vuelo',
            'dia_1',
            'dia_2',
            'dia_3',
            'dia_4',
            'dia_5',
            'dia_6',
            'dia_7',
            'id_aeronave',
            'id_aeropuerto_salida',
            'id_aeropuerto_llegada',
            'estado'
          ],
          model: itinerarios,
          as: 'itinerario',
          raw: true,
          include: [
            {
              attributes: [
                'matricula',
                'serie',
                'marca',
                'modelo',
                'estado'
              ],
              model: aeronaves,
              as: 'aeronave'
            },
            {
              attributes: [
                'id',
                'codigo_icao',
                'codigo_iata',
                'nombre',
                'ciudad',
                'pais',
                'estado'
              ],
              model: aeropuertos,
              as: 'aeropuerto_salida'
            },
            {
              attributes: [
                'id',
                'codigo_icao',
                'codigo_iata',
                'nombre',
                'ciudad',
                'pais',
                'estado'
              ],
              model: aeropuertos,
              as: 'aeropuerto_llegada'
            }
          ]
        },
        {
          attributes: [
            'codigo_icao',
            'codigo_iata',
            'nombre',
            'ciudad',
            'pais',
            'estado'
          ],
          model: aeropuertos,
          as: 'aeropuerto_escala'
        },
        {
          attributes: [
            'id',
            'nro_puerta'
          ],
          model: puertas,
          as: 'puerta_salida'
        },
        {
          attributes: [
            'id',
            'nro_puerta'
          ],
          model: puertas,
          as: 'puerta_llegada'
        }
      ],
      raw: true
    });
  }

  async function createAll (items, t) {
    try {
      let result = await vuelos.bulkCreate(items, t ? { transaction: t } : {});
      return result;
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }
  }

  async function createOrUpdate (vuelo, t) {
    const cond = {
      where: {
        id: vuelo.id
      }
    };

    const item = await vuelos.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await vuelos.update(vuelo, cond);
      } catch (e) {
        if (t) {
          t.rollback();
        }
        errorHandler(e);
      }
      return updated ? vuelos.findOne(cond) : item;
    }

    let result;
    try {
      result = await vuelos.create(vuelo, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, vuelos);
  }

  return {
    findAll,
    findAllVuelosConexiones,
    find,
    findById,
    deleteItem,
    createOrUpdate,
    createAll,
    findOne
  };
};
