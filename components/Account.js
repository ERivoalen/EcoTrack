import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';

export default function AccountPage({ session }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log(session.user.id)
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                //console.log(data.id)
                if (error) throw error;
                setUserData(data);
            } catch (error) {
                console.log('Error fetching user data:', error.message);
            }
        };
        fetchUserData();
    }, [session]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <View>
            <Text>Email: {userData?.username} </Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 5,
        padding: 10,
    },
})