import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import axios from 'axios';
import { supabase } from './supabase';

const API_KEY = '5b3ce3597851110001cf62488c1e79adf789490eb72896646a9c095e';
const CENTER_COORDINATES = { latitude: 48.858093, longitude: 2.294694 };
const MAP_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
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

const MapScreen = () => {
    const [points, setPoints] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [newMarkerTitle, setNewMarkerTitle] = useState('');
    const [newMarkerCoordinate, setNewMarkerCoordinate] = useState(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetchMarkers();
        //fetchPoints();
    }, []);

    const fetchPoints = async () => {
        // Select one random point from the table
        const taille= await supabase.from('Objects').count().eq()
        const randomId = Math.floor(Math.random() * 60) + 1;
        const { data: randomPointData } = await supabase
            .from('objects')
            .select('latitude, longitude,id')
            .eq('id', randomId);
        console.log(randomPointData);

        // Retrieve the latitude and longitude of the random point
        const { latitude: randomLatitude, longitude: randomLongitude } = randomPointData[0];

        // Select all points in the table
        const { data: allPointsData } = await supabase
            .from('objects')
            .select('latitude, longitude');

        // Calculate the distance between each point and the random point using the Haversine formula
        const formattedPoints = allPointsData
            .map((point) => ({
                ...point,
                distance: haversine(point.latitude, point.longitude, randomLatitude, randomLongitude),
            }))
            // Sort the points by their distance to the random point
            .sort((a, b) => a.distance - b.distance)
            // Take the first 5 closest points
            .slice(0, 10)
            // Map the data to an array of point objects with latitude and longitude properties
            .map((point) => ({
                latitude: point.latitude,
                longitude: point.longitude,
            }));

        // Set the points state to the array of formatted points
        setPoints(formattedPoints);
    };

    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // metres
        const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // in metres
    }


    const calculateItinerary = async (startPoint, endPoint) => {
        const int = 0;
        const { data } = await axios.get(
            `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${API_KEY}&start=${startPoint.longitude},${startPoint.latitude}&end=${endPoint.longitude},${endPoint.latitude}`
        );

        return data.features[0].geometry.coordinates;
    };

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

    const [itinerary, setItinerary] = useState([]);
    const [itineraryCalculated, setItineraryCalculated] = useState(false);

    const handleCalculateItinerary = async () => {
        await fetchPoints();
        const itineraryCoordinates = [];

        for (let i = 0; i < points.length - 1; i++) {
            const startPoint = points[i];
            const endPoint = points[i + 1];
            const segmentCoordinates = await calculateItinerary(startPoint, endPoint);
            itineraryCoordinates.push(...segmentCoordinates);
        }

        const formattedItinerary = itineraryCoordinates.map((coordinate) => ({
            latitude: coordinate[1],
            longitude: coordinate[0],
        }));

        setItinerary(formattedItinerary);
        setItineraryCalculated(true);
    };

    const handleSaveItinerary = async (points, startPoint, endPoint) => {
        try {
            // Create a new itinerary in the 'itineraries' table
            const { data, error } = await supabase
                .from('itineraries')
                .insert({ start_point: startPoint, end_point: endPoint })
                .single();

            if (error) {
                throw error;
            }

            // Get the ID of the newly created itinerary
            const itineraryId = data.id;

            // Insert each point into the 'itinerary_points' table
            const pointsData = points.map((point, index) => ({
                itinerary_id: itineraryId,
                point_order: index,
                latitude: point.latitude,
                longitude: point.longitude,
            }));

            const { error: pointsError } = await supabase
                .from('itinerary_points')
                .insert(pointsData);

            if (pointsError) {
                throw pointsError;
            }

            alert('Itinerary saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save itinerary.');
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    ...CENTER_COORDINATES,
                    ...MAP_DELTA,
                }}
                onPress={handleMapPress}
            >
                {points.map((point, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                        title={`Point ${index + 1}`}
                    />
                ))}
                {itinerary.length > 0 && (
                    <Polyline coordinates={itinerary} strokeColor="#f00" strokeWidth={3} />
                )}
                {markers.map((marker) => {
                    if (marker != null) {
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
            <TouchableOpacity style={styles.button} onPress={handleCalculateItinerary}>
                <Text style={styles.buttonText}>Calculate Itinerary</Text>
            </TouchableOpacity>
            {itineraryCalculated && (
                <TouchableOpacity style={styles.button} onPress={() => {handleSaveItinerary }}>
                    <Text style={styles.buttonText}>Save Itinerary</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default MapScreen;
``
