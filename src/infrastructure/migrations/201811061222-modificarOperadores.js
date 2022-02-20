'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      UPDATE ite_operadores set id_usuario = 8, usuario = 'boa' WHERE id = 1;
      UPDATE ite_operadores set id_usuario = 9, usuario = 'amaszonas' WHERE id = 2;
      UPDATE ite_operadores set id_usuario = 10, usuario = 'ecojet' WHERE id = 3;
      UPDATE ite_operadores set id_usuario = 11, usuario = 'austral' WHERE id = 4;
      UPDATE ite_operadores set id_usuario = 12, usuario = 'aerogal' WHERE id = 5;
      UPDATE ite_operadores set id_usuario = 13, usuario = 'aerolineasargentinas' WHERE id = 6;
      UPDATE ite_operadores set id_usuario = 14, usuario = 'aireuropa' WHERE id = 7;
      UPDATE ite_operadores set id_usuario = 15, usuario = 'americanairlines' WHERE id = 8;
      UPDATE ite_operadores set id_usuario = 16, usuario = 'avianca' WHERE id = 9;
      UPDATE ite_operadores set id_usuario = 17, usuario = 'copaairlines' WHERE id = 10;
      UPDATE ite_operadores set id_usuario = 18, usuario = 'golvrg' WHERE id = 11;
      UPDATE ite_operadores set id_usuario = 19, usuario = 'latamairlines' WHERE id = 12;
      UPDATE ite_operadores set id_usuario = 20, usuario = 'lanperu' WHERE id = 13;
      UPDATE ite_operadores set id_usuario = 21, usuario = 'peruvian' WHERE id = 14;
    `);
  }
};
