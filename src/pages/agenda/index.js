import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { View, Text, TouchableOpacity } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Agenda, LocaleConfig } from 'react-native-calendars';
import styles from './styles';
import api from './../../services/api';
import { date } from '../../functions/tempo';

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
  const [data, setData] = useState(new Date());

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
          onPress={() => logout()}
        />
      ),
    });

    async function iniciar_agenda() {
      buscar_eventos("");
    }

    iniciar_agenda();

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

  //ACTION CLIQUE DO ITEM DA AGENDA
  async function item_agenda_clique(item) {

    errorMsg = {};
    //verificar se o item já foi submetido
    if (item.realizada == 1) {
      errorMsg = {
        title: 'Evento finalizado!',
        msg: 'Este evento já foi finalizado"',
        confirm: 'Continuar',
        cancel: ''
      }
      setShowCancel(false);
      setAlertProps(errorMsg);
      setShowAlert(true);
    } else if (item.data < new Date()) {
      //verificar se o item esta vencido
      errorMsg = {
        title: 'Data inválida',
        msg: 'Este evento não é mais válido"',
        confirm: 'Continuar',
        cancel: ''
      }
      setShowCancel(false);
      setAlertProps(errorMsg);
      setShowAlert(true);
    } else {
      //navegar para realizar submissao mandando o id do evento selecionado
      navigation.navigate('Formulario', {
        id_evento: item.id,
      });
    }
  }

  function renderItem(item) {
    //BUSCANDO APENAS OS 2 PRIMEIROS NOMES DO COOPERADO
    nome_formatado_array = item.tanque.Cooperado.nome.split(" ", 2);
    nome_formatado = nome_formatado_array[0] + ' ' + nome_formatado_array[1];
    return (
      <TouchableOpacity onPress={() => item_agenda_clique(item)}>
        <View style={styles.renderItem}>
          <Text style={styles.textLabel}>{item.formulario.titulo}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.textLabel}>Cooperado:</Text>
            <Text style={styles.textValue}>{nome_formatado}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.textLabel}>Municipio:</Text>
            <Text style={styles.textValue}>{item.tanque.Cooperado.municipio}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.textLabel}>Tanque:</Text>
            <Text style={styles.textValue}>{item.tanque.tanque}</Text>
            <Text style={styles.textLabel}>Latao:</Text>
            <Text style={styles.textValue}>{item.tanque.latao}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.textLabel}>Técnico:</Text>
            <Text style={styles.textValue}>{item.tecnico.nome}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.textLabel}>Data:</Text>
            <Text style={styles.textValue}>{item.data}</Text>
            <Text style={styles.textValue}>{item.hora}</Text>
          </View>
        </View>
      </TouchableOpacity>

    );
  }

  function renderEmptyDate() {
    return (
      <View style={styles.renderItem}>
        <Text style={styles.textValue}>Sem eventos agendados</Text>
      </View>
    );
  }

  function rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  function timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  function timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  async function buscar_eventos(day) {
    //load inicial
    data_nova = "";
    timestamp = "";

    if (day == "") {
      data_temp = new Date();
      timestamp = data_temp.getTime();
      data_nova = timeToString(timestamp - 10 * 24 * 60 * 60 * 1000);
    } else {
      timestamp = day.timestamp;
      data_nova = timeToString(day.timestamp - 10 * 24 * 60 * 60 * 1000);
    }
    const eventos = await api.post('api/evento/eventos_por_data', {
      data: data_nova
    })

    //copia do state com os itens
    itensCop = [];

    for (let i = -6; i < 84; i++) {
      //gera a data relativa
      data_nova = timeToString(timestamp + i * 24 * 60 * 60 * 1000);
      //inicializaa nova pisição do array de eventos
      itensCop[data_nova] = [];
      //percorre response com os eventos encontrados
      if (eventos.data.eventos[data_nova]) {
        for (let j = 0; j < eventos.data.eventos[data_nova].length; j++) {
          //adiciona o evento na sua respectiva chave de data
          itensCop[data_nova].push(eventos.data.eventos[data_nova][j]);
        }
      }
    }
    const newItems = {};
    temp = Object.keys(itensCop);
    Object.keys(itensCop).forEach(key => { newItems[key] = itensCop[key] });
    setItems(itensCop);
  }


  const adicionarEvento = async () => {
    navigation.navigate('Criar Evento');
  }

  function rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        renderItem={(item) => renderItem(item)}
        renderEmptyDate={() => renderEmptyDate()}
        loadItemsForMonth={(day) => buscar_eventos(day)}
        onDayChange={(day) => buscar_eventos(day)}
        onDayPress={(day) => buscar_eventos(day)}
        rowHasChanged={(r1, r2) => rowHasChanged(r1, r2)}
      />

      <Button
        type="outline"
        onPress={adicionarEvento}
        buttonStyle={{ borderWidth: 0, bordercolor: 'white', backgroundColor: '#00BFFF' }}
        containerStyle={styles.containerButtonPadraoTemp}
        icon={
          <FontAwesomeIcon style={{ alignSelf: 'center' }} icon="plus" color="white" size={25} />
        }
      />




    </View>
  );
}


const mapStateToProps = state => ({
  identificado: state.Tecnico.identificado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AgendaScreen);