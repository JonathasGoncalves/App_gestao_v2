import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IndexRouter from '../src/routes/index';
import { Provider } from 'react-redux';
import store from './data/data';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare, faCoffee, faBars, faArrowLeft, faTrash, faUser, faSignOutAlt, faCalendar } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  useEffect(() => {

    //adicionando client_secret
    async function secret_laravel() {
      await AsyncStorage.setItem('@client_secret', 'xOZgN1Dcgjmmi7SyH6JaJNi6gaYfMHE65youl0r5');
      await AsyncStorage.setItem('@client_id', '1');
    }
    //adicionando icones globalmente
    try {
      library.add(fab, faCheckSquare, faCoffee, faBars, faArrowLeft, faTrash, faSignOutAlt);
    } catch (error) {
      console.log(error);
    }

    //adicionando client_secret
    secret_laravel();

  }, [])

  const MyTheme = {
    colors: {
      primary: 'white',
      background: 'white'
    },
  };

  return (
    <Provider store={store}>
      <NavigationContainer theme={MyTheme}>
        <IndexRouter />
        <StatusBar style="auto" />
      </NavigationContainer >
    </Provider>

  );
}


