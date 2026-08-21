import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowPairIcon, Dot, DotPairIcon, GREEN, YELLOW } from './ResultIcons';
import { GuessEntry, RowsMode, isDoubleResult } from '../types/game';

interface ResultTableProps {
  rows: RowsMode;
  guesses: GuessEntry[];
}

function CharRow({ chars }: { chars: string[] }) {
  return (
    <View style={styles.charRow}>
      {chars.map((char, i) => (
        <View key={i} style={styles.charCell}>
          <Text style={styles.guessText}>{char}</Text>
        </View>
      ))}
    </View>
  );
}

function GuessCell({ entry, rows }: { entry: GuessEntry; rows: RowsMode }) {
  if (rows === 1) {
    return <CharRow chars={entry.guess.rowA} />;
  }
  return (
    <View>
      <CharRow chars={entry.guess.rowA} />
      <CharRow chars={entry.guess.rowB ?? []} />
    </View>
  );
}

const SINGLE_HEADERS = ['Tentativa', <Dot key="g" color={GREEN} />, <Dot key="y" color={YELLOW} />];
const DOUBLE_HEADERS = [
  'Tentativa',
  <DotPairIcon key="1" color={GREEN} />,
  <ArrowPairIcon key="2" color={GREEN} />,
  <DotPairIcon key="3" color={YELLOW} />,
  <ArrowPairIcon key="4" color={YELLOW} />,
  <Dot key="5" color={GREEN} />,
  <Dot key="6" color={YELLOW} />,
];

export function ResultTable({ rows, guesses }: ResultTableProps) {
  const headers = rows === 1 ? SINGLE_HEADERS : DOUBLE_HEADERS;

  return (
    <ScrollView horizontal>
      <View>
        <View style={styles.row}>
          {headers.map((h, i) => (
            <View key={i} style={[styles.cell, i === 0 ? styles.firstCell : styles.valueCell, styles.headerCell]}>
              {typeof h === 'string' ? <Text style={styles.headerText}>{h}</Text> : h}
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
            const numbers = isDoubleResult(result)
              ? [
                  result.pairsCorrectPos,
                  result.pairsInvertedPos,
                  result.pairsCorrectWrongPos,
                  result.pairsInvertedWrongPos,
                  result.charsCorrectPos,
                  result.charsCorrectWrongPos,
                ]
              : [result.correctPosition, result.correctWrongPosition];

            return (
              <View key={index} style={styles.row}>
                <View style={[styles.cell, styles.firstCell]}>
                  <GuessCell entry={entry} rows={rows} />
                </View>
                {numbers.map((v, i) => (
                  <View key={i} style={[styles.cell, styles.valueCell]}>
                    <Text style={styles.valueText}>{v}</Text>
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
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstCell: {
    width: 84,
  },
  valueCell: {
    width: 38,
  },
  headerCell: {
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  charRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  charCell: {
    width: 12,
    alignItems: 'center',
  },
  guessText: {
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
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
