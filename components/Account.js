import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';

function AccountPage() {
    const [user, setUserData] = useState(null);

    useEffect(async () => {
        // Fetch user data from Supabase
        const { data: user, error } = await supabase.auth.user();

        if (error) {
            console.log('Error fetching user data:', error.message);
        } else {
            //alert('Wesh')
            setUserData(user);
        }
    }, []);

    async function updateUser(newUserData) {
        const { error } = await supabase.auth.update(newUserData);

        if (error) {
            console.log('Error updating user data:', error.message);
        } else {
            setUserData(newUserData);
            //alert('Wesh2')
        }
    }

    return (
        // Display user data in the UI
        <View>
            <Text>Username: {user?.email}</Text>
            <Button title="Edit" onPress={(updateUser) => console.log('Edit clicked')} />
        </View>
    );
}

export default AccountPage;