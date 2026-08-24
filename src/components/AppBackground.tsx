import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const MAX_BACKGROUND_OPACITY = 0.7;
const FADE_DURATION = 500;

interface AppBackgroundProps {
  children: React.ReactNode;
  // Changing this value (e.g. to the active screen's route name) replays the fade-in --
  // used so the background fades in again each time a page loads.
  fadeKey?: string | number;
}

export function AppBackground({ children, fadeKey }: AppBackgroundProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: MAX_BACKGROUND_OPACITY,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start();
  }, [fadeKey]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/background.jpeg')}
        style={[styles.image, { opacity }]}
        resizeMode="cover"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
  },
});
