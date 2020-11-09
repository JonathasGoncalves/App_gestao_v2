import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Agenda from './../pages/agenda/index';

const CreateMainDrawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <CreateMainDrawer.Navigator>
      <CreateMainDrawer.Screen
        name="index"
        component={Agenda}
        options={{
          title: 'Cadastro',
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