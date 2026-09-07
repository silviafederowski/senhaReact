import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatDuration } from '../utils/time';

interface TimerProps {
  label: string;
  startedAt: number;
  endedAt?: number;
  scale?: number;
}

export function Timer({ label, startedAt, endedAt, scale = 1 }: TimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (endedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [endedAt]);

  const elapsed = (endedAt ?? now) - startedAt;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { fontSize: Math.round(10 * scale) }]}>{label}</Text>
      <Text style={[styles.value, { fontSize: Math.round(13 * scale) }]}>{formatDuration(elapsed)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
  },
  value: {
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: '#fff',
  },
});
