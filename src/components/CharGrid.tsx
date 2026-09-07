import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CharGridProps {
  lines: string[][];
  fontSize?: number;
  cellWidth?: number;
  gap?: number;
  color?: string;
  glow?: boolean;
}

export function CharGrid({
  lines,
  fontSize = 16,
  cellWidth = 24,
  gap = 6,
  color = '#fff',
  glow = false,
}: CharGridProps) {
  return (
    <View style={styles.container}>
      {lines.map((chars, li) => (
        <View key={li} style={[styles.charRow, { gap }]}>
          {chars.map((char, i) => (
            <View key={i} style={[styles.charCell, { width: cellWidth }]}>
              <Text
                style={[
                  styles.charText,
                  { fontSize, color },
                  glow && { textShadowColor: color, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
                ]}
              >
                {char}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  charRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  charCell: {
    alignItems: 'center',
  },
  charText: {
    fontWeight: '800',
    textAlign: 'center',
  },
});
