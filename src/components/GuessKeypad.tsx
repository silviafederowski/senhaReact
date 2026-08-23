import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { icon3D, raisedShadow } from '../styles/shadows';

interface GuessKeypadProps {
  alphabet: string[];
  disabledChars: Set<string>;
  canType: boolean;
  canClear: boolean;
  canSubmit: boolean;
  onPressChar: (char: string) => void;
  onClearAll: () => void;
  onSubmit: () => void;
}

export function GuessKeypad({
  alphabet,
  disabledChars,
  canType,
  canClear,
  canSubmit,
  onPressChar,
  onClearAll,
  onSubmit,
}: GuessKeypadProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {alphabet.map((char) => {
          const disabled = !canType || disabledChars.has(char);
          return (
            <TouchableOpacity
              key={char}
              disabled={disabled}
              onPress={() => onPressChar(char)}
              style={[styles.key, disabled && styles.keyDisabled]}
            >
              <Text style={[styles.keyText, disabled && styles.keyTextDisabled]}>{char}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          disabled={!canClear}
          onPress={onClearAll}
          accessibilityLabel="Limpar tudo"
          style={styles.actionButton}
        >
          <MaterialCommunityIcons name="eraser" size={34} color={canClear ? '#000' : '#ccc'} style={canClear && icon3D} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canSubmit}
          onPress={onSubmit}
          accessibilityLabel="Enviar tentativa"
          style={styles.actionButton}
        >
          <Ionicons name="checkmark" size={38} color={canSubmit ? '#000' : '#ccc'} style={canSubmit && icon3D} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  key: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: '#707070',
    alignItems: 'center',
    justifyContent: 'center',
    ...raisedShadow,
  },
  keyDisabled: {
    backgroundColor: '#ccc',
  },
  keyText: {
    color: '#fff',
    fontWeight: '700',
  },
  keyTextDisabled: {
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
