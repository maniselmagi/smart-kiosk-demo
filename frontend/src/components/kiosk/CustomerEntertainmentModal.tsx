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
// 1. AUTHENTIC 15×15 INTERACTIVE LUDO BOARD (With Real Token Movement on Cells)
// ============================================================================
// Main 52 perimeter track coordinates in clockwise order [row, col] (0-indexed, 0..14)
const LUDO_TRACK_COORDS: [number, number][] = [
  [6, 1],  // 0: Red Start ★
  [6, 2],  // 1
  [6, 3],  // 2
  [6, 4],  // 3
  [6, 5],  // 4
  [5, 6],  // 5
  [4, 6],  // 6
  [3, 6],  // 7
  [2, 6],  // 8: Safe Star ★
  [1, 6],  // 9
  [0, 6],  // 10
  [0, 7],  // 11
  [0, 8],  // 12
  [1, 8],  // 13: Green Start ★
  [2, 8],  // 14
  [3, 8],  // 15
  [4, 8],  // 16
  [5, 8],  // 17
  [6, 9],  // 18
  [6, 10], // 19
  [6, 11], // 20
  [6, 12], // 21: Safe Star ★
  [6, 13], // 22
  [6, 14], // 23
  [7, 14], // 24
  [8, 14], // 25
  [8, 13], // 26: Yellow Start ★ (Player Start)
  [8, 12], // 27
  [8, 11], // 28
  [8, 10], // 29
  [8, 9],  // 30
  [9, 8],  // 31
  [10, 8], // 32
  [11, 8], // 33
  [12, 8], // 34: Safe Star ★
  [13, 8], // 35
  [14, 8], // 36
  [14, 7], // 37
  [14, 6], // 38
  [13, 6], // 39: Blue Start ★
  [12, 6], // 40
  [11, 6], // 41
  [10, 6], // 42
  [9, 6],  // 43
  [8, 5],  // 44
  [8, 4],  // 45
  [8, 3],  // 46
  [8, 2],  // 47: Safe Star ★
  [8, 1],  // 48
  [8, 0],  // 49
  [7, 0],  // 50
  [6, 0]   // 51
];

// Safe tiles on 52 track where tokens cannot be captured
const SAFE_CELL_INDICES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

// Yellow Home Runway [row, col] for steps 51..55 (Step 56 is Home Triangle)
const YELLOW_HOME_RUNWAY: [number, number][] = [
  [7, 13], // 51
  [7, 12], // 52
  [7, 11], // 53
  [7, 10], // 54
  [7, 9]   // 55
];

// Red Home Runway [row, col] for steps 51..55
const RED_HOME_RUNWAY: [number, number][] = [
  [7, 1],  // 51
  [7, 2],  // 52
  [7, 3],  // 53
  [7, 4],  // 54
  [7, 5]   // 55
];

const OriginalLudoGame: React.FC = () => {
  // Tokens representation:
  // -1 = In Base Yard
  // 0..50 = On 52-tile circuit track
  // 51..55 = In Home Runway
  // 56 = In Central Home Triangle (Finished!)
  const [playerTokens, setPlayerTokens] = useState<[number, number]>([-1, -1]);
  const [botTokens, setBotTokens] = useState<[number, number]>([-1, -1]);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [turn, setTurn] = useState<'player' | 'bot'>('player');
  const [waitingForMove, setWaitingForMove] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameLog, setGameLog] = useState<string[]>([
    '🎲 Welcome to Royal Ludo! Roll a 6 to deploy your gold coins to the track.'
  ]);

  // Convert player token step to (r, c)
  const getPlayerTokenPos = (step: number): [number, number] | null => {
    if (step === -1) return null;
    if (step >= 0 && step <= 50) {
      const trackIdx = (26 + step) % 52;
      return LUDO_TRACK_COORDS[trackIdx];
    }
    if (step >= 51 && step <= 55) {
      return YELLOW_HOME_RUNWAY[step - 51];
    }
    if (step >= 56) {
      return [7, 8]; // Center Home
    }
    return null;
  };

  // Convert bot token step to (r, c)
  const getBotTokenPos = (step: number): [number, number] | null => {
    if (step === -1) return null;
    if (step >= 0 && step <= 50) {
      return LUDO_TRACK_COORDS[step];
    }
    if (step >= 51 && step <= 55) {
      return RED_HOME_RUNWAY[step - 51];
    }
    if (step >= 56) {
      return [7, 6]; // Center Home
    }
    return null;
  };

  // Can player token move with current dice roll?
  const canPlayerMoveToken = (tokenIdx: 0 | 1): boolean => {
    if (diceRoll === null || turn !== 'player' || !waitingForMove || winner) return false;
    const step = playerTokens[tokenIdx];
    if (step === 56) return false; // Already in Home
    if (step === -1) {
      return diceRoll === 6; // Needs a 6 to deploy
    }
    return step + diceRoll <= 56;
  };

  // Execute Player Move
  const handlePlayerMove = (tokenIdx: 0 | 1) => {
    if (!canPlayerMoveToken(tokenIdx) || diceRoll === null) return;

    setWaitingForMove(false);
    const step = playerTokens[tokenIdx];
    let newStep = step;

    if (step === -1 && diceRoll === 6) {
      newStep = 0; // Deploys to Start Cell (Track Index 26)
      setGameLog((l) => [`🚀 Gold Coin P${tokenIdx + 1} deployed to Start!`, ...l.slice(0, 3)]);
    } else if (step >= 0 && step + diceRoll <= 56) {
      newStep = step + diceRoll;
      if (newStep === 56) {
        setGameLog((l) => [`🏆 Gold Coin P${tokenIdx + 1} reached Home!`, ...l.slice(0, 3)]);
      } else {
        setGameLog((l) => [`👉 Gold Coin P${tokenIdx + 1} advanced to Step ${newStep}.`, ...l.slice(0, 3)]);
      }
    }

    const nextPlayerTokens: [number, number] = tokenIdx === 0 
      ? [newStep, playerTokens[1]] 
      : [playerTokens[0], newStep];

    setPlayerTokens(nextPlayerTokens);

    // Check Capture if on main track
    let captured = false;
    if (newStep >= 0 && newStep <= 50) {
      const myTrackIdx = (26 + newStep) % 52;
      if (!SAFE_CELL_INDICES.has(myTrackIdx)) {
        // Check bot tokens
        setBotTokens((prevBot) => {
          let [b1, b2] = prevBot;
          let hit = false;
          if (b1 >= 0 && b1 <= 50 && b1 === myTrackIdx) {
            b1 = -1;
            hit = true;
            captured = true;
            setGameLog((l) => [`💥 BOOM! You captured Chef Bot's B1 back to base!`, ...l.slice(0, 3)]);
          } else if (b2 >= 0 && b2 <= 50 && b2 === myTrackIdx) {
            b2 = -1;
            hit = true;
            captured = true;
            setGameLog((l) => [`💥 BOOM! You captured Chef Bot's B2 back to base!`, ...l.slice(0, 3)]);
          }
          return [b1, b2];
        });
      }
    }

    // Win check
    if (nextPlayerTokens[0] === 56 && nextPlayerTokens[1] === 56) {
      setWinner('🎉 You conquered Royal Ludo! Champions Trophy Awarded 🏆');
      return;
    }

    // Next turn logic (rolling 6 or capturing grants an extra turn)
    if (diceRoll === 6 || captured) {
      setGameLog((l) => [`⭐ Bonus Turn earned! Roll again!`, ...l.slice(0, 3)]);
      setDiceRoll(null);
    } else {
      setTurn('bot');
      setDiceRoll(null);
      setTimeout(runBotTurn, 900);
    }
  };

  // Roll Dice Handler
  const handleRollDice = () => {
    if (isRolling || winner || turn !== 'player' || waitingForMove) return;
    setIsRolling(true);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(roll);
      setIsRolling(false);

      // Check how many tokens can move
      const can0 = playerTokens[0] === -1 ? roll === 6 : (playerTokens[0] < 56 && playerTokens[0] + roll <= 56);
      const can1 = playerTokens[1] === -1 ? roll === 6 : (playerTokens[1] < 56 && playerTokens[1] + roll <= 56);

      if (!can0 && !can1) {
        setGameLog((l) => [`🎲 Rolled a ${roll}. No moves possible! Turn passing...`, ...l.slice(0, 3)]);
        setTimeout(() => {
          setTurn('bot');
          setDiceRoll(null);
          setTimeout(runBotTurn, 900);
        }, 1100);
      } else {
        setWaitingForMove(true);
        setGameLog((l) => [`🎲 Rolled a ${roll}! Tap a gold coin to move it.`, ...l.slice(0, 3)]);
      }
    }, 450);
  };

  // Chef Bot Turn (Autonomous AI)
  const runBotTurn = () => {
    if (winner) return;
    setIsRolling(true);

    setTimeout(() => {
      const botRoll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(botRoll);
      setIsRolling(false);

      setBotTokens((prev) => {
        let [b1, b2] = prev;
        let chosenIdx: 0 | 1 | null = null;
        let willDeploy = false;

        // Bot move priority:
        // 1. If 6 and someone in base, deploy!
        if (botRoll === 6 && b1 === -1) {
          b1 = 0;
          chosenIdx = 0;
          willDeploy = true;
          setGameLog((l) => [`🤖 Chef Bot rolled a 6 and deployed B1 to track!`, ...l.slice(0, 3)]);
        } else if (botRoll === 6 && b2 === -1) {
          b2 = 0;
          chosenIdx = 1;
          willDeploy = true;
          setGameLog((l) => [`🤖 Chef Bot rolled a 6 and deployed B2 to track!`, ...l.slice(0, 3)]);
        } else {
          // Check who can advance
          const canB1 = b1 >= 0 && b1 + botRoll <= 56;
          const canB2 = b2 >= 0 && b2 + botRoll <= 56;

          if (canB1 && canB2) {
            // Pick the one furthest ahead or closer to home
            if (b1 >= b2) {
              b1 += botRoll;
              chosenIdx = 0;
            } else {
              b2 += botRoll;
              chosenIdx = 1;
            }
          } else if (canB1) {
            b1 += botRoll;
            chosenIdx = 0;
          } else if (canB2) {
            b2 += botRoll;
            chosenIdx = 1;
          }
        }

        if (chosenIdx !== null && !willDeploy) {
          const val = chosenIdx === 0 ? b1 : b2;
          if (val === 56) {
            setGameLog((l) => [`🤖 Chef Bot coin reached Home!`, ...l.slice(0, 3)]);
          } else {
            setGameLog((l) => [`🤖 Chef Bot moved B${chosenIdx! + 1} to step ${val}.`, ...l.slice(0, 3)]);
          }
        } else if (chosenIdx === null) {
          setGameLog((l) => [`🤖 Chef Bot rolled a ${botRoll}. No moves possible.`, ...l.slice(0, 3)]);
        }

        // Check Bot Capture of Player
        let botCaptured = false;
        if (chosenIdx !== null) {
          const botPos = chosenIdx === 0 ? b1 : b2;
          if (botPos >= 0 && botPos <= 50 && !SAFE_CELL_INDICES.has(botPos)) {
            setPlayerTokens((prevPlayer) => {
              let [p1, p2] = prevPlayer;
              const p1Track = p1 >= 0 && p1 <= 50 ? (26 + p1) % 52 : -99;
              const p2Track = p2 >= 0 && p2 <= 50 ? (26 + p2) % 52 : -99;

              if (p1Track === botPos) {
                p1 = -1;
                botCaptured = true;
                setGameLog((l) => [`⚠️ Oh no! Chef Bot captured your Gold P1! Back to base.`, ...l.slice(0, 3)]);
              } else if (p2Track === botPos) {
                p2 = -1;
                botCaptured = true;
                setGameLog((l) => [`⚠️ Oh no! Chef Bot captured your Gold P2! Back to base.`, ...l.slice(0, 3)]);
              }
              return [p1, p2];
            });
          }
        }

        // Win check
        if (b1 === 56 && b2 === 56) {
          setWinner('Chef Bot conquered Home! Better luck next dining round.');
          return [b1, b2];
        }

        // Pass turn or extra turn
        if (botRoll === 6 || botCaptured) {
          setTimeout(runBotTurn, 1000);
        } else {
          setTimeout(() => {
            setTurn('player');
            setDiceRoll(null);
          }, 800);
        }

        return [b1, b2];
      });
    }, 600);
  };

  const resetGame = () => {
    setPlayerTokens([-1, -1]);
    setBotTokens([-1, -1]);
    setDiceRoll(null);
    setWaitingForMove(false);
    setTurn('player');
    setWinner(null);
    setGameLog(['Game reset! Roll a 6 to deploy your gold tokens to the track.']);
  };

  const p1Pos = getPlayerTokenPos(playerTokens[0]);
  const p2Pos = getPlayerTokenPos(playerTokens[1]);
  const b1Pos = getBotTokenPos(botTokens[0]);
  const b2Pos = getBotTokenPos(botTokens[1]);

  return (
    <div className="space-y-3.5 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/60 p-2.5 px-4 rounded-2xl border border-white/5">
        <div>
          <h4 className="font-black text-xs sm:text-sm md:text-base text-white flex items-center gap-2">
            <span>🎲 Royal Ludo Master</span>
            <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold border border-amber-400/30">
              15×15 Board
            </span>
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Roll 6 to leave base. Tap gleaming tokens or use the action buttons to advance!
          </p>
        </div>

        <button
          onClick={resetGame}
          className="p-1.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/10 active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>

      {winner && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-emerald-500/25 to-amber-500/25 border-2 border-amber-400/60 text-center animate-in zoom-in-95 shadow-xl">
          <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-bounce" />
          <span className="font-black text-xs sm:text-sm text-white block">{winner}</span>
        </div>
      )}

      {/* 2-COLUMN BALANCED RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4 items-start">
        
        {/* LEFT COLUMN: PERFECTLY PROPORTIONED 15×15 LUDO BOARD */}
        <div className="sm:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[390px] sm:max-w-[420px] md:max-w-[440px] p-2 sm:p-2.5 rounded-2xl bg-slate-950 border-2 border-amber-500/40 shadow-2xl relative select-none">
            
            <div 
              className="aspect-square w-full rounded-xl bg-slate-900 border border-white/10 p-0.5 sm:p-1 shadow-inner relative overflow-hidden"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(15, minmax(0, 1fr))',
                gap: '1px'
              }}
            >
              {/* 1. TOP-LEFT YARD: RED (Chef Bot) */}
              <div 
                style={{ gridColumn: '1 / span 6', gridRow: '1 / span 6' }}
                className="bg-gradient-to-br from-rose-700 to-rose-900 rounded-lg p-2 flex flex-col justify-between border border-rose-600/50 shadow-inner relative"
              >
                <span className="text-[10px] font-black uppercase text-rose-200 tracking-wider flex items-center gap-1">
                  <span>👨‍🍳 Chef Bot</span>
                </span>

                {/* Inner Yard Circle with 2 token pockets */}
                <div className="bg-slate-950/80 rounded-lg p-2 grid grid-cols-2 gap-2 aspect-square items-center justify-items-center border border-rose-500/30">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border border-dashed border-rose-500/50 flex items-center justify-center relative">
                    {botTokens[0] === -1 ? (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 text-white flex items-center justify-center text-[10px] font-black shadow-md border border-rose-300">
                        B1
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-600 font-bold">B1</span>
                    )}
                  </div>

                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border border-dashed border-rose-500/50 flex items-center justify-center relative">
                    {botTokens[1] === -1 ? (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 text-white flex items-center justify-center text-[10px] font-black shadow-md border border-rose-300">
                        B2
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-600 font-bold">B2</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. TOP-RIGHT YARD: GREEN */}
              <div 
                style={{ gridColumn: '10 / span 6', gridRow: '1 / span 6' }}
                className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-lg p-2 flex flex-col justify-between border border-emerald-600/50 shadow-inner relative"
              >
                <span className="text-[10px] font-black uppercase text-emerald-200 tracking-wider">Green Yard</span>
                <div className="bg-slate-950/80 rounded-lg p-2 grid grid-cols-2 gap-2 aspect-square items-center justify-items-center border border-emerald-500/30">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-[9px] text-emerald-400 font-bold">G1</div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-[9px] text-emerald-400 font-bold">G2</div>
                </div>
              </div>

              {/* 3. BOTTOM-LEFT YARD: BLUE */}
              <div 
                style={{ gridColumn: '1 / span 6', gridRow: '10 / span 6' }}
                className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg p-2 flex flex-col justify-between border border-blue-600/50 shadow-inner relative"
              >
                <span className="text-[10px] font-black uppercase text-blue-200 tracking-wider">Blue Yard</span>
                <div className="bg-slate-950/80 rounded-lg p-2 grid grid-cols-2 gap-2 aspect-square items-center justify-items-center border border-blue-500/30">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-[9px] text-blue-400 font-bold">U1</div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-[9px] text-blue-400 font-bold">U2</div>
                </div>
              </div>

              {/* 4. BOTTOM-RIGHT YARD: YELLOW (PLAYER GOLD COINS) */}
              <div 
                style={{ gridColumn: '10 / span 6', gridRow: '10 / span 6' }}
                className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 rounded-lg p-2 flex flex-col justify-between border-2 border-amber-300 shadow-xl relative"
              >
                <span className="text-[10px] font-black uppercase text-slate-950 tracking-wider flex items-center justify-between">
                  <span>👑 You (Gold)</span>
                  <span className="text-[9px] font-mono bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded-full">Base</span>
                </span>

                {/* Inner Yard with interactive player tokens */}
                <div className="bg-slate-950/90 rounded-lg p-2 grid grid-cols-2 gap-2 aspect-square items-center justify-items-center border border-amber-400/40 shadow-inner">
                  {/* Player Token 1 */}
                  <div 
                    onClick={() => canPlayerMoveToken(0) && handlePlayerMove(0)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border border-dashed border-amber-400/50 flex items-center justify-center relative transition-all ${
                      canPlayerMoveToken(0) ? 'ring-2 ring-amber-400 animate-bounce cursor-pointer' : ''
                    }`}
                    title="Gold Coin P1"
                  >
                    {playerTokens[0] === -1 ? (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-md border border-white">
                        P1
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-600 font-bold">P1</span>
                    )}
                  </div>

                  {/* Player Token 2 */}
                  <div 
                    onClick={() => canPlayerMoveToken(1) && handlePlayerMove(1)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border border-dashed border-amber-400/50 flex items-center justify-center relative transition-all ${
                      canPlayerMoveToken(1) ? 'ring-2 ring-amber-400 animate-bounce cursor-pointer' : ''
                    }`}
                    title="Gold Coin P2"
                  >
                    {playerTokens[1] === -1 ? (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-md border border-white">
                        P2
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-600 font-bold">P2</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. CENTER: LUDO TRIANGULAR HOME */}
              <div 
                style={{ gridColumn: '7 / span 3', gridRow: '7 / span 3' }}
                className="bg-gradient-to-tr from-amber-500 via-rose-600 to-emerald-600 rounded-lg border border-white flex flex-col items-center justify-center text-white text-center p-0.5 relative shadow-lg"
              >
                <Trophy className="w-5 h-5 text-amber-300 drop-shadow-md animate-pulse" />
                <span className="text-[8px] font-black tracking-widest uppercase">HOME</span>
                
                <div className="flex gap-1 mt-0.5">
                  {playerTokens[0] === 56 && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white shadow-sm" title="P1 Home" />}
                  {playerTokens[1] === 56 && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white shadow-sm" title="P2 Home" />}
                  {botTokens[0] === 56 && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shadow-sm" title="B1 Home" />}
                  {botTokens[1] === 56 && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shadow-sm" title="B2 Home" />}
                </div>
              </div>

              {/* 6. ALL 52 TRACK SQUARES */}
              {LUDO_TRACK_COORDS.map(([r, c], trackIdx) => {
                const isSafe = SAFE_CELL_INDICES.has(trackIdx);
                const isRedStart = trackIdx === 0;
                const isYellowStart = trackIdx === 26;

                const hasP1 = p1Pos && p1Pos[0] === r && p1Pos[1] === c && playerTokens[0] < 56;
                const hasP2 = p2Pos && p2Pos[0] === r && p2Pos[1] === c && playerTokens[1] < 56;
                const hasB1 = b1Pos && b1Pos[0] === r && b1Pos[1] === c && botTokens[0] < 56;
                const hasB2 = b2Pos && b2Pos[0] === r && b2Pos[1] === c && botTokens[0] < 56;

                const canP1MoveHere = hasP1 && canPlayerMoveToken(0);
                const canP2MoveHere = hasP2 && canPlayerMoveToken(1);

                return (
                  <div
                    key={`track-${trackIdx}`}
                    style={{ gridColumn: c + 1, gridRow: r + 1 }}
                    onClick={() => {
                      if (canP1MoveHere) handlePlayerMove(0);
                      else if (canP2MoveHere) handlePlayerMove(1);
                    }}
                    className={`relative flex items-center justify-center rounded-xs transition-colors text-[8px] font-bold ${
                      isRedStart
                        ? 'bg-rose-600 text-white'
                        : isYellowStart
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : isSafe
                        ? 'bg-slate-700 text-amber-400 font-black'
                        : 'bg-slate-800/80 hover:bg-slate-750'
                    }`}
                  >
                    {isSafe && !hasP1 && !hasP2 && !hasB1 && !hasB2 && (
                      <span className="text-[9px] sm:text-[10px]">★</span>
                    )}

                    {hasP1 && (
                      <div 
                        className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border border-white flex items-center justify-center font-black text-[7px] sm:text-[8px] shadow-lg ${
                          canP1MoveHere ? 'ring-2 ring-white animate-bounce cursor-pointer scale-110' : ''
                        }`}
                        title="P1 - Tap to Move"
                      >
                        P1
                      </div>
                    )}

                    {hasP2 && (
                      <div 
                        className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border border-white flex items-center justify-center font-black text-[7px] sm:text-[8px] shadow-lg ${
                          canP2MoveHere ? 'ring-2 ring-white animate-bounce cursor-pointer scale-110' : ''
                        }`}
                        title="P2 - Tap to Move"
                      >
                        P2
                      </div>
                    )}

                    {hasB1 && (
                      <div 
                        className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 text-white border border-white flex items-center justify-center font-black text-[7px] sm:text-[8px] shadow-lg"
                        title="Chef Bot B1"
                      >
                        B1
                      </div>
                    )}

                    {hasB2 && (
                      <div 
                        className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 text-white border border-white flex items-center justify-center font-black text-[7px] sm:text-[8px] shadow-lg"
                        title="Chef Bot B2"
                      >
                        B2
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 7. YELLOW HOME RUNWAY */}
              {YELLOW_HOME_RUNWAY.map(([r, c], i) => {
                const hasP1 = p1Pos && p1Pos[0] === r && p1Pos[1] === c;
                const hasP2 = p2Pos && p2Pos[0] === r && p2Pos[1] === c;
                const canP1 = hasP1 && canPlayerMoveToken(0);
                const canP2 = hasP2 && canPlayerMoveToken(1);

                return (
                  <div
                    key={`yellow-runway-${i}`}
                    style={{ gridColumn: c + 1, gridRow: r + 1 }}
                    onClick={() => {
                      if (canP1) handlePlayerMove(0);
                      else if (canP2) handlePlayerMove(1);
                    }}
                    className="bg-amber-400/90 text-slate-950 flex items-center justify-center rounded-xs font-black text-[8px]"
                  >
                    {hasP1 && (
                      <div className={`w-5 h-5 rounded-full bg-white text-slate-950 border border-amber-600 flex items-center justify-center font-black text-[7px] ${canP1 ? 'animate-bounce ring-1 ring-slate-950 cursor-pointer' : ''}`}>
                        P1
                      </div>
                    )}
                    {hasP2 && (
                      <div className={`w-5 h-5 rounded-full bg-white text-slate-950 border border-amber-600 flex items-center justify-center font-black text-[7px] ${canP2 ? 'animate-bounce ring-1 ring-slate-950 cursor-pointer' : ''}`}>
                        P2
                      </div>
                    )}
                    {!hasP1 && !hasP2 && <span className="opacity-60 text-[7px]">▶</span>}
                  </div>
                );
              })}

              {/* 8. RED HOME RUNWAY */}
              {RED_HOME_RUNWAY.map(([r, c], i) => {
                const hasB1 = b1Pos && b1Pos[0] === r && b1Pos[1] === c;
                const hasB2 = b2Pos && b2Pos[0] === r && b2Pos[1] === c;

                return (
                  <div
                    key={`red-runway-${i}`}
                    style={{ gridColumn: c + 1, gridRow: r + 1 }}
                    className="bg-rose-600/90 text-white flex items-center justify-center rounded-xs font-bold text-[8px]"
                  >
                    {hasB1 && (
                      <div className="w-5 h-5 rounded-full bg-white text-rose-700 border border-rose-900 flex items-center justify-center font-black text-[7px]">
                        B1
                      </div>
                    )}
                    {hasB2 && (
                      <div className="w-5 h-5 rounded-full bg-white text-rose-700 border border-rose-900 flex items-center justify-center font-black text-[7px]">
                        B2
                      </div>
                    )}
                    {!hasB1 && !hasB2 && <span className="opacity-60 text-[7px]">▶</span>}
                  </div>
                );
              })}

            </div>

            {/* STATUS FOOTER BAR */}
            <div className="flex items-center justify-between text-[11px] font-bold pt-2 px-1 border-t border-white/[0.08] mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span className="text-amber-300 text-[10px] sm:text-[11px]">
                  You: P1 ({playerTokens[0] === -1 ? 'Base' : playerTokens[0] === 56 ? '🏆 Home' : `S${playerTokens[0]}`}) • P2 ({playerTokens[1] === -1 ? 'Base' : playerTokens[1] === 56 ? '🏆 Home' : `S${playerTokens[1]}`})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="text-rose-400 text-[10px] sm:text-[11px]">
                  Chef: B1 ({botTokens[0] === -1 ? 'Base' : botTokens[0] === 56 ? '🏆 Home' : `S${botTokens[0]}`}) • B2 ({botTokens[1] === -1 ? 'Base' : botTokens[1] === 56 ? '🏆 Home' : `S${botTokens[1]}`})
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: ACTION & CONTROL DESK */}
        <div className="sm:col-span-5 flex flex-col space-y-3 w-full">
          
          {/* Action Box: Dice & Move Selection */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/95 border border-amber-500/30 shadow-xl space-y-3 backdrop-blur-md">
            
            {/* Turn Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400">
                Active Turn
              </span>
              <div className="flex items-center gap-1.5">
                {turn === 'player' ? (
                  <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] sm:text-[11px] font-black animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    YOUR TURN
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] sm:text-[11px] font-black">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    CHEF BOT PLAYING
                  </span>
                )}
              </div>
            </div>

            {/* 3D Dice Display & Guidance */}
            <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
              <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border-2 border-amber-400 text-amber-300 flex items-center justify-center font-black text-2xl shadow-lg transition-transform ${isRolling ? 'rotate-180 scale-110' : ''}`}>
                {diceRoll !== null ? diceRoll : '🎲'}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  Dice Outcome
                </span>
                <span className="text-xs sm:text-sm font-black text-white block mt-0.5">
                  {turn === 'player' ? (
                    waitingForMove ? (
                      <span className="text-amber-300 font-extrabold">Rolled a {diceRoll}! Pick coin 👇</span>
                    ) : (
                      <span>Roll dice to start your turn</span>
                    )
                  ) : (
                    <span className="text-rose-300">Chef Bot is taking turn...</span>
                  )}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                  {playerTokens[0] === -1 && playerTokens[1] === -1 ? 'Need a 6 to deploy from base' : 'Aim to conquer Center Home 🏆'}
                </span>
              </div>
            </div>

            {/* PRIMARY ACTION BUTTONS: ROLL DICE vs PROMINENT MOVE GOLD P1 & MOVE GOLD P2 */}
            {!waitingForMove ? (
              <button
                onClick={handleRollDice}
                disabled={turn !== 'player' || isRolling || !!winner}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                  turn === 'player' && !winner
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 active:scale-95 cursor-pointer shadow-amber-500/25 ring-2 ring-amber-400/50'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <Dices className="w-4 h-4 text-slate-950" />
                <span>{isRolling ? 'Rolling Dice...' : 'Roll Dice 🎲'}</span>
              </button>
            ) : (
              /* PROMINENT MOVE GOLD P1 / P2 BUTTONS (CLEARLY VISIBLE IN TABLET VIEW) */
              <div className="space-y-2 bg-gradient-to-b from-amber-500/15 to-amber-500/5 border-2 border-amber-400/60 p-2.5 rounded-xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-0.5">
                  <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                    👉 Move Your Gold Token:
                  </span>
                  <span className="text-[10px] font-mono font-black text-amber-400 bg-slate-950 px-2 py-0.5 rounded-full border border-amber-400/40">
                    Rolled {diceRoll}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {canPlayerMoveToken(0) && (
                    <button
                      onClick={() => handlePlayerMove(0)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 ring-2 ring-white flex items-center justify-between cursor-pointer active:scale-95 animate-pulse transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center text-[10px] font-black">
                          P1
                        </span>
                        <span>Move Gold P1 ➔</span>
                      </span>
                      <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-md font-mono">
                        {playerTokens[0] === -1 ? 'Deploy to Track 🚀' : `Advance +${diceRoll} steps`}
                      </span>
                    </button>
                  )}

                  {canPlayerMoveToken(1) && (
                    <button
                      onClick={() => handlePlayerMove(1)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 ring-2 ring-white flex items-center justify-between cursor-pointer active:scale-95 animate-pulse transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center text-[10px] font-black">
                          P2
                        </span>
                        <span>Move Gold P2 ➔</span>
                      </span>
                      <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-md font-mono">
                        {playerTokens[1] === -1 ? 'Deploy to Track 🚀' : `Advance +${diceRoll} steps`}
                      </span>
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-amber-200/90 text-center pt-0.5">
                  💡 Tip: You can also tap the bouncing gold token directly on the board!
                </p>
              </div>
            )}
          </div>

          {/* Commentary & Move Log */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-[10px] font-mono text-slate-400 space-y-1 shadow-inner max-h-36 sm:max-h-44 overflow-y-auto custom-scrollbar">
            <span className="text-[9px] font-sans font-black uppercase tracking-wider text-slate-500 block mb-0.5">
              Live Battle Feed
            </span>
            {gameLog.map((log, i) => (
              <div key={i} className={i === 0 ? 'text-amber-400 font-bold' : ''}>
                {log}
              </div>
            ))}
          </div>

        </div>

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
type NewsLanguage = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'mr';

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
  },
  kn: {
    code: 'kn',
    label: 'ಕನ್ನಡ (Kannada)',
    nativeName: 'ಕನ್ನಡ ದಿನಪತ್ರಿಕೆ',
    flag: '🇮🇳',
    papers: [
      {
        name: 'ವಿಜಯ ಕರ್ನಾಟಕ (Vijay Karnataka)',
        masthead: 'ವಿಜಯ ಕರ್ನಾಟಕ',
        tagline: 'ಕರ್ನಾಟಕದ ನಂ.1 ದಿನಪತ್ರಿಕೆ • ಸತ್ಯಮೇವ ಜಯತೇ',
        cityEdition: 'ಬೆಂಗಳೂರು & ಮೈಸೂರು ಆವೃತ್ತಿ • ಇಂದು, 16 ಅಕ್ಟೋಬರ್ 2026',
        news: [
          {
            id: 1701,
            newspaper: 'ವಿಜಯ ಕರ್ನಾಟಕ',
            headline: 'ನಮ್ಮ ಮೆಟ್ರೋ 3ನೇ ಹಂತದ ಕಾಮಗಾರಿ ಪೂರ್ಣ: ಹೊಸ ಮಾರ್ಗಗಳು ಸಾರ್ವಜನಿಕ ಸೇವೆಗೆ ಸಿದ್ಧ!',
            summary: 'ಐಟಿ ಕಾರಿಡಾರ್ ಹಾಗೂ ನಗರದ ಪ್ರಮುಖ ತಾಣಗಳನ್ನು ಬೆಸೆಯುವ ಹೊಸ ಹೈ-ಸ್ಪೀಡ್ ಮೆಟ್ರೋ ಮಾರ್ಗವನ್ನು ಇಂದಿನಿಂದ ಸಾರ್ವಜನಿಕ ಸಂಚಾರಕ್ಕೆ ಮುಕ್ತಗೊಳಿಸಲಾಯಿತು.',
            category: 'ನಗರಾಭಿವೃದ್ಧಿ',
            readTime: '45 ಸೆಕೆಂಡ್ ಓದು',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
            timeAgo: '10 ನಿಮಿಷಗಳ ಹಿಂದೆ'
          },
          {
            id: 1702,
            newspaper: 'ವಿಜಯ ಕರ್ನಾಟಕ',
            headline: 'ಬೆಂಗಳೂರು ಟೆಕ್ ಸಮ್ಮಿಟ್ 2026: ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಕ್ಷೇತ್ರದಲ್ಲಿ ₹40,000 ಕೋಟಿ ಹೂಡಿಕೆ ಒಪ್ಪಂದ',
            summary: 'ಜಾಗತಿಕ ತಂತ್ರಜ್ಞಾನ ಸಂಸ್ಥೆಗಳು ಕರ್ನಾಟಕದಲ್ಲಿ ಅತ್ಯಾಧುನಿಕ ಡೇಟಾ ಸೆಂಟರ್ ಹಾಗೂ ಎಐ ಸಂಶೋಧನಾ ಕೇಂದ್ರಗಳನ್ನು ಸ್ಥಾಪಿಸಲು ಒಡಂಬಡಿಕೆಗೆ ಸಹಿ ಹಾಕಿವೆ.',
            category: 'ತಂತ್ರಜ್ಞಾನ & ಉದ್ಯಮ',
            readTime: '40 ಸೆಕೆಂಡ್ ಓದು',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
            timeAgo: '30 ನಿಮಿಷಗಳ ಹಿಂದೆ'
          },
          {
            id: 1703,
            newspaper: 'ವಿಜಯ ಕರ್ನಾಟಕ',
            headline: 'ಕರ್ನಾಟಕದ ದೇಸಿ ತಿನಿಸುಗಳಿಗೆ ಜಾಗತಿಕ ಮನ್ನಣೆ: ಮೈಸೂರು ಪಾಕ್ ಮತ್ತು ದೋಸೆಗೆ ಹೆರಿಟೇಜ್ ಗರಿ',
            summary: 'ಪ್ಯಾರಿಸ್‌ನಲ್ಲಿ ನಡೆದ ಅಂತರರಾಷ್ಟ್ರೀಯ ಪಾಕಶಾಸ್ತ್ರ ಸಮ್ಮೇಳನದಲ್ಲಿ ಸಾಂಪ್ರದಾಯಿಕ ಮೈಸೂರು ಪಾಕ್ ಮತ್ತು ಮಸಾಲೆ ದೋಸೆಗೆ ವಿಶ್ವ ಪಾರಂಪರಿಕ ಆಹಾರ ಮಾನ್ಯತೆ ಲಭಿಸಿದೆ.',
            category: 'ಆಹಾರ & ಸಂಸ್ಕೃತಿ',
            readTime: '35 ಸೆಕೆಂಡ್ ಓದು',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 ಗಂಟೆ ಹಿಂದೆ'
          },
          {
            id: 1704,
            newspaper: 'ವಿಜಯ ಕರ್ನಾಟಕ',
            headline: 'ರೈತರ ಕೃಷಿ ಪಂಪ್‌ಸೆಟ್‌ಗಳಿಗೆ ಹಗಲು ವೇಳೆಯೇ ಸೌರ ವಿದ್ಯುತ್: 50,000 ಹೊಸ ಸಂಪರ್ಕಗಳು ಮಂಜೂರು',
            summary: 'ಕುಸುಮ್ ಯೋಜನೆಯಡಿ ರಾಜ್ಯದ ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳ ರೈತರಿಗೆ ಉಚಿತ ಸೋಲಾರ್ ಪಂಪ್ ವಿತರಣೆ ಆರಂಭವಾಗಿದ್ದು, ಕೃಷಿ ಇಳುವರಿ ಗಣನೀಯವಾಗಿ ಹೆಚ್ಚಲಿದೆ.',
            category: 'ಕೃಷಿ ಜಗತ್ತು',
            readTime: '30 ಸೆಕೆಂಡ್ ಓದು',
            image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 ಗಂಟೆ ಹಿಂದೆ'
          }
        ]
      },
      {
        name: 'ಕನ್ನಡ ಪ್ರಭ (Kannada Prabha)',
        masthead: 'ಕನ್ನಡ ಪ್ರಭ',
        tagline: 'ಕನ್ನಡದ ಹೆಮ್ಮೆಯ ಧ್ವನಿ • ನಿಖರ ಮತ್ತು ನಿಷ್ಠುರ ವರದಿ',
        cityEdition: 'ರಾಜ್ಯ ಆವೃತ್ತಿ • ಇಂದು, 16 ಅಕ್ಟೋಬರ್ 2026',
        news: [
          {
            id: 1801,
            newspaper: 'ಕನ್ನಡ ಪ್ರಭ',
            headline: 'ಟಿ20 ವಿಶ್ವ ಸಮರ: ಯುವ ಭಾರತೀಯ ಪಡೆಯ ಭರ್ಜರಿ ಗೆಲುವು, ಅಭಿಮಾನಿಗಳ ಸಂಭ್ರಮ!',
            summary: 'ಅತ್ಯಾಕರ್ಷಕ ಬ್ಯಾಟಿಂಗ್ ಹಾಗೂ ಶಿಸ್ತಿನ ಬೌಲಿಂಗ್ ಪ್ರದರ್ಶನದ ಮೂಲಕ ಭಾರತ ತಂಡ ಜಯಭೇರಿ ಬಾರಿಸಿದ್ದು, ಕ್ರೀಡಾಂಗಣದಲ್ಲಿ ಸಂಭ್ರಮ ಮನೆಮಾಡಿದೆ.',
            category: 'ಕ್ರೀಡಾ ಲೋಕ',
            readTime: '40 ಸೆಕೆಂಡ್ ಓದು',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
            timeAgo: '15 ನಿಮಿಷಗಳ ಹಿಂದೆ'
          },
          {
            id: 1802,
            newspaper: 'ಕನ್ನಡ ಪ್ರಭ',
            headline: 'ಹಂಪಿಯ ಐತಿಹಾಸಿಕ ತಾಣಗಳಲ್ಲಿ ನೂತನ 3D ಲೇಸರ್ ಶೋ: ಪ್ರವಾಸಿಗರ ಭಾರಿ ಆಕರ್ಷಣೆ',
            summary: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ವೈಭವವನ್ನು ಕಣ್ಮುಂದೆ ತರುವ ವಿಶ್ವದರ್ಜೆಯ ಧ್ವನಿ ಮತ್ತು ಬೆಳಕು ಕಾರ್ಯಕ್ರಮ ಇಂದಿನಿಂದ ಪ್ರವಾಸಿಗರಿಗೆ ವೀಕ್ಷಣೆಗೆ ಲಭ್ಯವಿದೆ.',
            category: 'ಪ್ರವಾಸೋದ್ಯಮ',
            readTime: '35 ಸೆಕೆಂಡ್ ಓದು',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 ಗಂಟೆ ಹಿಂದೆ'
          }
        ]
      }
    ]
  },
  ml: {
    code: 'ml',
    label: 'മലയാളം (Malayalam)',
    nativeName: 'മലയാള വാർത്തകൾ',
    flag: '🇮🇳',
    papers: [
      {
        name: 'മലയാള മനോരമ (Malayala Manorama)',
        masthead: 'മലയാള മനോരമ',
        tagline: 'സത്യവും നീതിയും • കേരളത്തിന്റെ വിശ്വസ്ത ദിനപത്രം',
        cityEdition: 'കൊച്ചി & തിരുവനന്തപുരം പതിപ്പ് • ഇന്ന്, 16 ഒക്ടോബർ 2026',
        news: [
          {
            id: 1901,
            newspaper: 'മലയാള മനോരമ',
            headline: 'കൊച്ചി വാട്ടർ മെട്രോ പുതിയ ടെർമിനലുകൾ പ്രവർത്തനം തുടങ്ങി; ദ്വീപ് നിവാസികൾക്ക് ആശ്വാസം!',
            summary: 'പരിസ്ഥിതി സൗഹൃദ ഇലക്ട്രിക് ബോട്ടുകൾ പുതിയ റൂട്ടുകളിൽ സർവീസ് ആരംഭിച്ചതോടെ നഗരത്തിലെ യാത്രാസമയം പകുതിയായി കുറഞ്ഞു.',
            category: 'നഗര വികസനം',
            readTime: '45 സെക്കൻഡ് വായന',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
            timeAgo: '12 മിനിറ്റ് മുൻപ്'
          },
          {
            id: 1902,
            newspaper: 'മലയാള മനോരമ',
            headline: 'കേരളത്തിന്റെ തനത് സദ്യയ്ക്കും സുഗന്ധവ്യഞ്ജനങ്ങൾക്കും അന്താരാഷ്ട്ര ഗുണനിലവാര അംഗീകാരം',
            summary: 'പരമ്പരാഗത സുഗന്ധവ്യഞ്ജന കൂട്ടുകൾക്കും സ്വാദിഷ്ടമായ സദ്യയ്ക്കും ആഗോള ഫുഡ് കോൺഫെഡറേഷന്റെ പ്രത്യേക പുരസ്കാരം ലഭിച്ചു.',
            category: 'രുചിയും പൈതൃകവും',
            readTime: '40 സെക്കൻഡ് വായന',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            timeAgo: '35 മിനിറ്റ് മുൻപ്'
          },
          {
            id: 1903,
            newspaper: 'മലയാള മനോരമ',
            headline: 'ഐടി ഇടനാഴിയിൽ 100 പുതിയ സ്റ്റാർട്ടപ്പുകൾക്ക് കൂടി തുടക്കം; 15,000 തൊഴിലവസರങ്ങൾ',
            summary: 'ഡിജിറ്റൽ ഹെಲ್ത്ത് കെയರ್, ഫിൻടെക് മേഖലകളിലെ ಪ್ರಮುಖ ആഗോള നിക്ഷേപകർ കേരളത്തിലെ സ്റ്റാർട്ടപ്പുകളിലേക്ക് വൻതോതിൽ ഫണ്ട് ഒഴുക്കുന്നു.',
            category: 'ടെക്നോളജി',
            readTime: '35 സെക്കൻഡ് വായന',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
            timeAgo: '1 മണിക്കൂർ മുൻപ്'
          }
        ]
      },
      {
        name: 'മാതൃഭൂമി (Mathrubhumi)',
        masthead: 'മാതൃഭൂമി',
        tagline: 'നന്മയുടെ വെളിച്ചം • വിട്ടുവീഴ്ചയില്ലാത്ത പത്രപ്രവർത്തനം',
        cityEdition: 'കോഴിക്കോട് & തൃശ്ശൂർ എഡിഷൻ • ഇന്ന്, 16 ഒക്ടോബർ 2026',
        news: [
          {
            id: 2001,
            newspaper: 'മാതൃഭൂമി',
            headline: 'ടി20 പരമ്പര: ഇന്ത്യയ്ക്ക് ഉജ്ജ്വല വിജയം; യുവതാരങ്ങൾ കരുത്തുതെളിയിച്ചു!',
            summary: 'ആവേശകരമായ അവസാന ഓവറിൽ അവിസ്മരണീയ പ്രകടനം കാഴ്ചവെച്ച് ഇന്ത്യൻ ടീം വിജയം സ്വന്തമാക്കി. കാണികൾ ആവേശക്കടലിൽ.',
            category: 'കായികം',
            readTime: '40 സെക്കൻഡ് വായന',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
            timeAgo: '20 മിനിറ്റ് മുൻപ്'
          },
          {
            id: 2002,
            newspaper: 'മാതൃഭൂമി',
            headline: 'കൊച്ചി ബിനാലെ 2026 തീയതികൾ പ്രഖ്യാപിച്ചു; 40 രാജ്യങ്ങളിൽ നിന്നുള്ള കലാകാരന്മാർ എത്തും',
            summary: 'ഫോർട്ട് കൊച്ചിയിലെ ചരിത്ര വേദികളിൽ വിപുലമായ തയ്യാറെടുപ്പുകൾ ആരംഭിച്ചു. വിദേശ വിനോദസഞ്ചാരികളുടെ ബുക്കിംഗിൽ വലിയ വർധനവ്.',
            category: 'കല & സംസ്കാരം',
            readTime: '30 സെക്കൻഡ് വായന',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
            timeAgo: '2 മണിക്കൂർ മുൻപ്'
          }
        ]
      }
    ]
  },
  mr: {
    code: 'mr',
    label: 'मराठी (Marathi)',
    nativeName: 'मराठी वृत्तपत्र',
    flag: '🇮🇳',
    papers: [
      {
        name: 'लोकमत (Lokmat)',
        masthead: 'लोकमत',
        tagline: 'महाराष्ट्राचे नंबर १ वृत्तपत्र • जनसामान्यांचा बुलंद आवाज',
        cityEdition: 'मुंबई व पुणे आवृत्ती • आज, १६ ऑक्टोबर २०२६',
        news: [
          {
            id: 2101,
            newspaper: 'लोकमत',
            headline: 'मुंबई-पुणे एक्सप्रेसवेवर स्वयंचलित हायपर-ट्रॅफिक प्रणाली सुरू; प्रवासाचा वेळ अर्धा झाला!',
            summary: 'नवीन एआय संचलित कॅमेरा सिस्टीम आणि स्मार्ट लेनमुळे वाहतूक कोंडी पूर्णपणे दूर झाली असून प्रवाशांना मोठा दिलासा मिळाला आहे.',
            category: 'पायाभूत सुविधा',
            readTime: '४५ सेकंद वाचन',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
            timeAgo: '१५ मिनिटांपूर्वी'
          },
          {
            id: 2102,
            newspaper: 'लोकमत',
            headline: 'महाराष्ट्राच्या अस्सल खाद्यसंस्कृतीला जागतिक मानांकन; पुरणपोळी व मिसळची आंतरराष्ट्रीय ख्याती',
            summary: 'जागतिक फूड परिषदेत पारंपरिक महाराष्ट्रीयन पदार्थांना विशेष वारसा दर्जा मिळाला असून जगभरातील शेफनी कौतुक केले.',
            category: 'संस्कृती व खाद्य',
            readTime: '३५ सेकंद वाचन',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            timeAgo: '४० मिनिटांपूर्वी'
          },
          {
            id: 2103,
            newspaper: 'लोकमत',
            headline: 'शेतकऱ्यांसाठी दिवसा अखंड मोफत वीज देणारी महा-सौर योजना संपूर्ण राज्यात लागू',
            summary: 'कृषी पंपांना दिवसा १२ तास सौर ऊर्जा देण्याच्या प्रकल्पाने लाखो शेतकऱ्यांना डिझेलच्या खर्चातून कायमची मुक्ती मिळवून दिली आहे.',
            category: 'कृषी व ग्रामीण',
            readTime: '३० सेकंद वाचन',
            image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
            timeAgo: '१ तास पूर्वी'
          }
        ]
      },
      {
        name: 'महाराष्ट्र टाइम्स (Maharashtra Times)',
        masthead: 'महाराष्ट्र टाइम्स',
        tagline: 'प्रत्येक बातमीवर ठाम • महाराष्ट्राचा अग्रगण्य आवाज',
        cityEdition: 'मेट्रो मुंबई आवृत्ती • आज, १६ ऑक्टोबर २०२६',
        news: [
          {
            id: 2201,
            newspaper: 'महाराष्ट्र टाइम्स',
            headline: 'भारतीय क्रिकेट संघाची टी२० मालिकेत विजयी आगेकूच; युवा खेळाडूंचे धडाकेबाज प्रदर्शन!',
            summary: 'उत्कंठावर्धक सामन्यात शेवटच्या षटकात भारताने विजय मिळवला. वानखेडे स्टेडियमवर प्रेक्षकांचा प्रचंड उत्साह.',
            category: 'क्रीडा विश्व',
            readTime: '४० सेकंद वाचन',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
            timeAgo: '२० मिनिटांपूर्वी'
          },
          {
            id: 2202,
            newspaper: 'महाराष्ट्र टाइम्स',
            headline: 'दिवाळी सणानिमित्त बाजारपेठांमध्ये खरेदीची मोठी गर्दी; इलेक्ट्रॉनिक्स व कपड्यांची विक्रमी विक्री',
            summary: 'दादर, लालबाग आणि एफसी रोडवर ग्राहकांची अफाट गर्दी. डिजिटल पेमेंट आणि विशेष ऑफर्समुळे व्यापारी वर्गात उत्साहाचे वातावरण.',
            category: 'बाजार व व्यापार',
            readTime: '३० सेकंद वाचन',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
            timeAgo: '२ तास पूर्वी'
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
      
      {/* 1. LUXURY LANGUAGE SELECTION SUITE WITH PROMINENT DROPDOWN */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-3 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Globe className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xs font-black text-white uppercase tracking-wider block">
                Choose Newspaper Language
              </span>
              <span className="text-[10px] text-slate-400">
                Select your preferred language to switch live news &amp; editorial editions
              </span>
            </div>
          </div>

          {/* High-end Styled Dropdown Selector */}
          <div className="relative w-full sm:w-72">
            <select
              value={selectedLang}
              onChange={(e) => {
                setSelectedLang(e.target.value as NewsLanguage);
                setSelectedPaperIdx(0);
                setActiveShortIdx(0);
              }}
              className="w-full appearance-none bg-slate-950 text-amber-300 font-black text-xs sm:text-sm px-3.5 py-2.5 pr-10 rounded-2xl border-2 border-amber-400/60 shadow-lg shadow-amber-500/10 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              <option value="en">🇬🇧 English (The Hindu, TOI, Indian Express)</option>
              <option value="ta">🇮🇳 தமிழ் (Tamil - தினத்தந்தி, தினமலர், தினகரன்)</option>
              <option value="hi">🇮🇳 हिन्दी (Hindi - दैनिक जागरण, नवभारत टाइम्स)</option>
              <option value="te">🇮🇳 తెలుగు (Telugu - నమస్తే తెలంగాణ, ఈనాడు)</option>
              <option value="kn">🇮🇳 ಕನ್ನಡ (Kannada - ವಿಜಯ ಕರ್ನಾಟಕ, ಕನ್ನಡ ಪ್ರಭ)</option>
              <option value="ml">🇮🇳 മലയാളം (Malayalam - മലയാള മനോരമ, മാതൃഭൂമി)</option>
              <option value="mr">🇮🇳 मराठी (Marathi - लोकमत, महाराष्ट्र टाइम्स)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-amber-400">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Quick Language Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Quick Switch:
          </span>
          {(['en', 'ta', 'hi', 'te', 'kn', 'ml', 'mr'] as NewsLanguage[]).map((langKey) => {
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
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black scale-102'
                    : 'bg-slate-950/80 text-slate-300 border-white/10 hover:bg-slate-800'
                }`}
              >
                <span>{config.flag}</span>
                <span>{config.label.split(' ')[0]}</span>
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
  const [dismissTimeUp, setDismissTimeUp] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl lg:max-w-6xl h-[96vh] sm:h-[94vh] bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-amber-500/25 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base font-display tracking-tight text-white">
                  Table-Side Entertainment Lounge
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40">
                  Table {order?.tableNumber || 12}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Original interactive board games &amp; live multilingual daily newspapers
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-black cursor-pointer hover:bg-amber-500/30 transition-colors"
              title="Click to view full kitchen tracker"
            >
              <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>
                {isTimeUp ? 'Ready to Serve!' : `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TIME UP REMINDER ALERT (SLEEK, COMPACT & DISMISSIBLE) */}
        {isTimeUp && !dismissTimeUp && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-3.5 py-2 flex items-center justify-between gap-2.5 text-xs shadow-md border-b border-emerald-400/30 shrink-0 animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <span className="text-base animate-bounce">🔔</span>
              <span className="font-extrabold text-xs">
                Your Feast is Fresh &amp; Ready! Waiter {waiter.fullName} is serving Table {order?.tableNumber || 12}.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  onClose();
                  onOpenTracker?.();
                }}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-black transition-colors cursor-pointer whitespace-nowrap"
              >
                Track Order →
              </button>
              <button
                onClick={() => setDismissTimeUp(true)}
                className="p-1 rounded-md text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TIER 1: MAIN NAVIGATION BAR (CENTERED LUXURY SEGMENTED DOCK) */}
        <div className="px-3 sm:px-6 py-2.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-center shrink-0">
          <div className="grid grid-cols-3 gap-2 w-full max-w-xl">
            <button
              onClick={() => setActiveTab('games')}
              className={`py-2 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-102 ring-1 ring-amber-300'
                  : 'text-slate-400 hover:text-white bg-slate-950/70 hover:bg-slate-800 border border-white/5'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Original Games</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`py-2 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-102 ring-1 ring-amber-300'
                  : 'text-slate-400 hover:text-white bg-slate-950/70 hover:bg-slate-800 border border-white/5'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Today's Live News</span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`py-2 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'music'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-102 ring-1 ring-amber-300'
                  : 'text-slate-400 hover:text-white bg-slate-950/70 hover:bg-slate-800 border border-white/5'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Music Lounge</span>
            </button>
          </div>
        </div>

        {/* TIER 2: GAME SUB-SELECTOR (DEDICATED ROW - ZERO COLLISION WITH MAIN TABS!) */}
        {activeTab === 'games' && (
          <div className="px-3 sm:px-6 py-2 bg-slate-950 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 hidden sm:inline">
              Choose Arcade Challenge:
            </span>

            <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveGame('ludo')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  activeGame === 'ludo'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-md scale-102'
                    : 'bg-slate-900/90 text-slate-400 border-white/10 hover:text-white hover:bg-slate-800'
                }`}
              >
                🎲 Royal Ludo 15×15
              </button>
              <button
                onClick={() => setActiveGame('snakes')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  activeGame === 'snakes'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 shadow-md scale-102'
                    : 'bg-slate-900/90 text-slate-400 border-white/10 hover:text-white hover:bg-slate-800'
                }`}
              >
                🐍 Snakes &amp; Ladders
              </button>
              <button
                onClick={() => setActiveGame('sudoku')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  activeGame === 'sudoku'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-300 shadow-md scale-102'
                    : 'bg-slate-900/90 text-slate-400 border-white/10 hover:text-white hover:bg-slate-800'
                }`}
              >
                🧩 9×9 Sudoku
              </button>
            </div>
          </div>
        )}

        {/* Tab Body Content */}
        <div className="p-2.5 sm:p-3.5 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
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
        <div className="p-2.5 sm:p-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Real-time games &amp; multilingual live news active</span>
            <span className="sm:hidden">Active while waiting</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold border border-white/10 transition-all cursor-pointer text-xs"
            >
              Minimize &amp; Keep Playing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerEntertainmentModal;
