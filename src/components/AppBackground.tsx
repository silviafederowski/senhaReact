import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const MAX_NUANCE_OPACITY = 0.85;
const FADE_DURATION = 500;

interface AppBackgroundProps {
  children: React.ReactNode;
  // Changing this value (e.g. to the active screen's route name) replays the fade-in --
  // used so the background nuance layer fades in again each time a page loads.
  fadeKey?: string | number;
}

export function AppBackground({ children, fadeKey }: AppBackgroundProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: MAX_NUANCE_OPACITY,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start();
  }, [fadeKey]);

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
        <LinearGradient
          colors={['#1c1c1e', '#000000', '#0a0a0c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
          start={{ x: 0.15, y: 0.05 }}
          end={{ x: 0.75, y: 0.6 }}
          style={styles.glowTopLeft}
        />
        <LinearGradient
          colors={['rgba(120,120,140,0.12)', 'rgba(120,120,140,0)']}
          start={{ x: 0.85, y: 1 }}
          end={{ x: 0.3, y: 0.4 }}
          style={styles.glowBottomRight}
        />

        {/* Vignette: each corner darkens toward its edge and fades out toward the
            center, so the middle of the screen reads as "lit" and the frame recedes
            into shadow -- the depth cue. */}
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.65, y: 0.65 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.35, y: 0.65 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0.65, y: 0.35 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0.35, y: 0.35 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  glowTopLeft: {
    position: 'absolute',
    top: '-15%',
    left: '-10%',
    width: '85%',
    height: '55%',
    borderRadius: 999,
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: '-15%',
    right: '-10%',
    width: '75%',
    height: '50%',
    borderRadius: 999,
  },
  content: {
    flex: 1,
  },
});
