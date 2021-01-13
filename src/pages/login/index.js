import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { useEffect, useState } from 'react';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import { Form, Item, Input, Label } from 'native-base';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Updates from 'expo-updates';
import NetInfo from "@react-native-community/netinfo";

const Login = ({ save_tecnico }) => {

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const [showCancel, setShowCancel] = useState(false);
  const [isConnected, setIsConnected] = useState(true);


  useEffect(() => {

    //CRIANDO EVENTOS PARA VERIFICAR SE O APARELHO ESTA CONECTADO A INTERNET
    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });


    async function updateAPP() {
      setLoading(true);
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setLoading(false);
          await Updates.reloadAsync();
        } else {
          setLoading(false);
        }
      } catch (e) {
        if (!isConnected) {
          errorMsg = {
            title: 'Sem internet!',
            msg: 'Não é possivel verificar atualizações sem internet. Conecte-se e reinicie o APP!',
            confirm: 'Continuar',
            cancel: ''
          }
          setAlertProps(errorMsg);
          setLoading(false);
          setShowAlert(true);

        } else {
          errorMsg = {
            title: 'Erro ao atualizar o APP!',
            msg: `Erro ${e}`,
            confirm: 'Continuar',
            cancel: ''
          }
          setAlertProps(errorMsg);
          setLoading(false);
          setShowAlert(true);
        }
        setLoading(false);
      }
    }
    updateAPP();

  }, [])

  async function loginUser() {
    //PROCESSANDO
    setLoading(true);
    //RECEBENDO O TOKEN DE AUTENTICAÇÃO E SALVANDO NO STORAGE
    try {
      const client_secret = await AsyncStorage.getItem('@client_secret');
      const client_id = await AsyncStorage.getItem('@client_id');

      // cpanel FoHGIE8cTNGNJez3uYQdV8gbJdtYvyDBoV4cwjmQ id: 5
      const responseToken = await api.post('oauth/token', {
        grant_type: 'password',
        client_id: client_id,
        client_secret: client_secret,
        username: userName,
        password: password,
      })
      console.log('responseToken');
      console.log(responseToken.data);
      await AsyncStorage.setItem('@access_token', responseToken.data.access_token);
      await AsyncStorage.setItem('@refresh_token', responseToken.data.refresh_token);

      //RECUPERANDO USUÁRIO LOGADO E SALVANDO DO REDUX e ASYNCSTORAGE
      const responseTecnico = await api.get('api/tecnico/logged_tecnico');
      save_tecnico(responseTecnico.name, responseTecnico.email, responseTecnico.id);
    } catch (error) {
      console.log(error);
      setShowCancel(error.cancel);
      setAlertProps(error);
      setLoading(false);
      setShowAlert(true);
    }
  }

  return (
    <View style={loading ? { opacity: 0.5 } : { flex: 1 }}>

      {loading && <ActivityIndicator size='large' color='#00BFFF' style={{ marginTop: '50%', position: "absolute", alignSelf: "center" }} />}
      <Form>
        <Item floatingLabel style={{ borderWidth: 0 }}>
          <Label style={styles.labelLogin}>Usuário</Label>
          <Input
            style={styles.inputlogin}
            value={userName}
            onChangeText={text => setUserName(text)}
          />
        </Item>
        <Item floatingLabel last>
          <Label style={styles.labelLogin}>Senha</Label>
          <Input
            style={styles.inputlogin}
            value={password}
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />
        </Item>
      </Form>

      <Button
        title="Logar"
        type="outline"
        onPress={loginUser}
        containerStyle={userName.length == 0 || password.length == 0 ? styles.containerButtonPadraoDisable : styles.containerButtonPadrao}
        titleStyle={styles.textButtonPadrao}
        disabled={userName.length == 0 || password.length == 0}
      />

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertProps.title}
        message={alertProps.msg}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={showCancel != ''}
        showConfirmButton={true}
        cancelText={alertProps.cancel}
        confirmText={alertProps.confirm}
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
    </View>
  );
}

const mapStateToProps = state => ({
  identificado: state.Tecnico.identificado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);

