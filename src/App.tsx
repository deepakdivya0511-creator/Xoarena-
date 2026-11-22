import { useCallback, useState } from 'react';
import type {
  AppSettings,
  Difficulty,
  GameMode,
  MatchOutcome,
  MatchRecord,
  PlayerProfile,
  ScreenView,
} from './types/game';
import {
  clearMatchHistoryStorage,
  DEFAULT_PROFILE,
  loadMatchHistory,
  loadProfile,
  loadSettings,
  saveMatchHistory,
  saveProfile,
  saveSettings,
} from './utils/storage';
import { HomeScreen } from './components/HomeScreen';
import { GameBoardScreen } from './components/GameBoardScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsModal } from './components/SettingsModal';

function createMatchId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenView>('home');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>(() => loadSettings().defaultDifficulty);
  const [gameSessionKey, setGameSessionKey] = useState(0);

  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile());
  const [history, setHistory] = useState<MatchRecord[]>(() => loadMatchHistory());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleStartAI = useCallback((chosenDifficulty: Difficulty) => {
    setGameMode('ai');
    setDifficulty(chosenDifficulty);
    setGameSessionKey((k) => k + 1);
    setScreen('game');
  }, []);

  const handleStartLocal = useCallback(() => {
    setGameMode('local');
    setGameSessionKey((k) => k + 1);
    setScreen('game');
  }, []);

  const handleMatchComplete = useCallback(
    (payload: {
      mode: GameMode;
      difficulty?: Difficulty;
      outcome: MatchOutcome;
      resultLabel: string;
    }) => {
      setProfile((prev) => {
        const next: PlayerProfile = {
          ...prev,
          totalGames: prev.totalGames + 1,
          wins: payload.mode === 'ai' && payload.outcome === 'win' ? prev.wins + 1 : prev.wins,
          losses:
            payload.mode === 'ai' && payload.outcome === 'loss' ? prev.losses + 1 : prev.losses,
          draws: payload.mode === 'ai' && payload.outcome === 'draw' ? prev.draws + 1 : prev.draws,
          localMatches: payload.mode === 'local' ? prev.localMatches + 1 : prev.localMatches,
        };
        saveProfile(next);
        return next;
      });

      const newRecord: MatchRecord = {
        id: createMatchId(),
        mode: payload.mode,
        difficulty: payload.difficulty,
        outcome: payload.outcome,
        resultLabel: payload.resultLabel,
        playedAt: new Date().toISOString(),
      };

      setHistory((prev) => {
        const next = [newRecord, ...prev].slice(0, 100);
        saveMatchHistory(next);
        return next;
      });
    },
    []
  );

  const handleUpdateUsername = useCallback((username: string) => {
    setProfile((prev) => {
      const next = { ...prev, username };
      saveProfile(next);
      return next;
    });
  }, []);

  const handleResetStats = useCallback(() => {
    setProfile((prev) => {
      const next: PlayerProfile = {
        ...DEFAULT_PROFILE,
        username: prev.username,
      };
      saveProfile(next);
      return next;
    });
  }, []);

  const handleClearHistory = useCallback(() => {
    clearMatchHistoryStorage();
    setHistory([]);
  }, []);

  const handleUpdateSettings = useCallback((nextSettings: AppSettings) => {
    setSettings(nextSettings);
    saveSettings(nextSettings);
  }, []);

  const handleToggleSound = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, soundEnabled: !prev.soundEnabled };
      saveSettings(next);
      return next;
    });
  }, []);

  return (
    <div className="min-h-dvh w-full bg-[#e6dfd1] flex flex-col items-center justify-center sm:px-6 sm:py-6">
      <main className="notebook-paper relative w-full min-h-dvh sm:min-h-[680px] sm:max-w-2xl sm:rounded-2xl sm:border-2 sm:border-slate-800/80 sm:shadow-[6px_10px_0px_rgba(30,41,59,0.16)] flex flex-col pl-10 pr-4 py-4 sm:pl-24 sm:pr-8 sm:py-7 overflow-x-hidden">
        {/* Subtle binder holes along left edge for authentic notebook feel */}
        <div
          aria-hidden="true"
          className="hidden sm:flex flex-col justify-between py-14 absolute left-4 top-0 bottom-0 pointer-events-none"
        >
          <span className="w-4 h-4 rounded-full bg-[#e6dfd1] border border-slate-400/70 shadow-inner" />
          <span className="w-4 h-4 rounded-full bg-[#e6dfd1] border border-slate-400/70 shadow-inner" />
          <span className="w-4 h-4 rounded-full bg-[#e6dfd1] border border-slate-400/70 shadow-inner" />
        </div>

        <div className="flex-1 flex flex-col">
          {screen === 'home' && (
            <HomeScreen
              username={profile.username}
              defaultDifficulty={settings.defaultDifficulty}
              onStartAI={handleStartAI}
              onStartLocal={handleStartLocal}
              onOpenStats={() => setScreen('profile')}
              onOpenHistory={() => setScreen('history')}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {screen === 'game' && (
            <GameBoardScreen
              key={gameSessionKey}
              username={profile.username}
              mode={gameMode}
              difficulty={difficulty}
              soundEnabled={settings.soundEnabled}
              onToggleSound={handleToggleSound}
              onBackHome={() => setScreen('home')}
              onMatchComplete={handleMatchComplete}
            />
          )}

          {screen === 'profile' && (
            <ProfileScreen
              profile={profile}
              onUpdateUsername={handleUpdateUsername}
              onResetStats={handleResetStats}
              onBackHome={() => setScreen('home')}
            />
          )}

          {screen === 'history' && (
            <HistoryScreen
              history={history}
              onClearHistory={handleClearHistory}
              onBackHome={() => setScreen('home')}
            />
          )}
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        username={profile.username}
        settings={settings}
        onUpdateUsername={handleUpdateUsername}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
