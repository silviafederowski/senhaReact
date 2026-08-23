import { GuessResultSingle } from '../types/game';

/**
 * Every position is judged independently against the whole secret, with no shared
 * "supply" of characters to consume. A repeated guess character is not penalized for
 * colliding with another guess position — each position gets its own verdict purely
 * from whether it matches the secret at that index, or appears anywhere in the secret.
 */
export function evaluateSingle(secret: string[], guess: string[]): GuessResultSingle {
  let correctPosition = 0;
  let correctWrongPosition = 0;

  for (let i = 0; i < secret.length; i++) {
    if (guess[i] === secret[i]) {
      correctPosition++;
    } else if (secret.includes(guess[i])) {
      correctWrongPosition++;
    }
  }

  return { correctPosition, correctWrongPosition };
}
