## Test capa de infraestructura 
.src/infrastucture

[Test capa de infraestructura: ./src/infrastucture](https://gitlab.agetic.gob.bo/aereo/plataforma-aerea-backend/-/tree/master/src%2Finfrastructure%2Ftests ".src/infrastucture").

## Test capa de dominio 
[Test capa de dominio: ./src/domain](https://gitlab.agetic.gob.bo/aereo/plataforma-aerea-backend/-/tree/master/src%2Fdomain%2Ftests "./src/domain").

### EJECUCIÓN DE LOS TEST, CAPA DE DATOS Y DOMINIO

1. Crear una base de datos Ej. portaltest
2. Configurar el acceso a la base de datos en el archivo *./src/common/config/db.js*
3. Ejecutar
```
$ npm run test
```
4. El proceso debe terminar. No se deben producir errores