import React from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Link } from 'react-native';
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
        Eco Track est une application mobile destinée a garder nos rues propres and 
        nos espaces publiqes également. Notre mission et de rendre facile
        aux associations et aux personnes le fait de rendre leur ville plus propre.
      </Text>
      <Text style={styles.text}>
      En France, les dépôts sauvages sont des vrais problèmes qui impactent le 
      quotidien et l’environnement des citoyens. En effet, selon le site Citeo : 
      « Les Français sont 98% à juger cette situation inadmissible et 87% d’entre 
      eux estiment que le comportement incivique des citoyens en est la 1ère cause. ».
      </Text>
      <Text style={styles.text}>
        Quelques chiffes : 430 000 tonnes dans les grandes villes, 72 000 tonnes sur les routes, 
        41 000 tonnes au bord ou à la surface des cours d’eau, 2 900 tonnes sur le littoral, 
        129 tonnes en montagne.
      </Text>
      <Link>https://www.citeo.com/le-mag/trier-pour-lutter-contre-le-fleau-des-dechets-sauvages</Link>
      <Text style={styles.text}>
        Thank you for using Eco Track and helping us make the world a cleaner
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