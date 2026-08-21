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
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * pool.length);
    line.push(pool[index]);
    pool.splice(index, 1);
  }
  return line;
}

export function generateSecret(config: GameConfig): Secret {
  const alphabet = getAlphabet(config.charset);
  const rowA = generateLine(config.length, alphabet, config.allowRepetition);
  if (config.rows === 1) {
    return { rowA };
  }
  const rowB = generateLine(config.length, alphabet, config.allowRepetition);
  return { rowA, rowB };
}
