import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import type { CellValue, Difficulty, GameMode, MatchOutcome, Player } from '../types/game';
import { evaluateBoard, getAIMove } from '../utils/gameLogic';
import { playDrawSound, playLossSound, playMarkSound, playWinSound } from '../utils/sound';
import {
  DefeatDoodle,
  DrawDoodle,
  HandDrawnGrid,
  MarkO,
  MarkX,
  VictoryDoodle,
  WinningStrikeLine,
} from './HandDrawnMarks';

interface GameBoardScreenProps {
  username: string;
  mode: GameMode;
  difficulty: Difficulty;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBackHome: () => void;
  onMatchComplete: (payload: {
    mode: GameMode;
    difficulty?: Difficulty;
    outcome: MatchOutcome;
    resultLabel: string;
  }) => void;
}

const INITIAL_BOARD: CellValue[] = Array(9).fill(null);

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function GameBoardScreen({
  username,
  mode,
  difficulty,
  soundEnabled,
  onToggleSound,
  onBackHome,
  onMatchComplete,
}: GameBoardScreenProps) {
  const [board, setBoard] = useState<CellValue[]>(() => [...INITIAL_BOARD]);
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [roundScore, setRoundScore] = useState({ x: 0, o: 0, draws: 0 });
  const recordedRoundRef = useRef(false);

  const evaluation = evaluateBoard(board);
  const isGameOver = evaluation.winner !== null || evaluation.isDraw;

  // Record match completion once per finished board
  useEffect(() => {
    if (!isGameOver || recordedRoundRef.current) {
      return;
    }
    recordedRoundRef.current = true;

    if (mode === 'ai') {
      if (evaluation.winner === 'X') {
        playWinSound(soundEnabled);
        setRoundScore((prev) => ({ ...prev, x: prev.x + 1 }));
        onMatchComplete({
          mode: 'ai',
          difficulty,
          outcome: 'win',
          resultLabel: 'Victory',
        });
      } else if (evaluation.winner === 'O') {
        playLossSound(soundEnabled);
        setRoundScore((prev) => ({ ...prev, o: prev.o + 1 }));
        onMatchComplete({
          mode: 'ai',
          difficulty,
          outcome: 'loss',
          resultLabel: 'Defeat',
        });
      } else {
        playDrawSound(soundEnabled);
        setRoundScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
        onMatchComplete({
          mode: 'ai',
          difficulty,
          outcome: 'draw',
          resultLabel: 'Draw',
        });
      }
    } else {
      if (evaluation.winner === 'X') {
        playWinSound(soundEnabled);
        setRoundScore((prev) => ({ ...prev, x: prev.x + 1 }));
        onMatchComplete({
          mode: 'local',
          outcome: 'x_win',
          resultLabel: 'Player X Won',
        });
      } else if (evaluation.winner === 'O') {
        playWinSound(soundEnabled);
        setRoundScore((prev) => ({ ...prev, o: prev.o + 1 }));
        onMatchComplete({
          mode: 'local',
          outcome: 'o_win',
          resultLabel: 'Player O Won',
        });
      } else {
        playDrawSound(soundEnabled);
        setRoundScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
        onMatchComplete({
          mode: 'local',
          outcome: 'draw',
          resultLabel: 'Draw',
        });
      }
    }
  }, [isGameOver, evaluation.winner, mode, difficulty, soundEnabled, onMatchComplete]);

  // Trigger AI move when it is O's turn in AI mode
  useEffect(() => {
    if (mode !== 'ai' || currentTurn !== 'O' || isGameOver) {
      return;
    }

    setIsAiThinking(true);
    const timer = window.setTimeout(() => {
      const moveIndex = getAIMove(board, difficulty, 'O', 'X');
      if (moveIndex >= 0 && board[moveIndex] === null) {
        setBoard((prev) => {
          if (prev[moveIndex] !== null) return prev;
          const next = [...prev];
          next[moveIndex] = 'O';
          return next;
        });
        playMarkSound('O', soundEnabled);
        setCurrentTurn('X');
      }
      setIsAiThinking(false);
    }, 420);

    return () => {
      window.clearTimeout(timer);
    };
  }, [mode, currentTurn, isGameOver, board, difficulty, soundEnabled]);

  function handleCellClick(index: number) {
    if (board[index] !== null || isGameOver || isAiThinking) {
      return;
    }
    if (mode === 'ai' && currentTurn !== 'X') {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = currentTurn;
    setBoard(nextBoard);
    playMarkSound(currentTurn, soundEnabled);

    const nextEval = evaluateBoard(nextBoard);
    if (!nextEval.winner && !nextEval.isDraw) {
      setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
    }
  }

  function handlePlayAgain() {
    recordedRoundRef.current = false;
    setIsAiThinking(false);
    setBoard([...INITIAL_BOARD]);
    setCurrentTurn('X');
  }

  // Turn or result status label
  let turnStatusText = '';
  if (isGameOver) {
    if (evaluation.isDraw) {
      turnStatusText = 'Match Tied — Draw';
    } else if (mode === 'ai') {
      turnStatusText = evaluation.winner === 'X' ? 'You Won!' : 'AI Won This Round';
    } else {
      turnStatusText = evaluation.winner === 'X' ? 'Player 1 (X) Wins!' : 'Player 2 (O) Wins!';
    }
  } else if (mode === 'ai') {
    turnStatusText = isAiThinking ? 'AI is sketching O...' : 'Your Turn (X)';
  } else {
    turnStatusText = currentTurn === 'X' ? "Player 1's Turn (X)" : "Player 2's Turn (O)";
  }

  // Determine result variant for distinct animations
  const resultType: 'victory' | 'loss' | 'draw' | null = !isGameOver
    ? null
    : evaluation.isDraw
      ? 'draw'
      : mode === 'ai' && evaluation.winner === 'O'
        ? 'loss'
        : 'victory';

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

        <div className="text-center min-w-0">
          <p className="font-hand text-2xl font-bold text-slate-900 leading-none truncate">
            {mode === 'ai' ? 'vs AI' : 'Local 2P'}
          </p>
          <p className="text-xs text-slate-600 mt-0.5 truncate">
            {mode === 'ai' ? `${capitalize(difficulty)} Mode` : 'Pass & Play'}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          className="paper-btn bg-[#FFFDF8] text-slate-800 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
        </button>
      </header>

      {/* Session Score & Turn Indicator */}
      <div className="py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700 px-1">
          <span className="font-medium flex items-center gap-1.5 min-w-0">
            <span className="w-4 h-4 inline-block shrink-0">
              <MarkX size="sm" animate={false} />
            </span>
            <span className="truncate max-w-[110px] sm:max-w-[160px]">
              {mode === 'ai' ? username : 'Player 1'}:
            </span>
            <span className="font-mono font-bold tabular-nums text-blue-700 shrink-0">{roundScore.x}</span>
          </span>

          <span className="text-slate-500 font-mono tabular-nums">
            Draws: <strong className="text-slate-800">{roundScore.draws}</strong>
          </span>

          <span className="font-medium flex items-center gap-1.5">
            <span className="w-4 h-4 inline-block">
              <MarkO size="sm" animate={false} />
            </span>
            <span>{mode === 'ai' ? 'AI' : 'Player 2'}:</span>
            <span className="font-mono font-bold tabular-nums text-red-600">{roundScore.o}</span>
          </span>
        </div>

        {/* Turn Indicator Banner */}
        <div
          aria-live="polite"
          className={`paper-card rounded-xl px-4 py-2.5 flex items-center justify-center gap-2.5 ${
            isGameOver
              ? resultType === 'loss'
                ? 'bg-red-50/90 border-red-300'
                : resultType === 'draw'
                  ? 'bg-slate-100/90 border-slate-300'
                  : 'bg-amber-50/95 border-amber-300'
              : ''
          }`}
        >
          {!isGameOver && (
            <span className="w-5 h-5 shrink-0">
              {currentTurn === 'X' ? <MarkX size="sm" animate={false} /> : <MarkO size="sm" animate={false} />}
            </span>
          )}
          <span className="font-hand text-xl sm:text-2xl text-slate-900 tracking-wide">
            {turnStatusText}
          </span>
        </div>
      </div>

      {/* Classic 3x3 Hand-Drawn Notebook Board */}
      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-square mx-auto select-none">
          <HandDrawnGrid />

          {evaluation.winningLine && evaluation.winner && (
            <WinningStrikeLine winningLine={evaluation.winningLine} winner={evaluation.winner} />
          )}

          <div
            role="grid"
            aria-label="Tic-Tac-Toe Board"
            className="grid grid-cols-3 grid-rows-3 w-full h-full"
          >
            {board.map((cell, index) => {
              const row = Math.floor(index / 3) + 1;
              const col = (index % 3) + 1;
              const isWinningCell = evaluation.winningLine?.includes(index) ?? false;
              const isDisabled = cell !== null || isGameOver || isAiThinking;

              return (
                <button
                  key={index}
                  type="button"
                  role="gridcell"
                  disabled={isDisabled}
                  onClick={() => handleCellClick(index)}
                  aria-label={`Row ${row}, Column ${col}, ${cell ? cell : 'empty'}`}
                  className={`relative flex items-center justify-center p-3.5 sm:p-4 rounded-xl transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-blue-700 ${
                    isWinningCell
                      ? evaluation.winner === 'X'
                        ? 'bg-blue-100/55'
                        : 'bg-red-100/55'
                      : !isDisabled
                        ? 'hover:bg-blue-900/[0.04] active:bg-blue-900/[0.08] cursor-pointer'
                        : 'cursor-default'
                  }`}
                >
                  {cell === 'X' && <MarkX />}
                  {cell === 'O' && <MarkO />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Match Quick Reset */}
        {!isGameOver && (
          <div className="mt-5">
            <button
              type="button"
              onClick={handlePlayAgain}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg hover:bg-slate-900/5 transition-colors focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Board</span>
            </button>
          </div>
        )}

        {/* Game Result Card with Unique Victory / Loss / Draw Animations */}
        <AnimatePresence>
          {isGameOver && resultType && (
            <motion.section
              aria-label="Match Result"
              initial={
                resultType === 'loss'
                  ? { opacity: 0, x: -12 }
                  : resultType === 'draw'
                    ? { opacity: 0, scale: 0.94 }
                    : { opacity: 0, y: 14, scale: 0.96 }
              }
              animate={
                resultType === 'loss'
                  ? { opacity: 1, x: [0, -5, 5, -3, 3, 0] }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[360px] mt-5 paper-card rounded-2xl p-4 sm:p-5 text-center"
            >
              {resultType === 'victory' && <VictoryDoodle />}
              {resultType === 'loss' && <DefeatDoodle />}
              {resultType === 'draw' && <DrawDoodle />}

              <h2 className="font-hand text-3xl font-bold text-slate-900 mt-1">
                {resultType === 'victory'
                  ? mode === 'ai'
                    ? 'Victory!'
                    : evaluation.winner === 'X'
                      ? 'Player 1 (X) Wins!'
                      : 'Player 2 (O) Wins!'
                  : resultType === 'loss'
                    ? 'AI Wins This Round'
                    : "It's a Draw!"}
              </h2>

              <p className="text-sm text-slate-600 mt-0.5">
                {resultType === 'victory'
                  ? 'Sharp strategy on the notebook grid.'
                  : resultType === 'loss'
                    ? 'Sketch a new strategy and try again.'
                    : 'Both sides held the line evenly.'}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={handlePlayAgain}
                  className="paper-btn bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 px-3 min-h-[46px] font-semibold text-sm flex items-center justify-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>Play Again</span>
                </button>

                <button
                  type="button"
                  onClick={onBackHome}
                  className="paper-btn bg-[#FFFDF8] hover:bg-slate-50 text-slate-900 rounded-xl py-2.5 px-3 min-h-[46px] font-semibold text-sm flex items-center justify-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Home</span>
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
