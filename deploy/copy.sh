#!/usr/bin/env bash
echo - Copiando archivos para el deploy -
pwd
echo 1. Elimnando archivos Backend
rm -rf roles/backend/files/plataforma-aerea-backend
echo 2. Copiando archivos
cp -rf ../../plataforma-aerea-backend roles/backend/files
echo 3. Eliminando carpeta node_modules
rm -rf roles/backend/files/plataforma-aerea-backend/node_modules
echo 4. Eliminando carpeta deploy
rm -rf roles/backend/files/plataforma-aerea-backend/deploy
echo 5. Eliminando db.js
rm -f roles/backend/files/plataforma-aerea-backend/src/common/src/config/db.js
echo 6. Copiando db.js
cp roles/backend/files/plataforma-aerea-backend/src/common/src/config/db.js.sample roles/backend/files/plataforma-aerea-backend/src/common/src/config/db.js
echo 7. Eliminando mail.js
rm -f roles/backend/files/plataforma-aerea-backend/src/common/src/config/mail.js
echo 8. Copiando mail.js
cp roles/backend/files/plataforma-aerea-backend/src/common/src/config/mail.js.sample roles/backend/files/plataforma-aerea-backend/src/common/src/config/mail.js
echo 9. Eliminando openid.js
rm -f roles/backend/files/plataforma-aerea-backend/src/common/src/config/openid.js
echo 10. Copiando openid.js
cp roles/backend/files/plataforma-aerea-backend/src/common/src/config/openid.js.sample roles/backend/files/plataforma-aerea-backend/src/common/src/config/openid.js
echo 11. ¡Finalizado!
