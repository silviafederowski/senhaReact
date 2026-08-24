export type Charset = 'letters' | 'numbers' | 'both';
export type RowsMode = 1 | 2;

export interface GameConfig {
  rows: RowsMode;
  length: number;
  charset: Charset;
  allowRepetition: boolean;
}

export interface Secret {
  rowA: string[];
  rowB?: string[];
}

export interface GuessResultSingle {
  correctPosition: number;
  correctWrongPosition: number;
}

export interface GuessResultDouble {
  pairsCorrectPos: number;
  pairsInvertedPos: number;
  pairsCorrectWrongPos: number;
  pairsInvertedWrongPos: number;
  charsCorrectPos: number;
  charsCorrectWrongPos: number;
}

export type GuessResult = GuessResultSingle | GuessResultDouble;

export interface GuessEntry {
  guess: Secret;
  result: GuessResult;
}

export interface CurrentGame {
  config: GameConfig;
  secret: Secret;
  guesses: GuessEntry[];
  startedAt: number;
  finishedAt?: number;
  // Whether the win celebration animation has already played for this finish. Prevents
  // it from replaying every time the screen remounts (tab switch, app restart) after
  // the game was already won.
  celebrated?: boolean;
}

export interface HistoryEntry {
  id: string;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  guessedCorrectly: boolean;
  guessCount: number;
}

export function isDoubleResult(result: GuessResult): result is GuessResultDouble {
  return (result as GuessResultDouble).pairsCorrectPos !== undefined;
}
