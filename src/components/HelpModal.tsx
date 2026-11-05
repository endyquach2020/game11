import React from 'react';
import { HelpCircle, X, Crosshair, ShieldCheck, Zap, Flame, BookOpen } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-emerald-500/80 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.35)] overflow-hidden flex flex-col max-h-[90vh] text-zinc-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-emerald-950/80 border-b border-emerald-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                HƯỚNG DẪN CHIẾN DỊCH
              </div>
              <h2 className="text-xl font-black text-white tracking-wide">
                CÁCH CHƠI & LUẬT BẢN QUYỀN CONTRA
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Quy tắc vượt ải & Trắc nghiệm Bài 5 */}
          <div className="bg-zinc-900/80 border border-emerald-500/30 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase font-mono">
              <BookOpen className="w-5 h-5" />
              1. TRẠM BẢO MẬT BẢN QUYỀN (SGK TIN HỌC 5 - BÀI 5)
            </div>
            <ul className="text-sm text-zinc-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Mỗi màn chơi có <b>5 Trạm kiểm soát an ninh</b> tương ứng với 5 câu hỏi kiến thức bản quyền số.</li>
              <li><b className="text-amber-400">BẮT BUỘC TRẢ LỜI ĐÚNG MỚI ĐƯỢC QUA:</b> Cổng chỉ mở khi bạn chọn đúng đáp án chính xác.</li>
              <li><b className="text-red-400">KHI TRẢ LỜI SAI: KHÔNG CÓ GỢI Ý!</b> Bạn cần đọc kĩ lại kiến thức bài học và tự mình suy nghĩ lựa chọn lại.</li>
              <li>Trả lời đúng ngay lần đầu tiên được cộng thêm <b>+1,000 điểm</b> vào bảng xếp hạng!</li>
            </ul>
          </div>

          {/* Section 2: Bàn phím & Phím bấm */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase font-mono">
              <Crosshair className="w-5 h-5" />
              2. ĐIỀU KHIỂN CHIẾN BINH CONTRA
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">Di chuyển Trái / Phải</span>
                <span className="font-mono font-bold bg-zinc-800 text-amber-300 px-2 py-1 rounded border border-zinc-700">A / D hoặc ◄ / ►</span>
              </div>
              <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">Ngồi thụp (né đạn)</span>
                <span className="font-mono font-bold bg-zinc-800 text-amber-300 px-2 py-1 rounded border border-zinc-700">S hoặc Phím ▼</span>
              </div>
              <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">Bắn súng</span>
                <span className="font-mono font-bold bg-zinc-800 text-emerald-300 px-2 py-1 rounded border border-zinc-700">J hoặc Phím CÁCH</span>
              </div>
              <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">Nhảy lộn nhào (Somersault)</span>
                <span className="font-mono font-bold bg-zinc-800 text-cyan-300 px-2 py-1 rounded border border-zinc-700">K hoặc Phím ▲</span>
              </div>
              <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800 flex justify-between items-center sm:col-span-2">
                <span className="text-zinc-400">Ngắm bắn chéo / bắn lên</span>
                <span className="font-mono font-bold bg-zinc-800 text-purple-300 px-2 py-1 rounded border border-zinc-700">Giữ W / Phím Lên khi bắn</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 italic">
              * Màn hình cảm ứng: Tích hợp sẵn nút điều hướng ảo D-Pad và nút Bắn/Nhảy ngay trên màn hình.
            </p>
          </div>

          {/* Section 3: Vũ khí Contra */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase font-mono">
              <Zap className="w-5 h-5" />
              3. VŨ KHÍ & VẬT PHẨM TĂNG CƯỜNG (FALCON CAPSULES)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl">
                <div className="w-7 h-7 mx-auto mb-1 rounded bg-red-600 text-white font-black flex items-center justify-center font-mono text-sm">
                  S
                </div>
                <div className="font-bold text-white">Spread Gun</div>
                <div className="text-[10px] text-zinc-400">Tỏa 5 tia đạn</div>
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl">
                <div className="w-7 h-7 mx-auto mb-1 rounded bg-amber-600 text-white font-black flex items-center justify-center font-mono text-sm">
                  M
                </div>
                <div className="font-bold text-white">Machine Gun</div>
                <div className="text-[10px] text-zinc-400">Bắn liên thanh</div>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-xl">
                <div className="w-7 h-7 mx-auto mb-1 rounded bg-blue-600 text-white font-black flex items-center justify-center font-mono text-sm">
                  L
                </div>
                <div className="font-bold text-white">Laser Beam</div>
                <div className="text-[10px] text-zinc-400">Xuyên thấu mục tiêu</div>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
                <div className="w-7 h-7 mx-auto mb-1 rounded bg-emerald-600 text-white font-black flex items-center justify-center font-mono text-sm">
                  B
                </div>
                <div className="font-bold text-white">Barrier Shield</div>
                <div className="text-[10px] text-zinc-400">Khiên chắn bất tử</div>
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl col-span-2 sm:col-span-1">
                <div className="w-7 h-7 mx-auto mb-1 rounded bg-purple-600 text-white font-black flex items-center justify-center font-mono text-sm">
                  R
                </div>
                <div className="font-bold text-white">Rapid Fire</div>
                <div className="text-[10px] text-zinc-400">Tốc độ x2</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-zinc-900/90 border-t border-zinc-800 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            ĐÃ HIỂU - CHIẾN ĐẤU NGAY!
          </button>
        </div>

      </div>
    </div>
  );
};
