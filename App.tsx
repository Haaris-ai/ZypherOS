
import React, { useState, useCallback, createContext, useContext, useEffect, useRef } from 'react';
import Desktop from './components/Desktop';
import Shelf from './components/Shelf';
import AppDrawer from './components/AppDrawer';
import LoginScreen from './components/LoginScreen';
import SetupScreen from './components/SetupScreen';
import BIOS from './components/BIOS';
import { Power, RotateCcw, Cpu, MonitorOff, ShieldAlert } from 'lucide-react';
import { AppID, WindowState, OSConfig, OSContextType, DesktopIcon, DragState, UserAccount, FileSystemItem } from './types';
import { APPS_REGISTRY, getIcon } from './constants';

export const OSContext = createContext<OSContextType | null>(null);

const STORAGE_KEY = 'zypheros_standalone_v1';

const INITIAL_FS: FileSystemItem[] = [
  { id: 'f1', name: 'Documents', type: 'folder', parentId: null, createdAt: Date.now() },
  { id: 'f2', name: 'Downloads', type: 'folder', parentId: null, createdAt: Date.now() },
  { id: 'f3', name: 'System', type: 'folder', parentId: null, createdAt: Date.now() },
];

const App: React.FC = () => {
  const [bootStage, setBootStage] = useState<'rainbow' | 'bios' | 'post' | 'os' | 'halted' | 'restarting' | 'shutting_down'>('rainbow');
  const [showBiosConfig, setShowBiosConfig] = useState(false);
  const [postLogs, setPostLogs] = useState<string[]>([]);
  const [isAuthenticated, setAuthenticated] = useState(false);
  
  const [config, setConfig] = useState<OSConfig>(() => {
    const defaults: OSConfig = {
      layout: 'chrome',
      theme: 'dark',
      wallpaper: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2564&auto=format&fit=crop',
      accentColor: 'indigo',
      shelfOpacity: 0.8,
      showDesktopIcons: true,
      glassMode: true,
      isWifiEnabled: true,
      connectedWifi: 'Zypher_Fiber_Ultra',
      isEthernetConnected: false,
      isBluetoothEnabled: true,
      connectedBluetoothDevice: null,
      isFirstBoot: true,
      users: [],
      currentUserId: null,
      recoveryKey: '',
      fileSystem: INITIAL_FS,
      installedAppIds: [],
      currentSystemVersion: '1.0.4',
      globalManifest: {
        version: '1.0.4',
        url: 'https://cdn.zypher-os.io/releases/zypher-v104.iso',
        releaseNotes: 'Initial standalone release.',
        pushedAt: Date.now()
      },
      bios: {
        secureBoot: true,
        cpuOverclock: false,
        bootOrder: ['NVMe0', 'USB-ZIP', 'PXE'],
        vtEnabled: true,
        memoryFrequency: 3200
      },
      deployment: {
        productionUrl: '',
        apiKey: '',
        isSimulation: true
      }
    };

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed, isFirstBoot: parsed.isFirstBoot ?? true };
      } catch (e) {
        console.error("Kernel: Storage corruption detected. Resetting to defaults.");
      }
    }
    return defaults;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  // Handle Standalone Boot Sequence
  useEffect(() => {
    if (bootStage === 'rainbow') {
      const timer = setTimeout(() => setBootStage('bios'), 1500);
      return () => clearTimeout(timer);
    }

    const runPost = async () => {
      setPostLogs(["Zypher Bootloader v3.1 (ARM64 Native)..."]);
      await new Promise(r => setTimeout(r, 400));

      const logs = [
        "Hardware: Raspberry Pi 5 / Broadcom BCM2712",
        "Memory: 8192MB LPDDR4X Detected",
        "Storage: MicroSD / dev/mmcblk0p2 (EXT4)",
        "Bridge: ZEL Translation Layer Loaded",
        "Kernel: Mica-v1 (Mesa 23.2.1) Signature: OK",
        "Overlay: config.txt [dtoverlay=vc4-kms-v3d]",
        "Network: eth0: 1000Mbps link up",
        "Starting Systemd Services...",
        "Handing off to Native Shell..."
      ];

      for (const log of logs) {
        await new Promise(r => setTimeout(r, 50 + Math.random() * 100));
        setPostLogs(prev => [...prev, log]);
      }
      
      setTimeout(() => setBootStage('os'), 500);
    };

    if (bootStage === 'bios') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'F2' || e.key === 'Delete') {
          setShowBiosConfig(true);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      const timer = setTimeout(() => {
        if (!showBiosConfig) setBootStage('post');
      }, 1000);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    } else if (bootStage === 'post') {
      runPost();
    }
  }, [bootStage, showBiosConfig]);

  const [updatingApps, setUpdatingApps] = useState<Set<string>>(new Set());
  const [windows, setWindows] = useState<Record<AppID, WindowState>>({});
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([
    { id: '1', appId: 'files', name: 'My Files', icon: 'folder', x: 20, y: 20 },
    { id: '2', appId: 'kernel-dash', name: 'System Hub', icon: 'activity', x: 20, y: 130 },
  ]);

  const [pinnedAppIds, setPinnedAppIds] = useState<AppID[]>(
    APPS_REGISTRY.filter(a => a.isPinned).map(a => a.id)
  );

  const [dragState, setDragState] = useState<DragState | null>(null);
  const [activeApp, setActiveApp] = useState<AppID | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(10);

  useEffect(() => {
    const initialWindows: Record<AppID, WindowState> = {};
    APPS_REGISTRY.forEach(app => {
      initialWindows[app.id] = { id: app.id, isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 };
    });
    setWindows(initialWindows);
  }, []);

  const openApp = useCallback((id: AppID) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: nextZ }
    }));
    setActiveApp(id);
    setIsDrawerOpen(false);
  }, [maxZIndex]);

  const installApp = async (id: string) => {
    if (config.installedAppIds.includes(id)) return;
    setUpdatingApps(prev => new Set(prev).add(id));
    await new Promise(r => setTimeout(r, 2000));
    setConfig(prev => ({
      ...prev,
      installedAppIds: [...prev.installedAppIds, id]
    }));
    setUpdatingApps(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const uninstallApp = async (id: string) => {
    if (!config.installedAppIds.includes(id)) return;
    setUpdatingApps(prev => new Set(prev).add(id));
    await new Promise(r => setTimeout(r, 1500));
    setConfig(prev => ({
      ...prev,
      installedAppIds: prev.installedAppIds.filter(appId => appId !== id)
    }));
    setUpdatingApps(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const systemAction = (action: 'shutdown' | 'restart') => {
    setAuthenticated(false);
    setWindows({});
    
    // NATIVE BRIDGE DISPATCHER (For Mastered/Installed Deployment)
    // If running as a real OS shell, window.zypherNative would exist.
    const nativeBridge = (window as any).zypherNative;
    if (nativeBridge) {
        nativeBridge.dispatchPowerSignal(action);
        return; // Handled by actual hardware
    }

    if (action === 'restart') {
      setBootStage('restarting');
      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } else {
      setBootStage('shutting_down');
      
      // Simulate Thermal Flush and Cache Writing
      setTimeout(() => {
        setBootStage('halted');
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        // Attempt browser close
        setTimeout(() => window.close(), 1000);
      }, 2500);
    }
  };

  const logout = () => {
    setAuthenticated(false);
    setConfig(p => ({ ...p, currentUserId: null }));
  };

  const fsActions = {
    add: (item: Omit<FileSystemItem, 'id' | 'createdAt'>) => {
      const newItem: FileSystemItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now()
      };
      setConfig(prev => ({ ...prev, fileSystem: [...prev.fileSystem, newItem] }));
    },
    remove: (id: string) => {
      setConfig(prev => ({ ...prev, fileSystem: prev.fileSystem.filter(i => i.id !== id) }));
    },
    getFolderContent: (parentId: string | null) => {
      return config.fileSystem.filter(i => i.parentId === parentId);
    }
  };

  if (bootStage === 'rainbow') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="w-full h-full animate-in fade-in duration-500 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 opacity-80" />
      </div>
    );
  }

  if (bootStage === 'restarting') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 font-mono text-zinc-500 uppercase tracking-widest text-xs">
         <RotateCcw size={32} className="animate-spin text-white/20" />
         <p>Rebooting Physical Hardware...</p>
         <div className="flex gap-1 text-[8px] opacity-20">
            <span>[ BUS_RESET ]</span>
            <span>[ RAM_FLUSH ]</span>
         </div>
      </div>
    );
  }

  if (bootStage === 'shutting_down') {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center gap-8 font-mono overflow-hidden">
        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-rose-600 animate-[loading_2s_linear_infinite]" />
        </div>
        <div className="text-center space-y-2 uppercase tracking-[0.4em] text-[10px] text-white/30 font-black">
          <p className="animate-pulse">Flushing Cache to NVMe0...</p>
          <p className="text-rose-500/50">Broadcom: HALT_READY</p>
        </div>
        <style>{`@keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
      </div>
    );
  }

  if (bootStage === 'halted') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-12 text-white/40 animate-in fade-in duration-1000 select-none">
        <div className="text-center space-y-4 font-mono">
           <div className="space-y-1 uppercase tracking-[0.5em] text-[10px] font-black">
              <p>System Halted</p>
              <p className="opacity-50 text-rose-900">ACPI Power-off complete</p>
           </div>
           <div className="text-[9px] text-white/5 opacity-50 space-y-1">
              <p>[ 102.441203] reboot: Power down</p>
              <p>[ 102.441205] Broadcom: HALT signal received</p>
              <p>[ 102.441301] Zypher: Memory cache flushed</p>
              <p>[ 102.441305] CPU_0: Core Sleep State 4</p>
           </div>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <div className="p-12 rounded-full border border-white/5 bg-white/[0.01] flex items-center justify-center">
             <MonitorOff size={48} className="text-white/5" />
          </div>
          <p className="text-[10px] text-white/5 uppercase tracking-[0.3em] font-black italic">Hardware Bridge Offline</p>
          
          <button 
            onClick={() => window.location.reload()}
            className="mt-20 px-8 py-3 rounded-xl border border-white/5 text-[9px] text-white/10 hover:text-white/40 hover:bg-white/5 hover:border-white/10 transition-all uppercase font-black tracking-[0.5em] flex items-center gap-2 group"
          >
            <RotateCcw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
            Physical Power Toggle
          </button>
        </div>
      </div>
    );
  }

  if (bootStage === 'bios') {
    if (showBiosConfig) {
      return <BIOS config={config.bios} onSave={(b) => { setConfig(p => ({ ...p, bios: b })); setShowBiosConfig(false); setBootStage('post'); }} onExit={() => { setShowBiosConfig(false); setBootStage('post'); }} />;
    }
    return (
      <div className="fixed inset-0 bg-black text-white font-mono flex flex-col justify-center items-center gap-12">
        <div className="flex flex-col items-center gap-4">
           <Cpu size={64} className="text-rose-600 mb-4" />
           <h1 className="text-3xl font-black italic tracking-widest">ZYPHER UEFI</h1>
        </div>
        <div className="text-center space-y-2 text-[10px] uppercase tracking-[0.3em] text-white/30">
           <p className="animate-pulse">Press [DEL] for Settings</p>
        </div>
      </div>
    );
  }

  if (bootStage === 'post') {
    return (
      <div className="fixed inset-0 bg-black text-[#aaa] font-mono p-12 flex flex-col gap-1 text-[11px] uppercase tracking-wider overflow-hidden">
        {postLogs.map((log, i) => (
          <p key={i} className={log.includes('OK') || log.includes('VALID') ? 'text-emerald-500' : ''}>{log}</p>
        ))}
        <div className="mt-auto pt-4 border-t border-white/5 flex justify-between opacity-30 text-[9px]">
           <span>ARM64 v8.2-A OK</span>
           <span>ZypherOS v{config.currentSystemVersion}-LTS (Pi Edition)</span>
        </div>
      </div>
    );
  }

  return (
    <OSContext.Provider value={{ 
      config, setConfig, installApp, uninstallApp, openApp, systemAction, updatingApps, 
      isAuthenticated, setAuthenticated, logout, fs: fsActions
    }}>
      <div className={`relative w-screen h-screen overflow-hidden bg-[#050505] select-none ${config.theme}`}>
        {config.isFirstBoot ? (
          <SetupScreen onComplete={(setup) => setConfig(prev => ({ ...prev, ...setup, isFirstBoot: false }))} />
        ) : !isAuthenticated ? (
          <LoginScreen onLogin={() => setAuthenticated(true)} wallpaper={config.wallpaper} />
        ) : (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
              style={{ backgroundImage: `url('${config.wallpaper}')` }}
            />
            <div className="absolute inset-0 bg-black/20" style={{ backdropFilter: config.glassMode ? 'blur(8px)' : 'none' }} />

            <Desktop 
              windows={windows} 
              activeApp={activeApp}
              icons={desktopIcons}
              dragState={dragState}
              onClose={(id) => setWindows(p => ({ ...p, [id]: { ...p[id], isOpen: false } }))}
              onMinimize={(id) => setWindows(p => ({ ...p, [id]: { ...p[id], isMinimized: true } }))}
              onMaximize={(id) => setWindows(p => ({ ...p, [id]: { ...p[id], isMaximized: !p[id].isMaximized } }))}
              onFocus={(id) => { setMaxZIndex(z => z + 1); setWindows(p => ({ ...p, [id]: { ...p[id], isMinimized: false, zIndex: maxZIndex + 1 } })); setActiveApp(id); }}
              onLaunch={openApp}
              onUpdateIcons={setDesktopIcons}
              onStartGlobalDrag={(appId, iconId) => setDragState({ appId, source: 'desktop', iconId, initialX: 0, initialY: 0 })}
              onCreateShortcut={(appId, x, y) => {
                const app = APPS_REGISTRY.find(a => a.id === appId);
                if (app) setDesktopIcons(p => [...p, { id: Date.now().toString(), appId, name: app.name, icon: app.icon, x, y }]);
              }}
            />

            <AppDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onLaunch={openApp} />

            <Shelf 
              windows={windows}
              activeApp={activeApp}
              pinnedAppIds={pinnedAppIds}
              dragState={dragState}
              onLaunch={openApp}
              onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
              onFocus={(id) => { setMaxZIndex(z => z + 1); setWindows(p => ({ ...p, [id]: { ...p[id], isMinimized: false, zIndex: maxZIndex + 1 } })); setActiveApp(id); }}
              onStartGlobalDrag={(appId) => setDragState({ appId, source: 'shelf', initialX: 0, initialY: 0 })}
              onPinApp={(appId) => !pinnedAppIds.includes(appId) && setPinnedAppIds(p => [...p, appId])}
            />
          </>
        )}
      </div>
    </OSContext.Provider>
  );
};

export default App;
