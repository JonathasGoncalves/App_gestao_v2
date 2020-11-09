import React from 'react';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

const RecuperarSenha = ({ }) => {

  useEffect(() => {
    console.log('Login');
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ alignSelf: 'center', marginTop: 50, color: 'red' }}>Recuperar Senha</Text>
    </View>
  );
}

export default RecuperarSenha;