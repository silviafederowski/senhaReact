import React from 'react';
import { ShinyMetalBackground } from './ShinyMetalBackground';

interface ShinyGoldBackgroundProps {
  borderRadius?: number;
}

export function ShinyGoldBackground({ borderRadius = 0 }: ShinyGoldBackgroundProps) {
  return <ShinyMetalBackground colors={['#d6bc7a', '#af8a3a', '#6b4a12']} borderRadius={borderRadius} />;
}
