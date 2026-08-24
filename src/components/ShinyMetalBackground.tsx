import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ShinyMetalBackgroundProps {
  colors: [string, string, string];
  borderRadius?: number;
}

// A soft, puffy "clay/gel button" look, muted toward an aged/weathered metal tone: a
// gentle diagonal fill (worn light top-left, deeper tarnished bottom-right) plus a faint
// rounded highlight blob, mimicking a weathered convex surface rather than a polished one.
export function ShinyMetalBackground({ colors, borderRadius = 0 }: ShinyMetalBackgroundProps) {
  return (
    <View style={[StyleSheet.absoluteFill, { borderRadius, overflow: 'hidden' }]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']}
        start={{ x: 0.15, y: 0.1 }}
        end={{ x: 0.7, y: 0.6 }}
        style={styles.highlight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  highlight: {
    position: 'absolute',
    top: '6%',
    left: '10%',
    width: '55%',
    height: '45%',
    borderRadius: 999,
  },
});
