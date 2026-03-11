
import React, { useState, useContext, useRef } from 'react';
import { 
  Package, Search, Download, Trash2, RefreshCw, 
  ShieldCheck, Cpu, HardDrive, FileCode, Plus, 
  CheckCircle2, AlertCircle, Loader2, Filter,
  ChevronRight, ExternalLink, Box, Apple, Smartphone, Globe
} from 'lucide-react';
import { OSContext } from '../App';
import { APPS_REGISTRY } from '../constants';
import { AppConfig, Platform } from '../types';

const PackageManagerApp: React.FC = () => {
  const os = useContext(OSContext);
  const [activeTab, setActiveTab] = useState<'installed' | 'available' | 'sideload'>('installed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');
  const [sideloadFile, setSideloadFile] = useState<File | null>(null);
  const [isSideloading, setIsSideloading] = useState(false);
  const [sideloadLogs, setSideloadLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!os) return null;
  const { config, installApp, uninstallApp, updatingApps } = os;

  const installedApps = APPS_REGISTRY.filter(app => config.installedAppIds.includes(app.id));
  const availableApps = APPS_REGISTRY.filter(app => !config.installedAppIds.includes(app.id));

  const filteredApps = (activeTab === 'installed' ? installedApps : availableApps).filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         app.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || app.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const handleSideload = async () => {
    if (!sideloadFile) return;
    setIsSideloading(true);
    setSideloadLogs([]);
    
    const addLog = (msg: string) => setSideloadLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    
    addLog(`Analyzing binary: ${sideloadFile.name}...`);
    await new Promise(r => setTimeout(r, 800));
    
    const ext = sideloadFile.name.split('.').pop()?.toLowerCase();
    addLog(`Detected format: .${ext?.toUpperCase()}`);
    
    addLog(`Verifying digital signature...`);
    await new Promise(r => setTimeout(r, 1000));
    addLog(`Signature: OK (Zypher Trusted Developer)`);
    
    addLog(`Extracting payload to /system/apps/${sideloadFile.name.replace(/\.[^/.]+$/, "")}...`);
    await new Promise(r => setTimeout(r, 1200));
    
    addLog(`Registering system hooks...`);
    await new Promise(r => setTimeout(r, 600));
    
    addLog(`INSTALL SUCCESS: ${sideloadFile.name} is now available in the system.`);
    setIsSideloading(false);
    
    // In a real app we'd add it to the registry, but here we just simulate the success
    alert(`Successfully sideloaded ${sideloadFile.name}!`);
    setSideloadFile(null);
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'windows': return <Globe size={14} className="text-blue-400" />;
      case 'macos': return <Apple size={14} className="text-zinc-400" />;
      case 'android': return <Smartphone size={14} className="text-emerald-400" />;
      case 'linux': return <Box size={14} className="text-amber-600" />;
      default: return <Cpu size={14} className="text-indigo-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0c] text-zinc-300 font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-900/50 p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-900/40">
            <Package size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Package Manager</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Zypher Distribution System</p>
          </div>
        </div>
        
        <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
          {[
            { id: 'installed', label: 'Installed', count: installedApps.length },
            { id: 'available', label: 'Available', count: availableApps.length },
            { id: 'sideload', label: 'Sideload', count: null }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'hover:bg-white/5'}`}
            >
              {tab.label}
              {tab.count !== null && <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/5'}`}>{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      {activeTab !== 'sideload' && (
        <div className="px-8 py-4 bg-black/20 border-b border-white/5 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-zinc-500" />
            <select 
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500"
            >
              <option value="all">All Platforms</option>
              <option value="native">Native</option>
              <option value="windows">Windows</option>
              <option value="macos">macOS</option>
              <option value="linux">Linux</option>
              <option value="android">Android</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        {activeTab === 'sideload' ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                <div className="flex items-center gap-4 text-indigo-400">
                  <Plus size={24} />
                  <h3 className="text-xl font-black text-white">Manual Installation</h3>
                </div>
                
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Install applications from local binary files. ZypherOS supports .exe, .msi, .deb, .rpm, .dmg, and .apk via the ZEL translation layer.
                </p>

                <div className="space-y-4">
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => setSideloadFile(e.target.files?.[0] || null)}
                    accept=".exe,.msi,.deb,.rpm,.dmg,.apk,.sh,.bin"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all group"
                  >
                    <FileCode size={32} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm font-bold">{sideloadFile ? sideloadFile.name : 'Select Package File'}</span>
                    <span className="text-[10px] text-zinc-600 uppercase font-black">Max size: 2GB</span>
                  </button>

                  {sideloadFile && (
                    <button 
                      disabled={isSideloading}
                      onClick={handleSideload}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isSideloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18}/>}
                      {isSideloading ? 'Installing...' : 'Install Package'}
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden flex flex-col">
                <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Security Sandbox</span>
                  </div>
                </div>
                <div className="flex-1 p-6 font-mono text-[11px] text-zinc-500 space-y-2 overflow-y-auto custom-scrollbar h-64">
                  {sideloadLogs.length === 0 ? (
                    <div className="h-full flex items-center justify-center italic opacity-20">
                      Waiting for installation...
                    </div>
                  ) : (
                    sideloadLogs.map((log, i) => <div key={i}>{log}</div>)
                  )}
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl flex items-start gap-4">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-500">Security Warning</h4>
                <p className="text-xs text-amber-500/60 leading-relaxed">
                  Sideloading applications bypasses the Zypher Store verification process. Ensure you trust the source of the binary before proceeding. All sideloaded apps run in a restricted ZEL container.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
            {filteredApps.map(app => {
              const isInstalled = config.installedAppIds.includes(app.id);
              const isUpdating = updatingApps.has(app.id);

              return (
                <div key={app.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 hover:bg-white/[0.07] transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                        {/* Simplified icon rendering */}
                        <Package size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">{app.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getPlatformIcon(app.platform)}
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{app.platform}</span>
                        </div>
                      </div>
                    </div>
                    {isInstalled && (
                      <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                        Installed
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {app.description || `Professional ${app.category || 'utility'} application for ZypherOS.`}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Size</span>
                      <span className="text-xs font-bold">{app.size || '42 MB'}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {isInstalled ? (
                        <>
                          <button 
                            disabled={isUpdating}
                            onClick={() => uninstallApp(app.id)}
                            className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                            title="Uninstall"
                          >
                            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                          <button 
                            className="p-2 bg-white/5 text-white/60 hover:bg-white/10 rounded-xl transition-all"
                            title="Update"
                          >
                            <RefreshCw size={16} />
                          </button>
                        </>
                      ) : (
                        <button 
                          disabled={isUpdating}
                          onClick={() => installApp(app.id)}
                          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                          {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                          {isUpdating ? 'Installing...' : 'Install'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-8 py-4 bg-zinc-900/50 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <HardDrive size={12} />
            <span>Storage: 4.2 GB / 256 GB</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw size={12} />
            <span>Last Sync: Just now</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-emerald-500/50">
          <ShieldCheck size={12} />
          <span>Kernel Integrity: Verified</span>
        </div>
      </div>
    </div>
  );
};

export default PackageManagerApp;
