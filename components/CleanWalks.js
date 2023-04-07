import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet,ScrollView } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { supabase } from './supabase';
import axios from 'axios';

const API_KEY = '5b3ce3597851110001cf62488c1e79adf789490eb72896646a9c095e';

const CleanWalks = () => {
    const [cleanWalks, setCleanWalks] = useState([]);
    const [selectedCleanWalk, setSelectedCleanWalk] = useState(null);
    const [cleanWalkPoints, setCleanWalkPoints] = useState([]);
    const [itinerary, setItinerary] = useState([]);
    const [itineraryCalculated, setItineraryCalculated] = useState(false);

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
        console.log(points)
        setCleanWalkPoints(points);
        //handleCalculateItinerary();
        const itineraryCoordinates = [];
        console.log(cleanWalkPoints);
        for (let i = 0; i < points.length - 1; i++) {
            const startPoint = points[i];
            const endPoint = points[i + 1];
            console.log('bouvle');
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

    const handleBackToList = () => {
        setSelectedCleanWalk(null);
        setCleanWalkPoints([]);
    };

    const calculateItinerary = async (startPoint, endPoint) => {
        console.log('Ici');
        const { data } = await axios.get(
            `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${API_KEY}&start=${startPoint.longitude},${startPoint.latitude}&end=${endPoint.longitude},${endPoint.latitude}`
        );
        console.log(data);

        return data.features[0].geometry.coordinates;
    };

    const handleCalculateItinerary = async () => {
        const itineraryCoordinates = [];
        console.log(cleanWalkPoints);
        for (let i = 0; i < cleanWalkPoints.length - 1; i++) {
            const startPoint = cleanWalkPoints[i];
            const endPoint = cleanWalkPoints[i + 1];
            console.log('bouvle');
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

    useEffect(() => {
        if (itineraryCalculated) {
            // Trigger map re-render when itinerary is calculated
            setSelectedCleanWalk(selectedCleanWalk);
        }
    }, [itineraryCalculated]);


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
                    {itineraryCalculated && (
                        <Polyline coordinates={itinerary} strokeColor="#f00" strokeWidth={3} />
                    )}
                </MapView>

                <Button title="Back to List" onPress={handleBackToList} />
            </View>
        );
    } else {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.header}>Clean Walks</Text>
                    {cleanWalks.map((cleanWalk) => (
                        <View key={cleanWalk.id} style={styles.item}>
                            <Text style={styles.title}>{`Clean Walk ${cleanWalk.id}`}</Text>
                            <Button
                                title="View Itinerary"
                                onPress={() => { handleViewItinerary(cleanWalk) }}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
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
