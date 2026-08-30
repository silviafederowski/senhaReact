import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowPairIcon, Dot, DotPairIcon, GREEN, YELLOW } from './ResultIcons';
import { raisedShadow } from '../styles/shadows';
import { GuessEntry, RowsMode, isDoubleResult } from '../types/game';

interface ResultTableProps {
  rows: RowsMode;
  guesses: GuessEntry[];
  pinnedA: (string | null)[];
  pinnedB: (string | null)[];
  onTogglePin: (row: 'A' | 'B', position: number, char: string) => void;
}

function GuessCell({
  entry,
  rows,
  pinnedA,
  pinnedB,
  onTogglePin,
}: {
  entry: GuessEntry;
  rows: RowsMode;
  pinnedA: (string | null)[];
  pinnedB: (string | null)[];
  onTogglePin: (row: 'A' | 'B', position: number, char: string) => void;
}) {
  const charsA = entry.guess.rowA;
  const charsB = entry.guess.rowB ?? [];

  return (
    <View style={styles.charRow}>
      {charsA.map((charA, i) => {
        const charB = rows === 2 ? charsB[i] : undefined;
        const greenA = pinnedA[i] === charA;
        const greenB = rows === 2 && pinnedB[i] === charB;
        return (
          <View key={i} style={styles.charCell}>
            <TouchableOpacity onPress={() => onTogglePin('A', i, charA)}>
              <Text style={[styles.guessText, greenA && styles.greenText]}>{charA}</Text>
            </TouchableOpacity>
            {rows === 2 && charB !== undefined && (
              <TouchableOpacity onPress={() => onTogglePin('B', i, charB)}>
                <Text style={[styles.guessText, greenB && styles.greenText]}>{charB}</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
}

const SINGLE_HEADERS = ['', <Dot key="g" color={GREEN} />, <Dot key="y" color={YELLOW} />];
const DOUBLE_HEADERS = [
  '',
  <DotPairIcon key="1" color={GREEN} />,
  <ArrowPairIcon key="2" color={GREEN} />,
  <DotPairIcon key="3" color={YELLOW} />,
  <ArrowPairIcon key="4" color={YELLOW} />,
  <Dot key="5" color={GREEN} />,
  <Dot key="6" color={YELLOW} />,
];

export function ResultTable({ rows, guesses, pinnedA, pinnedB, onTogglePin }: ResultTableProps) {
  const headers = rows === 1 ? SINGLE_HEADERS : DOUBLE_HEADERS;

  return (
    <View style={styles.tableShadowWrapper}>
      <View style={styles.tableClip}>
        <ScrollView
          horizontal
          style={styles.horizontalScroll}
          contentContainerStyle={styles.scrollContent}
          minimumZoomScale={1}
          maximumZoomScale={2.5}
          pinchGestureEnabled
        >
          <ScrollView>
            <View>
              <View style={styles.row}>
                {headers.map((h, i) => (
                  <View key={i} style={[styles.cell, i === 0 ? styles.firstCell : styles.valueCell, styles.headerCell]}>
                    {typeof h === 'string' ? <Text style={styles.headerText}>{h}</Text> : h}
                  </View>
                ))}
              </View>
              {guesses.map((entry, index) => {
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
                      <GuessCell entry={entry} rows={rows} pinnedA={pinnedA} pinnedB={pinnedB} onTogglePin={onTogglePin} />
                    </View>
                    {numbers.map((v, i) => (
                      <View key={i} style={[styles.cell, styles.valueCell]}>
                        <Text style={styles.valueText}>{v}</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableShadowWrapper: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.35)',
    borderLeftColor: 'rgba(255,255,255,0.25)',
    borderRightColor: 'rgba(0,0,0,0.5)',
    borderBottomColor: 'rgba(0,0,0,0.5)',
    ...raisedShadow,
  },
  tableClip: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  horizontalScroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#eef6e0',
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
    backgroundColor: '#e5e5e5',
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
  greenText: {
    color: GREEN,
  },
  valueText: {
    fontSize: 14,
  },
});
