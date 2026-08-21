import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GuessEntry, RowsMode, isDoubleResult } from '../types/game';

interface ResultTableProps {
  rows: RowsMode;
  guesses: GuessEntry[];
}

function formatGuess(entry: GuessEntry, rows: RowsMode): string {
  if (rows === 1) return entry.guess.rowA.join('');
  return `${entry.guess.rowA.join('')} / ${(entry.guess.rowB ?? []).join('')}`;
}

const SINGLE_HEADERS = ['Tentativa', 'Certo\npos.', 'Certo,\npos. errada'];
const DOUBLE_HEADERS = [
  'Tentativa',
  'Pares\ncertos pos.',
  'Pares\ninvert. pos.',
  'Pares\ncertos fora',
  'Pares\ninvert. fora',
  'Caract.\ncertos pos.',
  'Caract.\ncertos fora',
];

export function ResultTable({ rows, guesses }: ResultTableProps) {
  const headers = rows === 1 ? SINGLE_HEADERS : DOUBLE_HEADERS;

  return (
    <ScrollView horizontal>
      <View>
        <View style={styles.row}>
          {headers.map((h) => (
            <View key={h} style={[styles.cell, styles.headerCell]}>
              <Text style={styles.headerText}>{h}</Text>
            </View>
          ))}
        </View>
        {guesses.length === 0 ? (
          <View style={styles.row}>
            <View style={[styles.cell, styles.emptyCell]}>
              <Text style={styles.emptyText}>Nenhuma tentativa ainda.</Text>
            </View>
          </View>
        ) : (
          guesses.map((entry, index) => {
            const result = entry.result;
            const values = isDoubleResult(result)
              ? [
                  formatGuess(entry, rows),
                  result.pairsCorrectPos,
                  result.pairsInvertedPos,
                  result.pairsCorrectWrongPos,
                  result.pairsInvertedWrongPos,
                  result.charsCorrectPos,
                  result.charsCorrectWrongPos,
                ]
              : [formatGuess(entry, rows), result.correctPosition, result.correctWrongPosition];

            return (
              <View key={index} style={styles.row}>
                {values.map((v, i) => (
                  <View key={i} style={styles.cell}>
                    <Text style={i === 0 ? styles.guessText : styles.valueText}>{v}</Text>
                  </View>
                ))}
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 90,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCell: {
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  guessText: {
    fontWeight: '700',
    fontSize: 13,
  },
  valueText: {
    fontSize: 14,
  },
  emptyCell: {
    width: 260,
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
});
