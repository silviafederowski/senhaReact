import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const GREEN = '#1f8a3b';
export const YELLOW = '#e0a800';

export function Dot({ color }: { color: string }) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

export function DotPairIcon({ color }: { color: string }) {
  return (
    <View style={styles.stacked}>
      <Dot color={color} />
      <Dot color={color} />
    </View>
  );
}

export function ArrowPairIcon({ color }: { color: string }) {
  return (
    <View style={styles.stacked}>
      <Ionicons name="arrow-up" size={12} color={color} />
      <Ionicons name="arrow-down" size={12} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginVertical: 1,
  },
  stacked: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
