import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground
      source={require('../../assets/background.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
