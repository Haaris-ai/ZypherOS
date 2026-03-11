
import React from 'react';
import { X, Minus, Square, Copy } from 'lucide-react';
import { getIcon } from '../constants';

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  children: React.ReactNode;
  zIndex: number;
  isActive: boolean;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}

const Window: React.FC<WindowProps> = ({
  title,
  icon,
  children,
  zIndex,
  isActive,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}) => {
  const windowStyles = isMaximized
    ? "inset-0 rounded-none"
    : "top-[10%] left-[15%] w-[70%] h-[70%] rounded-xl shadow-2xl";

  return (
    <div
      onClick={onFocus}
      className={`absolute transition-all duration-300 overflow-hidden flex flex-col border border-white/10 ${windowStyles} ${isActive ? 'ring-1 ring-white/20' : 'opacity-95'}`}
      style={{ 
        zIndex, 
        backgroundColor: 'rgba(28, 28, 30, 0.95)',
        backdropFilter: 'blur(12px)'
      }}
    >
      {/* Title Bar */}
      <div className={`flex items-center justify-between px-4 py-3 cursor-default select-none ${isActive ? 'bg-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <div className="text-white/70">
            {getIcon(icon, 16)}
          </div>
          <span className="text-sm font-medium text-white/90">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <Minus size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
          >
            {isMaximized ? <Copy size={14} /> : <Square size={14} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-1.5 hover:bg-red-500/80 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-zinc-900/50">
        {children}
      </div>
    </div>
  );
};

export default Window;
