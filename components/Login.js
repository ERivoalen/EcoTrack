import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { supabase } from './supabase';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) throw error;
            alert('Vous avez créé votre compte !');
        }
        catch (error) {
            alert(error.error_desccription || error.message)
        }
        finally {
            setLoading(false);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error;
        }
        catch (error) {
            alert(error.error_desccription || error.message)
        }
        finally {
            setLoading(false);
        }
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
            <Button title="Login" onPress={handleLogin} />
            <Button title="Sign Up" onPress={handleSignup} />
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
})