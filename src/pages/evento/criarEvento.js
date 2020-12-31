import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button } from 'react-native-elements';
import api from '../../services/api';
import { SearchBar } from 'react-native-elements';

const CriarEvento = ({ navigation }) => {

  const [cooperados, setCooperados] = useState([]);
  const [cooperadosTodos, setCooperadosTodos] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [cooperadoImput, setCooperadoImput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //ADICIONANDO BOTÃO DE VOLTAR
    navigation.setOptions({
      headerLeft: () => (
        <Button
          buttonStyle={{ borderWidth: 0, bordercolor: 'white', backgroundColor: '#00BFFF', marginLeft: 10 }}
          icon={<FontAwesomeIcon icon="arrow-left" color="white" size={25} />}
          onPress={() => navigation.goBack()}
        />
      ),
    });

    async function carregar_dados() {
      setLoading(true);
      console.log('carregar_dados');
      //TRAZER PROJETOS EM ABERTO
      const responseProjetos = await api.get('api/projeto/listar_projeto_abertos');
      //TRAZER COOPERADOS
      const responseCooperados = await api.get('api/cooperado/listar_cooperados');
      console.log('responseCooperados');
      console.log(responseCooperados.data);
      setCooperados(responseCooperados.data.cooperados);
      setCooperadosTodos(responseCooperados.data.cooperados);
      setProjetos(responseProjetos.data.projetos);
      setLoading(false);
    }
    carregar_dados();
  }, [])

  //Validar valor de entrada para a busca do cooperado
  function setTanqueAction(text) {
    newText = text.replace(/[^0-9]/g, '');
    setCooperadoImput(newText);
    filtrarCooperado(newText);
  }

  async function filtrarCooperado(inputCooperado) {
    var find = {};
    if (inputCooperado.length <= inputCooperado.length && cooperados) {
      find = cooperados.filter(function (cooperadoItem) {
        return cooperadoItem.nome.includes(inputCooperado);
      });
    } else {
      find = cooperadosTodos.filter(function (cooperadoItem) {
        return cooperadoItem.nome.includes(inputCooperado);
      });
    }
    setCooperados(find);
  }

  function renderCooperado(item) {
    return (
      <View>
        <Text>{item.codigo_cacal}</Text>
      </View>
    )
  }

  return (
    <View>
      {loading ? (
        <Text>Loading</Text>
      ) : (
          <View>
            <Text>Teste</Text>
            <SearchBar
              placeholder="Buscar Cooperado"
              onChangeText={text => setCoopAction(text)}
              value={cooperadoImput}
            />
            <FlatList
              data={cooperados}
              keyExtractor={item => item.codigo_cacal}
              renderItem={({ item }) => renderCooperado(item)}
            />
          </View>
        )
      }
    </View>
  )
}

export default CriarEvento;

/*
        inputContainerStyle={styles.searchBarCont}
        inputStyle={{ backgroundColor: 'white', borderWidth: 0 }}
        containerStyle={styles.searchBar}
        */
