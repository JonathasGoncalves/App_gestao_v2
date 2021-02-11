import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import erroMessage from './../functions/errorMessage';

const api = axios.create({
  //baseURL: 'http://192.168.10.26:8000/',
  baseURL: 'http://apigestaocooperados.selita.coop.br/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

/*
Test casa
Client ID: 1
Client secret: 0WdYjEZQGHR0K172HKPx5TJxYx0mzbD1QeDyeysK
*/

//modelo do objeto de erro
/*
{
 "errors":{
    "placa":[
       "A placa mtc não existe.",
       "The placa must be 10.",
       "The placa must be an integer."
    ],
    "input2":[
       "A placa mtc não existe.",
       "The placa must be 10.",
       "The placa must be an integer."
    ]
 },
 "message":"The given data was invalid."
}*/

//ADICIONANDO TOKEN AS REQUISIÇÕES
api.interceptors.request.use(
  async function (config) {
    const access_token = await AsyncStorage.getItem('@access_token');
    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
    //console.log(config);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//INTERCEPTANDO OS RESPONSES E TRATANDO OS ERROS
api.interceptors.response.use(async function (response) {

  //REFRESH DO TOKEN
  /*if (response.config.url != 'oauth/token') {
    const refresh_token = await AsyncStorage.getItem('@refresh_token');
    const client_secret = await AsyncStorage.getItem('@client_secret');
    const client_id = await AsyncStorage.getItem('@client_id');

    const responseToken = await api.post('oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: client_id,
      client_secret: client_secret,
      scope: ''
    })
    await AsyncStorage.setItem('@access_token', responseToken.data.access_token);
    await AsyncStorage.setItem('@refresh_token', responseToken.data.refresh_token);
  }*/
  return response;
}, async function (error) {
  //OBJ COM A RESPORTA PERSONALIZADA
  console.log(error);
  errorMsg = {};
  errorJson = error.toJSON();
  const access_token = await AsyncStorage.getItem('@access_token');
  if (errorJson.code == 'ECONNABORTED') {
    //TIMEOUT ERROR
    errorMsg = {
      title: 'Tempo excedido!',
      msg: 'Sem conexão com a API!',
      confirm: 'Continuar',
      cancel: '',
      identificado: true
    }
  } else if (error.response.status == '400' && access_token) {
    //TOKEN EXPIRADO
    errorMsg = {
      title: 'Não Autorizado!',
      msg: 'Realize login novamente!',
      confirm: 'Continuar',
      cancel: '',
      identificado: false
    }
  } else if (error.response.status == '400') {
    //CLIENTE DO PASSWORD LARAVEL NÃO IDENTIFICADO, CREDENCIAL INVÁLIDA
    errorMsg = {
      title: 'Não Autorizado!',
      msg: 'Senha ou usuário incorretos!',
      confirm: 'Continuar',
      cancel: '',
      identificado: false
    }
  } else if (error.response.status == '500') {
    errorMsg = {
      title: 'Erro!',
      msg: 'Erro interno na aplicação. Por favor contatar a TI.',
      confirm: 'Continuar',
      cancel: '',
      identificado: false
    }
  } else {
    //console.log('else erro');
    //console.log(errorJson);
    //ERRO DESCONHECIDO OU ERRO NA VALIDAÇÃO DO REQUEST
    try {
      //SE DER CERTO, O ERRO FOI NA VALIDAÇÃO DO REQUEST
      msgError = erroMessage(error);
      errorMsg = {
        title: 'Erro!',
        msg: msgError,
        confirm: 'Continuar',
        cancel: '',
        identificado: false
      }
    } catch (errorValidacao) {
      //SE DER ERRADO É UM ERRO INTERNO DESCONHECIDO
      errorMsg = {
        title: 'Erro!',
        msg: 'Erro desconhecido!',
        confirm: 'Continuar',
        cancel: '',
        identificado: false
      }
    }
  }
  return Promise.reject(errorMsg);
});

export default api;