import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import {Map} from './Map';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
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
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="CleanWalk" component={HomeScreen} />
            <Tab.Screen name="Map" component={Map} />
            <Tab.Screen name="Assos" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
