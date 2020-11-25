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

export default function App() {

  useEffect(() => {
    //adicionando icones globalmente
    try {
      library.add(fab, faCheckSquare, faCoffee, faBars, faArrowLeft, faTrash, faSignOutAlt);
    } catch (error) {
      console.log(error);
    }
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


