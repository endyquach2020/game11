import React, { useState } from 'react';
import { Question } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { ShieldAlert, CheckCircle2, XCircle, Zap, Award, BookOpen } from 'lucide-react';

interface CheckpointQuizModalProps {
  question: Question;
  stageName: string;
  totalQuestionsInStage: number;
  onCorrectAnswer: (firstTry: boolean) => void;
}

export const CheckpointQuizModal: React.FC<CheckpointQuizModalProps> = ({
  question,
  stageName,
  totalQuestionsInStage,
  onCorrectAnswer,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);

  const handleSelect = (idx: number) => {
    if (isCorrect) return; // Already passed
    setSelectedIndex(idx);
    setShowErrorAlert(false);
  };

  const handleConfirm = () => {
    if (selectedIndex === null) return;
    setIsSubmitted(true);

    if (selectedIndex === question.correctAnswerIndex) {
      setIsCorrect(true);
      setShowErrorAlert(false);
      soundManager.playCorrectAnswer();
      const firstTry = attempts === 0;
      setTimeout(() => {
        onCorrectAnswer(firstTry);
      }, 1400);
    } else {
      setIsCorrect(false);
      setShowErrorAlert(true);
      setAttempts(prev => prev + 1);
      soundManager.playWrongAnswer();
      // Reset selectedIndex so they must re-select without any hint
      setTimeout(() => {
        setSelectedIndex(null);
      }, 900);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-emerald-500/80 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.35)] overflow-hidden font-sans text-zinc-100">
        
        {/* Retro scanline & header glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 animate-pulse" />

        {/* Top Tactical Bar */}
        <div className="bg-zinc-900/90 border-b border-zinc-800 px-6 py-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/40 rounded-lg text-emerald-400 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                TRẠM BẢO MẬT BẢN QUYỀN SỐ • {stageName}
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                CÂU HỎI {question.questionNumber} / {totalQuestionsInStage}
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  BẮT BUỘC ĐÚNG ĐỂ QUA CỔNG
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Tin học 5 - Bài 5</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          {/* Question Text */}
          <div className="bg-zinc-900/80 border border-emerald-500/30 rounded-xl p-5 shadow-inner">
            <p className="text-base sm:text-lg font-semibold text-zinc-100 leading-relaxed">
              {question.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedIndex === idx;
              const isOptionCorrect = isCorrect && isSelected;
              const isOptionWrong = showErrorAlert && isSelected;

              return (
                <button
                  key={idx}
                  disabled={isCorrect === true}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 group relative cursor-pointer ${
                    isOptionCorrect
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : isOptionWrong
                      ? 'bg-red-950/80 border-red-500 text-red-200 animate-shake shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      : isSelected
                      ? 'bg-emerald-900/30 border-emerald-400 text-white shadow-lg'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 text-zinc-300'
                  }`}
                >
                  <span
                    className={`shrink-0 w-8 h-8 rounded-lg font-mono font-bold flex items-center justify-center text-sm border ${
                      isOptionCorrect
                        ? 'bg-emerald-500 border-emerald-400 text-zinc-950'
                        : isOptionWrong
                        ? 'bg-red-500 border-red-400 text-white'
                        : isSelected
                        ? 'bg-emerald-500 border-emerald-400 text-zinc-950'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 group-hover:text-white'
                    }`}
                  >
                    {optionLabels[idx]}
                  </span>
                  <span className="text-sm sm:text-base leading-snug pt-1 flex-1 font-medium">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Error Warning (Strict requirement: "khi trả lời sai không gợi ý") */}
          {showErrorAlert && (
            <div className="p-4 rounded-xl bg-red-950/70 border-2 border-red-500/80 text-red-200 flex items-center gap-3 animate-bounce shadow-lg">
              <XCircle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <p className="font-bold text-sm sm:text-base text-red-300 tracking-wide">
                  TRẢ LỜI SAI! BẢN QUYỀN BỊ XÂM PHẠM!
                </p>
                <p className="text-xs text-red-200/90 font-mono mt-0.5">
                  [HỆ THỐNG AN NINH]: KHÔNG CÓ GỢI Ý ĐƯỢC CẤP. HÃY ĐỌC KỸ ĐỀ VÀ THỬ LẠI!
                </p>
              </div>
            </div>
          )}

          {/* Success Notification */}
          {isCorrect && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border-2 border-emerald-500 text-emerald-200 flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 animate-spin" />
              <div>
                <p className="font-bold text-base text-emerald-300 tracking-wide flex items-center gap-2">
                  CHÍNH XÁC! XÁC THỰC THÀNH CÔNG!
                  <Award className="w-5 h-5 text-amber-400" />
                </p>
                <p className="text-xs text-emerald-200/90 font-mono mt-0.5">
                  {attempts === 0 ? '+1,000 ĐIỂM HOÀN HẢO (LẦN ĐẦU)!' : '+500 ĐIỂM VƯỢT TRẠM!'} CỔNG BẢO MẬT ĐANG MỞ...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-zinc-900/90 border-t border-zinc-800 px-6 py-4 flex items-center justify-between gap-4">
          <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Quy tắc: Trả lời đúng mới được mở cửa đi tiếp</span>
          </div>

          <button
            disabled={selectedIndex === null || isCorrect === true}
            onClick={handleConfirm}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center gap-2 ${
              selectedIndex === null || isCorrect === true
                ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer active:scale-95'
            }`}
          >
            {isCorrect ? 'ĐANG MỞ CỔNG...' : 'XÁC NHẬN CÂU TRẢ LỜI'}
          </button>
        </div>

      </div>
    </div>
  );
};
