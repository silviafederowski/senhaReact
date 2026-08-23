import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const EMOJIS = ['🎉', '✨', '🎊', '⭐', '🎈'];
const PARTICLE_COUNT = 20;
const PARTICLE_DURATION = 2200;

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function makeParticle() {
  return {
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    angle: randomBetween(0, Math.PI * 2),
    distance: randomBetween(80, 220),
    rotate: randomBetween(-180, 180),
    delay: randomBetween(0, 600),
    progress: new Animated.Value(0),
  };
}

// A generic celebratory burst -- emoji particles fly outward from the center, spin, and
// fade. Re-mount this component (change its `key`) to replay the animation.
export function CelebrationAnimation() {
  const particles = useRef(Array.from({ length: PARTICLE_COUNT }, makeParticle)).current;

  useEffect(() => {
    Animated.stagger(
      0,
      particles.map((p) =>
        Animated.timing(p.progress, {
          toValue: 1,
          duration: PARTICLE_DURATION,
          delay: p.delay,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p, i) => {
        const translateX = p.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(p.angle) * p.distance],
        });
        const translateY = p.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(p.angle) * p.distance],
        });
        const opacity = p.progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
        const rotate = p.progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.rotate}deg`] });
        const scale = p.progress.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 0.8] });

        return (
          <Animated.Text
            key={i}
            style={[styles.particle, { opacity, transform: [{ translateX }, { translateY }, { rotate }, { scale }] }]}
          >
            {p.emoji}
          </Animated.Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    fontSize: 22,
  },
});
