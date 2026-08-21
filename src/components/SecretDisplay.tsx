import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RowsMode, Secret } from '../types/game';

interface SecretDisplayProps {
  secret: Secret;
  rows: RowsMode;
  visible: boolean;
  onToggle: () => void;
}

function maskLine(length: number): string {
  return Array.from({ length }, () => '•').join(' ');
}

export function SecretDisplay({ secret, rows, visible, onToggle }: SecretDisplayProps) {
  const lineA = visible ? secret.rowA.join(' ') : maskLine(secret.rowA.length);
  const lineB =
    rows === 2 ? (visible ? (secret.rowB ?? []).join(' ') : maskLine((secret.rowB ?? []).length)) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.secretText}>{lineA}</Text>
      {lineB !== null && <Text style={styles.secretText}>{lineB}</Text>}
      <TouchableOpacity style={styles.toggleButton} onPress={onToggle}>
        <Text style={styles.toggleButtonText}>{visible ? 'Ocultar senha' : 'Mostrar senha'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  secretText: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
  },
  toggleButton: {
    marginTop: 8,
    backgroundColor: '#eef1f8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontWeight: '700',
    color: '#2f4a8f',
  },
});
