'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');
const moment = require('moment');

module.exports = function itinerariosRepository (models, Sequelize) {
  const { itinerarios, solicitudes, aeronaves, aeropuertos, operadores } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'codigo',
          'fecha_inicio',
          'fecha_fin',
          'estado',
          'id_operador'
        ],
        model: solicitudes,
        as: 'solicitud'
      },
      {
        attributes: [
          'matricula',
          'serie',
          'marca',
          'modelo',
          'estado',
          'id_operador'
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
          'estado',
          'lapso_entre_despegues'
        ],
        model: aeropuertos,
        as: 'aeropuerto_salida'
      },
      {
        attributes: [
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
    ];

    if (params.nro_vuelo) {
      query.where.nro_vuelo = {
        [Op.iLike]: `%${params.nro_vuelo}%`
      };
    }

    if (params.hora_despegue) {
      query.where.hora_despegue = params.hora_despegue;
    }

    if (params.hora_aterrizaje) {
      query.where.hora_aterrizaje = params.hora_aterrizaje;
    }

    if (params.dia_1) {
      query.where.dia_1 = params.dia_1;
    }

    if (params.dia_2) {
      query.where.dia_2 = params.dia_2;
    }

    if (params.dia_3) {
      query.where.dia_3 = params.dia_3;
    }

    if (params.dia_4) {
      query.where.dia_4 = params.dia_4;
    }

    if (params.dia_5) {
      query.where.dia_5 = params.dia_5;
    }

    if (params.dia_6) {
      query.where.dia_6 = params.dia_6;
    }

    if (params.dia_7) {
      query.where.dia_7 = params.dia_7;
    }

    if (params.id_aeronave) {
      query.where.id_aeronave = params.id_aeronave;
    }

    if (params.id_solicitud) {
      query.where.id_solicitud = params.id_solicitud;
    }

    if (params.id_aeropuerto_salida) {
      query.where.id_aeropuerto_salida = params.id_aeropuerto_salida;
    }

    if (params.id_aeropuerto_llegada) {
      query.where.id_aeropuerto_llegada = params.id_aeropuerto_llegada;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.tipo_vuelo) {
      query.where.tipo_vuelo = {
        [Op.and]: {tipo_vuelo: `NACIONAL`}
        // [Op.and]: `NACIONAL`
      };
    }

    return itinerarios.findAndCountAll(query);
  }

  function filter (params = {}) {
    let query = {
      where: {},
      attributes: [
        'id',
        'nro_vuelo',
        'hora_despegue',
        'hora_aterrizaje',
        'dia_1',
        'dia_2',
        'dia_3',
        'dia_4',
        'dia_5',
        'dia_6',
        'dia_7',
        'estado',
        'id_solicitud'
      ],
      raw: true
      // order: [['hora_despegue', 'ASC']]
    };

    query.include = [
      {
        attributes: [
          'fecha_inicio',
          'fecha_fin',
          'estado'
        ],
        model: solicitudes,
        as: 'solicitud',
        raw: true,
        include: [
          {
            attributes: [ 'sigla' ],
            model: operadores,
            as: 'operador'
          }
        ]
      },
      {
        attributes: [
          'matricula'
        ],
        model: aeronaves,
        as: 'aeronave'
      },
      {
        attributes: [
          'id',
          'codigo_iata'
        ],
        model: aeropuertos,
        as: 'aeropuerto_salida'
      },
      {
        attributes: [
          'codigo_iata'
        ],
        model: aeropuertos,
        as: 'aeropuerto_llegada'
      }
    ];

    if (params.id_solicitud) {
      query.where.id_solicitud = { [Op.ne]: params.id_solicitud };
    }

    if (params.fecha_inicio_solicitud) {
      // let ini = new Date(params.fecha_inicio_solicitud);
      let ini = moment(params.fecha_inicio_solicitud).format('YYYY-MM-DD');
      if (params.fecha_fin_solicitud) { // Solicitud con fecha final
        // let fin = new Date(params.fecha_fin_solicitud);
        let fin = moment(params.fecha_fin_solicitud).format('YYYY-MM-DD');
        /*
         aqui se filtran cuatro casos principales donde se deberia incluir el itinerario por
         rango de fechas:

         solicitud         |----------------------------------------------|
         c1            |--------------|
         c2                          |---------------------|
         c3                                                      |------------|
         c4          |---------------------------------------------------------------|
         */
        query.where[Op.or] = [
          { [Op.and]: // c1
            [
              { '$solicitud.fecha_inicio$': { [Op.gte]: ini } },
              { '$solicitud.fecha_inicio$': { [Op.lte]: fin } },
              { '$solicitud.fecha_fin$': { [Op.gte]: ini } },
              { '$solicitud.fecha_fin$': { [Op.gte]: fin } }
            ]
          },
          {
            [Op.and]: // c2
            [
              { '$solicitud.fecha_inicio$': { [Op.lte]: ini } },
              { '$solicitud.fecha_inicio$': { [Op.lte]: fin } },
              { '$solicitud.fecha_fin$': { [Op.gte]: ini } },
              { '$solicitud.fecha_fin$': { [Op.gte]: fin } }
            ]
          },
          {
            [Op.and]: // c3
            [
              { '$solicitud.fecha_inicio$': { [Op.lte]: ini } },
              { '$solicitud.fecha_inicio$': { [Op.lte]: fin } },
              { '$solicitud.fecha_fin$': { [Op.gte]: ini } },
              { '$solicitud.fecha_fin$': { [Op.lte]: fin } }
            ]
          },
          {
            [Op.and]: // c4
            [
              { '$solicitud.fecha_inicio$': { [Op.gte]: ini } },
              { '$solicitud.fecha_inicio$': { [Op.lte]: fin } },
              { '$solicitud.fecha_fin$': { [Op.gte]: ini } },
              { '$solicitud.fecha_fin$': { [Op.lte]: fin } }
            ]
          }
        ];
      } // else { // Solicitud sin fecha final
      //   query.where[Op.or] = [
      //     { '$solicitud.fecha_inicio$': { [Op.gte]: ini } },
      //     {
      //       '$solicitud.fecha_inicio$': { [Op.lte]: ini },
      //       [Op.and]: { '$solicitud.fecha_fin$': { [Op.gte]: ini } }
      //     },
      //     { '$solicitud.fecha_inicio$': { [Op.lte]: ini } }
      //   ];
      // }
    }

    if (params.estado_solicitud) {
      query.where['$solicitud.estado$'] = params.estado_solicitud;
    }
    /*
    if (params.fecha_inicio_solicitud) {
      // let ini = new Date(params.fecha_inicio_solicitud);
      let ini = moment(params.fecha_inicio_solicitud).format('YYYY-MM-DD');
      if (params.fecha_fin_solicitud) { // Solicitud con fecha final
        // let fin = new Date(params.fecha_fin_solicitud);
        let fin = moment(params.fecha_fin_solicitud).format('YYYY-MM-DD');
        query.where[Op.or] = [
          { '$solicitud.fecha_inicio$': { [Op.gte]: ini } },
          { '$solicitud.fecha_fin$': { [Op.lte]: fin } },
          {
            '$solicitud.fecha_inicio$': { [Op.lte]: ini },
            [Op.and]: {
              [Op.or]: [
                { '$solicitud.fecha_fin$': { [Op.gte]: fin } },
                { '$solicitud.fecha_fin$': null }
              ]
            }
          }
        ];
      }
      else { // Solicitud sin fecha final
        query.where[Op.or] = [
          { '$solicitud.fecha_inicio$': { [Op.gte]: ini } },
          {
            '$solicitud.fecha_inicio$': { [Op.lte]: ini },
            [Op.and]: { '$solicitud.fecha_fin$': { [Op.gte]: ini } }
          },
          { '$solicitud.fecha_inicio$': { [Op.lte]: ini } }
        ];
      }
    }
     */
    // console.log('-------------------------------query', query.where);

    return itinerarios.findAll(query);
  }
  
  function findById (id) {
    return itinerarios.findOne({
      where: {
        id
      },
      include: [
        {
          attributes: [
            'codigo',
            'fecha_inicio',
            'fecha_fin',
            'estado'
          ],
          model: solicitudes,
          as: 'solicitud'
        },
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
      ],
      raw: true
    });
  }

  async function findByIdOperadorYRangoFechas (idOperador, fechaInicio, fechaFin) {
    let query = {
      where: {},
      attributes: [
        'id',
        'hora_despegue',
        'hora_aterrizaje',
        'nro_vuelo',
        'estado',
        'dia_1',
        'dia_2',
        'dia_3',
        'dia_4',
        'dia_5',
        'dia_6',
        'dia_7',
        'observacion',
        'tipo_vuelo'
      ],
      raw: true
    };

    query.include = [
      {
        attributes: [
          'id',
          'fecha_inicio',
          'fecha_fin',
          'estado'
        ],
        model: solicitudes,
        as: 'solicitud',
        raw: true,
        include: [
          {
            attributes: ['sigla'],
            model: operadores,
            as: 'operador',
            raw: true
          }
        ]
      },
      {
        attributes: [
          'codigo_iata',
          'codigo_icao',
          'nombre'
        ],
        model: aeropuertos,
        as: 'aeropuerto_salida',
        raw: true
      },
      {
        attributes: [
          'codigo_iata',
          'codigo_icao',
          'nombre'
        ],
        model: aeropuertos,
        as: 'aeropuerto_llegada',
        raw: true
      },
      {
        attributes: [
          'matricula'
        ],
        model: aeronaves,
        as: 'aeronave',
        raw: true
      }
    ];
    query.where['$solicitud.id_operador$'] = parseInt(idOperador);
    query.where.estado = 'APROBADO'; // solo vigentes
    
    // // controlando rango de fechas
    let desde = moment(fechaInicio).format('YYYY-MM-DD');
    let hasta = moment(fechaFin).format('YYYY-MM-DD');
    console.log('desde:::::', desde);
    console.log('hasta:::::', hasta);
    query.where[Op.or] = [
      {
        [Op.and]:
        [
          { '$solicitud.fecha_inicio$': { [Op.gte]: desde } },
          { '$solicitud.fecha_fin$': { [Op.lte]: hasta } }
        ]
      }
    ];

    console.log('query---------', query.where);
    return itinerarios.findAll(query);
    // return itinerarios.findAndCountAll(query);
  }
  
  async function createAll (items, t) {
    try {
      let result = await itinerarios.bulkCreate(items, t ? { transaction: t } : {});
      return result;
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }
  }

  async function createOrUpdate (itinerario, t) {
    let cond = {
      where: {
        id: itinerario.id
      }
    };

    const item = await itinerarios.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await itinerarios.update(itinerario, cond);
      } catch (e) {
        if (t) {
          t.rollback();
        }
        errorHandler(e);
      }
      return updated ? itinerarios.findOne(cond) : item;
    }

    let result;
    try {
      result = await itinerarios.create(itinerario, t ? { transaction: t } : {});
    } catch (e) {
      if (t) {
        t.rollback();
      }
      errorHandler(e);
    }

    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, itinerarios);
  }

  function findNroVuelo (parametros) {
    if (parametros.id) {
      parametros.id = {
        [Op.ne]: parametros.id
      };
    }
    return itinerarios.findOne({
      where: parametros
    });
  }

  function findBySolicitud (parametros) {
    if (parametros.id) {
      parametros.id = {
        [Op.ne]: parametros.id
      };
    }
    return itinerarios.findAll({
      where: parametros,
      include: [
        {
          attributes: ['lapso_entre_despegues', 'codigo_iata'],
          model: aeropuertos,
          as: 'aeropuerto_salida'
        },
        {
          attributes: ['codigo_iata'],
          model: aeropuertos,
          as: 'aeropuerto_llegada'
        },
        {
          attributes: ['matricula'],
          model: aeronaves,
          as: 'aeronave'
        }
      ],
      raw: true
    });
  }

  return {
    findAll,
    findById,
    findByIdOperadorYRangoFechas,
    deleteItem,
    createOrUpdate,
    createAll,
    filter,
    findNroVuelo,
    findBySolicitud
  };
};
