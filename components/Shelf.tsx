
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Wifi, WifiOff, Battery, Volume2, Command, Layout, Bluetooth, BluetoothConnected, EthernetPort, Cpu, Activity, Power, RotateCcw, LogOut } from 'lucide-react';
import { AppID, WindowState, DragState } from '../types';
import { APPS_REGISTRY, getIcon } from '../constants';
import { OSContext } from '../App';

interface ShelfProps {
  windows: Record<AppID, WindowState>;
  activeApp: AppID | null;
  pinnedAppIds: AppID[];
  dragState: DragState | null;
  onLaunch: (id: AppID) => void;
  onToggleDrawer: () => void;
  onFocus: (id: AppID) => void;
  onStartGlobalDrag: (appId: AppID) => void;
  onPinApp: (appId: AppID) => void;
}

const Shelf: React.FC<ShelfProps> = ({ 
  windows, 
  activeApp, 
  pinnedAppIds,
  dragState,
  onLaunch, 
  onToggleDrawer, 
  onFocus,
  onStartGlobalDrag,
  onPinApp
}) => {
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [cpuTemp, setCpuTemp] = useState(38);
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const powerMenuRef = useRef<HTMLDivElement>(null);
  const os = useContext(OSContext);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const tempTimer = setInterval(() => setCpuTemp(prev => Math.max(35, Math.min(65, prev + (Math.random() * 2 - 1)))), 5000);
    
    // Real Battery API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level * 100);
        battery.addEventListener('levelchange', () => setBatteryLevel(battery.level * 100));
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (powerMenuRef.current && !powerMenuRef.current.contains(event.target as Node)) {
        setShowPowerMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(timer);
      clearInterval(tempTimer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!os) return null;

  const { layout, shelfOpacity, glassMode, isWifiEnabled, connectedWifi, isEthernetConnected, isBluetoothEnabled, connectedBluetoothDevice } = os.config;
  const isWindows = layout === 'windows';
  const currentUser = os.config.users.find(u => u.id === os.config.currentUserId);
  
  // Apply Identity Filtering to pinned apps
  const pinnedApps = APPS_REGISTRY.filter(app => {
    // Restricted Identity Check (DEV ONLY)
    const isDevOnlyApp = ['dev-portal', 'distro-builder'].includes(app.id);
    if (isDevOnlyApp && currentUser?.name !== 'DEV') {
      return false;
    }

    return pinnedAppIds.includes(app.id) || os.config.installedAppIds.includes(app.id);
  });

  return (
    <div 
      className={`absolute bottom-0 left-0 right-0 h-12 flex items-center justify-between px-2 z-[9999] border-t transition-all duration-300
        ${dragState && dragState.source === 'desktop' ? 'bg-blue-500/20 border-blue-400/50 scale-[1.01]' : 'border-white/10'}`}
      style={{ 
        backgroundColor: `rgba(0, 0, 0, ${dragState && dragState.source === 'desktop' ? 0.8 : shelfOpacity})`,
        backdropFilter: glassMode ? 'blur(16px)' : 'none'
      }}
    >
      
      {!isWindows && (
        <button 
          onClick={onToggleDrawer}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-all group"
        >
          <div className="w-6 h-6 rounded-full border-2 border-white/80 group-active:scale-90 transition-transform flex items-center justify-center" title="App Drawer">
            <div className="w-2 h-2 rounded-full bg-white/80" />
          </div>
        </button>
      )}

      <div className={`flex items-center gap-1 h-full transition-all duration-500 ${isWindows ? 'absolute left-1/2 -translate-x-1/2' : 'flex-1 ml-2'}`}>
        {isWindows && (
          <button 
            onClick={onToggleDrawer}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-indigo-400 transition-all group"
          >
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 rounded-sm bg-indigo-500" />
              <div className="w-2 h-2 rounded-sm bg-indigo-400" />
              <div className="w-2 h-2 rounded-sm bg-indigo-600" />
              <div className="w-2 h-2 rounded-sm bg-indigo-300" />
            </div>
          </button>
        )}

        {pinnedApps.map(app => {
          const isActive = activeApp === app.id;
          const isOpen = windows[app.id]?.isOpen || false;
          return (
            <button
              key={app.id}
              onClick={() => isOpen ? onFocus(app.id) : onLaunch(app.id)}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:bg-white/10 
                ${isActive ? 'bg-white/10' : ''}`}
              title={app.name}
            >
              <div className={`text-white transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>
                {getIcon(app.icon, 22)}
              </div>
              {isOpen && (
                <div className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isActive ? 'bg-indigo-500 w-3 h-0.5' : 'bg-white/50'}`} />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pr-2 relative">
        {/* Power Menu Popover */}
        {showPowerMenu && (
          <div 
            ref={powerMenuRef}
            className="absolute bottom-14 right-0 w-48 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl animate-in slide-in-from-bottom-2 duration-200 z-[10000]"
          >
            <div className="p-3 mb-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Power Options</p>
            </div>
            <button 
              onClick={() => os.logout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white/60 transition-colors text-xs font-bold"
            >
              <LogOut size={16} />
              LOGOUT
            </button>
            <button 
              onClick={() => os.systemAction('restart')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-500/20 text-indigo-400 transition-colors text-xs font-bold"
            >
              <RotateCcw size={16} />
              RESTART
            </button>
            <button 
              onClick={() => os.systemAction('shutdown')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/20 text-rose-500 transition-colors text-xs font-bold"
            >
              <Power size={16} />
              SHUTDOWN
            </button>
          </div>
        )}

        {/* Performance Widget */}
        <div className="hidden md:flex items-center gap-4 bg-white/5 rounded-xl px-3 py-1 border border-white/5 text-[10px] font-bold text-white/40">
           <div className="flex items-center gap-1.5" title="CPU Temperature">
             <Cpu size={12} className={cpuTemp > 60 ? 'text-rose-500' : 'text-emerald-500'} />
             <span>{Math.floor(cpuTemp)}°C</span>
           </div>
           <div className="flex items-center gap-1.5" title="Neural Load">
             <Activity size={12} className="text-indigo-400" />
             <span>12%</span>
           </div>
        </div>

        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-0.5 border border-white/5">
          <button 
            onClick={() => os.openApp('settings')}
            className="flex items-center gap-3 hover:bg-white/10 rounded-lg px-3 py-1.5 transition-colors cursor-pointer text-sm font-medium"
          >
            <div className="flex items-center gap-2 text-white/60">
              {isEthernetConnected && <EthernetPort size={14} className="text-emerald-400" />}
              {isWifiEnabled ? <Wifi size={14} className="text-white" /> : <WifiOff size={14} className="text-white/20" />}
              <Battery size={14} className={batteryLevel !== null && batteryLevel < 20 ? 'text-rose-500' : 'text-white'} />
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="text-white tabular-nums text-xs">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </button>
          <button 
            onClick={() => setShowPowerMenu(!showPowerMenu)}
            className={`p-1.5 rounded-lg transition-all ${showPowerMenu ? 'bg-rose-600 text-white' : 'text-white/40 hover:bg-white/10'}`}
          >
            <Power size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shelf;
