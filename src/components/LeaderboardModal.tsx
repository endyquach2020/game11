import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/game';
import { INITIAL_LEADERBOARD } from '../data/questions';
import { Trophy, Medal, X, Trash2, Clock, CheckCircle2, Flame, Award } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingScore?: {
    score: number;
    stageReached: number;
    firstTryAnswers: number;
    timeElapsedSeconds: number;
  } | null;
  onScoreSubmitted?: () => void;
}

const STORAGE_KEY = 'contra_copyright_leaderboard_v1';

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  pendingScore,
  onScoreSubmitted,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setEntries(JSON.parse(raw));
      } catch {
        setEntries(INITIAL_LEADERBOARD);
      }
    } else {
      setEntries(INITIAL_LEADERBOARD);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingScore || !playerName.trim() || hasSubmitted) return;

    const newEntry: LeaderboardEntry = {
      id: 'entry-' + Date.now(),
      name: playerName.trim(),
      score: pendingScore.score,
      stageReached: pendingScore.stageReached,
      firstTryAnswers: pendingScore.firstTryAnswers,
      timeElapsedSeconds: pendingScore.timeElapsedSeconds,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [...entries, newEntry].sort((a, b) => b.score - a.score).slice(0, 20);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHasSubmitted(true);
    if (onScoreSubmitted) {
      onScoreSubmitted();
    }
  };

  const handleReset = () => {
    if (window.confirm('Khôi phục danh sách xếp hạng về mặc định?')) {
      setEntries(INITIAL_LEADERBOARD);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-amber-500/80 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/80 via-zinc-900 to-amber-950/80 border-b border-amber-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                BẢNG VINH DANH QUÂN ĐOÀN
              </div>
              <h2 className="text-xl font-black text-white tracking-wide">
                BẢNG XẾP HẠNG CHIẾN BINH CONTRA
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pending Score Submission Form (if game over / victory) */}
        {pendingScore && !hasSubmitted && (
          <div className="bg-emerald-950/40 border-b border-emerald-500/30 p-5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase mb-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              LƯU THÀNH TÍCH CỦA BẠN VÀO BẢNG VÀNG
            </div>
            <form onSubmit={handleSubmitScore} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  maxLength={24}
                  placeholder="Nhập tên chiến binh của bạn..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-emerald-500/50 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 font-medium text-sm"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!playerName.trim()}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                LƯU KỶ LỤC
              </button>
            </form>
            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-emerald-300/80">
              <span>Điểm số: <b className="text-white">{pendingScore.score.toLocaleString()}</b></span>
              <span>Màn đến: <b className="text-white">Màn {pendingScore.stageReached}</b></span>
              <span>Đúng 100%: <b className="text-white">{pendingScore.firstTryAnswers} câu</b></span>
            </div>
          </div>
        )}

        {/* Score List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 divide-y divide-zinc-900">
          {entries.map((entry, index) => {
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isTop1
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-200 shadow-md'
                    : isTop2
                    ? 'bg-zinc-800/40 border-zinc-500/40 text-zinc-200'
                    : isTop3
                    ? 'bg-orange-950/20 border-orange-600/30 text-orange-200'
                    : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black font-mono text-sm shrink-0 ${
                      isTop1
                        ? 'bg-amber-500 text-zinc-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                        : isTop2
                        ? 'bg-slate-300 text-zinc-950'
                        : isTop3
                        ? 'bg-amber-700 text-white'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isTop1 ? <Medal className="w-5 h-5" /> : index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm sm:text-base truncate">
                      {entry.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-0.5">
                      <span className="text-emerald-400">Màn {entry.stageReached}</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {entry.firstTryAnswers} câu chuẩn
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {formatTime(entry.timeElapsedSeconds)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <div className="text-base sm:text-lg font-black font-mono tracking-wider text-amber-400">
                    {entry.score.toLocaleString()} <span className="text-xs font-normal text-zinc-400">PTS</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {entry.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-zinc-900/90 border-t border-zinc-800 px-6 py-3 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1.5 transition-colors font-mono cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Đặt lại mặc định
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer"
          >
            ĐÓNG
          </button>
        </div>

      </div>
    </div>
  );
};
