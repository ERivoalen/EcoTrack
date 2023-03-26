import React, { useState, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import {supabase } from './supabase';

export default function CleanWalkScreen (){
    const [cleanWalkPaths, setCleanWalkPaths] = useState([]);

    useEffect(() => {
        const fetchCleanWalkPaths = async () => {
            const { data: cleanWalksData, error } = await supabase
                .from('cleanWalks')
                .select('*');
            if (error) {
                console.log(error);
            } else {
                setCleanWalkPaths(cleanWalksData);
            }
        };
        fetchCleanWalkPaths();
    }, []);

    const renderCleanWalkPath = ({ item }) => {
        const { latitude, longitude } = item.location;
        return (
            <Marker
                key={item.id}
                coordinate={{ latitude, longitude }}
                title={item.name}
                description={item.description}
            />
        );
    };

    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            {cleanWalkPaths.map(renderCleanWalkPath)}
        </MapView>
    );
};
