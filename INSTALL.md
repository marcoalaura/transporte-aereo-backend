
## Instalando Node.js v8.x

NOTA.- Debian Wheezy no soporta Node 8

``` bash
# Para Ubuntu
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Para Debian, instalar como root
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get install -y nodejs
```


### 1. Instalando dependencias
``` bash
npm install
```
### 2. Creando base de datos
Crear una base de datos en postgres y configurar la conexión en el módulo common instalado fuera del proyecto en `[Ruta del proyecto]/common/src/config/db.js` *(Este archivo se obtiene copiando el archivo db.js.sample)*

### 3. Creando seeders y test
Ejecutar lo siguiente para crear las tablas, seeders y tests unitarios de las 3 capas del DDD, esto eliminará las tablas y los datos de estas para reescribirlos

``` bash
npm run test

```
### 4. Sincronización de datos con la DGAC
Ejecutar el siguiente comando para sincronizar los datos de aeronaves y tripulantes y guardarlos en la base de datos, posteriormente esto se hará de forma automática en el sistema

```
npm run sincronizar
```

### 5. Sincronización de vuelos con servicio de AASANA
Para automatizar el proceso de sincronizacion y modificación de vuelos en la base de datos a través de la consulta al servicio web de AASANA se utilizará la herramient cron. 

Los pasos a realizar son los siguientes:

- Ir al directorio ```/etc```
- Obtener permisos de super usuario (root) para editar el archivo ```crontab``` ubicado en el directorio ya mencionado. Una vez abierto el archivo veremos las siguientes tareas por defecto:

```
# m h dom mon dow user	command
17 *	* * *	root    cd / && run-parts --report /etc/cron.hourly
25 6	* * *	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6	* * 7	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6	1 * *	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
#
```
Debajo de la cuarta tarea se deberá adicionar la siguiente nueva tarea:
```
1 12 1-31 * *   agetic  cd /<<ruta-del-proyecto>>/plataforma-aerea-backend/cronjob/; npm run sincronizarAASANA > /tmp/logAASANA.txt 
```
La lista de tareas deberá quedar de la siguiente manera:
```
# m h dom mon dow user	command
17 *	* * *	root    cd / && run-parts --report /etc/cron.hourly
25 6	* * *	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6	* * 7	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6	1 * *	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
1 12 1-31 * *   agetic  cd /<<ruta-del-proyecto>>/plataforma-aerea-backend/cronjob/; npm run sincronizarAASANA > /tmp/logAASANA.txt 
#
```
El detalle de la tarea adicionada es la siguiente:
```
1(minuto) 12(hora) 1-31(dias del mes) *(mes) *(dia de la semana) agetic(nombre de usuario de la sesion actual en el sistema operativo, en caso de ser necesario puede cambiarse por el usuario que sea requerido)
```
Por lo tanto representa lo siguiente, a las 12:01 del medio día de cada día del mes de todos los meses de ejecutará la tarea adicionalmente se creará un log del resultado de la tarea la cual se almacenará temporalmente en el directorio ```/temp```, el nombre del archivo generado es ```logAASANA.txt```.
