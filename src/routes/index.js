import React, { useState, useEffect } from 'react';
import LoginStack from './login';
import MainDrawer from './main';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../data/actions/tecnicoActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { ActivityIndicator } from 'react-native';

function IndexRouter({ identificado, save_tecnico, clear_tecnico }) {

  const [verificar, setVerificar] = useState(true);

  useEffect(() => {

    async function verificarUsuario() {
      //await AsyncStorage.clear();
      //VERIFICANDO SE O O USUÁRIO ESTÁ LOGADO
      const access_token = await AsyncStorage.getItem('@access_token');
      try {
        if (access_token) {
          console.log('TOKEN ENCONTRADO');
          console.log(access_token);
          //RECUPERANDO USUÁRIO LOGADO E SALVANDO DO REDUX e ASYNCSTORAGE
          const responseTecnico = await api.get('api/tecnico/logged_tecnico');
          save_tecnico(responseTecnico.name, responseTecnico.email, responseTecnico.id);
        }
      } catch (error) {
        console.log('TOKEN INVÁLIDO');
        //TOKEN INVÁLIDO
        //LIMPAR CREDENCIAIS
        await AsyncStorage.removeItem('@access_token');
        clear_tecnico();
      }
      setVerificar(false);
    }

    verificarUsuario();
  }, [])

  if (verificar) {
    return <ActivityIndicator size='large' color='#00BFFF' style={{ marginTop: '50%', position: "absolute", alignSelf: "center" }} />
  } else if (identificado) {
    return <MainDrawer />;
  } else {
    return <LoginStack />;
  }

}

const mapStateToProps = state => ({
  identificado: state.Tecnico.identificado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IndexRouter);