//Your final app.js with stack navigator and tab navigator
import React from 'react';
import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

//Import DB
import { supabase } from './components/supabase';
//Import d'ecran

import LoginScreen from './components/Login';
import MapScreen from './components/Map';
//import CleanWalk from './components/CleanWalk';
import HomeScreen from './components/HomeScreen';
import Account from './components/Account';


const Tab = createBottomTabNavigator();
export default function App() {

  //Gestion des données de session

  const [session, setSession] = useState(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const ProfileStack = createStackNavigator();
  function ProfileStackScreen() {

    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen name="Login" component={LoginScreen} />
        <ProfileStack.Screen name="Account" component={Account} />
      </ProfileStack.Navigator>
    )
  }

  //Render 
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            //Appuyer sur les boutons
            if (route.name === 'CleanWalk') {
              iconName = focused ? 'walk' : 'walk';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            }
            else if (route.name === 'Assos') {
              iconName = focused ? 'body' : 'body-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="CleanWalk" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Assos" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}