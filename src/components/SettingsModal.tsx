import { useEffect, useState, type FormEvent } from 'react';
import { X, Volume2, VolumeX, Pencil, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AppSettings, Difficulty } from '../types/game';

interface SettingsModalProps {
  isOpen: boolean;
  username: string;
  settings: AppSettings;
  onUpdateUsername: (name: string) => void;
  onUpdateSettings: (next: AppSettings) => void;
  onClose: () => void;
}

const DIFFICULTIES: Array<{ id: Difficulty; label: string }> = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

export function SettingsModal({
  isOpen,
  username,
  settings,
  onUpdateUsername,
  onUpdateSettings,
  onClose,
}: SettingsModalProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(username);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNameInput(username);
      setIsEditingName(false);
      setSavedNotice(false);
    }
  }, [isOpen, username]);

  function handleSaveName(e: FormEvent) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (trimmed.length === 0) {
      return;
    }
    const finalName = trimmed.slice(0, 24);
    onUpdateUsername(finalName);
    setNameInput(finalName);
    setIsEditingName(false);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1800);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="notebook-paper w-full max-w-sm rounded-2xl border-2 border-slate-800 shadow-[4px_6px_0px_#1e293b] p-5 pl-12 sm:pl-20 relative max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-blue-900/15">
              <h2 id="settings-title" className="font-hand text-3xl font-bold text-slate-900">
                Settings
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close settings"
                className="paper-btn bg-[#FFFDF8] text-slate-800 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* Player Profile Section */}
              <section aria-label="Player Profile" className="pb-4 border-b border-blue-900/15">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="font-semibold text-sm text-slate-900">Player Profile</p>
                  {savedNotice && (
                    <span className="text-xs font-medium text-emerald-700 inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Saved
                    </span>
                  )}
                </div>

                {!isEditingName ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Player Name</p>
                      <p className="font-hand text-2xl font-bold text-slate-900 truncate">
                        {username}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNameInput(username);
                        setIsEditingName(true);
                        setSavedNotice(false);
                      }}
                      className="paper-btn bg-[#FFFDF8] hover:bg-slate-50 text-slate-900 rounded-xl px-3 min-h-[44px] inline-flex items-center gap-1.5 text-sm font-semibold shrink-0"
                    >
                      <Pencil className="w-4 h-4 text-blue-700" />
                      <span>Edit Name</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveName} className="space-y-2.5 mt-1">
                    <label htmlFor="settings-player-name" className="block text-xs text-slate-600">
                      Player Name
                    </label>
                    <input
                      id="settings-player-name"
                      type="text"
                      maxLength={24}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Enter player name"
                      autoFocus
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-2 focus:outline-blue-600"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={nameInput.trim().length === 0}
                        className="paper-btn flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 min-h-[44px] text-sm font-semibold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNameInput(username);
                          setIsEditingName(false);
                        }}
                        className="paper-btn bg-[#FFFDF8] text-slate-700 rounded-xl px-3.5 min-h-[44px] text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </section>

              {/* Sound Effects Toggle */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-slate-900">Sound Effects</p>
                  <p className="text-xs text-slate-600">Pen taps & result chimes</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.soundEnabled}
                  onClick={() =>
                    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
                  }
                  className={`paper-btn rounded-xl px-3.5 min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold ${
                    settings.soundEnabled
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#FFFDF8] text-slate-700'
                  }`}
                >
                  {settings.soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>On</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Off</span>
                    </>
                  )}
                </button>
              </div>

              {/* Default AI Difficulty */}
              <div>
                <p className="font-semibold text-sm text-slate-900">
                  Highlighted AI Difficulty
                </p>
                <p className="text-xs text-slate-600 mb-2">
                  Pre-highlighted level in Play with AI
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTIES.map((diff) => {
                    const active = settings.defaultDifficulty === diff.id;
                    return (
                      <button
                        key={diff.id}
                        type="button"
                        onClick={() =>
                          onUpdateSettings({ ...settings, defaultDifficulty: diff.id })
                        }
                        className={`paper-btn rounded-lg py-2 min-h-[44px] text-sm font-semibold ${
                          active
                            ? 'bg-amber-100 text-slate-900'
                            : 'bg-[#FFFDF8] text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {diff.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="paper-btn w-full bg-slate-900 text-white rounded-xl py-2.5 min-h-[46px] font-semibold text-sm"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
