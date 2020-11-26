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
import { faCheckSquare, faCoffee, faBars, faArrowLeft, faTrash, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  useEffect(() => {

    //adicionando client_secret
    async function secret_laravel() {
      await AsyncStorage.setItem('@client_secret', 'gH1A7MRMm6pF5WHjT4LoqShppVGfwwsvjuivzNNe');
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

  return (
    <Provider store={store}>
      <NavigationContainer>
        <IndexRouter />
        <StatusBar style="auto" />
      </NavigationContainer >
    </Provider>

  );
}


