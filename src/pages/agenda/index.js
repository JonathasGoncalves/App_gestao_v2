import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { View, Text, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Agenda } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembrp', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar', 'Abril', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov.', 'Dec'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],

};
LocaleConfig.defaultLocale = 'br';

const AgendaScreen = ({ clear_tecnico, navigation }) => {

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const [showCancel, setShowCancel] = useState(true);
  const [items, setItems] = useState({});

  useEffect(() => {

    //ADICIONANDO BOTÃO DE TOGGLE
    navigation.setOptions({
      headerLeft: () => (
        <Button
          buttonStyle={{ borderWidth: 0, bordercolor: 'white', backgroundColor: '#00BFFF', marginLeft: 10 }}
          icon={<FontAwesomeIcon icon="bars" color="white" size={25} />}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    });

    //ADICIONANDO BOTÃO DE LOGOUT
    navigation.setOptions({
      headerRight: () => (
        <Button
          buttonStyle={{ borderWidth: 0, bordercolor: 'white', backgroundColor: '#00BFFF', marginRight: 10 }}
          icon={<FontAwesomeIcon icon="sign-out-alt" color="white" size={25} />}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    });

  }, [])

  async function teste() {
    setLoading(true);
    try {
      //const responseTecnico = await api.get('api/tecnico/logged_tecnico');
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

  function loadItems(day) {
    temp = {};
    setTimeout(() => {
      for (let i = -1; i < 5; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!temp[strTime]) {
          temp[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            temp[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = {};
      Object.keys(temp).forEach(key => { newItems[key] = temp[key]; });
      setItems(temp);
    }, 1000);
  }

  function renderItem(item) {
    console.log(item);
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  }

  function renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  function rowHasChanged(r1, r2) {
    console.log(items);
    return r1.name !== r2.name;
  }

  function timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }




  return (
    <View>
      <View style={{ flex: 1 }}>
        <Agenda />
      </ View>



    </View>
  );
}


const mapStateToProps = state => ({
  identificado: state.Tecnico.identificado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AgendaScreen);