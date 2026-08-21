import { GuessResultDouble, Secret } from '../types/game';

type Pair = [string, string];

function pairToken(pair: Pair): string {
  return `${pair[0]}|${pair[1]}`;
}

function reversed(pair: Pair): Pair {
  return [pair[1], pair[0]];
}

/**
 * Matches guess-pair tokens (at the given guess indices) against secret-pair tokens
 * (at the given secret indices) using multiset consumption (classic Mastermind-style):
 * each secret pair can only be "used" by one guess pair. Returns the count of matches
 * and the indices consumed from each side.
 */
function consumeMatches(
  guessIndices: number[],
  secretIndices: number[],
  guessToken: (i: number) => string,
  secretToken: (j: number) => string
): { count: number; usedGuess: Set<number>; usedSecret: Set<number> } {
  const secretBuckets = new Map<string, number[]>();
  for (const j of secretIndices) {
    const token = secretToken(j);
    const bucket = secretBuckets.get(token);
    if (bucket) bucket.push(j);
    else secretBuckets.set(token, [j]);
  }

  const usedGuess = new Set<number>();
  const usedSecret = new Set<number>();
  let count = 0;

  for (const i of guessIndices) {
    const token = guessToken(i);
    const bucket = secretBuckets.get(token);
    if (bucket && bucket.length > 0) {
      const j = bucket.shift() as number;
      usedGuess.add(i);
      usedSecret.add(j);
      count++;
    }
  }

  return { count, usedGuess, usedSecret };
}

function evaluateRowLeftover(
  guessRow: string[],
  secretRow: string[],
  leftoverGuessIndices: number[],
  leftoverSecretIndices: number[]
): { correctPos: number; correctWrongPos: number } {
  const secretIndexSet = new Set(leftoverSecretIndices);

  let correctPos = 0;
  const remainingGuess: number[] = [];
  const consumedByCorrectPos = new Set<number>();
  for (const i of leftoverGuessIndices) {
    if (secretIndexSet.has(i) && guessRow[i] === secretRow[i]) {
      correctPos++;
      consumedByCorrectPos.add(i);
    } else {
      remainingGuess.push(i);
    }
  }

  const remainingSecretIndices = leftoverSecretIndices.filter((j) => !consumedByCorrectPos.has(j));

  const counts = new Map<string, number>();
  for (const j of remainingSecretIndices) {
    const c = secretRow[j];
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }

  let correctWrongPos = 0;
  for (const i of remainingGuess) {
    const c = guessRow[i];
    const remaining = counts.get(c) ?? 0;
    if (remaining > 0) {
      correctWrongPos++;
      counts.set(c, remaining - 1);
    }
  }

  return { correctPos, correctWrongPos };
}

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
  const consumedIndex = new Set<number>();

  for (let i = 0; i < length; i++) {
    const g = guessPair(i);
    const s = secretPair(i);
    if (g[0] === s[0] && g[1] === s[1]) {
      pairsCorrectPos++;
      consumedIndex.add(i);
    }
  }

  for (let i = 0; i < length; i++) {
    if (consumedIndex.has(i)) continue;
    const g = guessPair(i);
    const s = secretPair(i);
    if (g[0] === s[1] && g[1] === s[0]) {
      pairsInvertedPos++;
      consumedIndex.add(i);
    }
  }

  const remainingIndices: number[] = [];
  for (let i = 0; i < length; i++) {
    if (!consumedIndex.has(i)) remainingIndices.push(i);
  }

  const exactMatch = consumeMatches(
    remainingIndices,
    remainingIndices,
    (i) => pairToken(guessPair(i)),
    (j) => pairToken(secretPair(j))
  );
  const pairsCorrectWrongPos = exactMatch.count;

  const afterExactGuess = remainingIndices.filter((i) => !exactMatch.usedGuess.has(i));
  const afterExactSecret = remainingIndices.filter((j) => !exactMatch.usedSecret.has(j));

  const invertedMatch = consumeMatches(
    afterExactGuess,
    afterExactSecret,
    (i) => pairToken(reversed(guessPair(i))),
    (j) => pairToken(secretPair(j))
  );
  const pairsInvertedWrongPos = invertedMatch.count;

  const leftoverGuessIndices = afterExactGuess.filter((i) => !invertedMatch.usedGuess.has(i));
  const leftoverSecretIndices = afterExactSecret.filter((j) => !invertedMatch.usedSecret.has(j));

  const rowAResult = evaluateRowLeftover(guessRowA, secretRowA, leftoverGuessIndices, leftoverSecretIndices);
  const rowBResult = evaluateRowLeftover(guessRowB, secretRowB, leftoverGuessIndices, leftoverSecretIndices);

  return {
    pairsCorrectPos,
    pairsInvertedPos,
    pairsCorrectWrongPos,
    pairsInvertedWrongPos,
    charsCorrectPos: rowAResult.correctPos + rowBResult.correctPos,
    charsCorrectWrongPos: rowAResult.correctWrongPos + rowBResult.correctWrongPos,
  };
}
