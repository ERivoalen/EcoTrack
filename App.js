import React from 'react';

import { ObjectMap } from './components/Map';

import { SafeAreaView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import BottomTabNavigator from './components/BottomTabNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
};

export default App;


