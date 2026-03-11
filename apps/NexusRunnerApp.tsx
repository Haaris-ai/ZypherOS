
import React, { useState, useRef, useEffect } from 'react';
import { FileUp, Cpu, Activity, ShieldCheck, Play, Terminal, Layers, Globe, Apple, Box } from 'lucide-react';

type TargetOS = 'macos' | 'linux' | 'windows' | 'chromeos';

const NexusRunnerApp: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [targetOS, setTargetOS] = useState<TargetOS>('windows');
  const [isRunning, setIsRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const ext = selected.name.split('.').pop()?.toLowerCase();
      setFile(selected);
      addLog(`Binary detected: ${selected.name} (${ext?.toUpperCase()})`);
      
      // Auto-switch OS target based on extension
      if (['dmg', 'app', 'pkg'].includes(ext || '')) setTargetOS('macos');
      else if (['deb', 'rpm', 'sh'].includes(ext || '')) setTargetOS('linux');
      else if (['apk'].includes(ext || '')) setTargetOS('chromeos');
      else if (['exe', 'msi'].includes(ext || '')) setTargetOS('windows');
    }
  };

  const runEmulation = async () => {
    if (!file) return;
    setIsLoading(true);
    setIsRunning(false);
    setLogs([]);
    
    addLog(`Nexus Hub: Initializing Cross-Kernel Bridge...`);
    await new Promise(r => setTimeout(r, 800));

    switch (targetOS) {
      case 'macos':
        addLog(`Nectar Runtime (v2.4) active. Simulating Mach kernel...`);
        addLog(`Loading CoreFoundation & Cocoa frameworks...`);
        if (file.name.toLowerCase().includes('xcode')) {
          addLog(`XCODE_DETECTION: Launching Simulator services...`);
          addLog(`Mapping LLVM toolchain for Zypher-ARM64...`);
        }
        break;
      case 'linux':
        addLog(`Lumen Runtime (v5.1) active. Loading ELF container...`);
        addLog(`Mounting /dev, /proc, /sys in sandbox...`);
        addLog(`X11/Wayland bridge established.`);
        break;
      case 'chromeos':
        addLog(`ARC-Z Environment active. Loading Android Runtime...`);
        addLog(`Binding Play Services (Mock) to Zypher Cloud...`);
        break;
      default:
        addLog(`ZEL Runtime active. Loading PE headers...`);
        addLog(`Translating x86 instructions to native ARM64...`);
    }

    await new Promise(r => setTimeout(r, 1500));
    addLog(`Execution pipeline established. Entering process loop.`);
    
    setIsLoading(false);
    setIsRunning(true);
  };

  const osStyles: Record<TargetOS, string> = {
    windows: 'bg-blue-600',
    macos: 'bg-zinc-800 text-white',
    linux: 'bg-amber-600',
    chromeos: 'bg-sky-500'
  };

  return (
    <div className="h-full flex flex-col text-zinc-300 font-sans">
      <div className="bg-zinc-900/40 p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Zypher Nexus</h1>
            <p className="text-sm opacity-60">Multi-Environment Translation Hub</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/5">
          {[
            { id: 'macos', icon: <Apple size={14} />, label: 'macOS' },
            { id: 'linux', icon: <Box size={14} />, label: 'Linux' },
            { id: 'windows', icon: <Globe size={14} />, label: 'Windows' },
            { id: 'chromeos', icon: <Globe size={14} />, label: 'ChromeOS' },
          ].map(os => (
            <button 
              key={os.id}
              onClick={() => setTargetOS(os.id as TargetOS)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${targetOS === os.id ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/50'}`}
            >
              {os.icon}
              {os.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row p-6 gap-6">
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/20">Binary Source</h2>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-6 bg-white/5 hover:bg-white/10 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center gap-3 transition-all group"
            >
              <FileUp size={32} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <div className="text-center px-4">
                <p className="text-sm font-medium">{file ? file.name : 'Load Application'}</p>
                <p className="text-[10px] text-white/30 mt-1">Supports DMG, EXE, DEB, APK</p>
              </div>
            </button>

            {file && (
              <button 
                disabled={isLoading}
                onClick={runEmulation}
                className={`w-full py-3 ${osStyles[targetOS]} hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg`}
              >
                {isLoading ? <Activity className="animate-spin" size={18} /> : <Play size={18} />}
                {isLoading ? 'Booting Runtime...' : `Launch in ${targetOS.toUpperCase()}`}
              </button>
            )}
          </div>

          <div className="bg-zinc-900/50 rounded-2xl p-5 border border-white/5 flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/20">Kernel Status</h2>
            <div className="flex items-center justify-between text-[11px]">
              <span>Memory Bridge</span>
              <span className="text-emerald-400 font-bold">OPTIMIZED</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>System V / Posix</span>
              <span className="text-indigo-400 font-mono">EMULATED</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-black/40 rounded-2xl border border-white/10 flex flex-col overflow-hidden backdrop-blur-md">
          <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/30 text-[10px] font-mono">
              <Terminal size={12} />
              NEXUS_RUNTIME_CONSOLE
            </div>
          </div>
          
          <div className="flex-1 p-5 font-mono text-[13px] overflow-y-auto space-y-1.5 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <Layers size={64} className="mb-4" />
                <p className="italic">Nexus Hub Standby</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-zinc-400 border-l-2 border-indigo-500/30 pl-3 py-0.5">
                  {log}
                </div>
              ))
            )}
            {isRunning && (
              <div className="mt-10 p-10 bg-white/5 border border-white/5 rounded-3xl text-center">
                <Activity size={32} className="text-indigo-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-white font-bold text-lg">Application Active</h3>
                <p className="text-xs text-white/40 mt-2 max-w-sm mx-auto">
                  Binary is executing within the {targetOS.toUpperCase()} sandbox. Memory and IO are being virtualized by Zypher Multi-Kernel.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexusRunnerApp;
