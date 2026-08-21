import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
          <MaterialCommunityIcons name="eraser" size={34} color={canClear ? '#1a1a1a' : '#ccc'} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canSubmit}
          onPress={onSubmit}
          accessibilityLabel="Enviar tentativa"
          style={styles.actionButton}
        >
          <Ionicons name="checkmark" size={38} color={canSubmit ? '#1a1a1a' : '#ccc'} />
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
    backgroundColor: '#2f6fed',
    alignItems: 'center',
    justifyContent: 'center',
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
