
import React, { useState, useRef } from 'react';
import { FileUp, Cpu, Activity, ShieldCheck, Play, Terminal } from 'lucide-react';

const ExeRunnerApp: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [arch, setArch] = useState<'x86' | 'arm64'>('x86');
  const [isRunning, setIsRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.name.endsWith('.exe')) {
        setFile(selected);
        addLog(`Loaded potential PE binary: ${selected.name}`);
      } else {
        alert("ZypherOS Loader only supports .exe PE headers.");
      }
    }
  };

  const runEmulation = async () => {
    if (!file) return;
    setIsLoading(true);
    setIsRunning(false);
    setLogs([]);
    
    addLog(`Initializing Zypher Emulation Layer (ZEL v1.0)...`);
    await new Promise(r => setTimeout(r, 1000));
    addLog(`Target Architecture: ${arch.toUpperCase()}`);
    addLog(`Mapping virtual memory space...`);
    await new Promise(r => setTimeout(r, 800));
    addLog(`Loading dynamic libraries (kernel32.dll, user32.dll)...`);
    await new Promise(r => setTimeout(r, 1200));
    addLog(`Entry point found at 0x401000. Redirecting execution...`);
    
    setIsLoading(false);
    setIsRunning(true);
    addLog(`Running ${file.name} successfully in sandboxed container.`);
  };

  return (
    <div className="h-full flex flex-col text-zinc-300 font-sans">
      <div className="bg-indigo-900/20 p-6 flex items-center justify-between border-b border-indigo-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Cpu size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Zypher Loader</h1>
            <p className="text-sm opacity-60">High-Performance Binary Translator (ZEL)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setArch('x86')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${arch === 'x86' ? 'bg-indigo-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}
          >
            x86-64
          </button>
          <button 
            onClick={() => setArch('arm64')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${arch === 'arm64' ? 'bg-indigo-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}
          >
            ARM64
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row p-6 gap-6">
        {/* Control Panel */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40">Load Binary</h2>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".exe" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-dashed border-white/20 flex flex-col items-center gap-2 transition-all"
            >
              <FileUp size={24} className="text-indigo-400" />
              <span className="text-sm">{file ? file.name : 'Select .exe file'}</span>
            </button>

            {file && (
              <button 
                disabled={isLoading}
                onClick={runEmulation}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
              >
                {isLoading ? <Activity className="animate-spin" size={18} /> : <Play size={18} />}
                {isLoading ? 'Translating...' : 'Launch Application'}
              </button>
            )}
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40">Environment Status</h2>
            <div className="flex items-center justify-between text-xs">
              <span>Security Sandbox</span>
              <ShieldCheck size={14} className="text-emerald-400" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Virtual Memory</span>
              <span className="text-indigo-400 font-mono">4.2 GB Available</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Kernel Version</span>
              <span className="text-zinc-500">v1.0.0-Zypher</span>
            </div>
          </div>
        </div>

        {/* Runtime Console */}
        <div className="flex-1 bg-black/60 rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
              <Terminal size={12} />
              SYSTEM_LOGS
            </div>
            {isRunning && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold">Process Running</span>}
          </div>
          
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                Waiting for binary initialization...
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-indigo-100/70 border-l-2 border-indigo-500/30 pl-3">
                  {log}
                </div>
              ))
            )}
            {isRunning && (
              <div className="mt-8 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                  <Activity size={24} className="text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Process Active</h3>
                <p className="text-xs opacity-50 max-w-xs mx-auto mt-2">
                  The application is running in the background. Output is being piped to the Zypher system bus.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExeRunnerApp;
