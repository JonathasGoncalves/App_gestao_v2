import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AgendaScreen from './../pages/agenda/index';

import { createStackNavigator } from '@react-navigation/stack';

const CreateMainStack = createStackNavigator();
function AgendaIndex() {
  return (
    <CreateMainStack.Navigator>
      <CreateMainStack.Screen
        name="Agenda"
        component={AgendaScreen}
        options={{
          title: 'Agenda',
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
    </CreateMainStack.Navigator>
  );
}

const CreateMainDrawer = createDrawerNavigator();
function MainDrawer() {
  return (
    <CreateMainDrawer.Navigator initialRouteName="Index">
      <CreateMainDrawer.Screen
        name="Index"
        component={AgendaIndex}
        options={{
          title: 'Agenda',
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

    </CreateMainDrawer.Navigator>
  );
}

export default MainDrawer;