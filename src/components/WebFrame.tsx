import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

// On web, fills the browser window edge-to-edge with the app's black background instead
// of leaving default page chrome around it. Native platforms render children directly,
// unaffected.
export function WebFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return <View style={styles.outer}>{children}</View>;
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
