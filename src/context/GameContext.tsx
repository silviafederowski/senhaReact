import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { evaluateDouble } from '../game/scoringDouble';
import { evaluateSingle } from '../game/scoringSingle';
import {
  addHistoryEntry,
  clearHistory as clearHistoryStorage,
  createNewGame,
  DEFAULT_CONFIG,
  getConfig,
  getCurrentGame,
  getHistory,
  makeHistoryEntry,
  saveConfig,
  saveCurrentGame,
} from '../storage/storage';
import { CurrentGame, GameConfig, HistoryEntry, isDoubleResult, Secret } from '../types/game';

interface GameContextValue {
  loading: boolean;
  config: GameConfig;
  currentGame: CurrentGame | null;
  history: HistoryEntry[];
  sessionStartedAt: number;
  submitGuess: (guess: Secret) => void;
  resetGame: () => void;
  revealPassword: () => void;
  updateConfig: (config: GameConfig) => void;
  clearHistory: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

function isWinningResult(config: GameConfig, result: ReturnType<typeof evaluateSingle> | ReturnType<typeof evaluateDouble>): boolean {
  if (isDoubleResult(result)) {
    return result.pairsCorrectPos === config.length;
  }
  return result.correctPosition === config.length;
}

async function finishUnfinishedGame(game: CurrentGame): Promise<HistoryEntry[]> {
  if (game.finishedAt) {
    return getHistory();
  }
  const entry = makeHistoryEntry(game, false);
  return addHistoryEntry(entry);
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [currentGame, setCurrentGame] = useState<CurrentGame | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [sessionStartedAt] = useState<number>(() => Date.now());

  useEffect(() => {
    (async () => {
      const [loadedConfig, loadedGame, loadedHistory] = await Promise.all([
        getConfig(),
        getCurrentGame(),
        getHistory(),
      ]);
      setConfig(loadedConfig);
      setHistory(loadedHistory);

      if (loadedGame) {
        setCurrentGame(loadedGame);
      } else {
        const game = createNewGame(loadedConfig);
        await saveCurrentGame(game);
        setCurrentGame(game);
      }
      setLoading(false);
    })();
  }, []);

  const submitGuess = (guess: Secret) => {
    if (!currentGame || currentGame.finishedAt) return;

    const result =
      currentGame.config.rows === 2
        ? evaluateDouble(currentGame.secret, guess)
        : evaluateSingle(currentGame.secret.rowA, guess.rowA);

    const won = isWinningResult(currentGame.config, result);
    const updatedGame: CurrentGame = {
      ...currentGame,
      guesses: [...currentGame.guesses, { guess, result }],
      ...(won ? { finishedAt: Date.now(), outcome: 'won' as const } : {}),
    };

    setCurrentGame(updatedGame);
    saveCurrentGame(updatedGame);

    if (won) {
      const entry = makeHistoryEntry(updatedGame, true);
      addHistoryEntry(entry).then(setHistory);
    }
  };

  const resetGame = () => {
    if (!currentGame) return;
    (async () => {
      const nextHistory = await finishUnfinishedGame(currentGame);
      setHistory(nextHistory);
      const game = createNewGame(config);
      await saveCurrentGame(game);
      setCurrentGame(game);
    })();
  };

  const revealPassword = () => {
    if (!currentGame || currentGame.finishedAt) return;
    const finished: CurrentGame = { ...currentGame, finishedAt: Date.now(), outcome: 'revealed' as const };
    setCurrentGame(finished);
    saveCurrentGame(finished);
    addHistoryEntry(makeHistoryEntry(finished, false)).then(setHistory);
  };

  const updateConfig = (newConfig: GameConfig) => {
    (async () => {
      if (currentGame) {
        const nextHistory = await finishUnfinishedGame(currentGame);
        setHistory(nextHistory);
      }
      await saveConfig(newConfig);
      setConfig(newConfig);
      const game = createNewGame(newConfig);
      await saveCurrentGame(game);
      setCurrentGame(game);
    })();
  };

  const clearHistory = () => {
    clearHistoryStorage();
    setHistory([]);
  };

  const value = useMemo<GameContextValue>(
    () => ({
      loading,
      config,
      currentGame,
      history,
      sessionStartedAt,
      submitGuess,
      resetGame,
      revealPassword,
      updateConfig,
      clearHistory,
    }),
    [loading, config, currentGame, history, sessionStartedAt]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
