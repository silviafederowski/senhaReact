import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { RowsMode, Secret } from '../types/game';

const ZOOM_DURATION = 380;
const FLIP_STAGGER = 180;
const FLIP_DURATION = 650;
const PULSE_DURATION = 260;

function charCount(secret: Secret, rows: RowsMode): number {
  return rows === 2 ? secret.rowA.length * 2 : secret.rowA.length;
}

export function totalCelebrationDuration(secret: Secret, rows: RowsMode): number {
  const count = charCount(secret, rows);
  return ZOOM_DURATION + (count - 1) * FLIP_STAGGER + FLIP_DURATION + PULSE_DURATION * 2;
}

interface CelebrateCharProps {
  char: string;
  index: number;
  size: number;
  fontSize: number;
  pulseColor: Animated.AnimatedInterpolation<string>;
}

// Each cell: zooms in (all cells together, since every cell starts this same sequence at
// mount), then -- staggered by index -- flips from "?" to the real character.
function CelebrateChar({ char, index, size, fontSize, pulseColor }: CelebrateCharProps) {
  const zoom = useRef(new Animated.Value(0)).current;
  const flip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(zoom, {
        toValue: 1,
        duration: ZOOM_DURATION,
        easing: Easing.out(Easing.back(1.6)),
        useNativeDriver: true,
      }),
      Animated.timing(flip, {
        toValue: 1,
        duration: FLIP_DURATION,
        delay: index * FLIP_STAGGER,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const frontRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <Animated.View style={[styles.cell, { width: size, height: size, transform: [{ scale: zoom }] }]}>
      <Animated.View style={[styles.face, { transform: [{ perspective: 800 }, { rotateY: frontRotate }] }]}>
        <Text style={[styles.text, { fontSize }]}>?</Text>
      </Animated.View>
      <Animated.View style={[styles.face, { transform: [{ perspective: 800 }, { rotateY: backRotate }] }]}>
        <Animated.Text style={[styles.text, { fontSize, color: pulseColor }]}>{char}</Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

interface CelebratingSecretRevealProps {
  secret: Secret;
  rows: RowsMode;
  size?: number;
  fontSize?: number;
}

// Plays the win celebration directly on the hidden-password characters, in place: every
// "?" zooms in, then -- one after another -- flips to reveal the real character, and
// finally the whole revealed code gives a little celebratory pulse (scale + color flash).
export function CelebratingSecretReveal({ secret, rows, size = 30, fontSize = 20 }: CelebratingSecretRevealProps) {
  const rowALen = secret.rowA.length;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const flipCount = charCount(secret, rows);
    const flipPhaseEnd = ZOOM_DURATION + (flipCount - 1) * FLIP_STAGGER + FLIP_DURATION;
    const timer = setTimeout(() => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, { toValue: 1.25, duration: PULSE_DURATION, useNativeDriver: true }),
          Animated.timing(pulseProgress, { toValue: 1, duration: PULSE_DURATION, useNativeDriver: false }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, { toValue: 1, duration: PULSE_DURATION, useNativeDriver: true }),
          Animated.timing(pulseProgress, { toValue: 0, duration: PULSE_DURATION, useNativeDriver: false }),
        ]),
      ]).start();
    }, flipPhaseEnd);
    return () => clearTimeout(timer);
  }, []);

  const pulseColor = pulseProgress.interpolate({ inputRange: [0, 1], outputRange: ['#ffffff', '#1f8a3b'] });

  return (
    <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
      <View style={styles.row}>
        {secret.rowA.map((char, i) => (
          <CelebrateChar key={`a-${i}`} char={char} index={i} size={size} fontSize={fontSize} pulseColor={pulseColor} />
        ))}
      </View>
      {rows === 2 && (
        <View style={styles.row}>
          {(secret.rowB ?? []).map((char, i) => (
            <CelebrateChar
              key={`b-${i}`}
              char={char}
              index={rowALen + i}
              size={size}
              fontSize={fontSize}
              pulseColor={pulseColor}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 3,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  text: {
    fontWeight: '800',
    color: '#fff',
  },
});
