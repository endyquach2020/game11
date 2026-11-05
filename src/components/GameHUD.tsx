import React from 'react';
import { WeaponType, StageData } from '../types/game';
import { Volume2, VolumeX, Trophy, HelpCircle, Shield, Zap, Pause, Play } from 'lucide-react';

interface GameHUDProps {
  score: number;
  lives: number;
  stage: StageData;
  checkpointIndex: number; // 0 to 5
  weapon: WeaponType;
  hasShield: boolean;
  rapidFire: boolean;
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onOpenLeaderboard: () => void;
  onOpenHelp: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  lives,
  stage,
  checkpointIndex,
  weapon,
  hasShield,
  rapidFire,
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePause,
  onOpenLeaderboard,
  onOpenHelp,
}) => {
  const weaponBadges: Record<WeaponType, { label: string; bg: string; border: string; text: string }> = {
    NORMAL: { label: 'STANDARD RIFLE', bg: 'bg-zinc-800', border: 'border-zinc-600', text: 'text-zinc-300' },
    SPREAD: { label: '[S] SPREAD GUN (5-TIA)', bg: 'bg-red-950/80', border: 'border-red-500', text: 'text-red-400' },
    MACHINE: { label: '[M] MACHINE GUN', bg: 'bg-amber-950/80', border: 'border-amber-500', text: 'text-amber-400' },
    LASER: { label: '[L] HIGH-POWER LASER', bg: 'bg-cyan-950/80', border: 'border-cyan-500', text: 'text-cyan-400' },
  };

  const badge = weaponBadges[weapon];

  return (
    <div className="w-full bg-zinc-950/90 border-b border-zinc-800 backdrop-blur-md px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-white select-none">
      
      {/* Left: Score & Lives */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            ĐIỂM SỐ (1P)
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            {score.toString().padStart(6, '0')}
          </div>
        </div>

        <div className="h-8 w-px bg-zinc-800" />

        {/* Lives */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            MẠNG SỐNG
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-6 rounded-sm border ${
                  i < lives
                    ? 'bg-red-600 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                    : 'bg-zinc-900 border-zinc-800 opacity-30'
                }`}
                title={`Mạng ${i + 1}`}
              />
            ))}
            <span className="text-xs font-mono font-bold text-red-400 ml-1">x{lives}</span>
          </div>
        </div>
      </div>

      {/* Middle: Stage & Checkpoint Status */}
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            {stage.name}
          </span>
        </div>

        {/* 5 Checkpoints Progress Dots */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-mono text-zinc-400">TRẠM:</span>
          {Array.from({ length: 5 }).map((_, idx) => {
            const isCleared = idx < checkpointIndex;
            const isCurrent = idx === checkpointIndex;
            return (
              <div
                key={idx}
                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all border ${
                  isCleared
                    ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                    : isCurrent
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300 animate-pulse'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                }`}
                title={`Trạm ${idx + 1}`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Weapon & Action Tools */}
      <div className="flex items-center gap-3">
        {/* Weapon Badge */}
        <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${badge.bg} ${badge.border} ${badge.text}`}>
          <span>{badge.label}</span>
          {rapidFire && (
            <span className="text-[9px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              RAPID
            </span>
          )}
          {hasShield && (
            <Shield className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onTogglePause}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isMuted
                ? 'bg-red-950/40 border-red-500/50 text-red-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Bảng xếp hạng"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Hướng dẫn chơi"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
