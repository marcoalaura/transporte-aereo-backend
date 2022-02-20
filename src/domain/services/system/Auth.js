'use strict';

const debug = require('debug')('app:service:auth');

const crypto = require('crypto');
const Issuer = require('openid-client').Issuer;
const jose = require('node-jose');
const moment = require('moment');
const url = require('url');
const { config } = require('../../../common');
const { iss } = require('../../lib/util');

module.exports = function authService (repositories, res) {
  const Usuario = require('./Usuario')(repositories, res);
  const { auth, usuarios } = repositories;
  const issuer = new Issuer(iss);
  console.log('---------------------------- issuer', issuer);
  const keystore = jose.JWK.createKeyStore();
  const cliente = new issuer.Client(config.openid.client, keystore);
  cliente.CLOCK_TOLERANCE = 5;

  async function getCode (data) {
    // usado para login con ciudadania tambien
    debug('Obtener código state');
    const state = crypto.randomBytes(16).toString('hex');
    const nonce = crypto.randomBytes(16).toString('hex');

    try {
      const authorizationRequest = Object.assign({
        redirect_uri: config.openid.client.redirect_uris[0],
        state,
        nonce
      }, config.openid.client_params);

      const authorizeUrl = cliente.authorizationUrl(authorizationRequest);

      const data = {
        state,
        parametros: {
          nonce: nonce
        },
        _user_created: 1
      };
      await auth.createOrUpdate(data);

      return res.success({
        url: authorizeUrl,
        codigo: state
      });
    } catch (e) {
      return res.error(e);
    }
  }

  async function authorizate (req) {
    debug('Autorizar código');
    let user;
    let respuesta;
    try {
      const params = cliente.callbackParams(req);
      if (!params.state) {
        throw new Error('Parámetro state es requerido.');
      }
      if (!params.code) {
        throw new Error('Parámetro code es requerido.');
      }
      const parametros = {
        state: params.state,
        estado: 'INICIO'
      };
      const resultadoState = await auth.find(parametros);

      if (resultadoState) {
        // obtenemos el code
        const respuestaCode = await cliente.authorizationCallback(cliente.redirect_uris[0], params, {
          nonce: resultadoState.parametros.nonce,
          state: resultadoState.state
        });
        resultadoState.tokens = respuestaCode;

        const claims = await cliente.userinfo(respuestaCode);
        // const claims = respuestaCode.claims;
        claims.fecha_nacimiento = moment(claims.fecha_nacimiento, 'DD/MM/YYYY').toDate();
        if (/[a-z]/i.test(claims.documento_identidad.numero_documento)) {
          claims.documento_identidad.complemento = claims.documento_identidad.numero_documento.slice(-2);
          claims.documento_identidad.numero_documento = claims.documento_identidad.numero_documento.slice(0, -2);
        }
        console.log('-------------------------------claims', claims);
        const dataPersona = {
          tipo_documento: claims.documento_identidad.tipo_documento,
          nro_documento: claims.documento_identidad.numero_documento,
          // complemento: claims.documento_identidad.complemento,
          fecha_nacimiento: claims.fecha_nacimiento
        };
        const data = await usuarios.findByCi(dataPersona);
        if (data) {
          user = await usuarios.findByUsername(data.usuario);
          if (user.estado === 'ACTIVO') {
            const ip = req.connection.remoteAddress;
            respuesta = await Usuario.getResponse(user, ip);
            resultadoState.id_usuario = user.id;
            resultadoState.estado = 'ACTIVO';
            await auth.createOrUpdate(resultadoState);
          } else { // usuario inactivo
            respuesta = {
              url: getUrl(resultadoState),
              mensaje: `El usuario no esta ACTIVO en el sistema. Consulte con el administrador del sistema.`
            };
          }
        } else { // no tiene acceso al sistema
          respuesta = {
            url: getUrl(resultadoState),
            mensaje: `La persona ${claims.nombre.nombres} no tiene acceso al sistema. Consulte con el administrador del sistema.`
          };
        }
        return res.success(respuesta);
      } else {
        return res.error(new Error(`Los códigos de verificacion no coenciden. Intente nuevamente.`));
      }
    } catch (e) {
      return res.error(e);
    }
  }

  async function logout (code, idUsuario) {
    debug('Salir del sistema');
    let resultUrl;
    try {
      const parametros = {
        state: code,
        id_usuario: idUsuario,
        estado: 'ACTIVO'
      };
      const resultadoTokens = await auth.find(parametros);
      if (resultadoTokens) {
        resultUrl = getUrl(resultadoTokens);
      } else {
        resultUrl = '/oauth_logut';
      }
      return res.success({url: resultUrl});
    } catch (e) {
      return res.error(e);
    }
  }

  function getUrl (data) {
    return url.format(Object.assign(url.parse(issuer.end_session_endpoint), {
      search: null,
      query: {
        id_token_hint: data.tokens.id_token,
        post_logout_redirect_uri: cliente.post_logout_redirect_uris[0]
      }
    }));
  }

  return {
    getCode,
    authorizate,
    logout
  };
};
