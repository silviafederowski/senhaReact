import { GameConfig, Secret } from '../types/game';
import { getAlphabet } from './alphabet';

function generateLine(length: number, alphabet: string[], allowRepetition: boolean): string[] {
  if (allowRepetition) {
    const line: string[] = [];
    for (let i = 0; i < length; i++) {
      line.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    return line;
  }

  const pool = [...alphabet];
  const line: string[] = [];
  const count = Math.min(length, pool.length);
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * pool.length);
    line.push(pool[index]);
    pool.splice(index, 1);
  }
  return line;
}

export function generateSecret(config: GameConfig): Secret {
  const alphabet = getAlphabet(config.charset);

  if (config.rows === 1) {
    return { rowA: generateLine(config.length, alphabet, config.allowRepetition) };
  }

  if (config.allowRepetition) {
    return {
      rowA: generateLine(config.length, alphabet, true),
      rowB: generateLine(config.length, alphabet, true),
    };
  }

  // Without repetition, no character may repeat anywhere in the secret -- rowA and rowB
  // draw from one shared pool instead of two independent ones, so a character used in
  // one row can't also turn up in the other.
  const combined = generateLine(config.length * 2, alphabet, false);
  return { rowA: combined.slice(0, config.length), rowB: combined.slice(config.length) };
}
