import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RowsMode, Secret } from '../types/game';
import { raisedShadow } from '../styles/shadows';
import { CharGrid } from './CharGrid';

interface SecretDisplayProps {
  secret: Secret;
  rows: RowsMode;
  visible: boolean;
  onToggle: () => void;
  scale?: number;
}

const HIDDEN_RED = '#ff3b30';
const REVEALED_GREEN = '#39ff14';

function lineFor(chars: string[], visible: boolean): string[] {
  return visible ? chars : chars.map(() => '?');
}

export function SecretDisplay({ secret, rows, visible, onToggle, scale = 1 }: SecretDisplayProps) {
  const lines = [lineFor(secret.rowA, visible)];
  if (rows === 2) lines.push(lineFor(secret.rowB ?? [], visible));

  const toggleSize = Math.round(32 * scale);

  return (
    <View style={styles.container}>
      <CharGrid
        lines={lines}
        fontSize={Math.round(24 * scale)}
        cellWidth={Math.round(36 * scale)}
        gap={Math.round(6 * scale)}
        color={visible ? REVEALED_GREEN : HIDDEN_RED}
        glow={visible}
      />
      <TouchableOpacity
        style={[
          styles.toggleButton,
          { width: toggleSize, height: toggleSize, borderRadius: toggleSize / 2 },
        ]}
        onPress={onToggle}
        accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
      >
        <Ionicons name={visible ? 'eye-off' : 'eye'} size={Math.round(22 * scale)} color="#2f4a8f" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleButton: {
    marginTop: 4,
    backgroundColor: '#eef1f8',
    alignItems: 'center',
    justifyContent: 'center',
    ...raisedShadow,
  },
});
