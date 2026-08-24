import { TextStyle, ViewStyle } from 'react-native';

export const raisedShadow: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
};

// Drop-shadow behind a bare icon glyph -- gives icon-only (no background) buttons a
// raised 3D look without needing a filled backdrop.
export const icon3D: TextStyle = {
  textShadowColor: 'rgba(0,0,0,0.55)',
  textShadowOffset: { width: 1, height: 3 },
  textShadowRadius: 2,
};

// A softer, more diffuse shadow (wider blur, lower opacity, warm brown tint instead of
// pure black) for an aged/worn look on the gold buttons, in place of a crisp modern edge.
export const agedGoldShadow: ViewStyle = {
  shadowColor: '#4a2f06',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.35,
  shadowRadius: 6,
  elevation: 4,
  borderWidth: 1,
  borderColor: 'rgba(120, 84, 24, 0.35)',
};
