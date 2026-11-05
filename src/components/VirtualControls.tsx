import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Target, Disc } from 'lucide-react';

interface VirtualControlsProps {
  onDirectionPress: (dir: 'left' | 'right' | 'up' | 'down', isPressed: boolean) => void;
  onShootPress: (isPressed: boolean) => void;
  onJumpPress: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onDirectionPress,
  onShootPress,
  onJumpPress,
}) => {
  return (
    <div className="w-full flex items-center justify-between pointer-events-none select-none px-4 py-2">
      {/* D-Pad on the left */}
      <div className="pointer-events-auto grid grid-cols-3 grid-rows-3 gap-1.5 w-36 h-36 p-1 bg-zinc-950/70 border border-zinc-700/60 rounded-2xl backdrop-blur-md shadow-xl">
        <div />
        <button
          onPointerDown={() => onDirectionPress('up', true)}
          onPointerUp={() => onDirectionPress('up', false)}
          onPointerLeave={() => onDirectionPress('up', false)}
          className="flex items-center justify-center bg-zinc-800/90 active:bg-emerald-600 rounded-xl text-zinc-200 border border-zinc-600 touch-none active:scale-95 transition-transform"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />

        <button
          onPointerDown={() => onDirectionPress('left', true)}
          onPointerUp={() => onDirectionPress('left', false)}
          onPointerLeave={() => onDirectionPress('left', false)}
          className="flex items-center justify-center bg-zinc-800/90 active:bg-emerald-600 rounded-xl text-zinc-200 border border-zinc-600 touch-none active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-500">
          <Disc className="w-4 h-4 animate-spin" />
        </div>

        <button
          onPointerDown={() => onDirectionPress('right', true)}
          onPointerUp={() => onDirectionPress('right', false)}
          onPointerLeave={() => onDirectionPress('right', false)}
          className="flex items-center justify-center bg-zinc-800/90 active:bg-emerald-600 rounded-xl text-zinc-200 border border-zinc-600 touch-none active:scale-95 transition-transform"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        <div />
        <button
          onPointerDown={() => onDirectionPress('down', true)}
          onPointerUp={() => onDirectionPress('down', false)}
          onPointerLeave={() => onDirectionPress('down', false)}
          className="flex items-center justify-center bg-zinc-800/90 active:bg-emerald-600 rounded-xl text-zinc-200 border border-zinc-600 touch-none active:scale-95 transition-transform"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
        <div />
      </div>

      {/* Action Buttons on the right (Shoot & Jump) */}
      <div className="pointer-events-auto flex items-center gap-4">
        {/* Jump Button */}
        <button
          onPointerDown={onJumpPress}
          className="w-16 h-16 rounded-full bg-cyan-600/90 active:bg-cyan-400 border-2 border-cyan-300 text-white font-black font-mono shadow-[0_0_15px_rgba(6,182,212,0.5)] flex flex-col items-center justify-center touch-none active:scale-95 transition-transform"
        >
          <span className="text-sm">NHẢY</span>
          <span className="text-[9px] opacity-75">(K)</span>
        </button>

        {/* Shoot Button */}
        <button
          onPointerDown={() => onShootPress(true)}
          onPointerUp={() => onShootPress(false)}
          onPointerLeave={() => onShootPress(false)}
          className="w-20 h-20 rounded-full bg-red-600/90 active:bg-red-400 border-2 border-red-300 text-white font-black font-mono shadow-[0_0_20px_rgba(239,68,68,0.6)] flex flex-col items-center justify-center touch-none active:scale-95 transition-transform"
        >
          <Target className="w-6 h-6 mb-0.5" />
          <span className="text-xs">BẮN</span>
          <span className="text-[9px] opacity-75">(J/CÁCH)</span>
        </button>
      </div>
    </div>
  );
};
