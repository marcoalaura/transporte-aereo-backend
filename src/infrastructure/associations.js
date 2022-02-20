'use strict';

// Definiendo asociaciones de las tablas
module.exports = function associations (models) {
  const {
    roles,
    usuarios,
    entidades,
    modulos,
    permisos,
    personas,
    puertas,
    tokens,
    aeronaves,
    aeropuertos,
    itinerarios,
    operadores,
    solicitudes,
    itinerarioHistorial,
    vuelos,
    pasajeros,
    tripulaciones,
    equipajes,
    cargas,
    logVuelos,
    planSolicitudes,
    planVuelos,
    aeropuertoSalidas,
    planHistorial,
    conexiones,
    dgacAeronaves,
    dgacAeronavesHistorial,
    tripulacionesHistorial,
    notificaciones
  } = models;

  // MODULO USUARIOS
  // Asociaciones tabla usuarios
  usuarios.belongsTo(entidades, { foreignKey: { name: 'id_entidad', allowNull: false }, as: 'entidad' });
  entidades.hasMany(usuarios, { foreignKey: { name: 'id_entidad', allowNull: false }, as: 'entidad' });

  usuarios.belongsTo(aeropuertos, { foreignKey: { name: 'id_aeropuerto' }, as: 'aeropuerto' });
  aeropuertos.hasMany(usuarios, { foreignKey: { name: 'id_aeropuerto' }, as: 'aeropuerto' });

  usuarios.belongsTo(operadores, { foreignKey: { name: 'id_operador' }, as: 'operador' });
  operadores.hasMany(usuarios, { foreignKey: { name: 'id_operador' }, as: 'operador' });

  usuarios.belongsTo(roles, { foreignKey: { name: 'id_rol', allowNull: false }, as: 'rol' });
  roles.hasMany(usuarios, { foreignKey: { name: 'id_rol', allowNull: false }, as: 'rol' });

  usuarios.belongsTo(personas, { foreignKey: { name: 'id_persona' }, as: 'persona' });
  personas.hasMany(usuarios, { foreignKey: { name: 'id_persona' }, as: 'persona' });

  // Asociaciones tabla permisos - roles
  permisos.belongsTo(roles, { foreignKey: { name: 'id_rol', allowNull: false }, as: 'rol' });
  roles.hasMany(permisos, { foreignKey: { name: 'id_rol', allowNull: false } });

  // Asociaciones tabla permisos - modulos
  permisos.belongsTo(modulos, { foreignKey: { name: 'id_modulo', allowNull: false }, as: 'modulo' });
  modulos.hasMany(permisos, { foreignKey: { name: 'id_modulo', allowNull: false } });

  // Asociaciones tabla modulos - sección
  modulos.belongsTo(modulos, { foreignKey: 'id_modulo' });
  modulos.hasMany(modulos, { foreignKey: 'id_modulo' });
  modulos.belongsTo(modulos, { foreignKey: 'id_seccion' });
  modulos.hasMany(modulos, { foreignKey: 'id_seccion' });

  // Asociaciones tabla tokens
  tokens.belongsTo(usuarios, { foreignKey: { name: 'id_usuario' }, as: 'usuario' });
  usuarios.hasMany(tokens, { foreignKey: { name: 'id_usuario' } });

  tokens.belongsTo(operadores, { foreignKey: { name: 'id_operador' }, as: 'operador' });
  operadores.hasMany(tokens, { foreignKey: { name: 'id_operador' } });

  tokens.belongsTo(entidades, { foreignKey: { name: 'id_entidad' }, as: 'entidad' });
  entidades.hasMany(tokens, { foreignKey: { name: 'id_entidad' } });

  // Asociaciones tabla notificaciones
  notificaciones.belongsTo(usuarios, { foreignKey: { name: 'id_remitente', allowNull: true }, as: 'usuario_remitente' });
  usuarios.hasMany(notificaciones, { foreignKey: { name: 'id_remitente', allowNull: true }, as: 'usuario_remitente' });
  
  notificaciones.belongsTo(usuarios, { foreignKey: { name: 'id_receptor', allowNull: false }, as: 'usuario_receptor' });
  usuarios.hasMany(notificaciones, { foreignKey: { name: 'id_receptor', allowNull: false }, as: 'usuario_receptor' });
  
  
  // MÓDULO ITINERARIOS

  // Asociaciones tabla puertas
  puertas.belongsTo(aeropuertos, { foreignKey: { name: 'id_aeropuerto', allowNull: false }, as: 'aeropuerto' });
  aeropuertos.hasMany(puertas, { foreignKey: { name: 'id_aeropuerto', allowNull: false } });

  // Asociaciones tabla aeronaves
  aeronaves.belongsTo(operadores, { foreignKey: { name: 'id_operador', allowNull: false }, as: 'operador' });
  operadores.hasMany(aeronaves, { foreignKey: { name: 'id_operador', allowNull: false } });

  // Asociaciones tabla dgacAernavesHistorial
  dgacAeronavesHistorial.belongsTo(dgacAeronaves, { foreignKey: { name: 'id_dgac_aeronave', allowNull: false }, as: 'dgac_aeronave' });
  dgacAeronaves.hasMany(dgacAeronavesHistorial, { foreignKey: { name: 'id_dgac_aeronave', allowNull: false }, as: 'dgac_aeronave' });

  dgacAeronavesHistorial.belongsTo(usuarios, { foreignKey: { name: 'id_usuario', allowNull: false }, as: 'usuario' });
  usuarios.hasMany(dgacAeronavesHistorial, { foreignKey: { name: 'id_usuario', allowNull: false } });

  // Asociaciones tabla tripulacionesHistorial
  tripulacionesHistorial.belongsTo(tripulaciones, { foreignKey: { name: 'id_tripulacion', allowNull: false }, as: 'tripulacion' });
  tripulaciones.hasMany(tripulacionesHistorial, { foreignKey: { name: 'id_tripulacion', allowNull: false } });

  tripulacionesHistorial.belongsTo(usuarios, { foreignKey: { name: 'id_usuario', allowNull: false }, as: 'usuario' });
  usuarios.hasMany(tripulacionesHistorial, { foreignKey: { name: 'id_usuario', allowNull: false } });

  // Asociaciones tabla itinerarios
  itinerarios.belongsTo(aeronaves, { foreignKey: { name: 'id_aeronave', allowNull: false }, as: 'aeronave' });
  aeronaves.hasMany(itinerarios, { foreignKey: { name: 'id_aeronave', allowNull: false }, as: 'aeronave' });

  itinerarios.belongsTo(solicitudes, { foreignKey: { name: 'id_solicitud', allowNull: false }, as: 'solicitud' });
  solicitudes.hasMany(itinerarios, { foreignKey: { name: 'id_solicitud', allowNull: false }, as: 'solicitud' });

  itinerarios.belongsTo(aeropuertos, { foreignKey: { name: 'id_aeropuerto_salida', allowNull: false }, as: 'aeropuerto_salida' });
  aeropuertos.hasMany(itinerarios, { foreignKey: { name: 'id_aeropuerto_salida', allowNull: false }, as: 'aeropuerto_salida' });

  itinerarios.belongsTo(aeropuertos, { foreignKey: { name: 'id_aeropuerto_llegada', allowNull: false }, as: 'aeropuerto_llegada' });
  aeropuertos.hasMany(itinerarios, { foreignKey: { name: 'id_aeropuerto_llegada', allowNull: false }, as: 'aeropuerto_llegada' });

  // Asociaciones tabla solicitudes
  solicitudes.belongsTo(operadores, { foreignKey: { name: 'id_operador', allowNull: false }, as: 'operador' });
  operadores.hasMany(solicitudes, { foreignKey: { name: 'id_operador', allowNull: false } });

  // Asociaciones tabla historial itinerarios
  itinerarioHistorial.belongsTo(solicitudes, { foreignKey: { name: 'id_solicitud', allowNull: false }, as: 'solicitud' });
  solicitudes.hasMany(itinerarioHistorial, { foreignKey: { name: 'id_solicitud', allowNull: false } });

  itinerarioHistorial.belongsTo(entidades, { foreignKey: { name: 'id_entidad', allowNull: false }, as: 'entidad' });
  entidades.hasMany(itinerarioHistorial, { foreignKey: { name: 'id_entidad', allowNull: false } });

  itinerarioHistorial.belongsTo(usuarios, { foreignKey: { name: 'id_usuario', allowNull: false }, as: 'usuario' });
  usuarios.hasMany(itinerarioHistorial, { foreignKey: { name: 'id_usuario', allowNull: false } });

  // Asociaciones tabla conexiones entre vuelos
  conexiones.belongsTo(itinerarios, { foreignKey: { name: 'id_itinerario_a', allowNull: false }, as: 'itinerarioA' });
  itinerarios.hasMany(conexiones, { foreignKey: { name: 'id_itinerario_a', allowNull: false }, as: 'itinerarioA' });

  conexiones.belongsTo(itinerarios, { foreignKey: { name: 'id_itinerario_b', allowNull: false }, as: 'itinerarioB' });
  itinerarios.hasMany(conexiones, { foreignKey: { name: 'id_itinerario_b', allowNull: false }, as: 'itinerarioB' });

  // MÓDULO VUELOS
  // Asociaciones tabla vuelos
  vuelos.belongsTo(itinerarios, { foreignKey: { name: 'id_itinerario', allowNull: false }, as: 'itinerario' }); // Esto se hará mediante 0000-seeders-associations.js
  itinerarios.hasMany(vuelos, { foreignKey: { name: 'id_itinerario', allowNull: false }, as: 'itinerario' });

  vuelos.belongsTo(aeropuertos, { foreignKey: { name: 'id_aeropuerto_escala_pais' }, as: 'aeropuerto_escala' }); // Esto se hará mediante 0000-seeders-associations.js
  aeropuertos.hasMany(vuelos, { foreignKey: { name: 'id_aeropuerto_escala_pais' }, as: 'aeropuerto_escala' });

  vuelos.belongsTo(operadores, { foreignKey: { name: 'id_operador', allowNull: false }, as: 'operador' });
  operadores.hasMany(vuelos, { foreignKey: { name: 'id_operador', allowNull: false } });

  vuelos.belongsTo(puertas, { foreignKey: { name: 'id_puerta_llegada' }, as: 'puerta_llegada' });
  puertas.hasMany(vuelos, { foreignKey: { name: 'id_puerta_llegada' }, as: 'puerta_llegada' });

  vuelos.belongsTo(puertas, { foreignKey: { name: 'id_puerta_salida' }, as: 'puerta_salida' });
  puertas.hasMany(vuelos, { foreignKey: { name: 'id_puerta_salida' }, as: 'puerta_salida' });

  // vuelos.belongsTo(puertas, { foreignKey: { name: 'id_puerta', allowNull: false }, as: 'puerta' });
  // puertas.hasMany(vuelos, { foreignKey: { name: 'id_puerta', allowNull: false } });

  // Asociaciones tabla pasajeros
  pasajeros.belongsTo(vuelos, { foreignKey: { name: 'id_vuelo', allowNull: false }, as: 'vuelo' });
  vuelos.hasMany(pasajeros, { foreignKey: { name: 'id_vuelo', allowNull: false }, as: 'vuelo' });

  pasajeros.belongsTo(personas, { foreignKey: { name: 'id_persona' }, as: 'persona' }); // Esto se hará mediante 0000-seeders-associations.js
  personas.hasMany(pasajeros, { foreignKey: { name: 'id_persona' } });

  pasajeros.belongsTo(tripulaciones, { foreignKey: { name: 'id_tripulacion' }, as: 'tripulacion' });
  tripulaciones.hasMany(pasajeros, { foreignKey: { name: 'id_tripulacion' }, as: 'tripulacion' });

  // Asociaciones tabla tripulaciones
  tripulaciones.belongsTo(personas, { foreignKey: { name: 'id_persona', allowNull: false }, as: 'persona' }); // Esto se hará mediante 0000-seeders-associations.js
  personas.hasMany(tripulaciones, { foreignKey: { name: 'id_persona', allowNull: false } });

  tripulaciones.belongsTo(operadores, { foreignKey: { name: 'id_operador', allowNull: true }, as: 'operador' });
  operadores.hasMany(tripulaciones, { foreignKey: { name: 'id_operador', allowNull: true } });

  // Asociaciones tabla equipajes
  equipajes.belongsTo(pasajeros, { foreignKey: { name: 'id_pasajero', allowNull: false }, as: 'pasajero' });
  pasajeros.hasMany(equipajes, { foreignKey: { name: 'id_pasajero', allowNull: false }, as: 'pasajero' });

  // Asociaciones tabla cargas
  cargas.belongsTo(vuelos, { foreignKey: { name: 'id_vuelo', allowNull: false }, as: 'vuelo' });
  vuelos.hasMany(cargas, { foreignKey: { name: 'id_vuelo', allowNull: false } });

  // Asociaciones tabla logVuelos
  logVuelos.belongsTo(vuelos, { foreignKey: { name: 'id_vuelo', allowNull: false }, as: 'vuelo' });
  vuelos.hasMany(logVuelos, { foreignKey: { name: 'id_vuelo', allowNull: false } });

  // MÓDULO PLAN DE VUELOS
  // Asociaciones tabla planSolicitudes
  planSolicitudes.belongsTo(operadores, { foreignKey: { name: 'id_operador', allowNull: false }, as: 'operador' });
  operadores.hasMany(planSolicitudes, { foreignKey: { name: 'id_operador', allowNull: false } });

  planSolicitudes.belongsTo(solicitudes, { foreignKey: { name: 'id_solicitud_itinerario', allowNull: false }, as: 'solicitud_itinerario' });
  solicitudes.hasMany(planSolicitudes, { foreignKey: { name: 'id_solicitud_itinerario', allowNull: false } });

  // Asociaciones tabla planVuelos
  planVuelos.belongsTo(planSolicitudes, { foreignKey: { name: 'id_solicitud', allowNull: false }, as: 'solicitud' });
  planSolicitudes.hasMany(planVuelos, { foreignKey: { name: 'id_solicitud', allowNull: false } });

  planVuelos.belongsTo(aeronaves, { foreignKey: { name: 'id_aeronave', allowNull: false }, as: 'aeronave' });
  aeronaves.hasMany(planVuelos, { foreignKey: { name: 'id_aeronave', allowNull: false } });

  planVuelos.belongsTo(aeropuertos, { foreignKey: { name: 'id_aeropuerto_salida', allowNull: false }, as: 'aeropuerto_salida' });
  aeropuertos.hasMany(planVuelos, { foreignKey: { name: 'id_aeropuerto_salida', allowNull: false } });

  planVuelos.belongsTo(aeropuertos, { foreignKey: { name: 'id_aeropuerto_destino', allowNull: false }, as: 'aeropuerto_destino' });
  aeropuertos.hasMany(planVuelos, { foreignKey: { name: 'id_aeropuerto_destino', allowNull: false }, as: 'aeropuerto_destino' });

  // Asociaciones tabla aeropuerto salidas
  aeropuertoSalidas.belongsTo(planSolicitudes, { foreignKey: { name: 'id_solicitud', allowNull: false }, as: 'solicitud' });
  planSolicitudes.hasMany(aeropuertoSalidas, { foreignKey: { name: 'id_solicitud', allowNull: false } });

  aeropuertoSalidas.belongsTo(aeropuertos, { foreignKey: { name: 'id_aeropuerto', allowNull: false }, as: 'aeropuerto' });
  aeropuertos.hasMany(aeropuertoSalidas, { foreignKey: { name: 'id_aeropuerto', allowNull: false } });

  // Asociaciones tabla plan Historial
  planHistorial.belongsTo(planSolicitudes, { foreignKey: { name: 'id_solicitud', allowNull: false }, as: 'solicitud' });
  planSolicitudes.hasMany(planHistorial, { foreignKey: { name: 'id_solicitud', allowNull: false } });

  planHistorial.belongsTo(entidades, { foreignKey: { name: 'id_entidad', allowNull: false }, as: 'entidad' });
  entidades.hasMany(planHistorial, { foreignKey: { name: 'id_entidad', allowNull: false } });

  planHistorial.belongsTo(usuarios, { foreignKey: { name: 'id_usuario', allowNull: false }, as: 'usuario' });
  usuarios.hasMany(planHistorial, { foreignKey: { name: 'id_usuario', allowNull: false } });

  return models;
};
