import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { supabase } from './supabase';

const API_KEY = '5b3ce3597851110001cf62488c1e79adf789490eb72896646a9c095e';
const CENTER_COORDINATES = { latitude: 48.858093, longitude: 2.294694 };
const MAP_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };

const styles = {
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
};

const MapScreen = () => {
    const [points, setPoints] = useState([]);

    useEffect(() => {
        const fetchPoints = async () => {
            const { data } = await supabase
                .from('objects')
                .select('*')
                .limit(5);

            const formattedPoints = data.map((point) => ({
                latitude: point.latitude,
                longitude: point.longitude,
            }));

            setPoints(formattedPoints);
        };

        fetchPoints();
    }, []);

    const calculateItinerary = async () => {
        const { data } = await axios.get(
            `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${API_KEY}&start=${points[0].longitude},${points[0].latitude}&end=${points[points.length - 1].longitude},${points[points.length - 1].latitude}&coordinates=${points
                .slice(1, -1)
                .map((point) => `${point.longitude},${point.latitude}`)
                .join('|')}`
        );

        return data.features[0].geometry.coordinates;
    };

    const [itinerary, setItinerary] = useState([]);

    useEffect(() => {
        const fetchItinerary = async () => {
            const itineraryCoordinates = await calculateItinerary();

            const formattedItinerary = itineraryCoordinates.map((coordinate) => ({
                latitude: coordinate[1],
                longitude: coordinate[0],
            }));

            setItinerary(formattedItinerary);
        };

        if (points.length > 0) {
            fetchItinerary();
        }
    }, [points]);

    return (
        <MapView
            style={styles.map}
            initialRegion={{
                ...CENTER_COORDINATES,
                ...MAP_DELTA,
            }}
        >
            {points.map((point, index) => (
                <Marker
                    key={index}
                    coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                    title={`Point ${index + 1}`}
                />
            ))}
            {itinerary.length > 0 && (
                <Polyline
                    coordinates={itinerary}
                    strokeColor="#f00"
                    strokeWidth={3}
                />
            )}
        </MapView>
    );
};

export default MapScreen;
