import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button } from 'react-native-elements';
import api from '../../services/api';
import { SearchBar } from 'react-native-elements';
import styles from './styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { date, timeParam } from '../../functions/tempo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';

const CriarEvento = ({ navigation, id_tecnico }) => {

  const [cooperados, setCooperados] = useState([]);
  const [cooperadosTodos, setCooperadosTodos] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [formulario, setFormulario] = useState({ label: '', value: '' });
  const [projetos, setProjetos] = useState([]);
  const [projeto, setProjeto] = useState({ label: '', value: '' });
  const [cooperadoImput, setCooperadoImput] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingNovoProjeto, setLoadingNovoProjeto] = useState(false);
  const [listAtivo, setListAtivo] = useState(false);
  const [data, setData] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTime, setShowTime] = useState(false);
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
      //
      temp = [];
      responseFormularios.data.formularios.map((formulario) => {
        temp.push({ label: formulario.Titulo, value: formulario.id });
      })
      setFormularios(temp);
      setCooperadosTodos(responseCooperados.data.cooperados);
      temp2 = [];
      responseProjetos.data.projetos.map((projeto) => {
        temp2.push({ label: projeto.nome, value: projeto.id });
      })
      setProjetos(temp2);
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
    setCooperados(find);
  }

  //ADICIONA A NOVA DATA 
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShowDate(false);
    setShowTime(true);
    setData(currentDate);
  };

  //ADICIONA A NOVA HORA 
  const onChangeTime = (event, selectedTime) => {

    const currentTime = selectedTime || time;
    setShowTime(false);
    setTime(currentTime);
  };

  //ADICIONA O FORMULARIO 
  const onChangeFormulario = (selectedForm) => {
    setFormulario({ label: selectedForm, value: selectedForm });
  };

  //ADICIONA O PROJETO 
  const onChangeProjeto = (selectedProj) => {
    setProjeto({ label: selectedProj, value: selectedProj });
  };

  //Registra evento 
  const actionAplica = async () => {
    temp = await api.get('api/evento/agendar_evento', {
      DataSubmissao: data,
      hora: time,
      qualidade_id: coopSelect.id_qualidade,
      tanque_id: coopSelect.id,
      fomulario_id: formulario.value,
      projeto_id: projeto.value,
      tecnico_id: id_tecnico,
      realizada: 0,
    });

    console.log(temp);
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

              <View style={styles.viewSelect}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Selecione o tipo de visita',
                    value: 1,
                  }}
                  items={formularios}
                  onValueChange={(value) => {
                    onChangeFormulario(value);
                  }}
                  style={{
                    inputAndroid: styles.inputAndroid,
                    inputAndroidContainer: styles.containerDrop,
                    iconContainer: styles.containerIcon,
                  }}
                  value={formulario.value}
                  useNativeAndroidPickerStyle={false}
                  textInputProps={{ underlineColor: '#00BFFF' }}
                  Icon={() => {
                    return <FontAwesomeIcon icon="clipboard-list" color='#00BFFF' size={25} />;
                  }}
                />
              </View>

              <View style={styles.viewSelect}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Selecione um projeto',
                    value: 1,
                  }}
                  items={projetos}
                  onValueChange={(value) => {
                    onChangeProjeto(value);
                  }}
                  style={{
                    inputAndroid: styles.inputAndroid,
                    inputAndroidContainer: styles.containerDrop,
                    iconContainer: styles.containerIcon,
                  }}
                  value={projeto.value}
                  useNativeAndroidPickerStyle={false}
                  textInputProps={{ underlineColor: '#00BFFF' }}
                  Icon={() => {
                    return <FontAwesomeIcon icon="pencil-ruler" color='#00BFFF' size={25} />;
                  }}
                />
              </View>

              <TouchableOpacity disabled={loading} onPress={() => setShowDate(true)}>
                <View style={styles.viewCalendar}>
                  <FontAwesomeIcon style={{ alignSelf: 'center' }} icon="calendar" color='#00BFFF' size={25} />
                  <Text allowFontScaling={false} style={styles.textDate}>{date(data) + ' ' + timeParam(time)}</Text>
                </View>
              </TouchableOpacity>

              {showDate &&
                <DateTimePicker
                  value={data}
                  mode={'date'}
                  display={'spinner'}
                  is24Hour={true}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              }
              {showTime &&
                <DateTimePicker
                  value={data}
                  mode={'time'}
                  display={'spinner'}
                  is24Hour={true}
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTime}
                />
              }
              <Button
                title="Aplicar"
                type="outline"
                onPress={actionAplica}
                containerStyle={loadingNovoProjeto || formulario.label == '' ? styles.containerButtonPadraoDisable : styles.containerButtonPadrao}
                titleStyle={styles.textButtonPadrao}
                disabled={loadingNovoProjeto || formulario.label == ''}
              />
            </View>
          )
      }
    </View>
  )
}

const mapStateToProps = state => ({
  id_tecnico: state.Tecnico.id
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CriarEvento);



/*

items={formularios}
                  placeholder={{
                    label: 'Selecionar...',
                    value: 1,
                  }}
                  onValueChange={(value) => {
                    onChangeFormulario(value);
                  }}
                  value={formulario.value}
              */

/*

<RNPickerSelect
    useNativeAndroidPickerStyle={false}
    style={{
      inputAndroid: styles.inputAndroid,
      inputAndroidContainer: styles.containerDrop,
      iconContainer: styles.containerIcon,
    }}
    items={formularios}
    placeholder={{
      label: 'Selecionar...',
      value: 1,
    }}
    onValueChange={(value) => {
      onChangeFormulario(value);
    }}
    value={formulario.value}
    Icon={() => {
      return <FontAwesomeIcon icon="clipboard-list" color='#00BFFF' size={25} />;
    }}
  />

  */
