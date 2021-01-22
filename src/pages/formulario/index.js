import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../services/api';

//offline
//perguntas
//eventos para a agenda
//cooperados
//formularios
//projetos



const Formulario = ({ route, navigation, id_tecnico }) => {

  const [evento, setEvento] = useState({});

  useEffect(() => {
    //utilizar o id do evento e buscar as perguntas
    async function buscar_perguntas() {
      const formulario = await api.post('api/evento/exibir_evento', {
        id_evento: route.params.id_evento
      })
      setEvento(formulario);
      console.log(formulario.data.evento.submissao.Respostas);
    }

    buscar_perguntas();
  }, [])

  return (
    <View>
      <Text>{route.params.id_evento}</Text>
    </View>
  )

}


const mapStateToProps = state => ({
  id_tecnico: state.Tecnico.id
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Formulario);