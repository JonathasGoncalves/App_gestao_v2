import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { View, Text } from 'react-native';
import api from '../../services/api';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Agenda = ({ clear_tecnico }) => {

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const [showCancel, setShowCancel] = useState(true);

  useEffect(() => {

  }, [])

  async function teste() {
    setLoading(true);
    try {
      const responseTecnico = await api.get('api/tecnico/logged_tecnico');
    } catch (error) {
      setShowCancel(error.cancel);
      setAlertProps(error);
      setLoading(false);
      setShowAlert(true);
    }
  }

  async function logout() {
    //LIMPAR CREDENCIAIS
    await AsyncStorage.removeItem('@access_token');
    clear_tecnico();
  }

  return (
    <View>
      <Text>Agenda!</Text>

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
          logout();
        }}
      />

      <Button
        title="Teste"
        type="outline"
        onPress={teste}
      />
    </View>
  );
}


const mapStateToProps = state => ({
  identificado: state.Tecnico.identificado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Agenda);