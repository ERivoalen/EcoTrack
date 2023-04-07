//Your final app.js with stack navigator and tab navigator
import React from 'react';
import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

//Import DB
import { supabase } from './components/supabase';
import { Session } from '@supabase/supabase-js';
//Import d'ecran

import LoginScreen from './components/Login';
import AboutUsPage from './components/Account';
import AssociationScreen from './components/Association';
import CleanWalks from './components/CleanWalks';
import MapScreen from './components/test';
import MapScreen2 from './components/Map';


const Tab = createBottomTabNavigator();
export default function App() {

  //Gestion des données de session

  const [session, setSession] = useState(null)
  useEffect(() => {
    setSession(supabase.auth.getSession())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const ProfileStack = createStackNavigator();
  function ProfileStackScreen() {

    return (
      <ProfileStack.Navigator>
        {session ? (
          <ProfileStack.Screen name="Manage Your Account">
            {(props) => <AboutUsPage {...props} session={session} />}
          </ProfileStack.Screen>
        ) : (
          <ProfileStack.Screen name="Welcome in our app" component={LoginScreen} />
        )}
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
            if (route.name === 'Cleanwalk') {
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
        <Tab.Screen name="Cleanwalk" component={CleanWalks} />
        <Tab.Screen name="Map" component={MapScreen2} />
        <Tab.Screen name="Assos" component={AssociationScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}