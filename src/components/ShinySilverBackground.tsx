import React from 'react';
import { ShinyMetalBackground } from './ShinyMetalBackground';

interface ShinySilverBackgroundProps {
  borderRadius?: number;
}

export function ShinySilverBackground({ borderRadius = 0 }: ShinySilverBackgroundProps) {
  return <ShinyMetalBackground colors={['#e2e2e2', '#a8a8a8', '#6b6b6b']} borderRadius={borderRadius} />;
}
