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
}

function lineFor(chars: string[], visible: boolean): string[] {
  return visible ? chars : chars.map(() => '?');
}

export function SecretDisplay({ secret, rows, visible, onToggle }: SecretDisplayProps) {
  const lines = [lineFor(secret.rowA, visible)];
  if (rows === 2) lines.push(lineFor(secret.rowB ?? [], visible));

  return (
    <View style={styles.container}>
      <CharGrid lines={lines} fontSize={16} cellWidth={24} />
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={onToggle}
        accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
      >
        <Ionicons name={visible ? 'eye-off' : 'eye'} size={22} color="#2f4a8f" />
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...raisedShadow,
  },
});
