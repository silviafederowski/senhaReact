import React from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

// Matches the background image's own pixel size (assets/background.jpeg) so the frame's
// aspect ratio lines up with the pattern instead of stretching it across the whole
// browser window.
const BACKGROUND_IMAGE_WIDTH = 1269;
const BACKGROUND_IMAGE_HEIGHT = 1239;

// On web, constrain the app to the background image's size (capped to the viewport) and
// center it, instead of letting it stretch edge-to-edge on a wide desktop window. Native
// platforms render children directly, unaffected.
export function WebFrame({ children }: { children: React.ReactNode }) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const width = Math.min(BACKGROUND_IMAGE_WIDTH, windowWidth);
  const height = Math.min(BACKGROUND_IMAGE_HEIGHT, windowHeight);

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, { width, height }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  inner: {
    overflow: 'hidden',
  },
});
