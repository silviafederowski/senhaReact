import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RowsMode, Secret } from '../types/game';

interface SecretDisplayProps {
  secret: Secret;
  rows: RowsMode;
  visible: boolean;
  onToggle: () => void;
}

function CharRow({ chars, visible }: { chars: string[]; visible: boolean }) {
  return (
    <View style={styles.charRow}>
      {chars.map((char, i) => (
        <View key={i} style={styles.charCell}>
          <Text style={styles.secretText}>{visible ? char : '?'}</Text>
        </View>
      ))}
    </View>
  );
}

export function SecretDisplay({ secret, rows, visible, onToggle }: SecretDisplayProps) {
  return (
    <View style={styles.container}>
      <CharRow chars={secret.rowA} visible={visible} />
      {rows === 2 && <CharRow chars={secret.rowB ?? []} visible={visible} />}
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
  charRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  charCell: {
    width: 24,
    alignItems: 'center',
  },
  secretText: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  toggleButton: {
    marginTop: 4,
    backgroundColor: '#eef1f8',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
