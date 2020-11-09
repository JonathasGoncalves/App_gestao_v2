import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import Login from './../pages/login/index';
import RecuperarSenha from './../pages/login/recuperarSenha';

const CreateStackLogin = createStackNavigator();

function LoginStack() {
  return (
    <CreateStackLogin.Navigator initialRouteName="Index">
      <CreateStackLogin.Screen
        name="Index"
        component={Login}
        options={{
          title: 'Login',
          headerStyle: {
            backgroundColor: '#00BFFF',
          },
          headerTitleAlign: "center",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <CreateStackLogin.Screen
        name="Recuperar Senha"
        component={RecuperarSenha}
        options={{
          title: 'Recuperar Senha',
          headerStyle: {
            backgroundColor: '#00BFFF',
          },
          headerTitleAlign: "center",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </CreateStackLogin.Navigator>
  );
}

export default LoginStack;