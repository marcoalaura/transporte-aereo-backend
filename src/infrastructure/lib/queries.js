'use strict';

async function deleteItemModel (id, model) {
  const cond = {
    where: {
      id
    }
  };

  const item = await model.findOne(cond);

  if (item) {
    const deleted = await model.destroy(cond);
    return +!!deleted; //  Devuelve 1 si se eliminĂ³ correctamente y 0 si no se pudo eliminar
  }

  return -1; // Devuelve -1 si no se encontrĂ³ el registro
}

module.exports = {
  deleteItemModel
};
