## Plataforma Interinstitucional de transporte aéreo - Backend

A continuación se detalla los pasos para actualizar la aplicación en PRODUCCIÓN

### Respaldar los archivos de configuración
```
src/common/src/config/openid.js
src/common/src/config/auth.js
src/common/src/config/mail.js
src/common/src/config/db.js
```


### Actualización de la Aplicación


Para actualizar el código fuente del repositorio ejecutar el siguiente comando:

```sh
$ git pull origin master
```

Instalar paquetes nuevos
```sh
$ npm install
```

## Ejecutar migraciones a la base de datos

```sh
$ npm run migrations
```

Reiniciar la aplicación con el manejador de procesos ej pm2
