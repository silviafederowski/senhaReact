import { GuessResultSingle } from '../types/game';

export function evaluateSingle(secret: string[], guess: string[]): GuessResultSingle {
  const length = secret.length;
  const secretLeftover: string[] = [];
  const guessLeftover: string[] = [];

  let correctPosition = 0;
  for (let i = 0; i < length; i++) {
    if (guess[i] === secret[i]) {
      correctPosition++;
    } else {
      secretLeftover.push(secret[i]);
      guessLeftover.push(guess[i]);
    }
  }

  const counts = new Map<string, number>();
  for (const c of secretLeftover) {
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }

  let correctWrongPosition = 0;
  for (const c of guessLeftover) {
    const remaining = counts.get(c) ?? 0;
    if (remaining > 0) {
      correctWrongPosition++;
      counts.set(c, remaining - 1);
    }
  }

  return { correctPosition, correctWrongPosition };
}
