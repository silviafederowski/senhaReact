import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HistoryEntry } from '../types/game';
import { formatDateTime, formatDuration } from '../utils/time';

type SortKey = 'startedAt' | 'durationMs' | 'guessedCorrectly';
type SortDir = 'asc' | 'desc';

interface HistoryTableProps {
  history: HistoryEntry[];
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'startedAt', label: 'Início' },
  { key: 'durationMs', label: 'Duração' },
  { key: 'guessedCorrectly', label: 'Resultado' },
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
      {sorted.length === 0 ? (
        <View style={styles.row}>
          <View style={[styles.cell, styles.emptyCell]}>
            <Text style={styles.emptyText}>Nenhum jogo no histórico ainda.</Text>
          </View>
        </View>
      ) : (
        sorted.map((entry) => (
          <View key={entry.id} style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.valueText}>{formatDateTime(entry.startedAt)}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.valueText}>{formatDuration(entry.durationMs)}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={[styles.valueText, entry.guessedCorrectly ? styles.won : styles.lost]}>
                {entry.guessedCorrectly ? 'Adivinhada' : 'Não adivinhada'}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
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
  },
  won: {
    color: '#1f8a3b',
    fontWeight: '700',
  },
  lost: {
    color: '#c0392b',
    fontWeight: '700',
  },
  emptyCell: {
    flex: 3,
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
});
