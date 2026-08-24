import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const GREEN = '#1f8a3b';
export const YELLOW = '#e0a800';

export function Dot({ color, size = 9 }: { color: string; size?: number }) {
  return (
    <View style={[styles.dot, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]} />
  );
}

export function DotPairIcon({ color, size = 9 }: { color: string; size?: number }) {
  return (
    <View style={styles.stacked}>
      <Dot color={color} size={size} />
      <Dot color={color} size={size} />
    </View>
  );
}

export function ArrowPairIcon({ color, size = 12 }: { color: string; size?: number }) {
  return (
    <View style={styles.stacked}>
      <Ionicons name="arrow-up" size={size} color={color} />
      <Ionicons name="arrow-down" size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    marginVertical: 1,
  },
  stacked: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
