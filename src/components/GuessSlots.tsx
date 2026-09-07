import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GuessSlotsProps {
  length: number;
  values: string[];
  selectedIndex: number | null;
  onSlotPress: (index: number) => void;
  scale?: number;
}

export function GuessSlots({ length, values, selectedIndex, onSlotPress, scale = 1 }: GuessSlotsProps) {
  const slotSize = Math.round(36 * scale);
  const gap = Math.round(6 * scale);
  const fontSize = Math.round(16 * scale);

  return (
    <View style={[styles.container, { gap }]}>
      {Array.from({ length }).map((_, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.slot,
            { width: slotSize, height: slotSize },
            i === selectedIndex && styles.slotSelected,
          ]}
          onPress={() => onSlotPress(i)}
        >
          <Text style={[styles.slotText, { fontSize }]}>{values[i] || ''}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  slot: {
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
    fontWeight: '700',
  },
});
