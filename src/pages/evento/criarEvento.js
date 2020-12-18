import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button } from 'react-native-elements';
import api from '../../services/api';

const CriarEvento = ({ navigation }) => {

  const [cooperados, setCooperados] = useState([]);
  const [projetos, setProjetos] = useState([]);

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
      //TRAZER PROJETOS EM ABERTO
      const responseProjetos = await api.get('api/projeto/listar_projeto_abertos');
      setProjetos(responseProjetos.data.projetos);
      //TRAZER COOPERADOS
      const responseCooperados = await api.get('api/cooperado/listar_cooperados');
      setCooperados(responseCooperados.data.cooperados);
    }

    carregar_dados();

  })


  return (
    <View>
      <Text>Teste</Text>
    </View>
  )
}

export default CriarEvento;
