import React, { useState, useEffect } from 'react';
import { 
  X, 
  Gamepad2, 
  Newspaper, 
  Music, 
  Clock, 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Dices,
  Flame,
  CheckCircle,
  HelpCircle,
  Bookmark,
  Share2,
  ExternalLink,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Order } from '../../types';
import { getAssignedWaiter } from '../../utils/waiterAssignment';

interface CustomerEntertainmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOpenTracker?: () => void;
  onFinishMeal?: () => void;
}

// -------------------------------------------------------------
// 1. GAME: LUDO QUICK DICE DUEL
// -------------------------------------------------------------
const LudoGame: React.FC = () => {
  const [playerPos, setPlayerPos] = useState(0);
  const [botPos, setBotPos] = useState(0);
  const [lastDice, setLastDice] = useState<number | null>(null);
  const [turn, setTurn] = useState<'player' | 'bot'>('player');
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameLog, setGameLog] = useState<string[]>(['Game started! Roll the dice to begin.']);

  const TRACK_LENGTH = 20;

  const rollDice = () => {
    if (isRolling || winner || turn !== 'player') return;
    setIsRolling(true);

    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      setLastDice(dice);
      setIsRolling(false);

      const nextPos = Math.min(TRACK_LENGTH, playerPos + dice);
      setPlayerPos(nextPos);
      setGameLog((prev) => [`🎲 You rolled a ${dice}! Advanced to tile ${nextPos}.`, ...prev.slice(0, 3)]);

      if (nextPos >= TRACK_LENGTH) {
        setWinner('You won the Ludo Duel! 🏆');
        return;
      }

      // Bot turn
      setTurn('bot');
      setTimeout(() => {
        const botDice = Math.floor(Math.random() * 6) + 1;
        const nextBotPos = Math.min(TRACK_LENGTH, botPos + botDice);
        setBotPos(nextBotPos);
        setGameLog((prev) => [`🤖 Chef Bot rolled a ${botDice}! Advanced to tile ${nextBotPos}.`, ...prev.slice(0, 3)]);

        if (nextBotPos >= TRACK_LENGTH) {
          setWinner('Chef Bot reached home first! Try again.');
        } else {
          setTurn('player');
        }
      }, 1000);
    }, 450);
  };

  const resetLudo = () => {
    setPlayerPos(0);
    setBotPos(0);
    setLastDice(null);
    setTurn('player');
    setWinner(null);
    setGameLog(['Game reset! Roll the dice to start.']);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-black text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>🎲 Royal Ludo Sprint</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
              Fast 20-Tile Sprint
            </span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Race your gold token against the Chef's bot to reach Home first!
          </p>
        </div>
        <button
          onClick={resetLudo}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {winner && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-brand-500/20 border border-amber-500/30 text-center animate-in zoom-in-95">
          <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1 animate-bounce" />
          <span className="font-black text-sm text-slate-900 dark:text-white">{winner}</span>
        </div>
      )}

      {/* Board Track Visualization */}
      <div className="p-3.5 rounded-2xl bg-slate-950/40 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
        {/* Player track */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1">
              🟡 Your Token: Tile {playerPos}/{TRACK_LENGTH}
            </span>
            <span className="text-[11px] text-slate-400">Target: Tile 20</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
              style={{ width: `${(playerPos / TRACK_LENGTH) * 100}%` }}
            />
          </div>
        </div>

        {/* Bot track */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-blue-700 dark:text-blue-400 flex items-center gap-1">
              🤖 Chef Bot: Tile {botPos}/{TRACK_LENGTH}
            </span>
            <span className="text-[11px] text-slate-400">Target: Tile 20</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
              style={{ width: `${(botPos / TRACK_LENGTH) * 100}%` }}
            />
          </div>
        </div>

        {/* Track Grid Tiles preview */}
        <div className="grid grid-cols-10 gap-1 pt-2">
          {Array.from({ length: TRACK_LENGTH }).map((_, idx) => {
            const tileNum = idx + 1;
            const hasPlayer = playerPos === tileNum;
            const hasBot = botPos === tileNum;

            return (
              <div 
                key={tileNum}
                className={`h-8 rounded-lg border text-[10px] font-black flex items-center justify-center relative transition-all ${
                  tileNum === 20 
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                    : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-500'
                }`}
              >
                {tileNum === 20 ? '🏁' : tileNum}
                {hasPlayer && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-[8px] flex items-center justify-center text-black font-black animate-bounce shadow-xs">
                    P
                  </span>
                )}
                {hasBot && (
                  <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-blue-500 text-[8px] flex items-center justify-center text-white font-black animate-bounce shadow-xs">
                    B
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Action & Dice Display */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center font-black text-2xl shadow-md ${isRolling ? 'animate-spin' : ''}`}>
            {lastDice ? lastDice : '🎲'}
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              Current Turn:
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {turn === 'player' ? '👉 Your Turn to Roll' : '⏳ Chef Bot Thinking...'}
            </span>
          </div>
        </div>

        <button
          onClick={rollDice}
          disabled={turn !== 'player' || !!winner || isRolling}
          className={`py-2.5 px-5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-md ${
            turn === 'player' && !winner
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 active:scale-95 cursor-pointer shadow-amber-500/20'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
        </button>
      </div>

      {/* Mini Game Log */}
      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-[11px] text-slate-500 dark:text-slate-400 font-mono space-y-1">
        {gameLog.map((log, i) => (
          <div key={i} className={i === 0 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. GAME: SUDOKU QUICK 4x4 CHALLENGE
// -------------------------------------------------------------
const SudokuGame: React.FC = () => {
  const initialGrid = [
    [1, 0, 3, 0],
    [0, 3, 0, 1],
    [3, 0, 1, 0],
    [0, 1, 0, 3],
  ];

  const solution = [
    [1, 4, 3, 2],
    [2, 3, 4, 1],
    [3, 2, 1, 4],
    [4, 1, 2, 3],
  ];

  const [grid, setGrid] = useState<number[][]>(initialGrid);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (initialGrid[r][c] !== 0) return; // immutable original clue

    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);

    // Check if solved
    const allFilled = newGrid.every((row) => row.every((val) => val > 0));
    if (allFilled) {
      const isCorrect = newGrid.every((row, rIdx) => 
        row.every((val, cIdx) => val === solution[rIdx][cIdx])
      );
      if (isCorrect) setIsCompleted(true);
    }
  };

  const handleClear = () => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (initialGrid[r][c] !== 0) return;
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = 0;
    setGrid(newGrid);
  };

  const resetSudoku = () => {
    setGrid(initialGrid);
    setSelectedCell(null);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-black text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>🧩 Mini Sudoku (4×4)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold">
              Casual Dining Puzzle
            </span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fill the empty cells so each row, column, and 2×2 box contains digits 1 to 4!
          </p>
        </div>
        <button
          onClick={resetSudoku}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {isCompleted && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center animate-in zoom-in-95">
          <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1 animate-bounce" />
          <span className="font-black text-sm text-emerald-800 dark:text-emerald-300">
            Brilliant! Sudoku Solved Perfectly! 🎉
          </span>
        </div>
      )}

      {/* Sudoku Grid */}
      <div className="max-w-[280px] mx-auto p-3 rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-xl">
        <div className="grid grid-cols-4 gap-1.5">
          {grid.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isClue = initialGrid[rIdx][cIdx] !== 0;
              const isSelected = selectedCell?.[0] === rIdx && selectedCell?.[1] === cIdx;

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => setSelectedCell([rIdx, cIdx])}
                  className={`h-14 rounded-xl font-display font-black text-xl transition-all cursor-pointer flex items-center justify-center border ${
                    isSelected
                      ? 'ring-2 ring-amber-400 bg-amber-500/20 text-amber-300 border-amber-400'
                      : isClue
                      ? 'bg-slate-800 text-white border-slate-700 font-bold'
                      : val > 0
                      ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                      : 'bg-slate-950/70 text-slate-600 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {val > 0 ? val : ''}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Number Pad for Input */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="w-12 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-black border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-base transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="px-3.5 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white border border-slate-200 dark:border-slate-700 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          Erase
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. GAME: SNAKES & LADDERS (PARAMAPATHAM)
// -------------------------------------------------------------
const SnakeAndLadderGame: React.FC = () => {
  const [playerTile, setPlayerTile] = useState(1);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [eventMessage, setEventMessage] = useState<string>('Roll the dice to climb to tile 36!');
  const [isWinner, setIsWinner] = useState(false);

  // Board rules: 36 tiles (6x6)
  const LADDERS: Record<number, number> = {
    4: 14,
    9: 22,
    17: 28,
    20: 31,
  };

  const SNAKES: Record<number, number> = {
    16: 6,
    24: 11,
    30: 19,
    35: 8,
  };

  const rollDice = () => {
    if (isWinner) return;
    const dice = Math.floor(Math.random() * 6) + 1;
    setLastRoll(dice);

    let nextTile = playerTile + dice;
    if (nextTile > 36) {
      setEventMessage(`Rolled ${dice}! Need exact roll to hit 36.`);
      return;
    }

    if (LADDERS[nextTile]) {
      const climbedTo = LADDERS[nextTile];
      setEventMessage(`🪜 Woohoo! Climbed ladder from tile ${nextTile} to ${climbedTo}!`);
      nextTile = climbedTo;
    } else if (SNAKES[nextTile]) {
      const bitDownTo = SNAKES[nextTile];
      setEventMessage(`🐍 Oops! Snake bite at tile ${nextTile}, slid down to ${bitDownTo}!`);
      nextTile = bitDownTo;
    } else {
      setEventMessage(`Moved forward ${dice} spaces to tile ${nextTile}.`);
    }

    setPlayerTile(nextTile);
    if (nextTile === 36) {
      setIsWinner(true);
      setEventMessage('🎉 Congratulations! You conquered the Board!');
    }
  };

  const resetGame = () => {
    setPlayerTile(1);
    setLastRoll(null);
    setIsWinner(false);
    setEventMessage('Game reset! Roll the dice to start.');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-black text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>🐍 Snakes & Ladders (Paramapatham)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
              Classic Board
            </span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ladders boost your meal waiting time, beware of hungry kitchen snakes!
          </p>
        </div>
        <button
          onClick={resetGame}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 6x6 Board grid */}
      <div className="max-w-[320px] mx-auto p-3 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 36 }).map((_, idx) => {
            const tileNumber = 36 - idx; // serpentine or top-down
            const isPlayerHere = playerTile === tileNumber;
            const isLadderStart = LADDERS[tileNumber] !== undefined;
            const isSnakeHead = SNAKES[tileNumber] !== undefined;

            return (
              <div
                key={tileNumber}
                className={`h-11 rounded-xl border text-[10px] font-black flex flex-col items-center justify-center relative transition-all ${
                  isPlayerHere
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-105 z-10'
                    : isLadderStart
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                    : isSnakeHead
                    ? 'bg-rose-950/60 text-rose-300 border-rose-500/50'
                    : tileNumber === 36
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <span>{tileNumber}</span>
                {isPlayerHere && <span className="text-[12px] leading-none animate-bounce">🪙</span>}
                {isLadderStart && !isPlayerHere && <span className="text-[10px] leading-none">🪜</span>}
                {isSnakeHead && !isPlayerHere && <span className="text-[10px] leading-none">🐍</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dice Action Bar */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-500 flex items-center justify-center font-black text-xl shadow-xs">
            {lastRoll ? lastRoll : '🎲'}
          </div>
          <div className="text-xs">
            <span className="font-extrabold text-slate-900 dark:text-white block">
              Player at Tile {playerTile}/36
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              {eventMessage}
            </span>
          </div>
        </div>

        <button
          onClick={rollDice}
          disabled={isWinner}
          className={`py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-md ${
            !isWinner
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white active:scale-95 cursor-pointer shadow-emerald-500/20'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>Roll Dice</span>
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. DIGITAL NEWSPAPER & SHORTS SECTION
// -------------------------------------------------------------
const DIGITAL_NEWSPAPERS = [
  { id: 'hindu', name: 'The Hindu Daily', lang: 'English', category: 'National & Metro', icon: '📰' },
  { id: 'times', name: 'Times of India', lang: 'English', category: 'Business & Trends', icon: '🗞️' },
  { id: 'culinary', name: 'Culinary Chronicles', lang: 'Special', category: 'Food & Recipes', icon: '🍲' },
  { id: 'tech', name: 'Tech Wire Daily', lang: 'Global', category: 'AI & Gadgets', icon: '⚡' },
];

const NEWS_SHORTS = [
  {
    id: 1,
    paper: 'The Hindu Daily',
    title: 'Metro Expansion Reaches Record Milestone with New Green Corridor',
    summary: 'The new high-speed transit corridor was inaugurated today, reducing peak travel time by 45%. Urban planners praise the eco-friendly electric bus integration across arterial junctions.',
    category: 'City & Infra',
    readTime: '45s read',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    time: '20 min ago'
  },
  {
    id: 2,
    paper: 'Culinary Chronicles',
    title: 'Ancient Wood-Fired Clay Oven Technique Rediscovered by Modern Chefs',
    summary: 'Master chefs are returning to century-old slow-tandoor traditions. Infusing smoked hickory and aromatic wild spices delivers extraordinary tenderness without artificial additives.',
    category: 'Gourmet & Dine',
    readTime: '30s read',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    time: '45 min ago'
  },
  {
    id: 3,
    paper: 'Tech Wire Daily',
    title: 'Next-Gen Quantum Microprocessors Cut Server Energy Use by 80%',
    summary: 'Silicon breakthrough promises sustainable computing centers with liquid-nitrogen optical gates, paving the way for instant real-time AI processing on everyday handhelds.',
    category: 'Innovation',
    readTime: '50s read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    time: '1h ago'
  },
  {
    id: 4,
    paper: 'Times of India',
    title: 'India T20 Stars Prepare for Festive Showdown Against Rivals',
    summary: 'Team management announced an aggressive opening lineup for the upcoming weekend clash, emphasizing athletic boundary-saving agility and tactical spin variations in middle overs.',
    category: 'Sports Arena',
    readTime: '40s read',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
    time: '2h ago'
  }
];

const DigitalNewspaperSection: React.FC = () => {
  const [selectedPaper, setSelectedPaper] = useState('hindu');
  const [activeShortIdx, setActiveShortIdx] = useState(0);

  const filteredNews = NEWS_SHORTS;
  const currentShort = filteredNews[activeShortIdx];

  const handleNext = () => {
    setActiveShortIdx((prev) => (prev + 1) % filteredNews.length);
  };

  const handlePrev = () => {
    setActiveShortIdx((prev) => (prev - 1 + filteredNews.length) % filteredNews.length);
  };

  return (
    <div className="space-y-4">
      {/* Newspaper Selection Pills */}
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
          Select Digital Newspaper / Edition:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DIGITAL_NEWSPAPERS.map((paper) => {
            const isSelected = selectedPaper === paper.id;
            return (
              <button
                key={paper.id}
                onClick={() => setSelectedPaper(paper.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-sm ring-1 ring-amber-500/30'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{paper.icon}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {paper.lang}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white block line-clamp-1">
                    {paper.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {paper.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shorts Card Format */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-black uppercase">
              {currentShort.category}
            </span>
            <span>• {currentShort.paper}</span>
          </div>
          <span className="text-[11px] font-mono text-amber-400 font-bold">
            {activeShortIdx + 1} of {filteredNews.length} Shorts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
          <div className="md:col-span-5 relative h-40 md:h-48 rounded-2xl overflow-hidden shadow-md">
            <img 
              src={currentShort.image} 
              alt={currentShort.title}
              className="w-full h-full object-cover" 
            />
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white">
              {currentShort.readTime}
            </span>
          </div>

          <div className="md:col-span-7 flex flex-col justify-between space-y-2">
            <h4 className="font-black text-sm md:text-base leading-snug font-display text-white">
              {currentShort.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentShort.summary}
            </p>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>Published {currentShort.time}</span>
              <span className="text-amber-400 font-bold cursor-pointer hover:underline">
                Read full article →
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
          <button
            onClick={handlePrev}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Short</span>
          </button>

          <div className="flex items-center gap-1">
            {filteredNews.map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${
                  i === activeShortIdx ? 'w-5 bg-amber-400' : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
          >
            <span>Next Short</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. MUSIC & AMBIENT LOUNGE SECTION
// -------------------------------------------------------------
const AMBIENT_TRACKS = [
  { id: 1, title: 'Royal Ember Evening Sitar & Tabla', genre: 'Acoustic Indian Classical', duration: '3:45', icon: '🪕' },
  { id: 2, title: 'Monsoon Chai & Rainy Cafe Lo-Fi', genre: 'Chillhop Lo-Fi Beats', duration: '4:10', icon: '☕' },
  { id: 3, title: 'Bespoke Dining Jazz & Saxophone', genre: 'Smooth Bistro Jazz', duration: '3:20', icon: '🎷' },
  { id: 4, title: 'Gentle Himalayan Pine Breeze', genre: 'Nature & Zen Flute', duration: '5:00', icon: '🍃' },
];

const MusicLoungeSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState(AMBIENT_TRACKS[0]);
  const [volume, setVolume] = useState(70);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-black text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
          <span>🎧 Table-Side Music & Ambient Lounge</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold">
            Relaxing Dining Tunes
          </span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Listen to curated acoustics and soothing ambient sounds while your chef prepares your dishes.
        </p>
      </div>

      {/* Live Track Player Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-purple-500/30 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-2xl shadow-inner">
              {activeTrack.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                {activeTrack.genre}
              </span>
              <h5 className="font-black text-sm text-white line-clamp-1">
                {activeTrack.title}
              </h5>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isPlaying && (
              <div className="flex items-end gap-1 h-5 px-2">
                <span className="w-1 bg-purple-400 h-3 animate-pulse" />
                <span className="w-1 bg-amber-400 h-5 animate-pulse delay-75" />
                <span className="w-1 bg-purple-400 h-2 animate-pulse delay-150" />
                <span className="w-1 bg-emerald-400 h-4 animate-pulse delay-100" />
              </div>
            )}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center font-black transition-all active:scale-95 cursor-pointer shadow-md"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Fake audio progress bar */}
        <div className="space-y-1">
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-purple-400 to-amber-400 transition-all ${isPlaying ? 'w-2/5 animate-pulse' : 'w-1/12'}`} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{isPlaying ? '01:14' : '00:00'}</span>
            <span>{activeTrack.duration}</span>
          </div>
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2 pt-1">
          {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1.5 accent-amber-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-400 font-mono w-7">{volume}%</span>
        </div>
      </div>

      {/* Track Selection List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
        {AMBIENT_TRACKS.map((track) => {
          const isSelected = activeTrack.id === track.id;
          return (
            <div 
              key={track.id}
              onClick={() => {
                setActiveTrack(track);
                setIsPlaying(true);
              }}
              className={`p-3 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 font-bold' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{track.icon}</span>
                <div>
                  <span className="font-extrabold text-xs block">{track.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{track.genre}</span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-slate-400">{track.duration}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MAIN MODAL: CUSTOMER ENTERTAINMENT & WAITING HUB
// -------------------------------------------------------------
export const CustomerEntertainmentModal: React.FC<CustomerEntertainmentModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenTracker,
  onFinishMeal,
}) => {
  const [activeTab, setActiveTab] = useState<'games' | 'news' | 'music'>('games');
  const [activeGame, setActiveGame] = useState<'ludo' | 'sudoku' | 'snakes'>('ludo');

  // Real-time delivery countdown calculation
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!order) return 0;
    const target = new Date(order.createdAt).getTime() + (order.estimatedPrepTime * 60 * 1000);
    return Math.max(0, Math.floor((target - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!order) return;
    const update = () => {
      if (order.status === 'COMPLETED') return 0;
      const target = new Date(order.createdAt).getTime() + (order.estimatedPrepTime * 60 * 1000);
      return Math.max(0, Math.floor((target - Date.now()) / 1000));
    };
    setSecondsLeft(update());
    const interval = setInterval(() => {
      setSecondsLeft(update());
    }, 1000);
    return () => clearInterval(interval);
  }, [order?.createdAt, order?.estimatedPrepTime, order?.status]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const remainingSeconds = secondsLeft % 60;
  const isTimeUp = secondsLeft === 0 || order?.status === 'READY';
  const waiter = getAssignedWaiter(order?.tableNumber || 12);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base font-display">
                  Table-Side Entertainment Lounge
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black border border-amber-500/30">
                  Table {order?.tableNumber || 12}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Engage while your food is prepared fresh by the kitchen line
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Countdown Mini-Chip */}
            <div 
              onClick={() => {
                onClose();
                onOpenTracker?.();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-black cursor-pointer hover:bg-amber-500/30 transition-colors"
              title="Click to view full kitchen tracker"
            >
              <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>
                {isTimeUp ? 'Ready to Serve!' : `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Minimize & Continue Game"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TIME UP REMINDER ALERT (Triggered once countdown reaches 0 or chef marks READY) */}
        {isTimeUp && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-3 px-4 flex items-center justify-between gap-3 text-xs shadow-md animate-in slide-in-from-top-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="text-xl animate-bounce">🔔</span>
              <div>
                <span className="font-black text-sm block">
                  Time's Up! Your Feast is Fresh & Ready!
                </span>
                <span className="text-[11px] text-emerald-100">
                  Waiter {waiter.fullName} is serving your order to Table {order?.tableNumber || 12}. Enjoy your dining!
                </span>
              </div>
            </div>

            {onFinishMeal && (
              <button
                onClick={() => {
                  onClose();
                  onFinishMeal();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-900 font-black text-xs hover:bg-emerald-50 active:scale-95 transition-all shrink-0 cursor-pointer shadow-xs"
              >
                Finish Meal & Tip →
              </button>
            )}
          </div>
        )}

        {/* Main Tab Switcher: Games, Newspaper, Music */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'games'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Interactive Games</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Digital News Shorts</span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'music'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Music Lounge</span>
            </button>
          </div>

          {/* Sub-selector for games */}
          {activeTab === 'games' && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveGame('ludo')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeGame === 'ludo' ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-xs' : 'text-slate-500'
                }`}
              >
                Ludo
              </button>
              <button
                onClick={() => setActiveGame('sudoku')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeGame === 'sudoku' ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-xs' : 'text-slate-500'
                }`}
              >
                Sudoku
              </button>
              <button
                onClick={() => setActiveGame('snakes')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeGame === 'snakes' ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-xs' : 'text-slate-500'
                }`}
              >
                Snakes & Ladders
              </button>
            </div>
          )}
        </div>

        {/* Mobile sub-game selector pills */}
        {activeTab === 'games' && (
          <div className="flex sm:hidden items-center justify-center gap-1 p-2 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveGame('ludo')}
              className={`flex-1 py-1 rounded-lg text-xs font-bold text-center ${
                activeGame === 'ludo' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500'
              }`}
            >
              Ludo
            </button>
            <button
              onClick={() => setActiveGame('sudoku')}
              className={`flex-1 py-1 rounded-lg text-xs font-bold text-center ${
                activeGame === 'sudoku' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500'
              }`}
            >
              Sudoku
            </button>
            <button
              onClick={() => setActiveGame('snakes')}
              className={`flex-1 py-1 rounded-lg text-xs font-bold text-center ${
                activeGame === 'snakes' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500'
              }`}
            >
              Snakes & Ladders
            </button>
          </div>
        )}

        {/* Tab Body Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'games' && (
            <div>
              {activeGame === 'ludo' && <LudoGame />}
              {activeGame === 'sudoku' && <SudokuGame />}
              {activeGame === 'snakes' && <SnakeAndLadderGame />}
            </div>
          )}

          {activeTab === 'news' && <DigitalNewspaperSection />}

          {activeTab === 'music' && <MusicLoungeSection />}
        </div>

        {/* Footer Bar with "Continue Game" & Quick Access */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Games & News active while waiting</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all cursor-pointer"
            >
              Minimize & Keep Playing Later
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerEntertainmentModal;
