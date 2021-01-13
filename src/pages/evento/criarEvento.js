import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button } from 'react-native-elements';
import api from '../../services/api';
import { SearchBar } from 'react-native-elements';
import styles from './styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { date } from '../../functions/tempo';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';

const CriarEvento = ({ navigation }) => {

  const [cooperados, setCooperados] = useState([]);
  const [cooperadosTodos, setCooperadosTodos] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [formulario, setFormulario] = useState('');
  const [projetos, setProjetos] = useState([]);
  const [cooperadoImput, setCooperadoImput] = useState('');
  const [loading, setLoading] = useState(true);
  const [listAtivo, setListAtivo] = useState(false);
  const [data, setData] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [coopSelect, setCoopSelect] = useState({});

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
      //TRAZER COOPERADOS
      const responseCooperados = await api.get('api/cooperado/listar_cooperados');
      //TRAZER TIPOS DE RELATÓRIO
      const responseFormularios = await api.get('api/evento/listar_formularios');
      setCooperados(responseCooperados.data.cooperados);
      setFormularios(responseFormularios.data.formularios);
      setCooperadosTodos(responseCooperados.data.cooperados);
      setProjetos(responseProjetos.data.projetos);
      setLoading(false);
      setListAtivo(true);
    }
    carregar_dados();
  }, [])

  //Validar valor de entrada para a busca do cooperado
  function setCoopAction(text) {
    setCooperadoImput(text);
    filtrarCooperado(text);
  }

  async function filtrarCooperado(inputCooperado) {
    console.log(cooperados.length);
    var find = {};
    if (cooperadoImput.length <= inputCooperado.length && cooperados) {
      find = cooperados.filter(function (cooperadoItem) {
        return cooperadoItem.nome.toLowerCase().startsWith(inputCooperado.toLowerCase());
      });
    } else {
      find = cooperadosTodos.filter(function (cooperadoItem) {
        return cooperadoItem.nome.toLowerCase().startsWith(inputCooperado.toLowerCase());
      });
    }
    console.log(find.length)
    setCooperados(find);
  }

  //ADICIONA A NOVA DATA 
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShowDate(false);
    setData(currentDate);
  };

  function renderCooperado(item) {
    return (
      <View style={styles.viewCard}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => selectCoop(item)}>
          <View style={styles.viewColunn}>
            <View style={styles.viewRow}>
              <Text style={styles.textLabel}>Nome</Text>
              <Text style={styles.textInput}>{item.nome}</Text>
            </View>
            <View style={styles.viewRow}>
              <Text style={styles.textLabel}>Municipio</Text>
              <Text style={styles.textInput}>{item.municipio}</Text>
            </View>
          </View>
          <View style={styles.viewRow}>
            <Text style={styles.textLabel}>Código:</Text>
            <Text style={styles.textInput}>{item.codigo_cacal}</Text>
            <Text style={styles.textLabel}>Tanque:</Text>
            <Text style={styles.textInput}>{item.tanque}</Text>
            <Text style={styles.textLabel}>Latão:</Text>
            <Text style={styles.textInput}>{item.latao}</Text>
          </View>
          <View style={styles.viewRow}>
            <Text style={styles.textLabel}>CBT:</Text>
            <Text style={styles.textInput}>{item.cbt}</Text>
            <Text style={styles.textLabel}>CCS:</Text>
            <Text style={styles.textInput}>{item.ccs}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  function selectCoop(item) {
    console.log('Selecionou!');
    console.log(item);
    setListAtivo(false);
    setCoopSelect(item);
  }

  return (
    <View>
      {loading ? (
        <ActivityIndicator size='large' color='#00BFFF' style={{ marginTop: '50%', position: "absolute", alignSelf: "center" }} />
      ) : listAtivo ? (
        <View>
          <SearchBar
            placeholder="Buscar Cooperado"
            onChangeText={text => setCoopAction(text)}
            value={cooperadoImput}
            inputContainerStyle={styles.searchBarCont}
            inputStyle={{ backgroundColor: 'white', borderWidth: 0 }}
            containerStyle={styles.searchBar}
          />
          <FlatList
            data={cooperados}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderCooperado(item)}
          />
        </View>
      ) : (
            <View>
              <View style={styles.viewCard}>
                <View style={styles.viewColunn}>
                  <View style={styles.viewRow}>
                    <Text style={styles.textLabel}>Nome</Text>
                    <Text style={styles.textInput}>{coopSelect.nome}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.textLabel}>Municipio</Text>
                    <Text style={styles.textInput}>{coopSelect.municipio}</Text>
                  </View>
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.textLabel}>Código:</Text>
                  <Text style={styles.textInput}>{coopSelect.codigo_cacal}</Text>
                  <Text style={styles.textLabel}>Tanque:</Text>
                  <Text style={styles.textInput}>{coopSelect.tanque}</Text>
                  <Text style={styles.textLabel}>Latão:</Text>
                  <Text style={styles.textInput}>{coopSelect.latao}</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.textLabel}>CBT:</Text>
                  <Text style={styles.textInput}>{coopSelect.cbt}</Text>
                  <Text style={styles.textLabel}>CCS:</Text>
                  <Text style={styles.textInput}>{coopSelect.ccs}</Text>
                </View>
              </View>

              <View>
                <FontAwesomeIcon icon="clipboard-list" color="white" size={25} />
                <Dropdown
                  //containerStyle={{ marginLeft: scale(10), width: scale(300), height: moderateScale(50) }}
                  label={"Selecione o tipo de visita"}
                  value={formulario}
                  useNativeDriver={true}
                  //fontSize={moderateScale(14)}
                  //labelFontSize={moderateScale(14)}
                  //dropdownPosition={0}
                  //overlayStyle={{ marginTop: moderateScale(3) }}
                  data={formularios}
                //itemTextStyle={{ fontSize: moderateScale(18), marginTop: 0 }}
                //onChangeText={this.onChangeText}
                />
              </View>

              <TouchableOpacity disabled={loading} onPress={() => setShowDate(true)}>
                <View style={styles.viewCalendar}>
                  <FontAwesomeIcon style={{ alignSelf: 'center' }} icon="calendar" color='#00BFFF' size={25} />
                  <Text allowFontScaling={false} style={styles.textDate}>{date(data)}</Text>
                </View>
              </TouchableOpacity>

              {showDate &&
                <DateTimePicker
                  value={data}
                  mode={'datetime'}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              }
            </View>
          )
      }
    </View>
  )
}

export default CriarEvento;



/*

<View>
                <FontAwesomeIcon icon="clipboard-list" color="white" size={25} />
                <Dropdown
                  //containerStyle={{ marginLeft: scale(10), width: scale(300), height: moderateScale(50) }}
                  label={"Teste"}
                  value={relatorio}
                  //fontSize={moderateScale(14)}
                  //labelFontSize={moderateScale(14)}
                  //dropdownPosition={0}
                  //overlayStyle={{ marginTop: moderateScale(3) }}
                  data={relatorios}
                //itemTextStyle={{ fontSize: moderateScale(18), marginTop: 0 }}
                //onChangeText={this.onChangeText}
                />
              </View>

              <View>
                <FontAwesomeIcon icon="pencil-ruler" color="white" size={25} />
                <Dropdown
                  //containerStyle={{ marginLeft: scale(10), width: scale(300), height: moderateScale(50) }}
                  label={"Teste"}
                  value={relatorio}
                  //fontSize={moderateScale(14)}
                  //labelFontSize={moderateScale(14)}
                  //dropdownPosition={0}
                  //overlayStyle={{ marginTop: moderateScale(3) }}
                  data={relatorios}
                //itemTextStyle={{ fontSize: moderateScale(18), marginTop: 0 }}
                //onChangeText={this.onChangeText}
                />
              </View>
              */
