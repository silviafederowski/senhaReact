import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CrossedCharProps {
  char: string;
  fontSize?: number;
  color?: string;
}

export function CrossedChar({ char, fontSize = 18, color = '#000' }: CrossedCharProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.char, { fontSize, color }]}>{char}</Text>
      <View style={styles.crossWrapper} pointerEvents="none">
        <Ionicons name="close" size={fontSize * 1.3} color="#c0392b" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  char: {
    fontWeight: 'normal',
  },
  crossWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
