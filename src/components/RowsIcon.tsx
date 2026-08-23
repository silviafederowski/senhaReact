import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RowsMode } from '../types/game';

interface RowsIconProps {
  rows: RowsMode;
  color: string;
}

export function RowsIcon({ rows, color }: RowsIconProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, { backgroundColor: color }]} />
      {rows === 2 && <View style={[styles.bar, { backgroundColor: color }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  bar: {
    width: 32,
    height: 6,
    borderRadius: 3,
  },
});
