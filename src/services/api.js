import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.10.26:8000/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

//ADICIONANDO TOKEN AS REQUISIÇÕES
api.interceptors.request.use(
  async function (config) {
    const access_token = await AsyncStorage.getItem('@access_token');
    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//INTERCEPTANDO OS RESPONSES E TRATANDO OS ERROS
api.interceptors.response.use(async function (response) {

  //REFRESH DO TOKEN
  if (response.config.url != 'oauth/token') {
    const refresh_token = await AsyncStorage.getItem('@refresh_token');
    const responseToken = await api.post('oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: '1',
      client_secret: 'gH1A7MRMm6pF5WHjT4LoqShppVGfwwsvjuivzNNe',
      scope: ''
    })
    await AsyncStorage.setItem('@access_token', responseToken.data.access_token);
    await AsyncStorage.setItem('@refresh_token', responseToken.data.refresh_token);
  }
  return response;
}, async function (error) {
  //OBJ COM A RESPORTA PERSONALIZADA
  errorMsg = {};
  errorJson = error.toJSON();
  const access_token = await AsyncStorage.getItem('@access_token');
  if (errorJson.code == 'ECONNABORTED' || errorJson.code == '408') {
    //TIMEOUT ERROR
    errorMsg = {
      title: 'Tempo excedido!',
      msg: 'Sem conexão com a API!',
      confirm: 'Continuar',
      cancel: '',
      identificado: true
    }
  } else if (errorJson.code == undefined && access_token) {
    //TOKEN EXPIRADO
    errorMsg = {
      title: 'Não Autorizado!',
      msg: 'Realize login novamente!',
      confirm: 'Continuar',
      cancel: '',
      identificado: false
    }
  } else if (errorJson.code == undefined) {
    //CLIENTE DO PASSWORD LARAVEL NÃO IDENTIFICADO, CREDENCIAL INVÁLIDA
    errorMsg = {
      title: 'Não Autorizado!',
      msg: 'Senha ou usuário incorretos!',
      confirm: 'Continuar',
      cancel: '',
      identificado: false
    }
  } else {
    //ERRO DESCONHECIDO
    console.log(errorJson);
    errorMsg = {
      title: 'Erro!',
      msg: 'Erro desconhecido!',
      confirm: 'Continuar',
      cancel: '',
      identificado: false
    }
  }
  return Promise.reject(errorMsg);
});

export default api;