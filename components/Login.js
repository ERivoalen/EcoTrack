import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from './supabase';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    async function handleSignup() {
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) { Alert.alert(error.message) }
        else {
            alert('Sign Up !');
            //navigation.Navigate('Account')
        }
        setLoading(false)
    }

    async function handleLogin() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) { Alert.alert(error.message) }
        else {
            alert('Login !');
            navigation.navigate('Account')
        }
        setLoading(false)
    }



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
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