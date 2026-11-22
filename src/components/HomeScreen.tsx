import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, BarChart3, History, Settings, ChevronRight } from 'lucide-react';
import type { Difficulty } from '../types/game';
import { XOArenaLogo } from './HandDrawnMarks';
import { AdBannerPlaceholder } from './AdBannerPlaceholder';

interface HomeScreenProps {
  username: string;
  defaultDifficulty: Difficulty;
  onStartAI: (difficulty: Difficulty) => void;
  onStartLocal: () => void;
  onOpenStats: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

const DIFFICULTY_OPTIONS: Array<{
  id: Difficulty;
  label: string;
  hint: string;
}> = [
  { id: 'easy', label: 'Easy', hint: 'Relaxed random moves' },
  { id: 'medium', label: 'Medium', hint: 'Blocks threats, fair play' },
  { id: 'hard', label: 'Hard', hint: 'Unbeatable strategist' },
];

export function HomeScreen({
  username,
  defaultDifficulty,
  onStartAI,
  onStartLocal,
  onOpenStats,
  onOpenHistory,
  onOpenSettings,
}: HomeScreenProps) {
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);

  return (
    <div className="flex flex-col min-h-full justify-between">
      <div className="space-y-5">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 pb-4 border-b border-blue-900/15">
          <div className="flex items-center gap-3 min-w-0">
            <XOArenaLogo />
            <div className="min-w-0">
              <h1 className="font-hand text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-none">
                XO Arena
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 truncate">
                Notebook Tic-Tac-Toe
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="paper-btn bg-[#FFFDF8] text-slate-800 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {/* Welcome Section */}
        <section aria-label="Welcome">
          <p className="font-hand text-2xl text-slate-800 leading-snug">
            Ready to play,{' '}
            <span className="text-blue-700 underline decoration-wavy decoration-red-400/70 underline-offset-4">
              {username}
            </span>
            ?
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Pick a mode to sketch your next match on the page.
          </p>
        </section>

        {/* Game Mode Buttons & Secondary Navigation Buttons */}
        <section aria-label="Menu" className="space-y-3">
          {/* Play with AI */}
          <div>
            <button
              type="button"
              onClick={() => setShowDifficultyPicker((prev) => !prev)}
              aria-expanded={showDifficultyPicker}
              className="paper-btn w-full bg-[#FFFDF8] hover:bg-amber-50/70 text-slate-900 rounded-xl px-4 py-3.5 min-h-[64px] flex items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <span>
                <span className="block font-semibold text-base leading-tight">
                  Play with AI
                </span>
                <span className="block text-xs text-slate-600 mt-0.5">
                  You play X · AI plays O
                </span>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {showDifficultyPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-2.5 paper-card rounded-xl p-3 space-y-2"
                >
                  <p className="font-hand text-lg text-slate-800 px-1">
                    Choose AI Difficulty:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {DIFFICULTY_OPTIONS.map((opt) => {
                      const isDefault = opt.id === defaultDifficulty;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onStartAI(opt.id)}
                          className={`paper-btn rounded-lg px-3 py-2.5 min-h-[48px] text-left flex flex-col justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                            isDefault
                              ? 'bg-amber-100 text-slate-900'
                              : 'bg-[#FFFDF8] hover:bg-slate-50 text-slate-900'
                          }`}
                        >
                          <span className="font-semibold text-sm leading-tight">
                            {opt.label}
                          </span>
                          <span className="text-xs text-slate-600 mt-0.5">
                            {opt.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Local 2 Player */}
          <button
            type="button"
            onClick={onStartLocal}
            className="paper-btn w-full bg-[#FFFDF8] hover:bg-amber-50/70 text-slate-900 rounded-xl px-4 py-3.5 min-h-[64px] flex items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <span className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </span>
              <span>
                <span className="block font-semibold text-base leading-tight">
                  Local 2 Player
                </span>
                <span className="block text-xs text-slate-600 mt-0.5">
                  Pass & play on one screen
                </span>
              </span>
            </span>
            <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
          </button>

          {/* Two separate buttons below the game mode buttons: Game Stats & Recent Matches */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={onOpenStats}
              className="paper-btn bg-[#FFFDF8] hover:bg-amber-50/70 text-slate-900 rounded-xl px-3.5 py-3 min-h-[52px] flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <BarChart3 className="w-5 h-5 text-blue-700 shrink-0" />
              <span className="font-semibold text-sm truncate">Game Stats</span>
            </button>

            <button
              type="button"
              onClick={onOpenHistory}
              className="paper-btn bg-[#FFFDF8] hover:bg-amber-50/70 text-slate-900 rounded-xl px-3.5 py-3 min-h-[52px] flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <History className="w-5 h-5 text-red-600 shrink-0" />
              <span className="font-semibold text-sm truncate">Recent Matches</span>
            </button>
          </div>
        </section>
      </div>

      {/* Bottom 320x50 Banner Placeholder */}
      <div className="pt-4 mt-5 -ml-10 -mr-4 px-2 sm:ml-0 sm:mr-0 sm:px-0 border-t border-blue-900/10">
        <AdBannerPlaceholder />
      </div>
    </div>
  );
}
