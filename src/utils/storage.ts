import type { AppSettings, MatchRecord, PlayerProfile } from '../types/game';

const PROFILE_KEY = 'xo_arena_profile_v1';
const HISTORY_KEY = 'xo_arena_history_v1';
const SETTINGS_KEY = 'xo_arena_settings_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  username: 'Player 1',
  totalGames: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  localMatches: 0,
};

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  defaultDifficulty: 'medium',
};

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or private browsing errors gracefully
  }
}

export function loadProfile(): PlayerProfile {
  const raw = safeGetItem(PROFILE_KEY);
  if (!raw) {
    return { ...DEFAULT_PROFILE };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    return {
      username:
        typeof parsed.username === 'string' && parsed.username.trim().length > 0
          ? parsed.username.slice(0, 24)
          : DEFAULT_PROFILE.username,
      totalGames: typeof parsed.totalGames === 'number' && parsed.totalGames >= 0 ? parsed.totalGames : 0,
      wins: typeof parsed.wins === 'number' && parsed.wins >= 0 ? parsed.wins : 0,
      losses: typeof parsed.losses === 'number' && parsed.losses >= 0 ? parsed.losses : 0,
      draws: typeof parsed.draws === 'number' && parsed.draws >= 0 ? parsed.draws : 0,
      localMatches:
        typeof parsed.localMatches === 'number' && parsed.localMatches >= 0 ? parsed.localMatches : 0,
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: PlayerProfile): void {
  safeSetItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadMatchHistory(): MatchRecord[] {
  const raw = safeGetItem(HISTORY_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is MatchRecord =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        (item.mode === 'ai' || item.mode === 'local') &&
        typeof item.resultLabel === 'string' &&
        typeof item.playedAt === 'string'
    );
  } catch {
    return [];
  }
}

export function saveMatchHistory(history: MatchRecord[]): void {
  safeSetItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
}

export function clearMatchHistoryStorage(): void {
  safeSetItem(HISTORY_KEY, JSON.stringify([]));
}

export function loadSettings(): AppSettings {
  const raw = safeGetItem(SETTINGS_KEY);
  if (!raw) {
    return { ...DEFAULT_SETTINGS };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const validDiff =
      parsed.defaultDifficulty === 'easy' ||
      parsed.defaultDifficulty === 'medium' ||
      parsed.defaultDifficulty === 'hard'
        ? parsed.defaultDifficulty
        : DEFAULT_SETTINGS.defaultDifficulty;
    return {
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      defaultDifficulty: validDiff,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  safeSetItem(SETTINGS_KEY, JSON.stringify(settings));
}
