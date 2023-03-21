import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export class Map extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    initialRegion={{
                        latitude: 48.866669,
                        longitude: 2.33333,
                        latitudeDelta: 0.15,
                        longitudeDelta: 0.15,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                        }}
                        title={"Object Title"}
                        description={"Object Description"}
                    />
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});


