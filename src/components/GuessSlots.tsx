import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GuessSlotsProps {
  length: number;
  values: string[];
  rowLabel?: string;
}

export function GuessSlots({ length, values, rowLabel }: GuessSlotsProps) {
  return (
    <View style={styles.container}>
      {rowLabel ? <Text style={styles.rowLabel}>{rowLabel}</Text> : null}
      <View style={styles.slots}>
        {Array.from({ length }).map((_, i) => (
          <View key={i} style={styles.slot}>
            <Text style={styles.slotText}>{values[i] ?? ''}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  rowLabel: {
    width: 24,
    fontSize: 12,
    color: '#666',
  },
  slots: {
    flexDirection: 'row',
    gap: 6,
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
  slotText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
