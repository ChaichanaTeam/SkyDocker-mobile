import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SkyDocker</Text>
      <Text style={styles.subtitle}>Application shell is ready.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#141414',
    fontSize: 32,
    fontWeight: '600',
  },
  subtitle: {
    color: '#616264',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});
