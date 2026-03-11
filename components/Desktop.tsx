
import React, { useContext, useState, useRef, useEffect } from 'react';
import Window from './Window';
import { AppID, WindowState, DesktopIcon, DragState } from '../types';
import { APPS_REGISTRY, getIcon } from '../constants';
import { OSContext } from '../App';

interface DesktopProps {
  windows: Record<AppID, WindowState>;
  activeApp: AppID | null;
  icons: DesktopIcon[];
  dragState: DragState | null;
  onClose: (id: AppID) => void;
  onMinimize: (id: AppID) => void;
  onMaximize: (id: AppID) => void;
  onFocus: (id: AppID) => void;
  onLaunch: (id: AppID) => void;
  onUpdateIcons: (icons: DesktopIcon[]) => void;
  onStartGlobalDrag: (appId: AppID, iconId: string) => void;
  onCreateShortcut: (appId: AppID, x: number, y: number) => void;
}

const SNAP_GRID = 20;
const ICON_WIDTH = 96; 
const ICON_HEIGHT = 100; 

const Desktop: React.FC<DesktopProps> = ({ 
  windows, 
  activeApp, 
  icons,
  dragState,
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus,
  onLaunch,
  onUpdateIcons,
  onStartGlobalDrag,
  onCreateShortcut
}) => {
  const os = useContext(OSContext);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [localDragging, setLocalDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const desktopRef = useRef<HTMLDivElement>(null);

  if (!os) return null;

  const handleMouseDown = (e: React.MouseEvent, icon: DesktopIcon) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedIcon(icon.id);
    setLocalDragging(icon.id);
    setDragOffset({
      x: e.clientX - icon.x,
      y: e.clientY - icon.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!localDragging || !desktopRef.current) return;

    const rect = desktopRef.current.getBoundingClientRect();
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    // Check if dragging out of desktop bounds (towards shelf)
    if (newY > rect.height - 20) {
      const icon = icons.find(i => i.id === localDragging);
      if (icon) {
        onStartGlobalDrag(icon.appId, icon.id);
        setLocalDragging(null);
        return;
      }
    }

    // Boundary enforcement
    newX = Math.max(0, Math.min(newX, rect.width - ICON_WIDTH));
    newY = Math.max(0, Math.min(newY, rect.height - ICON_HEIGHT));

    onUpdateIcons(icons.map(icon => 
      icon.id === localDragging ? { ...icon, x: newX, y: newY } : icon
    ));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // Drop logic from Shelf to Desktop
    if (dragState && dragState.source === 'shelf') {
      const rect = desktopRef.current?.getBoundingClientRect();
      if (rect) {
        onCreateShortcut(dragState.appId, e.clientX - rect.left - 48, e.clientY - rect.top - 40);
      }
    }

    if (!localDragging) return;

    // Snap to grid on drop
    onUpdateIcons(icons.map(icon => {
      if (icon.id === localDragging) {
        return {
          ...icon,
          x: Math.round(icon.x / SNAP_GRID) * SNAP_GRID,
          y: Math.round(icon.y / SNAP_GRID) * SNAP_GRID
        };
      }
      return icon;
    }));
    setLocalDragging(null);
  };

  return (
    <div 
      ref={desktopRef}
      className="relative w-full h-[calc(100vh-48px)] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={() => setSelectedIcon(null)}
    >
      {/* Desktop Icons */}
      {os.config.showDesktopIcons && icons.map((item) => (
        <div 
          key={item.id}
          onMouseDown={(e) => handleMouseDown(e, item)}
          onDoubleClick={(e) => { e.stopPropagation(); onLaunch(item.appId); }}
          className={`absolute flex flex-col items-center gap-1 p-2 rounded-lg transition-all group select-none cursor-default
            ${localDragging === item.id ? 'z-[50] opacity-80 duration-0' : 'z-10 duration-200'}
            ${selectedIcon === item.id ? 'bg-blue-500/30 ring-1 ring-blue-400/50' : 'hover:bg-white/10'}`}
          style={{ 
            left: item.x, 
            top: item.y,
            width: ICON_WIDTH,
          }}
        >
          <div className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform pointer-events-none">
            {getIcon(item.icon, 48)}
          </div>
          <span className="text-[11px] font-medium text-white text-center drop-shadow-[0_1px_2px_rgba(0,0,0,1)] pointer-events-none break-words w-full px-1 leading-tight">
            {item.name}
          </span>
        </div>
      ))}

      {/* Dynamic Windows */}
      {(Object.values(windows) as WindowState[]).map((window) => {
        if (!window.isOpen || window.isMinimized) return null;
        
        const appConfig = APPS_REGISTRY.find(a => a.id === window.id);
        if (!appConfig) return null;

        return (
          <Window
            key={window.id}
            id={window.id}
            title={appConfig.name}
            icon={appConfig.icon}
            zIndex={window.zIndex}
            isActive={activeApp === window.id}
            isMaximized={window.isMaximized}
            onClose={() => onClose(window.id)}
            onMinimize={() => onMinimize(window.id)}
            onMaximize={() => onMaximize(window.id)}
            onFocus={() => onFocus(window.id)}
          >
            {appConfig.component}
          </Window>
        );
      })}
    </div>
  );
};

export default Desktop;
