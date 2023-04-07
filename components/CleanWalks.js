import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {supabase} from './supabase';

const CleanWalks = () => {
    const [cleanWalks, setCleanWalks] = useState([]);
    const [selectedCleanWalk, setSelectedCleanWalk] = useState(null);
    const [cleanWalkPoints, setCleanWalkPoints] = useState([]);

    useEffect(() => {
        async function fetchCleanWalks() {
            let { data: cleanWalks, error } = await supabase
                .from('cleanWalks')
                .select('*');
            if (error) console.log('Error fetching clean walks:', error);
            else setCleanWalks(cleanWalks);
            console.log('Ok');
        }
        fetchCleanWalks();
    }, []);

    const handleViewItinerary = async (cleanWalk) => {
        setSelectedCleanWalk(cleanWalk);
        let points = [];

        for (let i = 0; i < cleanWalk.objects_id.length; i++) {
            let { data: objects, error } = await supabase
                .from('objects')
                .select('latitude, longitude')
                .eq('id', cleanWalk.objects_id[i]);
            if (error) console.log('Error fetching points:', error);
            else points.push(objects[0]);
        }
        setCleanWalkPoints(points);
    };

    const handleBackToList = () => {
        setSelectedCleanWalk(null);
        setCleanWalkPoints([]);
    };

    if (selectedCleanWalk) {
        return (
            <View style={{ flex: 1 }}>
                <MapView style={{ flex: 1 }} initialRegion={{
                    latitude: 48.8666,
                    longitude: 2.33333,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}>
                    {cleanWalkPoints.map((point, index) => (
                        <Marker key={index} coordinate={{ latitude: point.latitude, longitude: point.longitude }} />
                    ))}
                </MapView>
                <Button title="Back to List" onPress={handleBackToList} />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Clean Walks</Text>
                {cleanWalks.map((cleanWalk) => (
                    <View key={cleanWalk.id} style={styles.item}>
                        <Text style={styles.title}>{`Clean Walk ${cleanWalk.id}`}</Text>
                        <Button
                            title="View Itinerary"
                            onPress={() => handleViewItinerary(cleanWalk)}
                        />
                    </View>
                ))}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default CleanWalks;
