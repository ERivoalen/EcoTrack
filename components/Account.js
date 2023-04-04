import React from 'react';
import { StyleSheet, View, Text, Button, ScrollView } from 'react-native';
import { supabase } from './supabase';


export default function AboutUsPage() {

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.text}>
        Eco Track is a mobile application dedicated to keeping our streets and
        public spaces clean. Our mission is to make it easy and rewarding for
        people to pick up litter and take care of their local communities.
      </Text>
      <Text style={styles.text}>
        Our app is designed to gamify the process of cleaning up litter. Users
        can earn points and rewards for picking up litter, and compete with
        friends and other users to see who can collect the most trash.
      </Text>
      <Text style={styles.text}>
        At Clean Walk, we believe that small actions can have a big impact. By
        encouraging people to pick up litter, we can make our streets and public
        spaces cleaner and more welcoming for everyone.
      </Text>
      <Text style={styles.text}>
        Thank you for using Clean Walk and helping us make the world a cleaner
        place!
      </Text>
      <Button title="Log out" onPress={handleLogout} />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
});