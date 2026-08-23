import { GuessResultDouble, Secret } from '../types/game';

type Pair = [string, string];

/**
 * Every guess position is judged independently against the whole secret, with no
 * shared "supply" of pairs/characters to consume. If the same pair (or character)
 * appears at multiple guess positions, each occurrence is scored on its own merits:
 * a pair that exactly matches the secret at one position still lets a duplicate guess
 * of that same pair elsewhere be credited as "correct, wrong position", even though
 * the secret only contains that pair once.
 */
export function evaluateDouble(secret: Secret, guess: Secret): GuessResultDouble {
  const secretRowA = secret.rowA;
  const secretRowB = secret.rowB as string[];
  const guessRowA = guess.rowA;
  const guessRowB = guess.rowB as string[];
  const length = secretRowA.length;

  const secretPair = (j: number): Pair => [secretRowA[j], secretRowB[j]];
  const guessPair = (i: number): Pair => [guessRowA[i], guessRowB[i]];

  let pairsCorrectPos = 0;
  let pairsInvertedPos = 0;
  let pairsCorrectWrongPos = 0;
  let pairsInvertedWrongPos = 0;
  let charsCorrectPos = 0;
  let charsCorrectWrongPos = 0;

  for (let i = 0; i < length; i++) {
    const g = guessPair(i);
    const s = secretPair(i);

    if (g[0] === s[0] && g[1] === s[1]) {
      pairsCorrectPos++;
      continue;
    }
    if (g[0] === s[1] && g[1] === s[0]) {
      pairsInvertedPos++;
      continue;
    }

    let existsExactElsewhere = false;
    let existsInvertedElsewhere = false;
    for (let j = 0; j < length; j++) {
      if (j === i) continue;
      const sj = secretPair(j);
      if (g[0] === sj[0] && g[1] === sj[1]) existsExactElsewhere = true;
      if (g[0] === sj[1] && g[1] === sj[0]) existsInvertedElsewhere = true;
    }

    if (existsExactElsewhere) {
      pairsCorrectWrongPos++;
      continue;
    }
    if (existsInvertedElsewhere) {
      pairsInvertedWrongPos++;
      continue;
    }

    // The pair as a whole doesn't match anywhere -- fall back to per-character analysis.
    if (g[0] === s[0]) charsCorrectPos++;
    else if (secretRowA.includes(g[0])) charsCorrectWrongPos++;

    if (g[1] === s[1]) charsCorrectPos++;
    else if (secretRowB.includes(g[1])) charsCorrectWrongPos++;
  }

  return {
    pairsCorrectPos,
    pairsInvertedPos,
    pairsCorrectWrongPos,
    pairsInvertedWrongPos,
    charsCorrectPos,
    charsCorrectWrongPos,
  };
}
