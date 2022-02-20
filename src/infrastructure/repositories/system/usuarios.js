'use strict';

const { getQuery, errorHandler } = require('../../lib/util');
const { deleteItemModel } = require('../../lib/queries');
const { text } = require('../../../common');

module.exports = function usuariosRepository (models, Sequelize) {
  const { usuarios, roles, personas, entidades, operadores, aeropuertos } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: ['nombre', 'path'],
        model: roles,
        as: 'rol'
      },
      {
        attributes: [
          'razon_social',
          'tipo_transporte',
          'sigla',
          'estado'
        ],
        model: operadores,
        as: 'operador'
      },
      {
        attributes: ['nombre'],
        model: entidades,
        as: 'entidad'
      },
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
          'estado'
        ],
        model: personas,
        as: 'persona'
      },
      {
        attributes: [
          'codigo_iata',
          'nombre',
          'estado'
        ],
        model: aeropuertos,
        as: 'aeropuerto'
      }
    ];

    if (params.nombre_completo) {
      query.where[Op.or] = [
        { '$persona.nombres$': {
          [Op.iLike]: `%${params.nombre_completo}%` }
        },
        { '$persona.primer_apellido$': {
          [Op.iLike]: `%${params.nombre_completo}%` }
        },
        { '$persona.segundo_apellido$': {
          [Op.iLike]: `%${params.nombre_completo}%` }
        }
      ];
    }

    if (params.usuario) {
      query.where.usuario = {
        [Op.iLike]: `%${params.usuario}%`
      };
    }

    if (params.email) {
      query.where.email = {
        [Op.iLike]: `%${params.email}%`
      };
    }

    if (params.cargo) {
      query.where.cargo = {
        [Op.iLike]: `%${params.cargo}%`
      };
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.estados) {
      query.where.estado = {
        [Op.in]: params.estados
      };
    }

    if (params.id_rol) {
      query.where.id_rol = params.id_rol;
    }

    if (params.id_entidad) {
      query.where.id_entidad = params.id_entidad;
    }

    if (params.id_persona) {
      query.where.id_persona = params.id_persona;
    }

    if (params.id_operador) {
      query.where.id_operador = params.id_operador;
    }

    if (params.id_roles) {
      query.where.id_rol = {
        [Op.in]: params.id_roles
      };
    }

    if (params.id_aeropuerto) {
      query.where.id_aeropuerto = params.id_aeropuerto;
    }

    if (params.roles) {
      query.where['$rol.nombre$'] = {
        [Op.in]: params.roles
      };
    }

    return usuarios.findAndCountAll(query);
  }

  function findById (id) {
    return usuarios.findById(id, {
      include: [
        {
          attributes: ['nombre', 'path'],
          model: roles,
          as: 'rol'
        },
        {
          attributes: [
            'razon_social',
            'tipo_transporte',
            'sigla',
            'estado'
          ],
          model: operadores,
          as: 'operador'
        },
        {
          attributes: ['nombre'],
          model: entidades,
          as: 'entidad'
        },
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
            'estado'
          ],
          model: personas,
          as: 'persona'
        }
      ],
      raw: true
    });
  }
  // find user
  function findByUsername (usuario, include = true) {
    let cond = {
      where: {
        usuario
      }
    };

    if (include) {
      cond.include = [
        {
          attributes: ['nombre', 'path'],
          model: roles,
          as: 'rol'
        },
        {
          attributes: [
            'razon_social',
            'tipo_transporte',
            'sigla',
            'estado'
          ],
          model: operadores,
          as: 'operador'
        },
        {
          attributes: ['nombre'],
          model: entidades,
          as: 'entidad'
        },
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
            'estado'
          ],
          model: personas,
          as: 'persona'
        }
      ];
    } else {
      cond.include = [
        {
          attributes: ['nombre', 'path'],
          model: roles,
          as: 'rol'
        },
        {
          attributes: [
            'razon_social',
            'tipo_transporte',
            'sigla'
          ],
          model: operadores,
          as: 'operador'
        }
      ];
    }
    cond.raw = true;

    return usuarios.findOne(cond);
  }

  // find userByCi
  function findByCi (persona) {
    let cond = {
      attributes: ['id', 'usuario'],
      include: [{
        attributes: ['id'],
        model: personas,
        as: 'persona',
        where: persona,
        require: true
      }]
    };

    cond.raw = true;

    return usuarios.findOne(cond);
  }

  async function createOrUpdate (usuario, t) {
    const cond = {
      where: {
        id: usuario.id
      }
    };

    const item = await usuarios.findOne(cond);

    if (item) {
      let updated;
      try {
        if (usuario.contrasena) {
          usuario.contrasena = text.encrypt(usuario.contrasena);
        }
        if (t) {
          cond.transaction = t;
        }
        updated = await usuarios.update(usuario, cond);
      } catch (e) {
        errorHandler(e);
      }
      return updated ? usuarios.findOne(cond) : item;
    }

    let result;
    try {
      usuario.contrasena = text.encrypt(usuario.contrasena);
      result = await usuarios.create(usuario, t ? { transaction: t } : {});
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function deleteItem (id) {
    return deleteItemModel(id, usuarios);
  }

  return {
    findAll,
    findById,
    findByUsername,
    findByCi,
    createOrUpdate,
    deleteItem
  };
};
