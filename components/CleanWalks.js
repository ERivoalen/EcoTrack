import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { supabase } from './supabase';

export default function CleanWalkScreen() {
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

    const drawPaths = () => {
        const paths = [];

        for (let i = 0; i < locations.length - 1; i++) {
            const startLocation = locations[i];
            const endLocation = locations[i + 1];

            paths.push(
                <Polyline
                    key={`${startLocation.id}-${endLocation.id}`}
                    coordinates={[
                        { latitude: startLocation.latitude, longitude: startLocation.longitude },
                        { latitude: endLocation.latitude, longitude: endLocation.longitude },
                    ]}
                    strokeColor="#FF0000"
                    strokeWidth={2}
                />
            );
        }
        return paths;
    };

    return (
        <View style={styles.container}>
            {locations.length > 0 && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: locations[0].latitude,
                        longitude: locations[0].longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {drawPaths()}
                </MapView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});