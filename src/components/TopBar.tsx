import React from 'react';
import { FileText, Printer, Edit3, Sparkles, Layers, RefreshCw, Menu } from 'lucide-react';

export type ViewState = 'upload' | 'contract-info' | 'weekly-log' | 'daily-log' | 'export';

interface Props {
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  isPlaceholderMode: boolean;
  onTogglePreset: () => void;
  onOpenGemini: () => void;
  onOpenDrawer: () => void;
  activeProjectName?: string;
}

export const TopBar: React.FC<Props> = ({
  activeView,
  onViewChange,
  isPlaceholderMode,
  onTogglePreset,
  onOpenGemini,
  onOpenDrawer,
  activeProjectName,
}) => {
  return (
    <header className="bg-[#181818] border-b border-white/5 text-gray-100 sticky top-0 z-30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] print:hidden backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Title & Hamburger Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            className="p-2.5 rounded-xl neu-button text-gray-200 hover:text-orange-400 border border-white/5 transition-all flex items-center justify-center group"
            title="เปิดเมนูจัดการโครงการ (Hamburger Menu)"
            aria-label="เปิดเมนูจัดการโครงการ"
          >
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <div className="w-10 h-10 rounded-2xl neu-pressed border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-base shadow-inner shrink-0">
            CS
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-base text-white leading-tight tracking-wide flex items-center gap-2">
              ContractScan V2
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30 font-semibold shrink-0">
                Smart Assistant
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-medium truncate max-w-[220px] sm:max-w-xs">
              {activeProjectName ? activeProjectName : 'ระบบสแกนและบันทึกข้อความสัญญาจ้าง'}
            </p>
          </div>
        </div>


        {/* Page Selector Tabs */}
        <div className="flex items-center neu-pressed p-1.5 rounded-2xl border border-white/5 text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => onViewChange('upload')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeView === 'upload'
                ? 'neu-orange-btn text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            อัปโหลด & สแกน
          </button>
          <button
            onClick={() => onViewChange('contract-info')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeView === 'contract-info'
                ? 'neu-orange-btn text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ข้อมูลสัญญา
          </button>
          <button
            onClick={() => onViewChange('weekly-log')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeView === 'weekly-log'
                ? 'neu-orange-btn text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            บันทึกประจำสัปดาห์
          </button>
          <button
            onClick={() => onViewChange('daily-log')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeView === 'daily-log'
                ? 'neu-orange-btn text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            บันทึกรายวัน
          </button>
          <button
            onClick={() => onViewChange('export')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
              activeView === 'export'
                ? 'neu-orange-btn text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            ดาวน์โหลด / พิมพ์
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Preset Toggle */}
          <button
            onClick={onTogglePreset}
            className="px-3 py-1.5 neu-button text-gray-200 rounded-xl text-xs font-medium border border-white/5 flex items-center gap-1.5 transition-all hover:text-orange-400"
            title="สลับระหว่างโหมดแท็ก {{TAG}} และข้อมูลตัวอย่างจริง"
          >
            <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">{isPlaceholderMode ? 'โหมด {{TAG}}' : 'โหมด ข้อมูลจริง'}</span>
          </button>
          {/* Gemini AI Trigger */}
          <button
            onClick={onOpenGemini}
            className="px-3.5 py-1.5 neu-purple-btn text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span className="hidden sm:inline">Gemini AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};

