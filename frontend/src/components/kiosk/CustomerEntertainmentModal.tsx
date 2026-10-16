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
  Globe,
  Radio,
  BookOpen,
  Layers,
  Sparkle,
  Lightbulb,
  Eraser,
  Calendar,
  CloudSun
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

// ============================================================================
// 1. ORIGINAL TYPE LUDO BOARD (Authentic 4-Quadrant Cross Board with 2 Players)
// ============================================================================
const OriginalLudoGame: React.FC = () => {
  // 2 tokens for Player (Yellow), 2 tokens for Chef Bot (Red)
  // State: -1 = in base yard, 0..51 = main track, 100+ = home stretch, 200 = Finished Home
  const [playerTokens, setPlayerTokens] = useState<[number, number]>([-1, -1]);
  const [botTokens, setBotTokens] = useState<[number, number]>([-1, -1]);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [turn, setTurn] = useState<'player' | 'bot'>('player');
  const [winner, setWinner] = useState<string | null>(null);
  const [gameLog, setGameLog] = useState<string[]>([
    'Welcome to Royal Ludo! Roll a 6 to release your token from base.'
  ]);

  // Track is 28 tiles circular sprint for fast kiosk dining play
  const MAX_TRACK = 24;

  const rollDice = () => {
    if (isRolling || winner || turn !== 'player') return;
    setIsRolling(true);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(roll);
      setIsRolling(false);

      // Player move logic
      setPlayerTokens((prev) => {
        const [t1, t2] = prev;
        let newT1 = t1;
        let newT2 = t2;
        let moved = false;

        if (roll === 6) {
          if (t1 === -1) {
            newT1 = 0;
            moved = true;
            setGameLog((l) => [`🎲 You rolled a 6! Token #1 deployed to Track 0!`, ...l.slice(0, 3)]);
          } else if (t2 === -1) {
            newT2 = 0;
            moved = true;
            setGameLog((l) => [`🎲 You rolled a 6! Token #2 deployed to Track 0!`, ...l.slice(0, 3)]);
          } else {
            newT1 = Math.min(MAX_TRACK, t1 + roll);
            moved = true;
            setGameLog((l) => [`🎲 You rolled a 6! Token #1 advanced to ${newT1}.`, ...l.slice(0, 3)]);
          }
        } else {
          // Advance active token
          if (t1 >= 0 && t1 < MAX_TRACK) {
            newT1 = Math.min(MAX_TRACK, t1 + roll);
            moved = true;
            setGameLog((l) => [`🎲 You rolled a ${roll}! Token #1 at tile ${newT1}.`, ...l.slice(0, 3)]);
          } else if (t2 >= 0 && t2 < MAX_TRACK) {
            newT2 = Math.min(MAX_TRACK, t2 + roll);
            moved = true;
            setGameLog((l) => [`🎲 You rolled a ${roll}! Token #2 at tile ${newT2}.`, ...l.slice(0, 3)]);
          } else {
            setGameLog((l) => [`🎲 Rolled a ${roll}. Need a 6 to bring token out of base!`, ...l.slice(0, 3)]);
          }
        }

        // Win check
        if (newT1 >= MAX_TRACK && newT2 >= MAX_TRACK) {
          setWinner('You won the Ludo Championship! 🏆');
        }

        return [newT1, newT2];
      });

      // Pass turn to bot if not rolling a 6
      if (roll !== 6) {
        setTurn('bot');
        setTimeout(runBotTurn, 1000);
      }
    }, 500);
  };

  const runBotTurn = () => {
    if (winner) return;
    const botRoll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(botRoll);

    setBotTokens((prev) => {
      const [b1, b2] = prev;
      let newB1 = b1;
      let newB2 = b2;

      if (botRoll === 6) {
        if (b1 === -1) {
          newB1 = 0;
          setGameLog((l) => [`🤖 Chef Bot rolled a 6 and deployed Token #1!`, ...l.slice(0, 3)]);
        } else if (b2 === -1) {
          newB2 = 0;
          setGameLog((l) => [`🤖 Chef Bot rolled a 6 and deployed Token #2!`, ...l.slice(0, 3)]);
        } else {
          newB1 = Math.min(MAX_TRACK, b1 + botRoll);
          setGameLog((l) => [`🤖 Chef Bot advanced Token #1 to ${newB1}.`, ...l.slice(0, 3)]);
        }
      } else {
        if (b1 >= 0 && b1 < MAX_TRACK) {
          newB1 = Math.min(MAX_TRACK, b1 + botRoll);
          setGameLog((l) => [`🤖 Chef Bot rolled ${botRoll}, moving to tile ${newB1}.`, ...l.slice(0, 3)]);
        } else if (b2 >= 0 && b2 < MAX_TRACK) {
          newB2 = Math.min(MAX_TRACK, b2 + botRoll);
          setGameLog((l) => [`🤖 Chef Bot rolled ${botRoll}, moving to tile ${newB2}.`, ...l.slice(0, 3)]);
        } else {
          setGameLog((l) => [`🤖 Chef Bot rolled ${botRoll}. No tokens on track.`, ...l.slice(0, 3)]);
        }
      }

      if (newB1 >= MAX_TRACK && newB2 >= MAX_TRACK) {
        setWinner('Chef Bot conquered Home! Try again next round.');
      } else {
        setTurn('player');
      }

      return [newB1, newB2];
    });
  };

  const resetGame = () => {
    setPlayerTokens([-1, -1]);
    setBotTokens([-1, -1]);
    setDiceRoll(null);
    setTurn('player');
    setWinner(null);
    setGameLog(['Game reset! Roll a 6 to deploy your gold tokens.']);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-black text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎲 Royal Ludo Master</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/30">
              Classic 4-Quadrant Board
            </span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Roll 6 to leave base. Race tokens to Home Triangle against Chef Bot!
          </p>
        </div>

        <button
          onClick={resetGame}
          className="p-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>

      {winner && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-emerald-500/25 to-brand-500/25 border-2 border-amber-500/40 text-center animate-in zoom-in-95">
          <Trophy className="w-7 h-7 text-amber-500 mx-auto mb-1 animate-bounce" />
          <span className="font-black text-sm text-slate-900 dark:text-white block">{winner}</span>
        </div>
      )}

      {/* AUTHENTIC 4-QUADRANT LUDO BOARD SVG & GRID */}
      <div className="max-w-[380px] sm:max-w-[420px] mx-auto p-3.5 rounded-3xl bg-slate-950 border-4 border-amber-600/40 shadow-2xl relative select-none">
        
        {/* Ludo Board Framework */}
        <div className="aspect-square w-full grid grid-cols-3 grid-rows-3 gap-1 rounded-2xl bg-slate-900 p-1 border border-slate-700/80">
          
          {/* Top-Left Quadrant: RED YARD (Chef Bot) */}
          <div className="bg-rose-700 rounded-xl p-2.5 flex flex-col justify-between border-2 border-rose-800 shadow-inner">
            <span className="text-[10px] font-black uppercase text-rose-200 tracking-wider">Chef Bot (Red)</span>
            <div className="bg-white/90 dark:bg-slate-950/80 rounded-lg p-2 grid grid-cols-2 gap-2 aspect-square items-center justify-items-center">
              <div className={`w-6 h-6 rounded-full border-2 border-rose-900 flex items-center justify-center text-[10px] font-black ${botTokens[0] === -1 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-300 opacity-40'}`}>
                {botTokens[0] === -1 ? 'B1' : '✓'}
              </div>
              <div className={`w-6 h-6 rounded-full border-2 border-rose-900 flex items-center justify-center text-[10px] font-black ${botTokens[1] === -1 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-300 opacity-40'}`}>
                {botTokens[1] === -1 ? 'B2' : '✓'}
              </div>
            </div>
          </div>

          {/* Top-Center: NORTH TRACK (Green Home Runway) */}
          <div className="bg-slate-800 rounded-xl grid grid-cols-3 grid-rows-6 gap-0.5 p-1 border border-slate-700 text-[8px] text-slate-400 font-bold">
            {Array.from({ length: 18 }).map((_, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-center rounded-xs ${
                  i % 3 === 1 ? 'bg-emerald-600/70 text-white' : i === 7 ? 'bg-emerald-500 text-black font-black' : 'bg-slate-850'
                }`}
              >
                {i === 7 ? '★' : ''}
              </div>
            ))}
          </div>

          {/* Top-Right Quadrant: GREEN YARD */}
          <div className="bg-emerald-700 rounded-xl p-2.5 flex flex-col justify-between border-2 border-emerald-800 shadow-inner">
            <span className="text-[10px] font-black uppercase text-emerald-200 tracking-wider">North Yard</span>
            <div className="bg-white/90 dark:bg-slate-950/80 rounded-lg p-2 grid grid-cols-2 gap-2 aspect-square items-center justify-items-center">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">G1</div>
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">G2</div>
            </div>
          </div>

          {/* Center-Left: WEST TRACK (Red Home Runway) */}
          <div className="bg-slate-800 rounded-xl grid grid-cols-6 grid-rows-3 gap-0.5 p-1 border border-slate-700 text-[8px] text-slate-400 font-bold">
            {Array.from({ length: 18 }).map((_, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-center rounded-xs ${
                  Math.floor(i / 6) === 1 ? 'bg-rose-600/70 text-white' : i === 1 ? 'bg-rose-500 text-black font-black' : 'bg-slate-850'
                }`}
              >
                {i === 1 ? '★' : ''}
              </div>
            ))}
          </div>

          {/* CENTER: LUDO TRIANGULAR HOME */}
          <div className="bg-gradient-to-tr from-amber-500 via-rose-600 to-blue-600 rounded-xl border-2 border-white flex flex-col items-center justify-center text-white text-center p-1 relative shadow-lg">
            <span className="text-xl">🏆</span>
            <span className="text-[9px] font-black tracking-widest uppercase">HOME</span>
          </div>

          {/* Center-Right: EAST TRACK (Blue Home Runway) */}
          <div className="bg-slate-800 rounded-xl grid grid-cols-6 grid-rows-3 gap-0.5 p-1 border border-slate-700 text-[8px] text-slate-400 font-bold">
            {Array.from({ length: 18 }).map((_, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-center rounded-xs ${
                  Math.floor(i / 6) === 1 ? 'bg-blue-600/70 text-white' : i === 16 ? 'bg-blue-500 text-black font-black' : 'bg-slate-850'
                }`}
              >
                {i === 16 ? '★' : ''}
              </div>
            ))}
          </div>

          {/* Bottom-Left Quadrant: BLUE YARD */}
          <div className="bg-blue-700 rounded-xl p-2.5 flex flex-col justify-between border-2 border-blue-800 shadow-inner">
            <span className="text-[10px] font-black uppercase text-blue-200 tracking-wider">South Yard</span>
            <div className="bg-white/90 dark:bg-slate-950/80 rounded-lg p-2 grid grid-cols-2 gap-2 aspect-square items-center justify-items-center">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">U1</div>
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">U2</div>
            </div>
          </div>

          {/* Bottom-Center: SOUTH TRACK (Yellow Home Runway) */}
          <div className="bg-slate-800 rounded-xl grid grid-cols-3 grid-rows-6 gap-0.5 p-1 border border-slate-700 text-[8px] text-slate-400 font-bold">
            {Array.from({ length: 18 }).map((_, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-center rounded-xs ${
                  i % 3 === 1 ? 'bg-amber-500/80 text-black font-black' : i === 10 ? 'bg-amber-400 text-black font-black' : 'bg-slate-850'
                }`}
              >
                {i === 10 ? '★' : ''}
              </div>
            ))}
          </div>

          {/* Bottom-Right Quadrant: YELLOW YARD (PLAYER) */}
          <div className="bg-amber-500 rounded-xl p-2.5 flex flex-col justify-between border-2 border-amber-600 shadow-inner">
            <span className="text-[10px] font-black uppercase text-slate-950 tracking-wider">You (Gold Token)</span>
            <div className="bg-white/90 dark:bg-slate-950/80 rounded-lg p-2 grid grid-cols-2 gap-2 aspect-square items-center justify-items-center">
              <div className={`w-6 h-6 rounded-full border-2 border-amber-600 flex items-center justify-center text-[10px] font-black ${playerTokens[0] === -1 ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-slate-300 opacity-40'}`}>
                {playerTokens[0] === -1 ? 'P1' : '✓'}
              </div>
              <div className={`w-6 h-6 rounded-full border-2 border-amber-600 flex items-center justify-center text-[10px] font-black ${playerTokens[1] === -1 ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-slate-300 opacity-40'}`}>
                {playerTokens[1] === -1 ? 'P2' : '✓'}
              </div>
            </div>
          </div>

        </div>

        {/* Live Token Status Pills */}
        <div className="flex items-center justify-between text-xs font-bold pt-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="text-amber-400 text-[11px]">
              You: T1 ({playerTokens[0] === -1 ? 'Base' : `${playerTokens[0]}/${MAX_TRACK}`}) • T2 ({playerTokens[1] === -1 ? 'Base' : `${playerTokens[1]}/${MAX_TRACK}`})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="text-rose-400 text-[11px]">
              Chef: T1 ({botTokens[0] === -1 ? 'Base' : `${botTokens[0]}/${MAX_TRACK}`}) • T2 ({botTokens[1] === -1 ? 'Base' : `${botTokens[1]}/${MAX_TRACK}`})
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Roll Action Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-500 flex items-center justify-center font-black text-3xl shadow-lg transition-transform ${isRolling ? 'rotate-180 scale-110' : ''}`}>
            {diceRoll !== null ? diceRoll : '🎲'}
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">
              Active Turn:
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              {turn === 'player' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Your Turn (Roll 6 to launch)</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Chef Bot Rolling...</span>
                </>
              )}
            </span>
          </div>
        </div>

        <button
          onClick={rollDice}
          disabled={turn !== 'player' || isRolling || !!winner}
          className={`py-3 px-5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-xl ${
            turn === 'player' && !winner
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 active:scale-95 cursor-pointer shadow-amber-500/25 ring-2 ring-amber-400/40'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>{isRolling ? 'Rolling...' : 'Roll Dice 🎲'}</span>
        </button>
      </div>

      {/* Mini Game Commentary */}
      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
        {gameLog.map((log, i) => (
          <div key={i} className={i === 0 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 2. ORIGINAL SNAKES & LADDERS (AUTHENTIC 100-TILE BOARD / PARAMAPATHAM)
// ============================================================================
const OriginalSnakesAndLadders: React.FC = () => {
  const [playerTile, setPlayerTile] = useState(1);
  const [botTile, setBotTile] = useState(1);
  const [lastDice, setLastDice] = useState<number | null>(null);
  const [turn, setTurn] = useState<'player' | 'bot'>('player');
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(['Game started! First to reach tile 100 wins!']);

  // Authentic Indian Board Snakes and Ladders Mapping (100 Tiles)
  const LADDERS: Record<number, number> = {
    4: 14,
    9: 31,
    20: 38,
    28: 84,
    40: 59,
    51: 67,
    63: 81,
    71: 91,
  };

  const SNAKES: Record<number, number> = {
    17: 7,
    54: 34,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    99: 78,
  };

  const rollDice = () => {
    if (isRolling || winner || turn !== 'player') return;
    setIsRolling(true);

    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      setLastDice(dice);
      setIsRolling(false);

      let nextTile = playerTile + dice;
      if (nextTile > 100) {
        setLog((l) => [`🎲 You rolled ${dice}. Need exact roll to reach 100.`, ...l.slice(0, 3)]);
      } else {
        if (LADDERS[nextTile]) {
          const climbed = LADDERS[nextTile];
          setLog((l) => [`🪜 Rolled ${dice}! Climbed ladder from tile ${nextTile} to ${climbed}! 🎉`, ...l.slice(0, 3)]);
          nextTile = climbed;
        } else if (SNAKES[nextTile]) {
          const bitDown = SNAKES[nextTile];
          setLog((l) => [`🐍 Oh no! Snake bite at tile ${nextTile}, slid down to ${bitDown}!`, ...l.slice(0, 3)]);
          nextTile = bitDown;
        } else {
          setLog((l) => [`🎲 Rolled ${dice}! Moved to tile ${nextTile}.`, ...l.slice(0, 3)]);
        }

        setPlayerTile(nextTile);

        if (nextTile === 100) {
          setWinner('You won Snakes & Ladders! Reached 100! 🏆');
          return;
        }
      }

      // Bot turn
      setTurn('bot');
      setTimeout(runBotTurn, 900);
    }, 450);
  };

  const runBotTurn = () => {
    if (winner) return;
    const botDice = Math.floor(Math.random() * 6) + 1;
    setLastDice(botDice);

    let nextBot = botTile + botDice;
    if (nextBot <= 100) {
      if (LADDERS[nextBot]) {
        const climbed = LADDERS[nextBot];
        setLog((l) => [`🤖 Chef Bot rolled ${botDice} and climbed ladder to ${climbed}!`, ...l.slice(0, 3)]);
        nextBot = climbed;
      } else if (SNAKES[nextBot]) {
        const bit = SNAKES[nextBot];
        setLog((l) => [`🤖 Chef Bot hit a snake at ${nextBot}, fell to ${bit}!`, ...l.slice(0, 3)]);
        nextBot = bit;
      } else {
        setLog((l) => [`🤖 Chef Bot rolled ${botDice}, moved to tile ${nextBot}.`, ...l.slice(0, 3)]);
      }

      setBotTile(nextBot);

      if (nextBot === 100) {
        setWinner('Chef Bot reached 100 first! Rematch?');
        return;
      }
    }

    setTurn('player');
  };

  const resetGame = () => {
    setPlayerTile(1);
    setBotTile(1);
    setLastDice(null);
    setTurn('player');
    setWinner(null);
    setLog(['Board reset! Roll the dice to begin the climb to 100.']);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-black text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>🐍 Classic Snakes & Ladders (100 Tiles)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
              Paramapatham
            </span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Authentic 100-tile serpentine board. Ladders climb, beware of hungry snakes!
          </p>
        </div>

        <button
          onClick={resetGame}
          className="p-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {winner && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/25 via-teal-500/25 to-amber-500/25 border-2 border-emerald-500/40 text-center animate-in zoom-in-95">
          <Trophy className="w-7 h-7 text-amber-500 mx-auto mb-1 animate-bounce" />
          <span className="font-black text-sm text-slate-900 dark:text-white block">{winner}</span>
        </div>
      )}

      {/* 10x10 (100 Tile) Authentically Rendered Serpentine Board */}
      <div className="max-w-[420px] mx-auto p-3 rounded-3xl bg-slate-950 border-4 border-emerald-600/40 shadow-2xl">
        <div className="grid grid-cols-10 gap-0.5 aspect-square bg-slate-900 p-1 rounded-2xl border border-slate-800">
          {Array.from({ length: 10 }).map((_, rowIdx) => {
            const rowNumber = 10 - rowIdx; // 10, 9, 8, ... 1
            const isEvenRow = rowNumber % 2 === 0;

            const cols = Array.from({ length: 10 }).map((_, colIdx) => {
              const tileNumber = isEvenRow
                ? (rowNumber - 1) * 10 + (10 - colIdx)
                : (rowNumber - 1) * 10 + (colIdx + 1);

              const hasPlayer = playerTile === tileNumber;
              const hasBot = botTile === tileNumber;
              const hasLadder = LADDERS[tileNumber] !== undefined;
              const hasSnake = SNAKES[tileNumber] !== undefined;

              return (
                <div
                  key={tileNumber}
                  className={`aspect-square rounded-xs border text-[8px] font-black flex flex-col items-center justify-between p-0.5 relative transition-all ${
                    tileNumber === 100
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500/60 font-black'
                      : hasLadder
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                      : hasSnake
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                      : (rowIdx + colIdx) % 2 === 0
                      ? 'bg-slate-850 text-slate-400 border-slate-800'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  <span className="self-start text-[7px] opacity-75">{tileNumber}</span>
                  <div className="flex items-center gap-0.5 my-auto">
                    {hasPlayer && <span className="text-[11px] animate-bounce drop-shadow-md">🪙</span>}
                    {hasBot && <span className="text-[11px] animate-bounce drop-shadow-md">🤖</span>}
                    {!hasPlayer && !hasBot && hasLadder && <span className="text-[9px]">🪜</span>}
                    {!hasPlayer && !hasBot && hasSnake && <span className="text-[9px]">🐍</span>}
                  </div>
                </div>
              );
            });

            return cols;
          })}
        </div>

        {/* Board Meta Key */}
        <div className="flex items-center justify-between pt-2 px-1 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span>🪙 You: Tile {playerTile}/100</span>
            <span>• 🤖 Bot: Tile {botTile}/100</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">🪜 Ladders</span>
            <span className="text-rose-400">🐍 Snakes</span>
          </div>
        </div>
      </div>

      {/* Dice & Turn Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500 flex items-center justify-center font-black text-3xl shadow-lg transition-transform ${isRolling ? 'rotate-180' : ''}`}>
            {lastDice !== null ? lastDice : '🎲'}
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">
              Current Turn:
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              {turn === 'player' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Your Turn to Roll</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Chef Bot's Turn...</span>
                </>
              )}
            </span>
          </div>
        </div>

        <button
          onClick={rollDice}
          disabled={turn !== 'player' || isRolling || !!winner}
          className={`py-3 px-5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-xl ${
            turn === 'player' && !winner
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white active:scale-95 cursor-pointer shadow-emerald-500/25 ring-2 ring-emerald-400/40'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>{isRolling ? 'Rolling...' : 'Roll Dice 🎲'}</span>
        </button>
      </div>

      {/* Commentary Log */}
      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
        {log.map((entry, idx) => (
          <div key={idx} className={idx === 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 3. ORIGINAL CLASSIC SUDOKU (Authentic 9x9 Newspaper Puzzle)
// ============================================================================
const OriginalSudokuGame: React.FC = () => {
  // Pre-configured 9x9 authentic puzzle with clear newspaper layout
  const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  const [grid, setGrid] = useState<number[][]>(puzzle);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([0, 2]);
  const [mistakes, setMistakes] = useState(0);

  const handleInput = (num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (puzzle[r][c] !== 0) return; // Clue cannot be modified

    const copy = grid.map((row) => [...row]);
    copy[r][c] = num;
    setGrid(copy);
  };

  const handleErase = () => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (puzzle[r][c] !== 0) return;
    const copy = grid.map((row) => [...row]);
    copy[r][c] = 0;
    setGrid(copy);
  };

  const handleHint = () => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (puzzle[r][c] !== 0) return;
    // Simple mock hint for demonstration
    const copy = grid.map((row) => [...row]);
    copy[r][c] = 4; // Example hint
    setGrid(copy);
  };

  const resetSudoku = () => {
    setGrid(puzzle);
    setSelectedCell([0, 2]);
    setMistakes(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-black text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>🧩 Classic Newspaper Sudoku (9×9)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/30">
              Brain Workout
            </span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fill the 9×9 grid so every row, column and 3×3 box contains digits 1 to 9.
          </p>
        </div>

        <button
          onClick={resetSudoku}
          className="p-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 9x9 Authentic Sudoku Board */}
      <div className="max-w-[360px] sm:max-w-[400px] mx-auto p-3 rounded-3xl bg-slate-950 border-4 border-slate-700 shadow-2xl">
        <div className="grid grid-cols-9 bg-slate-900 border-2 border-slate-400 rounded-xl overflow-hidden">
          {grid.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isClue = puzzle[rIdx][cIdx] !== 0;
              const isSelected = selectedCell?.[0] === rIdx && selectedCell?.[1] === cIdx;
              const isSameRowOrCol = selectedCell?.[0] === rIdx || selectedCell?.[1] === cIdx;
              const borderRight = (cIdx + 1) % 3 === 0 && cIdx !== 8 ? 'border-r-2 border-r-slate-400' : 'border-r border-r-slate-800';
              const borderBottom = (rIdx + 1) % 3 === 0 && rIdx !== 8 ? 'border-b-2 border-b-slate-400' : 'border-b border-b-slate-800';

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => setSelectedCell([rIdx, cIdx])}
                  className={`aspect-square flex items-center justify-center font-display text-sm sm:text-base font-black transition-all cursor-pointer ${borderRight} ${borderBottom} ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 z-10'
                      : isSameRowOrCol
                      ? 'bg-slate-800/80 text-white'
                      : isClue
                      ? 'bg-slate-900 text-slate-200 font-bold'
                      : val > 0
                      ? 'bg-blue-950/60 text-blue-300'
                      : 'bg-slate-950 text-slate-600 hover:bg-slate-800'
                  }`}
                >
                  {val > 0 ? val : ''}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 1-9 Number Pad */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleInput(num)}
            className="w-9 h-10 sm:w-10 sm:h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-black border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-sm sm:text-base transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            {num}
          </button>
        ))}

        <button
          onClick={handleErase}
          className="px-3 h-10 sm:h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white border border-slate-200 dark:border-slate-700 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          title="Erase cell"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Erase</span>
        </button>

        <button
          onClick={handleHint}
          className="px-3 h-10 sm:h-11 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/30 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          title="Get a hint"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Hint</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 4. MULTILINGUAL TODAY'S LIVE NEWSPAPER SECTION
// ============================================================================
type NewsLanguage = 'en' | 'ta' | 'hi' | 'te';

interface NewsItem {
  id: number;
  newspaper: string;
  headline: string;
  summary: string;
  category: string;
  readTime: string;
  image: string;
  timeAgo: string;
}

interface NewspaperEdition {
  name: string;
  masthead: string;
  tagline: string;
  cityEdition: string;
  news: NewsItem[];
}

interface LanguagePaperConfig {
  code: NewsLanguage;
  label: string;
  nativeName: string;
  flag: string;
  papers: NewspaperEdition[];
}

const MULTILINGUAL_NEWS_DATA: Record<NewsLanguage, LanguagePaperConfig> = {
  en: {
    code: 'en',
    label: 'English',
    nativeName: 'English Daily',
    flag: '🇬🇧',
    papers: [
      {
        name: 'The Hindu Daily',
        masthead: 'THE HINDU',
        tagline: "India's National Newspaper Since 1878 • Independent & Trusted",
        cityEdition: 'Metro South Edition • Today, October 16, 2026',
        news: [
          {
            id: 101,
            newspaper: 'The Hindu Daily',
            headline: 'Historic Metro Phase 3 Green Corridor Opened for Public Commuters',
            summary: 'The new 45km high-speed automated metro corridor officially commenced service today, connecting IT clusters with historic cultural hubs. Commuters celebrate zero-emission transit cutting rush-hour transit times by 40%.',
            category: 'Urban Mobility',
            readTime: '45s read',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
            timeAgo: '15m ago'
          },
          {
            id: 102,
            newspaper: 'The Hindu Daily',
            headline: 'Supreme Court Landmark Ruling Safeguards Pristine Western Ghats Bio-Corridors',
            summary: 'A constitutional bench ruled today that continuous forested elephant and river corridors in the Western Ghats enjoy absolute ecological protection against commercial quarrying and unauthorized resorts.',
            category: 'Environment & Law',
            readTime: '40s read',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
            timeAgo: '42m ago'
          },
          {
            id: 103,
            newspaper: 'The Hindu Daily',
            headline: 'National Science Academies Partner on Next-Gen Clean Coastal Desalination',
            summary: 'Indian and Scandinavian oceanographic researchers unveiled a low-energy solar osmosis desalination grid along the Coromandel coast, supplying 100 million liters of potable drinking water per day.',
            category: 'Science & Water',
            readTime: '35s read',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1h ago'
          },
          {
            id: 104,
            newspaper: 'The Hindu Daily',
            headline: 'Digital Literacy Curriculum Rolled Out to 12,000 Rural State Secondary Schools',
            summary: 'State education councils commenced training students in ethical AI, hands-on computer science, and regional digital publishing, bridging urban-rural technological parity across tier-2 and tier-3 towns.',
            category: 'Education & Future',
            readTime: '30s read',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2h ago'
          }
        ]
      },
      {
        name: 'Times of India',
        masthead: 'THE TIMES OF INDIA',
        tagline: "Let Truth Prevail • World's Largest Circulated English Daily",
        cityEdition: 'National & Metro Edition • Today, October 16, 2026',
        news: [
          {
            id: 201,
            newspaper: 'Times of India',
            headline: 'South Indian Artisanal Culinary Heritage Earns UNESCO Cultural Recognition',
            summary: 'Centuries-old slow-tandoor roasting and aromatic clay-pot dum biryani methods from Chettinad and Hyderabad were recognized today by the global culinary federation as living artisanal traditions in a grand Paris gala.',
            category: 'Gourmet & Culture',
            readTime: '30s read',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            timeAgo: '20m ago'
          },
          {
            id: 202,
            newspaper: 'Times of India',
            headline: 'Tech Corridors Record 300,000 New Campus Hiring Offers This Festive Season',
            summary: 'Hiring indices released by Indian tech councils revealed a massive hiring surge across AI engineering, autonomous automotive systems, and clean energy tech, with average salary packages rising 18%.',
            category: 'Campus & Careers',
            readTime: '35s read',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
            timeAgo: '45m ago'
          },
          {
            id: 203,
            newspaper: 'Times of India',
            headline: 'Indian Cinema Waves Sweep International Film Awards with 12 Grand Trophies',
            summary: 'Acclaimed independent features and epic period dramas from Tamil, Telugu, and Hindi cinema dominated the global film circuit this week, winning top honors for sound design, screenplay, and cinematography.',
            category: 'Cinema & Arts',
            readTime: '40s read',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1h ago'
          },
          {
            id: 204,
            newspaper: 'Times of India',
            headline: 'Next-Gen Vande Bharat Sleeper Trains Enter Commercial Inter-City Operations',
            summary: 'The futuristic aerodynamic sleeper train clocked smooth 160km/h speeds during maiden nocturnal journeys between major metropolitan capitals, boasting smart airline-style pods and noise-dampened cabins.',
            category: 'Travel & Railways',
            readTime: '30s read',
            image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2h ago'
          }
        ]
      },
      {
        name: 'Indian Express',
        masthead: 'THE INDIAN EXPRESS',
        tagline: 'Journalism of Courage • Uncompromising Ground Reporting & Truth',
        cityEdition: 'National Express Edition • Today, October 16, 2026',
        news: [
          {
            id: 301,
            newspaper: 'Indian Express',
            headline: 'Cricket World Cup Squad Announces Fearless Youth Batting Lineup',
            summary: 'National selectors finalized a dynamic, athletic 15-man squad for the upcoming championship, featuring explosive pinch-hitters, 145km/h pacers, and wrist-spinners primed for subcontinent conditions.',
            category: 'Sports Arena',
            readTime: '35s read',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
            timeAgo: '18m ago'
          },
          {
            id: 302,
            newspaper: 'Indian Express',
            headline: 'Special Investigation: Solar Microgrids Electrify 50,000 Agricultural Borewells',
            summary: 'An on-the-ground survey across drought-prone rural belts revealed farmers enjoying uninterrupted daytime irrigation without diesel bills, transforming dryland crop yields and doubling household farm incomes.',
            category: 'Ground Report',
            readTime: '50s read',
            image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
            timeAgo: '50m ago'
          },
          {
            id: 303,
            newspaper: 'Indian Express',
            headline: 'Space Commission Approves Second-Gen Orbital Habitation Module',
            summary: 'National space scientists achieved green clearances for indigenous docking and life-support modules slated for the upcoming permanent space station orbit mission in early 2027.',
            category: 'Aerospace & Defence',
            readTime: '40s read',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1h ago'
          },
          {
            id: 304,
            newspaper: 'Indian Express',
            headline: 'University Research Group Synthesizes Low-Cost Carbon Nano-Filter for River Cleaning',
            summary: 'Engineering scholars produced a bio-derived filtration mesh capable of removing 99.8% of industrial chemical effluents and heavy microplastics at less than ten paise per liter cost.',
            category: 'Innovations',
            readTime: '35s read',
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
            timeAgo: '3h ago'
          }
        ]
      },
      {
        name: 'Economic Herald',
        masthead: 'THE ECONOMIC HERALD',
        tagline: 'Financial Intelligence, Capital Markets & Enterprise Strategy',
        cityEdition: 'Financial & Markets Edition • Today, October 16, 2026',
        news: [
          {
            id: 401,
            newspaper: 'Economic Herald',
            headline: 'Indian Tech Startups Lead Global Renewable Micro-Grid Deployments with $3.2B Inflow',
            summary: 'Solar-powered battery hubs pioneered in Bengaluru and Chennai crossed 10 Gigawatts of rural electrification, attracting 3.2 billion dollars in international sovereign wealth and venture funds.',
            category: 'Economy & Tech',
            readTime: '40s read',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
            timeAgo: '10m ago'
          },
          {
            id: 402,
            newspaper: 'Economic Herald',
            headline: 'Sensex & Nifty Smash Historic All-Time Highs on Record Festive Consumer Demand',
            summary: 'Benchmark indices closed in green for the seventh straight session, propelled by heavy institutional buying in banking, automotive, and high-frequency retail consumer goods.',
            category: 'Bourses & Indices',
            readTime: '35s read',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
            timeAgo: '28m ago'
          },
          {
            id: 403,
            newspaper: 'Economic Herald',
            headline: 'Central Bank Expands Zero-Fee Cross-Border Instant Payments to 14 Global Hubs',
            summary: 'Cross-border QR and instant UPI remittances officially commenced operations between India, Southeast Asia, and the Gulf, drastically cutting foreign transaction costs for exporters and families.',
            category: 'Fintech & Banking',
            readTime: '45s read',
            image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1h ago'
          },
          {
            id: 404,
            newspaper: 'Economic Herald',
            headline: 'Commercial EV Fleet Adoption Breaches 28% Mark Across Tier-1 Urban Logistics',
            summary: 'E-commerce deliveries and urban taxi operators reported a rapid transition to localized electric vans and two-wheelers, aided by widespread battery swapping stations and lower operating costs.',
            category: 'Auto & Logistics',
            readTime: '30s read',
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2h ago'
          }
        ]
      }
    ]
  },
  ta: {
    code: 'ta',
    label: 'தமிழ்',
    nativeName: 'தமிழ் நாளிதழ்',
    flag: '🇮🇳',
    papers: [
      {
        name: 'தினத்தந்தி (Daily Thanthi)',
        masthead: 'தினத்தந்தி',
        tagline: 'வெல்க தமிழ் • தமிழ்நாட்டின் முதன்மை நாளிதழ்',
        cityEdition: 'சென்னை & மதுரை பதிப்பு • இன்று, 16 அக்டோபர் 2026',
        news: [
          {
            id: 501,
            newspaper: 'தினத்தந்தி',
            headline: 'சென்னையில் புதிய அதிவேக மெட்ரோ ரயில் சேவை இன்று கோலாகலமாக துவக்கம்!',
            summary: 'சென்னையின் முக்கிய தகவல் தொழில்நுட்ப மையங்களை இணைக்கும் புதிய பசுமை மெட்ரோ பாதை இன்று மக்கள் பயன்பாட்டிற்கு திறக்கப்பட்டது. அலுவலக பயண நேரம் 45% குறையும் என பயணிகள் மகிழ்ச்சி தெரிவித்துள்ளனர்.',
            category: 'சென்னை செய்திகள்',
            readTime: '45 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
            timeAgo: '10 நிமிடம் முன்'
          },
          {
            id: 502,
            newspaper: 'தினத்தந்தி',
            headline: 'சென்னை-பெங்களூரு எக்ஸ்பிரஸ் விரைவுச்சாலை பணிகள் நிறைவு: அடுத்த மாதம் திறப்பு!',
            summary: 'இரு பெருநகரங்களுக்கு இடையிலான பயண நேரத்தை வெறும் 3 மணி நேரமாகக் குறைக்கும் அதிநவீன எட்டு வழி விரைவுச்சாலை பணிகள் இறுதிக்கட்டத்தை எட்டியுள்ளன.',
            category: 'உள்கட்டமைப்பு',
            readTime: '35 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80',
            timeAgo: '40 நிமிடம் முன்'
          },
          {
            id: 503,
            newspaper: 'தினத்தந்தி',
            headline: 'அரசுப் பள்ளி மாணவர்களுக்கு புதிய ஸ்மார்ட் வகுப்பறைகள் மற்றும் கணினி ஆய்வகங்கள்',
            summary: 'தமிழகம் முழுவதும் 5,000 அரசுப் பள்ளிகளில் ரோபோட்டிக்ஸ் மற்றும் செயற்கை நுண்ணறிவு பயிற்சிக்கான சிறப்பு ஆய்வகங்களை பள்ளிக்கல்வித்துறை இன்று தொடங்கி வைத்தது.',
            category: 'கல்வி உலகம்',
            readTime: '30 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 மணி முன்'
          },
          {
            id: 504,
            newspaper: 'தினத்தந்தி',
            headline: '48-வது சர்வதேச சென்னை புத்தகத் திருவிழா தேதிகள் அதிகாரப்பூர்வமாக அறிவிப்பு!',
            summary: 'நந்தனம் ஒய்.எம்.சி.ஏ மைதானத்தில் 1,000-க்கும் மேற்பட்ட அரங்கங்களுடன் புத்தகத் திருவிழா ஜனவரியில் பிரம்மாண்டமாக நடைபெற ஏற்பாடுகள் தொடங்கியுள்ளன.',
            category: 'பண்பாடு & இலக்கியம்',
            readTime: '25 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 மணி முன்'
          }
        ]
      },
      {
        name: 'தினமலர் (Dinamalar)',
        masthead: 'தினமலர்',
        tagline: 'உண்மை மட்டுமே • நடுநிலையான செய்திப் பார்வை',
        cityEdition: 'மதுரை, கோவை & திருச்சி பதிப்பு • இன்று, 16 அக்டோபர் 2026',
        news: [
          {
            id: 601,
            newspaper: 'தினமலர்',
            headline: 'மேட்டூர் அணையில் நீர்வரத்து அதிகரிப்பு: டெல்டா விவசாயிகளுக்கு மகிழ்ச்சி செய்தி!',
            summary: 'காவிரி நீர்ப்பிடிப்பு பகுதிகளில் பெய்த கனமழையால் மேட்டூர் அணைக்கு நீர்வரத்து வினாடிக்கு 35,000 கனஅடியாக உயர்ந்துள்ளது. குறுவை பாசனத்திற்கு போதுமான தண்ணீர் திறக்கப்படும் என அரசு அறிவித்துள்ளது.',
            category: 'விவசாயம் & வளம்',
            readTime: '35 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
            timeAgo: '25 நிமிடம் முன்'
          },
          {
            id: 602,
            newspaper: 'தினமலர்',
            headline: 'கோவை தொழில் முதலீட்டு மாநாடு: ரூ. 15,000 கோடி புதிய ஒப்பந்தங்கள் கையெழுத்து!',
            summary: 'வாகன உதிரிபாகங்கள், எலக்ட்ரானிக்ஸ் மற்றும் ஜவுளித் துறையில் பல்லாயிரக்கணக்கான இளைஞர்களுக்கு வேலைவாய்ப்பை உருவாக்கும் புதிய முதலீடுகள் ஈர்க்கப்பட்டுள்ளன.',
            category: 'வணிகம் & தொழில்',
            readTime: '40 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
            timeAgo: '50 நிமிடம் முன்'
          },
          {
            id: 603,
            newspaper: 'தினமலர்',
            headline: 'தமிழகத்தில் நெல் கொள்முதல் புதிய வரலாற்று சாதனை: விவசாயிகளுக்கு கூடுதல் ஊக்கத்தொகை',
            summary: 'நேரடி நெல் கொள்முதல் நிலையங்கள் மூலம் 40 லட்சம் மெட்ரிக் டன் நெல் கொள்முதல் செய்யப்பட்டு விவசாயிகளின் வங்கிக் கணக்குகளில் உடனடி தொகை வரவு வைக்கப்பட்டுள்ளது.',
            category: 'பொருளாதாரம்',
            readTime: '30 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 மணி முன்'
          },
          {
            id: 604,
            newspaper: 'தினமலர்',
            headline: 'தென்மண்டல பசுமை காற்றாலை மின் உற்பத்தி தன்னிறைவை எட்டியது',
            summary: 'கயத்தாறு மற்றும் ஆரல்வாய்மொழி பகுதிகளில் வீசிய பலத்த காற்றினால் தமிழக மின்கட்டமைப்பிற்கு நாள் ஒன்றுக்கு 4,500 மெகாவாட் தூய மின்சாரம் கிடைத்துள்ளது.',
            category: 'சுற்றுச்சூழல்',
            readTime: '35 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80',
            timeAgo: '3 மணி முன்'
          }
        ]
      },
      {
        name: 'தி இந்து தமிழ் திசை',
        masthead: 'இந்து தமிழ் திசை',
        tagline: 'தலைநிமிர் தமிழா • ஆழமான சிந்தனை மற்றும் பண்பாட்டுப் பார்வை',
        cityEdition: 'தமிழ்நாடு மாநில பதிப்பு • இன்று, 16 அக்டோபர் 2026',
        news: [
          {
            id: 701,
            newspaper: 'தி இந்து தமிழ் திசை',
            headline: 'பாரம்பரிய செட்டிநாடு மண்பானை பிரியாணிக்கு சர்வதேச பாராட்டு விருது!',
            summary: 'மரபு மாறாத மசாலா மணம் மற்றும் செட்டிநாடு சமையல் கலைஞர்களின் கைவண்ணத்தில் உருவான தம்பிரியாணி உலக உணவு கவுன்சிலால் சிறந்த பாரம்பரிய உணவாக அங்கீகரிக்கப்பட்டுள்ளது.',
            category: 'உணவு & பண்பாடு',
            readTime: '30 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            timeAgo: '20 நிமிடம் முன்'
          },
          {
            id: 702,
            newspaper: 'தி இந்து தமிழ் திசை',
            headline: 'கீழடி தொல்லியல் அருங்காட்சியகத்திற்கு உலகளாவிய யுனெஸ்கோ பாரம்பரிய சான்றிதழ்',
            summary: 'வைகை நதிக்கரை நாகரிகத்தின் 2600 ஆண்டுகள் பழமையான தமிழ் பிராமி எழுத்துக்கள் மற்றும் நகர்ப்புற கட்டமைப்பு ஆவணங்களை உலக அறிஞர்கள் வியப்புடன் பாராட்டியுள்ளனர்.',
            category: 'வரலாறு & தொல்லியல்',
            readTime: '45 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
            timeAgo: '45 நிமிடம் முன்'
          },
          {
            id: 703,
            newspaper: 'தி இந்து தமிழ் திசை',
            headline: 'பிச்சாவரம் சதுப்புநிலக் காடுகளைப் பாதுகாக்க சர்வதேச பசுமை நிதி ஒதுக்கீடு',
            summary: 'கடற்கரை அரிப்பைத் தடுத்து பல்லுயிர் பெருக்கத்தைப் பாதுகாக்கும் சதுப்புநில அலையாத்திக் காடுகளை மேலும் 2,000 ஹெக்டேர் பரப்பளவில் விரிவாக்க திட்டம் வகுக்கப்பட்டுள்ளது.',
            category: 'சுற்றுச்சூழல் விழிப்புணர்வு',
            readTime: '35 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 மணி முன்'
          },
          {
            id: 704,
            newspaper: 'தி இந்து தமிழ் திசை',
            headline: 'சர்வதேச திரைப்பட விழாவில் மூன்று தமிழ் சுதந்திர திரைப்படங்களுக்கு தங்க விருது!',
            summary: 'எளிய மனிதர்களின் வாழ்வியலைப் பேசும் உணர்வுப்பூர்வமான கதையம்சமும், தொழில்நுட்ப நேர்த்தியும் உலக நடுவர்களை வெகுவாகக் கவர்ந்துள்ளது.',
            category: 'திரைக்கலை',
            readTime: '30 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 மணி முன்'
          }
        ]
      },
      {
        name: 'தினகரன்',
        masthead: 'தினகரன்',
        tagline: 'விடியலை நோக்கி • மக்களின் உரிமைக்குரல்',
        cityEdition: 'அனைத்து மாவட்ட பதிப்பு • இன்று, 16 அக்டோபர் 2026',
        news: [
          {
            id: 801,
            newspaper: 'தினகரன்',
            headline: 'டி20 கிரிக்கெட் போட்டி: இந்திய அணி அசுர வேக பேட்டிங்குடன் களம் இறங்குகிறது!',
            summary: 'இன்றைய முக்கிய ஆட்டத்தில் அதிரடி இளைஞர் படையுடன் இந்திய அணி களமிறங்குகிறது. சுழற்பந்து வீச்சாளர்களின் புதிய வியூகம் ஆட்டத்தை தீர்மானிக்கும் என பயிற்சியாளர் நம்பிக்கை தெரிவித்துள்ளார்.',
            category: 'விளையாட்டு',
            readTime: '40 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
            timeAgo: '15 நிமிடம் முன்'
          },
          {
            id: 802,
            newspaper: 'தினகரன்',
            headline: 'பெண்களுக்கான கட்டணமில்லா பேருந்து பயணம்: புதிய 1,500 நவீன பேருந்துகள் இணைப்பு!',
            summary: 'நகரப்புற மற்றும் கிராமப்புற பகுதிகளில் பெண்களின் பாதுகாப்பான பயணத்தை உறுதிசெய்ய சிசிடிவி வசதியுடன் கூடிய புதிய தாழ்தள பேருந்துகள் பயன்பாட்டுக்கு வந்தன.',
            category: 'மக்கள் நலம்',
            readTime: '35 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
            timeAgo: '35 நிமிடம் முன்'
          },
          {
            id: 803,
            newspaper: 'தினகரன்',
            headline: 'தீபாவளி பண்டிகை சிறப்பு ரயில்கள் மற்றும் பேருந்துகள் முன்பதிவு விறுவிறுப்பு!',
            summary: 'சொந்த ஊர்களுக்கு செல்லும் பயணிகளின் வசதிக்காக 16,000 சிறப்பு பேருந்துகள் இயக்கப்படுகின்றன. கூடுதல் பெட்டிகளுடன் சிறப்பு ரயில்களும் இயக்கப்படுகின்றன.',
            category: 'பயணிகள் தகவல்',
            readTime: '30 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 மணி முன்'
          },
          {
            id: 804,
            newspaper: 'தினகரன்',
            headline: 'கிராமப்புற இளைஞர்களுக்கு இலவச திறன் மேம்பாட்டுப் பயிற்சி முகாம்கள்',
            summary: 'முன்னணி ஐடி மற்றும் உற்பத்தி நிறுவனங்களுடன் இணைந்து நவீன தொழில்நுட்பங்களில் இலவச சான்றிதழ் பயிற்சி வழங்கி உடனடி வேலைவாய்ப்பு அளிக்கப்படுகிறது.',
            category: 'இளைஞர் நலம்',
            readTime: '30 வினாடி வாசிப்பு',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 மணி முன்'
          }
        ]
      }
    ]
  },
  hi: {
    code: 'hi',
    label: 'हिन्दी',
    nativeName: 'दैनिक समाचार',
    flag: '🇮🇳',
    papers: [
      {
        name: 'दैनिक जागरण (Dainik Jagran)',
        masthead: 'दैनिक जागरण',
        tagline: 'दुनियां का सबसे ज्यादा पढ़ा जाने वाला दैनिक समाचार पत्र',
        cityEdition: 'राष्ट्रीय राजधानी एवं मेट्रो संस्करण • आज, 16 अक्टूबर 2026',
        news: [
          {
            id: 901,
            newspaper: 'दैनिक जागरण',
            headline: 'देश के पहले स्वदेशी हाई-स्पीड इलेक्ट्रिक कॉरिडोर का भव्य शुभारंभ',
            summary: 'मेट्रो और एक्सप्रेस-वे को जोड़ने वाले नए हाई-स्पीड कॉरिडोर से अब सफर में 50% समय की बचत होगी। प्रदूषण मुक्त आवागमन से शहरवासियों को बड़ी राहत मिली है।',
            category: 'विकास एवं राष्ट्रीय',
            readTime: '45 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
            timeAgo: '12 मिनट पहले'
          },
          {
            id: 902,
            newspaper: 'दैनिक जागरण',
            headline: 'इसरो का नया मौसम एवं समुद्र निगरानी उपग्रह सफलतापूर्वक कक्षा में स्थापित',
            summary: 'सतीश धवन अंतरिक्ष केंद्र से प्रक्षेपित अत्याधुनिक उपग्रह से किसानों और तटीय मछुआरों को मौसम की सटीक और त्वरित जानकारी 48 घंटे पहले प्राप्त हो सकेगी।',
            category: 'अंतरिक्ष एवं विज्ञान',
            readTime: '40 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
            timeAgo: '35 मिनट पहले'
          },
          {
            id: 903,
            newspaper: 'दैनिक जागरण',
            headline: 'पीएम गति-शक्ति परियोजना: उत्तर भारत के प्रमुख एक्सप्रेसवे पर लॉजिस्टिक्स पार्क तैयार',
            summary: 'दिल्ली-मुंबई एवं पूर्वांचल एक्सप्रेसवे के किनारे नए मल्टीमॉडल फ्रेट टर्मिनल चालू होने से माल ढुलाई लागत में 20% तक की भारी कमी दर्ज की गई है।',
            category: 'उद्योग व व्यापार',
            readTime: '35 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 घंटा पहले'
          },
          {
            id: 904,
            newspaper: 'दैनिक जागरण',
            headline: 'हर खेत को सोलर पंप: 1 लाख नए किसानों को मिली सौर ऊर्जा सब्सिडी',
            summary: 'कुसुम योजना के तहत सोलर ट्यूबवेल स्थापित करने से किसानों का डीजल पर निर्भरता शून्य हो गई है, जिससे प्रति माह हजारों रुपयों की शुद्ध बचत हो रही है।',
            category: 'कृषि व ग्रामीण',
            readTime: '30 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 घंटे पहले'
          }
        ]
      },
      {
        name: 'नवभारत टाइम्स (NBT)',
        masthead: 'नवभारत टाइम्स',
        tagline: 'हमसे है आपका सवेरा • दिल्ली-एनसीआर एवं देश की धड़कन',
        cityEdition: 'दिल्ली, नोएडा व गुरुग्राम संस्करण • आज, 16 अक्टूबर 2026',
        news: [
          {
            id: 1001,
            newspaper: 'नवभारत टाइम्स',
            headline: 'भारतीय अवधी एवं तंदूरी व्यंजनों को वैश्विक धरोहर सूची में मिला स्थान',
            summary: 'धीमी आंच पर पकने वाली दम बिरयानी और पुरानी दिल्ली के शाही मसालों की खुशबू ने अंतरराष्ट्रीय फूड फेडरेशन को मंत्रमुग्ध कर दिया है। इसे विश्व विरासत पाक-कला घोषित किया गया।',
            category: 'खान-पान एवं संस्कृति',
            readTime: '30 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            timeAgo: '15 मिनट पहले'
          },
          {
            id: 1002,
            newspaper: 'नवभारत टाइम्स',
            headline: 'दिल्ली-एनसीआर में 1,000 नई वातानुकूलित इलेक्ट्रिक बसें सड़कों पर उतरीं',
            summary: 'यात्रियों की सुविधा और प्रदूषण निवारण हेतु दिल्ली सरकार ने अत्याधुनिक लो-फ्लोर इलेक्ट्रिक बेड़ा समर्पित किया। महिलाओं और बुजुर्गों को सुगम यात्रा का लाभ।',
            category: 'राजधानी एक्सप्रेस',
            readTime: '35 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
            timeAgo: '40 मिनट पहले'
          },
          {
            id: 1003,
            newspaper: 'नवभारत टाइम्स',
            headline: 'त्योहारी सीजन में बाजारों में भारी भीड़, रिकॉर्ड 50,000 करोड़ का व्यापार दर्ज',
            summary: 'चांदनी चौक, करोल बाग और कनॉट प्लेस के बाजारों में ग्राहकों का तांता लगा है। ज्वैलरी, ऑटोमोबाइल और इलेक्ट्रॉनिक्स में जबरदस्त उछाल देखने को मिला है।',
            category: 'मार्केट लाइव',
            readTime: '40 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 घंटा पहले'
          },
          {
            id: 1004,
            newspaper: 'नवभारत टाइम्स',
            headline: 'दिल्ली के प्रमुख स्मारकों पर भव्य लेज़र शो और सांस्कृतिक संध्या का आयोजन',
            summary: 'लाल किला और कुतुब परिसर में अत्याधुनिक 3D मैपिंग लाइट शो शुरू हुआ, जिसमें भारत के समृद्ध इतिहास और स्वतंत्रता संग्राम की शौर्य गाथा दिखाई गई।',
            category: 'कला एवं पर्यटन',
            readTime: '25 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 घंटे पहले'
          }
        ]
      },
      {
        name: 'अमर उजाला',
        masthead: 'अमर उजाला',
        tagline: 'जोश सच का • उत्तर भारत का सर्वाधिक विश्वसनीय समाचार पत्र',
        cityEdition: 'उत्तर प्रदेश, उत्तराखंड व पंजाब संस्करण • आज, 16 अक्टूबर 2026',
        news: [
          {
            id: 1101,
            newspaper: 'अमर उजाला',
            headline: 'त्योहारी सीजन में अर्थव्यवस्था ने पकड़ी तेज रफ्तार, रिकॉर्ड जीएसटी संग्रह',
            summary: 'बाजारों में ग्राहकों की भारी भीड़ से व्यापार जगत में उत्साह है। ऑटोमोबाइल और खुदरा बिक्री में पिछले वर्ष की तुलना में 25% का जोरदार उछाल दर्ज हुआ है।',
            category: 'व्यापार एवं अर्थ',
            readTime: '40 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
            timeAgo: '22 मिनट पहले'
          },
          {
            id: 1102,
            newspaper: 'अमर उजाला',
            headline: 'चारधाम ऑल-वेदर रोड का अंतिम चरण पूरा: यात्रा अब और भी सुरक्षित एवं तेज',
            summary: 'पहाड़ी क्षेत्रों में नई टनल और सुरक्षा बैरियर बनने से भूस्खलन का खतरा समाप्त हो गया है। श्रद्धालुओं ने यात्रा समय में 4 घंटे की कमी पर खुशी जताई।',
            category: 'उत्तराखंड विकास',
            readTime: '35 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
            timeAgo: '50 मिनट पहले'
          },
          {
            id: 1103,
            newspaper: 'अमर उजाला',
            headline: 'हिमालयी जड़ी-बूटियों से निर्मित प्राकृतिक औषधियों का निर्यात 30% बढ़ा',
            summary: 'आयुष उत्पादों की वैश्विक मांग में भारी वृद्धि हुई है। अमेरिका, यूरोप और खाड़ी देशों में भारतीय हर्बल टी और च्यवनप्राश की भारी मांग बनी हुई है।',
            category: 'स्वास्थ्य व आयुर्वेद',
            readTime: '30 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 घंटा पहले'
          },
          {
            id: 1104,
            newspaper: 'अमर उजाला',
            headline: 'ग्रामीण खेल महाकुंभ में युवाओं ने तोड़े कई राष्ट्रीय एथलेटिक्स रिकॉर्ड',
            summary: 'दौड़, कुश्ती और तीरंदाजी में गांव के होनहार खिलाड़ियों ने बेहतरीन प्रदर्शन कर राष्ट्रीय प्रशिक्षण शिविर में अपनी जगह पक्की की।',
            category: 'खेल प्रतिभा',
            readTime: '35 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 घंटे पहले'
          }
        ]
      },
      {
        name: 'हिन्दुस्तान',
        masthead: 'हिन्दुस्तान',
        tagline: 'भरोसा नए हिन्दुस्तान का • निष्पक्ष और निर्भीक पत्रकारिता',
        cityEdition: 'राष्ट्रीय हिन्दी मुख्य संस्करण • आज, 16 अक्टूबर 2026',
        news: [
          {
            id: 1201,
            newspaper: 'हिन्दुस्तान',
            headline: 'क्रिकेट महामुकाबले के लिए भारतीय टीम तैयार, मैदान पर मचेगा रोमांच!',
            summary: 'कप्तान ने प्रेस कॉन्फ्रेंस में बताया कि टीम का ध्यान आक्रामक शुरुआत और सटीक यॉर्कर गेंदबाजी पर है। करोड़ों प्रशंसकों की निगाहें आज के मैच पर टिकी हैं।',
            category: 'खेल जगत',
            readTime: '35 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
            timeAgo: '18 मिनट पहले'
          },
          {
            id: 1202,
            newspaper: 'हिन्दुस्तान',
            headline: 'आईआईटी एवं प्रमुख विश्वविद्यालयों में नए एआई रिसर्च सेंटर्स का उद्घाटन',
            summary: 'देश के 20 शीर्ष संस्थानों में सुपरकंप्यूटिंग हब स्थापित किए गए, जिससे स्वास्थ्य, रक्षा और मौसम पूर्वानुमान में स्वदेशी शोध को अभूतपूर्व गति मिलेगी।',
            category: 'शिक्षा एवं शोध',
            readTime: '40 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
            timeAgo: '45 मिनट पहले'
          },
          {
            id: 1203,
            newspaper: 'हिन्दुस्तान',
            headline: 'डिजिटल इंडिया यूपीआई लेनदेन ने तोड़ा पिछला रिकॉर्ड, 18 अरब लेनदेन पार',
            summary: 'छोटे चाय विक्रेताओं से लेकर बड़े शॉपिंग मॉल तक डिजिटल लेन-देन आम हो गया है। कैशलेस अर्थव्यवस्था से वित्तीय पारदर्शिता में ऐतिहासिक सुधार हुआ है।',
            category: 'डिजिटल भारत',
            readTime: '30 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 घंटा पहले'
          },
          {
            id: 1204,
            newspaper: 'हिन्दुस्तान',
            headline: 'मुद्रा योजना: महिला उद्यमियों को मिले 5 लाख तक के ब्याज-मुक्त ऋण',
            summary: 'स्वयं सहायता समूहों और कुटीर उद्योगों से जुड़ी महिलाओं को सशक्त बनाने हेतु बैंकों ने विशेष ऋण मेले आयोजित कर त्वरित मंजूरी प्रदान की।',
            category: 'महिला सशक्तिकरण',
            readTime: '30 सेकेंड पढ़ें',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 घंटे पहले'
          }
        ]
      }
    ]
  },
  te: {
    code: 'te',
    label: 'తెలుగు',
    nativeName: 'ఈనాడు దినపత్రిక',
    flag: '🇮🇳',
    papers: [
      {
        name: 'ఈనాడు (Eenadu)',
        masthead: 'ఈనాడు',
        tagline: 'ప్రజల పక్షం • తెలుగువారి నిత్య చైతన్యం',
        cityEdition: 'హైదరాబాద్ & తెలంగాణ ఎడిషన్ • ఈరోజు, 16 అక్టోబర్ 2026',
        news: [
          {
            id: 1301,
            newspaper: 'ఈనాడు',
            headline: 'నగరంలో కొత్త ఎక్స్‌ప్రెస్ మెట్రో కారిడార్ ప్రారంభం: ప్రయాణికుల హర్షం!',
            summary: 'ఐటీ కారిడార్‌ను పాత నగరంతో అనుసంధానించే నూతన మెట్రో లైన్ నేటి నుంచి అందుబాటులోకి వచ్చింది. ట్రాఫిక్ సమస్యలకు శాశ్వత పరిష్కారం లభించిందని ప్రయాణికులు సంతోషం వ్యక్తం చేశారు.',
            category: 'రాష్ట్ర వార్తలు',
            readTime: '40 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
            timeAgo: '15 నిమిషాల క్రితం'
          },
          {
            id: 1302,
            newspaper: 'ఈనాడు',
            headline: 'ఐటీ ఎగుమతుల్లో నూతన శిఖరాలకు చేరుకున్న హైదరాబాద్: ₹2.5 లక్షల కోట్ల మైలురాయి',
            summary: 'గ్లోబల్ కేపబిలిటీ సెంటర్లు, కృత్రిమ మేధ మరియు సెమీకండక్టర్ కంపెనీల విస్తరణతో లక్షలాది మంది యువతీ యువకులకు కొత్త ఉద్యోగావకాశాలు లభించాయి.',
            category: 'ఐటీ & వాణిజ్యం',
            readTime: '45 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
            timeAgo: '40 నిమిషాల క్రితం'
          },
          {
            id: 1303,
            newspaper: 'ఈనాడు',
            headline: 'వరి సాగులో ఆధునిక డ్రోన్ టెక్నాలజీ: రైతులకు తగ్గిన ఎరువుల ఖర్చు',
            summary: 'వ్యవసాయ శాఖ ఆధ్వర్యంలో డ్రోన్ల ద్వారా పురుగుమందులు మరియు నానో యూరియా పిచికారీ విజయవంతం కావడంతో ఎకరాకు ₹3,000 ఆదా అవుతోంది.',
            category: 'వ్యవసాయం',
            readTime: '35 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 గంట క్రితం'
          },
          {
            id: 1304,
            newspaper: 'ఈనాడు',
            headline: 'హైదరాబాద్ అంతర్జాతీయ పుస్తక ప్రదర్శన తేదీలు ఖరారు',
            summary: 'ఎన్టీఆర్ స్టేడియంలో డిసెంబర్ నెలలో 300కు పైగా ప్రచురణ సంస్థలతో తెలుగు మరియు ఆంగ్ల పుస్తకాల జాతర నిర్వహించేందుకు ఏర్పాట్లు ప్రారంభమయ్యాయి.',
            category: 'సాహిత్యం & సంస్కృతి',
            readTime: '30 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 గంటల క్రితం'
          }
        ]
      },
      {
        name: 'సాక్షి (Sakshi)',
        masthead: 'సాక్షి',
        tagline: 'సత్యమేవ జయతే • నిక్కచ్చిగా నిజాలు మరియు ప్రజా గళం',
        cityEdition: 'ఆంధ్రప్రదేశ్ & రాయలసీమ ఎడిషన్ • ఈరోజు, 16 అక్టోబర్ 2026',
        news: [
          {
            id: 1401,
            newspaper: 'సాక్షి',
            headline: 'హైదరాబాదీ దమ్ బిర్యానీకి అంతర్జాతీయ స్థాయి గుర్తింపు మరియు పురస్కారం!',
            summary: 'నిజామీ దమ్ పద్ధతిలో తయారుచేసే సుగంధ ద్రవ్యాల దమ్ బిర్యానీ ప్రపంచ ఫుడ్ ఫెస్టివల్‌లో అత్యుత్తమ రుచి పురస్కారాన్ని దక్కించుకుంది. అంతర్జాతీయ షెఫ్‌లు ప్రశంసల జల్లు కురిపించారు.',
            category: 'రుచులు & జీవనశైలి',
            readTime: '30 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            timeAgo: '20 నిమిషాల క్రితం'
          },
          {
            id: 1402,
            newspaper: 'సాక్షి',
            headline: 'పోలవరం ప్రాజెక్టు డయాఫ్రమ్ వాల్ నిర్మాణం శరవేగంగా పూర్తి',
            summary: 'నిర్దేశిత గడువు కంటే ముందే ప్రధాన డ్యామ్ పనులు వేగం పుంజుకున్నాయి. గోదావరి వరద జలాలను సమర్థవంతంగా నిల్వ చేసేందుకు అధికారులు పటిష్ట చర్యలు చేపట్టారు.',
            category: 'సాగునీటి ప్రాజెక్టులు',
            readTime: '40 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
            timeAgo: '45 నిమిషాల క్రితం'
          },
          {
            id: 1403,
            newspaper: 'సాక్షి',
            headline: 'తీరప్రాంత పారిశ్రామిక కారిడార్‌లో 10 కొత్త గ్రీన్ ఎనర్జీ ప్రాజెక్టులు',
            summary: 'సౌర, పవన విద్యుత్ మరియు గ్రీన్ హైడ్రోజన్ రంగాలలో భారీ అంతర్జాతీయ సంస్థలు పెట్టుబడులు పెట్టేందుకు ప్రభుత్వం అనుమతులు జారీ చేసింది.',
            category: 'పరిశ్రమలు & అభివృద్ధి',
            readTime: '35 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 గంట క్రితం'
          },
          {
            id: 1404,
            newspaper: 'సాక్షి',
            headline: 'ప్రభుత్వ పాఠశాలల విద్యార్థులకు అంతర్జాతీయ ఒలింపియాడ్లలో స్వర్ణ పతకాలు',
            summary: 'గణితం మరియు సైన్స్ విభాగాలలో గ్రామీణ ప్రాంత విద్యార్థులు అద్భుత ప్రతిభ కనబరిచి రాష్ట్ర కీర్తిని దశదిశలా చాటిచెప్పారు.',
            category: 'విద్యా రంగం',
            readTime: '30 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 గంటల క్రితం'
          }
        ]
      },
      {
        name: 'ఆంధ్రజ్యోతి (Andhra Jyothy)',
        masthead: 'ఆంధ్రజ్యోతి',
        tagline: 'నిరంతర ప్రజా చైతన్యం • నిర్భయ జర్నలిజం',
        cityEdition: 'విశాఖ & అమరావతి ఎడిషన్ • ఈరోజు, 16 అక్టోబర్ 2026',
        news: [
          {
            id: 1501,
            newspaper: 'ఆంధ్రజ్యోతి',
            headline: 'గోదావరి జలాలతో నిండిన ప్రాజెక్టులు: రైతుల్లో చిగురించిన ఆశలు!',
            summary: 'ఎగువ ప్రాంతాల్లో కురుస్తున్న వర్షాలతో సాగునీటి ప్రాజెక్టులకు భారీగా వరద నీరు చేరుతోంది. యాసంగి పంటలకు ఎలాంటి ఢోకా లేదని అధికారులు తెలిపారు.',
            category: 'వ్యవసాయ రంగం',
            readTime: '35 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
            timeAgo: '25 నిమిషాల క్రితం'
          },
          {
            id: 1502,
            newspaper: 'ఆంధ్రజ్యోతి',
            headline: 'అమరావతి రాజధాని నగర పనులకు నూతన ఊపు: వరల్డ్ బ్యాంక్ నిధులు విడుదల',
            summary: 'ఐకానిక్ భవనాలు, ట్రంక్ రోడ్లు మరియు వరద నియంత్రణ కాలువల పనులను వేగవంతం చేసేందుకు అవసరమైన బడ్జెట్ కేటాయింపులు పూర్తయ్యాయి.',
            category: 'రాజధాని ప్రత్యేక కథనం',
            readTime: '40 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80',
            timeAgo: '50 నిమిషాల క్రితం'
          },
          {
            id: 1503,
            newspaper: 'ఆంధ్రజ్యోతి',
            headline: 'విశాఖ పోర్టులో రికార్డు స్థాయిలో సరుకు రవాణా: దేశంలోనే రెండో స్థానం',
            summary: 'కంటైనర్ టెర్మినల్ విస్తరణ మరియు ఆటోమేటెడ్ క్రేన్ల సహాయంతో నౌకల టర్న్‌అరౌండ్ సమయం భారీగా తగ్గి వ్యాపార లావాదేవీలు పెరిగాయి.',
            category: 'పోర్టులు & వాణిజ్యం',
            readTime: '35 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 గంట క్రితం'
          },
          {
            id: 1504,
            newspaper: 'ఆంధ్రజ్యోతి',
            headline: 'తిరుమల శ్రీవారి దర్శనార్థం భక్తుల రద్దీ: సర్వదర్శనానికి 12 గంటల సమయం',
            summary: 'వారాంతం మరియు సెలవుల నేపథ్యంలో భక్తుల సౌకర్యార్థం టీటీడీ విస్తృత ఏర్పాట్లు చేసింది. నిరంతర అన్నప్రసాద వితరణ కొనసాగుతోంది.',
            category: 'ఆధ్యాత్మికం',
            readTime: '30 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 గంటల క్రితం'
          }
        ]
      },
      {
        name: 'నమస్తే తెలంగాణ',
        masthead: 'నమస్తే తెలంగాణ',
        tagline: 'తెలంగాణ గుండె చప్పుడు • ప్రగతి పథంలో నవ తెలంగాణ',
        cityEdition: 'గ్రేటర్ హైదరాబాద్ & జిల్లా ఎడిషన్ • ఈరోజు, 16 అక్టోబర్ 2026',
        news: [
          {
            id: 1601,
            newspaper: 'నమస్తే తెలంగాణ',
            headline: 'టీ20 సమరం: యువ ఆటగాళ్లతో దూకుడుగా బరిలోకి దిగుతున్న భారత జట్టు!',
            summary: 'నేటి రాత్రి జరిగే హై-వోల్టేజ్ పోరులో గెలుపే లక్ష్యంగా భారత ఆటగాళ్లు ప్రాక్టీస్ పూర్తి చేసుకున్నారు. స్టేడియంలో పండుగ వాతావరణం నెలకొంది.',
            category: 'క్రీడాలోకం',
            readTime: '40 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
            timeAgo: '15 నిమిషాల క్రితం'
          },
          {
            id: 1602,
            newspaper: 'నమస్తే తెలంగాణ',
            headline: 'టీ-హబ్ వేదికగా సరికొత్త డీప్‌టెక్ మరియు హెల్త్‌కేర్ ఆవిష్కరణల ప్రదర్శన',
            summary: 'హైదరాబాద్ స్టార్టప్‌లు రూపొందించిన తక్కువ ఖర్చుతో కూడిన రోగనిర్ధారణ పరికరాలను అంతర్జాతీయ సంస్థలు కొనుగోలు చేసేందుకు ఒప్పందాలు చేసుకున్నాయి.',
            category: 'ఆవిష్కరణలు',
            readTime: '35 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
            timeAgo: '45 నిమిషాల క్రితం'
          },
          {
            id: 1603,
            newspaper: 'నమస్తే తెలంగాణ',
            headline: 'కాళేశ్వరం ప్రాజెక్టు రిజర్వాయర్ల నుంచి ఆయకట్టుకు తాగు, సాగునీటి విడుదల',
            summary: 'రైతుల విజ్ఞప్తి మేరకు చెరువులు, కుంటలను నింపేందుకు కాల్వల ద్వారా నీటిని విడుదల చేశారు. భూగర్భ జలాలు గణనీయంగా పెరిగాయి.',
            category: 'నీటి వనరులు',
            readTime: '35 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 గంట క్రితం'
          },
          {
            id: 1604,
            newspaper: 'నమస్తే తెలంగాణ',
            headline: 'వరంగల్‌లో కాళోజీ కళాక్షేత్రం ఘనంగా ప్రారంభం: తెలంగాణ సాంస్కృతిక వైభవం',
            summary: 'కవులు, కళాకారుల సమ్మేళనంతో నూతన ఆడిటోరియం ప్రారంభమైంది. జానపద కళారూపాలు, నాటకాలు మరియు సంగీత విభావరి ప్రేక్షకులను అలరించాయి.',
            category: 'సంస్కృతి & కళలు',
            readTime: '30 సెకన్ల చదువు',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 గంటల క్రితం'
          }
        ]
      }
    ]
  }
};

const MultilingualTodayNewspaper: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<NewsLanguage>('en');
  const [selectedPaperIdx, setSelectedPaperIdx] = useState(0);
  const [activeShortIdx, setActiveShortIdx] = useState(0);
  const [viewFormat, setViewFormat] = useState<'shorts' | 'epaper'>('shorts');

  const currentConfig = MULTILINGUAL_NEWS_DATA[selectedLang];
  const activePaper = currentConfig.papers[selectedPaperIdx] || currentConfig.papers[0];
  const newsList = activePaper.news;
  const currentShort = newsList[activeShortIdx] || newsList[0];

  const handleNextShort = () => {
    setActiveShortIdx((prev) => (prev + 1) % newsList.length);
  };

  const handlePrevShort = () => {
    setActiveShortIdx((prev) => (prev - 1 + newsList.length) % newsList.length);
  };

  return (
    <div className="space-y-4">
      
      {/* 1. LANGUAGE SELECTOR BAR */}
      <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Choose Newspaper Language:
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 w-full sm:w-auto">
          {(['en', 'ta', 'hi', 'te'] as NewsLanguage[]).map((langKey) => {
            const config = MULTILINGUAL_NEWS_DATA[langKey];
            const isSelected = selectedLang === langKey;
            return (
              <button
                key={langKey}
                onClick={() => {
                  setSelectedLang(langKey);
                  setSelectedPaperIdx(0);
                  setActiveShortIdx(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-102 font-display'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{config.flag}</span>
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. AUTHENTIC NEWSPAPER FRONT-PAGE MASTHEAD */}
      <div className="p-4 rounded-3xl bg-amber-50/80 dark:bg-slate-900/90 border-2 border-amber-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-sm space-y-2 font-serif">
        <div className="flex flex-col sm:flex-row items-center justify-between pb-2 border-b-2 border-slate-800 dark:border-slate-700 gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-sans font-bold">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Today, October 16, 2026</span>
            <span>• Vol. LXIV No. 288</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-sans font-black flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              LIVE BREAKING NEWS
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 font-sans font-semibold">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>28°C Clear</span>
            </div>
          </div>
        </div>

        {/* Dynamic Masthead for the Selected Paper */}
        <div className="text-center py-2">
          <div className="inline-block px-3 py-0.5 mb-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-[11px] font-sans font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase">
            {activePaper.name}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-amber-400 font-serif uppercase transition-all">
            {activePaper.masthead}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-sans font-medium mt-1">
            {activePaper.tagline} • <span className="font-bold text-amber-700 dark:text-amber-400">{activePaper.cityEdition}</span>
          </p>
        </div>

        {/* Publication Selector Tabs in this Language */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider text-center mb-1.5">
            Select Newspaper Edition:
          </div>
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar font-sans py-1">
            {currentConfig.papers.map((paper, pIdx) => {
              const isSelected = selectedPaperIdx === pIdx;
              return (
                <button
                  key={paper.name}
                  onClick={() => {
                    setSelectedPaperIdx(pIdx);
                    setActiveShortIdx(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 shadow-xs ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 scale-105 font-black'
                      : 'bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-sm">📰</span>
                  <span>{paper.name}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 ml-0.5 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. FORMAT TOGGLE (Digital Shorts vs Classic e-Paper) */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>{activePaper.name} Live Stories ({newsList.length} Articles)</span>
        </span>

        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewFormat('shorts')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              viewFormat === 'shorts' ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-xs' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Shorts Cards</span>
          </button>
          <button
            onClick={() => setViewFormat('epaper')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              viewFormat === 'epaper' ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-xs' : 'text-slate-500'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Full e-Paper</span>
          </button>
        </div>
      </div>

      {/* 4. CONTENT DISPLAY */}
      {viewFormat === 'shorts' ? (
        /* SHORTS CARD FORMAT (Inshorts Style) */
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl relative overflow-hidden animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                {currentShort.category}
              </span>
              <span className="font-bold text-amber-300">• {currentShort.newspaper}</span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {activeShortIdx + 1} of {newsList.length} Shorts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 relative h-44 sm:h-48 rounded-2xl overflow-hidden shadow-lg border border-slate-700">
              <img 
                src={currentShort.image} 
                alt={currentShort.headline}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-xs text-[10px] font-bold text-white">
                {currentShort.readTime}
              </span>
            </div>

            <div className="md:col-span-7 flex flex-col justify-between space-y-2.5">
              <h4 className="font-black text-base sm:text-lg leading-snug font-display text-white">
                {currentShort.headline}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentShort.summary}
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span>⏱️ {currentShort.timeAgo}</span>
                <span className="text-amber-400 font-bold cursor-pointer hover:underline">
                  Full Story Coverage →
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-slate-800">
            <button
              onClick={handlePrevShort}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Story</span>
            </button>

            <div className="flex items-center gap-1.5">
              {newsList.map((_, i) => (
                <span 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeShortIdx ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextShort}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <span>Next Story</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* FULL E-PAPER MULTI-COLUMN LAYOUT */
        <div className="p-4 sm:p-6 rounded-3xl bg-amber-50 dark:bg-slate-900 border-2 border-amber-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-5 animate-in fade-in font-serif">
          
          {/* Main Top Headline */}
          <div className="border-b-2 border-slate-300 dark:border-slate-700 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 rounded-sm bg-rose-600 text-white font-sans text-[10px] font-black uppercase tracking-wider">
                Lead Story • {activePaper.name}
              </span>
              <span className="text-xs text-slate-500 font-sans">{activePaper.cityEdition}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black leading-snug mt-1.5 text-slate-950 dark:text-white">
              {newsList[0]?.headline}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed mt-2">
              {newsList[0]?.summary}
            </p>
          </div>

          {/* 3-Column Newspaper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 dark:divide-slate-800 font-sans">
            {newsList.slice(1).map((item) => (
              <div key={item.id} className="pt-3 sm:pt-0 sm:px-3 space-y-1.5 first:pl-0">
                <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                  {item.category}
                </span>
                <h5 className="font-bold text-xs sm:text-sm font-display line-clamp-2 leading-snug">
                  {item.headline}
                </h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {item.timeAgo} • {item.newspaper}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

// ============================================================================
// 5. MUSIC & AMBIENT LOUNGE SECTION
// ============================================================================
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

        {/* Audio progress bar */}
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

// ============================================================================
// MAIN MODAL: TABLE-SIDE ENTERTAINMENT & ENGAGEMENT LOUNGE
// ============================================================================
export const CustomerEntertainmentModal: React.FC<CustomerEntertainmentModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenTracker,
  onFinishMeal,
}) => {
  const [activeTab, setActiveTab] = useState<'games' | 'news' | 'music'>('games');
  const [activeGame, setActiveGame] = useState<'ludo' | 'snakes' | 'sudoku'>('ludo');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[94vh] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
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
                Play original board games & read today's multilingual newspapers while waiting
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
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TIME UP REMINDER ALERT */}
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
                Finish Meal & Feedback →
              </button>
            )}
          </div>
        )}

        {/* Main Tab Switcher */}
        <div className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'games'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Original Games</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Today's Live News</span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeGame === 'ludo' ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-xs font-black' : 'text-slate-500'
                }`}
              >
                Ludo Board
              </button>
              <button
                onClick={() => setActiveGame('snakes')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeGame === 'snakes' ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-xs font-black' : 'text-slate-500'
                }`}
              >
                Snakes & Ladders
              </button>
              <button
                onClick={() => setActiveGame('sudoku')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeGame === 'sudoku' ? 'bg-white dark:bg-slate-900 text-blue-500 shadow-xs font-black' : 'text-slate-500'
                }`}
              >
                9×9 Sudoku
              </button>
            </div>
          )}
        </div>

        {/* Mobile Sub-selector pills for games */}
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
              onClick={() => setActiveGame('snakes')}
              className={`flex-1 py-1 rounded-lg text-xs font-bold text-center ${
                activeGame === 'snakes' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500'
              }`}
            >
              Snakes & Ladders
            </button>
            <button
              onClick={() => setActiveGame('sudoku')}
              className={`flex-1 py-1 rounded-lg text-xs font-bold text-center ${
                activeGame === 'sudoku' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500'
              }`}
            >
              Sudoku
            </button>
          </div>
        )}

        {/* Tab Body Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'games' && (
            <div>
              {activeGame === 'ludo' && <OriginalLudoGame />}
              {activeGame === 'snakes' && <OriginalSnakesAndLadders />}
              {activeGame === 'sudoku' && <OriginalSudokuGame />}
            </div>
          )}

          {activeTab === 'news' && <MultilingualTodayNewspaper />}

          {activeTab === 'music' && <MusicLoungeSection />}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Real-time games & multilingual live news active</span>
            <span className="sm:hidden">Active while waiting</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all cursor-pointer"
            >
              Minimize & Keep Playing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerEntertainmentModal;
