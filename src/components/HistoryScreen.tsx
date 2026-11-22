import { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { MatchRecord } from '../types/game';

interface HistoryScreenProps {
  history: MatchRecord[];
  onClearHistory: () => void;
  onBackHome: () => void;
}

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoDate;
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function HistoryScreen({
  history,
  onClearHistory,
  onBackHome,
}: HistoryScreenProps) {
  const [confirmClear, setConfirmClear] = useState(false);

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
          Match History
        </h1>

        <div className="w-[76px]" aria-hidden="true" />
      </header>

      <div className="py-5 flex-1 flex flex-col">
        {/* Clear History Toolbar */}
        {history.length > 0 && (
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-xs sm:text-sm text-slate-600 font-mono tabular-nums">
              {history.length} {history.length === 1 ? 'match' : 'matches'} recorded
            </span>

            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="paper-btn bg-[#FFFDF8] hover:bg-red-50 text-red-600 rounded-xl px-3 min-h-[42px] text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    setConfirmClear(false);
                  }}
                  className="paper-btn bg-red-600 text-white rounded-lg px-3 min-h-[40px] text-xs font-semibold"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="paper-btn bg-[#FFFDF8] text-slate-800 rounded-lg px-3 min-h-[40px] text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Match List or Empty State */}
        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
            <div className="paper-card rounded-2xl p-6 max-w-sm w-full">
              <p className="font-hand text-2xl font-bold text-slate-900">
                No matches on this page yet
              </p>
              <p className="text-sm text-slate-600 mt-1.5">
                Finish a game against the AI or a friend to see your match log here.
              </p>
              <button
                type="button"
                onClick={onBackHome}
                className="paper-btn mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 min-h-[44px] text-sm font-semibold"
              >
                Play a Match
              </button>
            </div>
          </div>
        ) : (
          <ul className="space-y-2.5" aria-label="Completed Matches">
            {history.map((match) => {
              const modeLabel =
                match.mode === 'ai'
                  ? `vs AI · ${capitalize(match.difficulty ?? 'medium')}`
                  : 'Local 2 Player';

              const resultColor =
                match.outcome === 'win' || match.outcome === 'x_win'
                  ? 'text-blue-700'
                  : match.outcome === 'loss' || match.outcome === 'o_win'
                    ? 'text-red-600'
                    : 'text-slate-700';

              return (
                <li
                  key={match.id}
                  className="paper-card rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-slate-900 truncate">
                      {modeLabel}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
                      {formatDate(match.playedAt)}
                    </p>
                  </div>

                  <span
                    className={`font-hand text-xl sm:text-2xl font-bold shrink-0 ${resultColor}`}
                  >
                    {match.resultLabel}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
