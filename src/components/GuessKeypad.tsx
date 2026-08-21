import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GuessKeypadProps {
  alphabet: string[];
  disabledChars: Set<string>;
  canType: boolean;
  canBackspace: boolean;
  canSubmit: boolean;
  onPressChar: (char: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}

export function GuessKeypad({
  alphabet,
  disabledChars,
  canType,
  canBackspace,
  canSubmit,
  onPressChar,
  onBackspace,
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
          disabled={!canBackspace}
          onPress={onBackspace}
          style={[styles.actionButton, styles.backspaceButton, !canBackspace && styles.keyDisabled]}
        >
          <Text style={styles.actionText}>⌫ Apagar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canSubmit}
          onPress={onSubmit}
          style={[styles.actionButton, styles.submitButton, !canSubmit && styles.keyDisabled]}
        >
          <Text style={[styles.actionText, styles.submitText]}>Enviar tentativa</Text>
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
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backspaceButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#1f8a3b',
  },
  actionText: {
    fontWeight: '700',
  },
  submitText: {
    color: '#fff',
  },
});
