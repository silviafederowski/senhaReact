import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GuessSlotsProps {
  length: number;
  values: string[];
  selectedIndex: number | null;
  onSlotPress: (index: number) => void;
}

export function GuessSlots({ length, values, selectedIndex, onSlotPress }: GuessSlotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.slot, i === selectedIndex && styles.slotSelected]}
          onPress={() => onSlotPress(i)}
        >
          <Text style={styles.slotText}>{values[i] || ''}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 4,
  },
  slot: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  slotSelected: {
    borderColor: '#2f6fed',
    borderWidth: 2,
    backgroundColor: '#eef1f8',
  },
  slotText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
