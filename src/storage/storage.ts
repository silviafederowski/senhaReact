import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateSecret } from '../game/passwordGenerator';
import { CurrentGame, GameConfig, HistoryEntry } from '../types/game';

const KEYS = {
  config: '@senha/config',
  currentGame: '@senha/currentGame',
  history: '@senha/history',
};

export const DEFAULT_CONFIG: GameConfig = {
  rows: 1,
  length: 4,
  charset: 'both',
  allowRepetition: false,
};

export async function getConfig(): Promise<GameConfig> {
  const raw = await AsyncStorage.getItem(KEYS.config);
  if (!raw) return DEFAULT_CONFIG;
  return JSON.parse(raw) as GameConfig;
}

export async function saveConfig(config: GameConfig): Promise<void> {
  await AsyncStorage.setItem(KEYS.config, JSON.stringify(config));
}

export async function getCurrentGame(): Promise<CurrentGame | null> {
  const raw = await AsyncStorage.getItem(KEYS.currentGame);
  if (!raw) return null;
  return JSON.parse(raw) as CurrentGame;
}

export async function saveCurrentGame(game: CurrentGame): Promise<void> {
  await AsyncStorage.setItem(KEYS.currentGame, JSON.stringify(game));
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.history);
  if (!raw) return [];
  return JSON.parse(raw) as HistoryEntry[];
}

export async function addHistoryEntry(entry: HistoryEntry): Promise<HistoryEntry[]> {
  const history = await getHistory();
  const next = [entry, ...history];
  await AsyncStorage.setItem(KEYS.history, JSON.stringify(next));
  return next;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.setItem(KEYS.history, JSON.stringify([]));
}

export function createNewGame(config: GameConfig): CurrentGame {
  return {
    config,
    secret: generateSecret(config),
    guesses: [],
    startedAt: Date.now(),
  };
}

export function makeHistoryEntry(game: CurrentGame, guessedCorrectly: boolean): HistoryEntry {
  const endedAt = Date.now();
  return {
    id: `${game.startedAt}-${endedAt}`,
    startedAt: game.startedAt,
    endedAt,
    durationMs: endedAt - game.startedAt,
    guessedCorrectly,
  };
}
