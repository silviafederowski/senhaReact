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
