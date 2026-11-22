import type { CellValue, Difficulty, Player } from '../types/game';

export const WIN_LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export interface BoardEvaluation {
  winner: Player | null;
  winningLine: readonly [number, number, number] | null;
  isDraw: boolean;
}

export function evaluateBoard(board: ReadonlyArray<CellValue>): BoardEvaluation {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const cellA = board[a];
    if (cellA !== null && cellA === board[b] && cellA === board[c]) {
      return {
        winner: cellA,
        winningLine: line,
        isDraw: false,
      };
    }
  }

  const isBoardFull = board.every((cell) => cell !== null);
  return {
    winner: null,
    winningLine: null,
    isDraw: isBoardFull,
  };
}

export function getEmptyCells(board: ReadonlyArray<CellValue>): number[] {
  const indices: number[] = [];
  for (let i = 0; i < board.length; i += 1) {
    if (board[i] === null) {
      indices.push(i);
    }
  }
  return indices;
}

function findImmediateWinningMove(
  board: ReadonlyArray<CellValue>,
  player: Player
): number | null {
  const emptyCells = getEmptyCells(board);
  for (const index of emptyCells) {
    const next = [...board];
    next[index] = player;
    if (evaluateBoard(next).winner === player) {
      return index;
    }
  }
  return null;
}

function minimax(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player
): number {
  const { winner, isDraw } = evaluateBoard(board);
  if (winner === aiPlayer) {
    return 10 - depth;
  }
  if (winner === humanPlayer) {
    return depth - 10;
  }
  if (isDraw) {
    return 0;
  }

  const emptyCells = getEmptyCells(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const index of emptyCells) {
      board[index] = aiPlayer;
      const score = minimax(board, depth + 1, false, aiPlayer, humanPlayer);
      board[index] = null;
      if (score > bestScore) {
        bestScore = score;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const index of emptyCells) {
      board[index] = humanPlayer;
      const score = minimax(board, depth + 1, true, aiPlayer, humanPlayer);
      board[index] = null;
      if (score < bestScore) {
        bestScore = score;
      }
    }
    return bestScore;
  }
}

export function getAIMove(
  board: ReadonlyArray<CellValue>,
  difficulty: Difficulty,
  aiPlayer: Player = 'O',
  humanPlayer: Player = 'X'
): number {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) {
    return -1;
  }

  if (difficulty === 'easy') {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  if (difficulty === 'medium') {
    // 1. Take immediate win if available
    const winMove = findImmediateWinningMove(board, aiPlayer);
    if (winMove !== null) {
      return winMove;
    }

    // 2. Block player's immediate winning threat
    const blockMove = findImmediateWinningMove(board, humanPlayer);
    if (blockMove !== null) {
      return blockMove;
    }

    // 3. Otherwise pick a valid random square
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  // Hard difficulty: Optimal Minimax with randomized tie-breaking
  let bestScore = -Infinity;
  let bestMoves: number[] = [];
  const workingBoard = [...board];

  for (const index of emptyCells) {
    workingBoard[index] = aiPlayer;
    const score = minimax(workingBoard, 0, false, aiPlayer, humanPlayer);
    workingBoard[index] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [index];
    } else if (score === bestScore) {
      bestMoves.push(index);
    }
  }

  const chosen = Math.floor(Math.random() * bestMoves.length);
  return bestMoves[chosen];
}
