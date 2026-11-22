import { useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Pencil, RotateCcw } from 'lucide-react';
import type { PlayerProfile } from '../types/game';

interface ProfileScreenProps {
  profile: PlayerProfile;
  onUpdateUsername: (name: string) => void;
  onResetStats: () => void;
  onBackHome: () => void;
}

export function ProfileScreen({
  profile,
  onUpdateUsername,
  onResetStats,
  onBackHome,
}: ProfileScreenProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.username);
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const aiGames = profile.wins + profile.losses + profile.draws;
  const winRate = aiGames > 0 ? Math.round((profile.wins / aiGames) * 100) : 0;

  function handleSaveName(e: FormEvent) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (trimmed.length > 0) {
      onUpdateUsername(trimmed.slice(0, 24));
      setNameInput(trimmed.slice(0, 24));
      setIsEditingName(false);
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 1800);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Bar */}
      <header className="flex items-center justify-between gap-3 pb-3 border-b border-blue-900/15">
        <button
          type="button"
          onClick={onBackHome}
          aria-label="Back to Home"
          className="paper-btn bg-[#FFFDF8] text-slate-800 rounded-xl min-h-[44px] px-3 flex items-center gap-1.5 text-sm font-medium shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <h1 className="font-hand text-3xl font-bold text-slate-900">
          Player Profile
        </h1>

        <div className="w-[76px]" aria-hidden="true" />
      </header>

      <div className="py-5 space-y-6 flex-1">
        {/* Username Card */}
        <section className="paper-card rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Notebook Owner
            </span>
            {savedNotice && (
              <span className="text-xs font-medium text-emerald-700 inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Saved
              </span>
            )}
          </div>

          {!isEditingName ? (
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="font-hand text-3xl font-bold text-slate-900 truncate">
                {profile.username}
              </p>
              <button
                type="button"
                onClick={() => {
                  setNameInput(profile.username);
                  setIsEditingName(true);
                }}
                aria-label="Edit username"
                className="paper-btn bg-[#FFFDF8] text-slate-800 rounded-xl min-h-[44px] px-3 flex items-center gap-1.5 text-sm font-medium shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveName} className="mt-2.5 flex flex-col sm:flex-row gap-2.5">
              <label htmlFor="username-input" className="sr-only">
                Username
              </label>
              <input
                id="username-input"
                type="text"
                maxLength={24}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-base focus:outline-2 focus:outline-blue-600"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="paper-btn bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 min-h-[44px] font-semibold text-sm flex-1 sm:flex-initial"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="paper-btn bg-[#FFFDF8] text-slate-700 rounded-xl px-3.5 min-h-[44px] font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Stats Summary */}
        <section aria-label="Lifetime Statistics" className="space-y-3">
          <div className="flex items-baseline justify-between px-1">
            <h2 className="font-hand text-2xl font-bold text-slate-900">
              Scorecard
            </h2>
            <span className="text-xs text-slate-600 font-mono tabular-nums">
              {aiGames > 0 ? `${winRate}% AI Win Rate` : 'No AI games yet'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="paper-card rounded-xl p-3.5 text-center">
              <p className="text-xs text-slate-600 font-medium">Total Games</p>
              <p className="font-mono text-3xl font-bold text-slate-900 tabular-nums mt-1">
                {profile.totalGames}
              </p>
            </div>

            <div className="paper-card rounded-xl p-3.5 text-center">
              <p className="text-xs text-blue-700 font-medium">Wins</p>
              <p className="font-mono text-3xl font-bold text-blue-700 tabular-nums mt-1">
                {profile.wins}
              </p>
            </div>

            <div className="paper-card rounded-xl p-3.5 text-center">
              <p className="text-xs text-red-600 font-medium">Losses</p>
              <p className="font-mono text-3xl font-bold text-red-600 tabular-nums mt-1">
                {profile.losses}
              </p>
            </div>

            <div className="paper-card rounded-xl p-3.5 text-center">
              <p className="text-xs text-slate-600 font-medium">Draws</p>
              <p className="font-mono text-3xl font-bold text-slate-800 tabular-nums mt-1">
                {profile.draws}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 px-1">
            Wins, losses, and draws reflect solo matches against AI. Local 2-player matches ({profile.localMatches}) are included in Total Games.
          </p>
        </section>

        {/* Reset Stats Control */}
        <section className="pt-2 border-t border-blue-900/10">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              disabled={profile.totalGames === 0}
              className="text-sm font-medium text-red-600 hover:text-red-700 disabled:text-slate-400 disabled:cursor-not-allowed inline-flex items-center gap-1.5 min-h-[44px] px-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Player Stats</span>
            </button>
          ) : (
            <div className="paper-card rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 bg-red-50/70">
              <span className="text-sm font-medium text-slate-900">
                Reset all game counts to zero?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onResetStats();
                    setConfirmReset(false);
                  }}
                  className="paper-btn bg-red-600 text-white rounded-lg px-3.5 min-h-[40px] text-sm font-semibold"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="paper-btn bg-[#FFFDF8] text-slate-800 rounded-lg px-3.5 min-h-[40px] text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
