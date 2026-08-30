import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HistoryEntry } from '../types/game';
import { formatDateTime, formatMinutes } from '../utils/time';

type SortKey = 'startedAt' | 'durationMs' | 'guessCount' | 'guessedCorrectly';
type SortDir = 'asc' | 'desc';

interface HistoryTableProps {
  history: HistoryEntry[];
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'startedAt', label: 'Início' },
  { key: 'durationMs', label: 'Tempo (min)' },
  { key: 'guessCount', label: 'Tentativas' },
  { key: 'guessedCorrectly', label: '' },
];

export function HistoryTable({ history }: HistoryTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('startedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sorted = useMemo(() => {
    const copy = [...history];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const diff = av === bv ? 0 : av > bv ? 1 : -1;
      return sortDir === 'asc' ? diff : -diff;
    });
    return copy;
  }, [history, sortKey, sortDir]);

  const onHeaderPress = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <View>
      <View style={styles.row}>
        {COLUMNS.map((col) => (
          <TouchableOpacity key={col.key} style={[styles.cell, styles.headerCell]} onPress={() => onHeaderPress(col.key)}>
            <Text style={styles.headerText}>
              {col.label}
              {sortKey === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {sorted.map((entry) => (
          <View key={entry.id} style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.valueText}>{formatDateTime(entry.startedAt)}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.valueText}>{formatMinutes(entry.durationMs)}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.valueText}>{entry.guessCount ?? '-'}</Text>
            </View>
            <View style={styles.cell}>
              {entry.guessedCorrectly ? (
                <Ionicons name="checkmark" size={30} color="#1f8a3b" style={styles.resultIcon} />
              ) : (
                <Ionicons name="close" size={26} color="#c0392b" style={styles.resultIcon} />
              )}
            </View>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  resultIcon: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCell: {
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  valueText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#fff',
  },
});
