import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import {supabase} from './supabase';

export default function AssociationScreen() {
    const [associations, setAssociations] = useState([]);

    useEffect(() => {
        const fetchAssociations = async () => {
            const { data: associationsData, error } = await supabase
                .from('associations')
                .select('*');
            if (error) {
                console.log(error);
            } else {
                setAssociations(associationsData);
            }
        };
        fetchAssociations();
    }, []);

    const SectionHeader = ({ title }) => {
        return (
            <Text style={styles.sectionHeader}>{title}</Text>
        );
    };

    const AssociationItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.associationItem}>
                <Image
                    source={{ uri: item.image_url }}
                    style={styles.associationItemImage}
                />
                <Text style={styles.associationItemText}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <SectionList
                sections={[
                    { title: 'Les assos de cleanWalk', data: associations.slice(0, 3) },
                ]}
                keyExtractor={(item) => item.id}
                renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
                renderItem={({ item }) => <AssociationItem item={item} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#eee',
        padding: 10,
    },
    associationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    associationItemImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    associationItemText: {
        fontSize: 16,
    },
});
