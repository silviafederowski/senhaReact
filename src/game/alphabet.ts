import { Charset } from '../types/game';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0123456789'.split('');

export function getAlphabet(charset: Charset): string[] {
  if (charset === 'letters') return LETTERS;
  if (charset === 'numbers') return NUMBERS;
  return [...LETTERS, ...NUMBERS];
}

export function maxLengthWithoutRepetition(charset: Charset): number {
  return getAlphabet(charset).length;
}
