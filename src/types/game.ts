export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'ai' | 'local';
export type MatchOutcome = 'win' | 'loss' | 'draw' | 'x_win' | 'o_win';
export type ScreenView = 'home' | 'game' | 'profile' | 'history';

export interface PlayerProfile {
  username: string;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  localMatches: number;
}

export interface MatchRecord {
  id: string;
  mode: GameMode;
  difficulty?: Difficulty;
  outcome: MatchOutcome;
  resultLabel: string;
  playedAt: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  defaultDifficulty: Difficulty;
}
