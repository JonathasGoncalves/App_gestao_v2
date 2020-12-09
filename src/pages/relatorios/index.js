import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Button, CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';

const Relatorio = ({ navigation }) => {

  const { data, setData } = useState('2020-12/01');

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
  })

  return (
    <View>
      <Text>Tipo de Relatório</Text>
      <View style={{ flexDirection: 'row' }}>
        <CheckBox
          center
          title='CBT'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={true}
          containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
        />
        <CheckBox
          center
          title='CCS'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={true}
          containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <CheckBox
          center
          title='Dentro Do Padrão'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={true}
          containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
        />
        <CheckBox
          center
          title='Fora Do Padrão'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={true}
          containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
        />
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        height: 50,
        width: 300
      }}>
        <FontAwesomeIcon icon="calendar" color='#00BFFF' size={25} />
        <DateTimePicker
          testID="dateTimePicker"
          value={data}
          mode={'datetime'}
          is24Hour={true}
          display="default"
          onChange={setData}
        />
      </View>
    </View>
  );
}

const mapStateToProps = state => ({
  identificado: state.Tecnico.identificado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Relatorio);