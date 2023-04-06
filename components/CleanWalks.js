import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { supabase } from './supabase';

export default function CWScreen() {
    const [CW, setCW] = useState([]);

    useEffect(() => {
        const fetchCW = async () => {
            const { data: CWData, error } = await supabase
                .from('cleanWalks')
                .select('*');
            if (error) {
                console.log(error);
            } else {
                setCW(CWData);
            }
        };
        fetchCW();
    }, []);

    const SectionHeader = ({ title }) => {
        return (
            <Text style={styles.sectionHeader}>{title}</Text>
        );
    };

    const CWItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.CWItem}>
                <View style={styles.CWItemTextContainer}>
                    <Text style={styles.CWStart}>{item.start_obj}</Text>
                    <Text style={styles.CWEnd}>{item.end_obj}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <SectionList
                sections={[
                    { title: 'Les CleanWalks proposées jusqu\'alors !', data: CW.slice(0, 10) },
                ]}
                keyExtractor={(item) => item.id}
                renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
                renderItem={({ item }) => <CWItem item={item} />}
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
    CWItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    CWItemTextContainer: {
        flex: 1,
    },
    CWStart: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    CWEnd: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});