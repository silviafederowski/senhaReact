import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowPairIcon, Dot, DotPairIcon, GREEN, YELLOW } from './ResultIcons';
import { raisedShadow } from '../styles/shadows';
import { GuessEntry, RowsMode, isDoubleResult } from '../types/game';

const BLUE = '#2f6fed';

const ZOOM_STEPS = [1, 1.25, 1.5, 1.75, 2];
const MIN_ZOOM = ZOOM_STEPS[0];
const MAX_ZOOM = ZOOM_STEPS[ZOOM_STEPS.length - 1];
const ZOOM_STEP = 0.25;

interface ResultTableProps {
  rows: RowsMode;
  guesses: GuessEntry[];
  pinnedA: (string | null)[];
  pinnedB: (string | null)[];
  excludedChars: Set<string>;
  notedChars: Set<string>;
  onCharPress: (row: 'A' | 'B', position: number, char: string) => void;
}

interface CellSizes {
  firstCellWidth: number;
  valueCellWidth: number;
  headerFontSize: number;
  guessFontSize: number;
  valueFontSize: number;
  charCellWidth: number;
  cellPaddingVertical: number;
}

function GuessCell({
  entry,
  rows,
  pinnedA,
  pinnedB,
  excludedChars,
  notedChars,
  onCharPress,
  sizes,
}: {
  entry: GuessEntry;
  rows: RowsMode;
  pinnedA: (string | null)[];
  pinnedB: (string | null)[];
  excludedChars: Set<string>;
  notedChars: Set<string>;
  onCharPress: (row: 'A' | 'B', position: number, char: string) => void;
  sizes: CellSizes;
}) {
  const charsA = entry.guess.rowA;
  const charsB = entry.guess.rowB ?? [];

  return (
    <View style={[styles.charRow, { width: sizes.charCellWidth * charsA.length }]}>
      {charsA.map((charA, i) => {
        const charB = rows === 2 ? charsB[i] : undefined;
        const greenA = pinnedA[i] === charA;
        const greenB = rows === 2 && pinnedB[i] === charB;
        const excludedA = excludedChars.has(charA);
        const excludedB = charB !== undefined && excludedChars.has(charB);
        const notedA = notedChars.has(charA);
        const notedB = charB !== undefined && notedChars.has(charB);
        return (
          <View key={i} style={[styles.charCell, { width: sizes.charCellWidth }]}>
            <TouchableOpacity onPress={() => onCharPress('A', i, charA)}>
              <Text
                style={[
                  styles.guessText,
                  { fontSize: sizes.guessFontSize },
                  greenA && styles.greenText,
                  excludedA && styles.excludedText,
                  notedA && styles.notedText,
                ]}
              >
                {charA}
              </Text>
            </TouchableOpacity>
            {rows === 2 && charB !== undefined && (
              <TouchableOpacity onPress={() => onCharPress('B', i, charB)}>
                <Text
                  style={[
                    styles.guessText,
                    { fontSize: sizes.guessFontSize },
                    greenB && styles.greenText,
                    excludedB && styles.excludedText,
                    notedB && styles.notedText,
                  ]}
                >
                  {charB}
                </Text>
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

export function ResultTable({
  rows,
  guesses,
  pinnedA,
  pinnedB,
  excludedChars,
  notedChars,
  onCharPress,
}: ResultTableProps) {
  const [zoom, setZoom] = useState(1);
  const headers = rows === 1 ? SINGLE_HEADERS : DOUBLE_HEADERS;

  const sizes: CellSizes = {
    firstCellWidth: Math.round(84 * zoom),
    valueCellWidth: Math.round(38 * zoom),
    headerFontSize: Math.round(11 * zoom),
    guessFontSize: Math.round(12 * zoom),
    valueFontSize: Math.round(14 * zoom),
    charCellWidth: Math.round(12 * zoom),
    cellPaddingVertical: Math.round(8 * zoom),
  };

  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));

  return (
    <View style={styles.tableShadowWrapper}>
      <View style={styles.zoomControls}>
        <TouchableOpacity
          onPress={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          style={[styles.zoomButton, zoom <= MIN_ZOOM && styles.zoomButtonDisabled]}
          accessibilityLabel="Diminuir zoom da tabela de tentativas"
        >
          <Text style={styles.zoomButtonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          style={[styles.zoomButton, zoom >= MAX_ZOOM && styles.zoomButtonDisabled]}
          accessibilityLabel="Aumentar zoom da tabela de tentativas"
        >
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tableClip}>
        <ScrollView horizontal style={styles.horizontalScroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.column}>
            <View style={styles.row}>
              {headers.map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.cell,
                    { width: i === 0 ? sizes.firstCellWidth : sizes.valueCellWidth, paddingVertical: sizes.cellPaddingVertical },
                    styles.headerCell,
                  ]}
                >
                  {typeof h === 'string' ? <Text style={[styles.headerText, { fontSize: sizes.headerFontSize }]}>{h}</Text> : h}
                </View>
              ))}
            </View>
            <ScrollView style={styles.bodyScroll}>
              <View>
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
                      <View
                        style={[
                          styles.cell,
                          { width: sizes.firstCellWidth, paddingVertical: sizes.cellPaddingVertical },
                        ]}
                      >
                        <GuessCell
                          entry={entry}
                          rows={rows}
                          pinnedA={pinnedA}
                          pinnedB={pinnedB}
                          excludedChars={excludedChars}
                          notedChars={notedChars}
                          onCharPress={onCharPress}
                          sizes={sizes}
                        />
                      </View>
                      {numbers.map((v, i) => (
                        <View
                          key={i}
                          style={[
                            styles.cell,
                            { width: sizes.valueCellWidth, paddingVertical: sizes.cellPaddingVertical },
                          ]}
                        >
                          <Text style={[styles.valueText, { fontSize: sizes.valueFontSize }]}>{v}</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
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
  zoomControls: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    zIndex: 10,
    elevation: 10,
  },
  zoomButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonDisabled: {
    opacity: 0.35,
  },
  zoomButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
  column: {
    alignSelf: 'stretch',
  },
  bodyScroll: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#eef6e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCell: {
    backgroundColor: '#e5e5e5',
  },
  headerText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  charRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  charCell: {
    alignItems: 'center',
  },
  guessText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  greenText: {
    color: GREEN,
  },
  excludedText: {
    color: '#ff3b30',
    textDecorationLine: 'line-through',
  },
  notedText: {
    color: BLUE,
  },
  valueText: {},
});
