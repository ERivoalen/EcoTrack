import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button,StyleSheet } from 'react-native';
import MapView, { Marker,Callout } from 'react-native-maps';
import { supabase } from './supabase';

const MarkersMapScreen = () => {
    const [markers, setMarkers] = useState([]);
    const [newMarkerTitle, setNewMarkerTitle] = useState('');
    const [newMarkerCoordinate, setNewMarkerCoordinate] = useState(null);

    useEffect(() => {
        
        fetchMarkers();
    }, []);
    
    const fetchMarkers = async () => {
        const { data: markers, error } = await supabase.from('objects').select('*');
        if (error) {
            console.error(error);
        } else {
            setMarkers(markers);
        }
    };

    const handleAddMarker = async (coordinate) => {
        if (coordinate !== null && coordinate.latitude !== null) {
            const { data: marker, error } = await supabase
                .from('objects')
                .insert({ title: newMarkerTitle, latitude: coordinate.latitude, longitude: coordinate.longitude });
            if (error) {
                console.error(error);
            } else {
                setMarkers([...markers, marker]);
                setNewMarkerTitle('');
                await fetchMarkers();
                setNewMarkerCoordinate(null);
            }
        }
    };

    const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;
        setNewMarkerCoordinate(coordinate);
    };

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
            >
                {markers.map((marker) => {
                    if (marker!=null) {
                        return (
                            <Marker
                                key={marker.id}
                                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                                title={marker.title}
                            >
                                <Callout style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>{marker.title}</Text>
                                </Callout>
                            </Marker>
                        );
                    } else {
                        return null;
                    }
                })}

                {newMarkerCoordinate && (
                    <Marker coordinate={newMarkerCoordinate}>
                        <View style={{ backgroundColor: 'white', padding: 5 }}>
                            <TextInput
                                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                placeholder="Enter marker title"
                                value={newMarkerTitle}
                                onChangeText={(text) => setNewMarkerTitle(text)}
                            />
                            <Button title="Add Marker" onPress={() => handleAddMarker(newMarkerCoordinate)} />
                        </View>
                    </Marker>
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    calloutContainer: {
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'gray',
        borderWidth: 1,
    },
    calloutText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MarkersMapScreen;
