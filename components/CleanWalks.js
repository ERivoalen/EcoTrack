import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { supabase } from './supabase';

const CleanWalksScreen = () => {
    const [cleanWalks, setCleanWalks] = useState([]);
    const [selectedCleanWalk, setSelectedCleanWalk] = useState({ points: [] });

    useEffect(() => {
        const fetchCleanWalks = async () => {
            const { data, error } = await supabase
                .from('cleanWalks')
                .select('id, objects_id');
            if (error) console.log('Error fetching clean walks:', error);
            else setCleanWalks(data);
        };
        fetchCleanWalks();
    }, []);

    const fetchCleanWalkPoints = async (pointsIds) => {
        const { data, error } = await supabase
            .from('objects')
            .select('latitude, longitude')
            .in('id', pointsIds);
        if (error) {
            console.log('Error fetching clean walk points:', error);
        } else {
            const points = data
                .filter((point) => point.latitude && point.longitude)
                .map((point) => ({
                    latitude: point.latitude,
                    longitude: point.longitude,
                }));
            setSelectedCleanWalk({ points });
        }
    };
    const clearSelectedCleanWalk = () => {
        setSelectedCleanWalk(null);
    };

    return (
        <View style={styles.container}>
            {selectedCleanWalk ? (
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: selectedCleanWalk.points[0].latitude,
                            longitude: selectedCleanWalk.points[0].longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        {selectedCleanWalk.points && selectedCleanWalk.points.length > 0 && (
                            <Polyline
                                coordinates={selectedCleanWalk.points.map((point) => ({
                                    latitude: point.latitude,
                                    longitude: point.longitude,
                                }))}
                                strokeColor="#000"
                                strokeWidth={2}
                            />
                        )}
                    </MapView>
                    <Button title="Back" onPress={clearSelectedCleanWalk} />
                </View>
            ) : (
                <FlatList
                    data={cleanWalks}
                    renderItem={({ item }) => (
                        <View style={styles.cleanWalkContainer}>
                            <Text style={styles.cleanWalkTitle}>Clean Walk {item.id}</Text>
                            <Button
                                title="View Itinerary"
                                onPress={() => fetchCleanWalkPoints(item.points)}
                            />
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cleanWalkContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cleanWalkTitle: {
        fontSize: 18,
    },
    mapContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default CleanWalksScreen;
