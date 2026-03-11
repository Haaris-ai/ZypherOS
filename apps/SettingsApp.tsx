
import React, { useContext, useState, useEffect } from 'react';
import { Monitor, Wifi, Bluetooth, Palette, User, Info, Layout, Check, ShieldCheck, Lock, Scan, Trash2, Plus, LogOut, Loader2, ShieldAlert, Cpu, RefreshCw, Database, HardDrive, CheckCircle2, ArrowUpCircle, CloudDownload, Globe, Zap, History } from 'lucide-react';
import { OSContext } from '../App';
import { UserAccount } from '../types';

const WALLPAPERS = [
  { name: 'Bloom', url: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2564&auto=format&fit=crop' },
  { name: 'Night City', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2564&auto=format&fit=crop' },
];

const SettingsApp: React.FC = () => {
  const os = useContext(OSContext);
  const [activeTab, setActiveTab] = useState('display');
  const [showAddUser, setShowAddUser] = useState(false);
  
  // Advanced Update Engine State
  const [updateState, setUpdateState] = useState<'idle' | 'checking' | 'downloading' | 'ready' | 'applying' | 'success' | 'up-to-date'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [updateLog, setUpdateLog] = useState<string[]>([]);
  const [newVersionFound, setNewVersionFound] = useState('');

  if (!os) return null;
  const { config, setConfig } = os;
  const currentUser = config.users.find(u => u.id === config.currentUserId);

  const addUpdateLog = (msg: string) => setUpdateLog(p => [...p, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const removeUser = (id: string) => {
    setConfig(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== id)
    }));
  };

  const checkForUpdates = () => {
    setUpdateState('checking');
    setUpdateLog([]);
    addUpdateLog("Connecting to OTA Gateway...");
    addUpdateLog("Source: ota.zypher-os.io/manifest.json");
    
    setTimeout(() => {
      const globalVersion = config.globalManifest.version;
      const currentVersion = config.currentSystemVersion;

      if (globalVersion !== currentVersion) {
        addUpdateLog(`UPDATE FOUND: ZypherOS v${globalVersion}`);
        addUpdateLog(`Current Version: v${currentVersion}`);
        addUpdateLog("Type: Delta Binary Update");
        setNewVersionFound(globalVersion);
        setUpdateState('downloading');
      } else {
        addUpdateLog(`System is up to date (v${currentVersion})`);
        setUpdateState('up-to-date');
      }
    }, 2000);
  };

  useEffect(() => {
    if (updateState === 'downloading') {
      const interval = setInterval(() => {
        setDownloadProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setUpdateState('ready');
            addUpdateLog("Download verified (Checksum OK).");
            addUpdateLog("Update staged in Slot B (Inactive).");
            return 100;
          }
          return p + Math.random() * 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [updateState]);

  const applyUpdate = () => {
    setUpdateState('applying');
    addUpdateLog("Atomic Swap initiated...");
    addUpdateLog("Updating bootloader pointer to Slot B...");
    
    setTimeout(() => {
      setUpdateState('success');
      setConfig(prev => ({
        ...prev,
        currentSystemVersion: newVersionFound
      }));
      addUpdateLog(`Successfully updated to v${newVersionFound}!`);
    }, 3000);
  };

  const renderUpdates = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all shadow-xl ${updateState === 'success' ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
              {updateState === 'checking' || updateState === 'applying' ? <RefreshCw className="animate-spin" size={28} /> : updateState === 'success' ? <CheckCircle2 size={28} /> : <CloudDownload size={28} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Software Update</h3>
              <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">ZypherOS v{config.currentSystemVersion}</p>
            </div>
          </div>
          {(updateState === 'idle' || updateState === 'up-to-date') && (
            <button onClick={checkForUpdates} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all shadow-lg active:scale-95">
              {updateState === 'up-to-date' ? 'CHECK AGAIN' : 'CHECK FOR UPDATES'}
            </button>
          )}
        </div>

        {/* Partition Map Visualization */}
        <div className="space-y-4">
           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
              <span>Atomic Partition Map</span>
              <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck size={12}/> Persistence Health: OK</span>
           </div>
           <div className="grid grid-cols-12 h-14 bg-black/40 rounded-2xl border border-white/5 p-1 gap-1">
              <div className={`col-span-3 rounded-xl border flex items-center justify-center text-[9px] font-black transition-all ${config.currentSystemVersion === config.globalManifest.version ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-zinc-800 border-white/5 text-white/20'}`}>
                SYSTEM A {config.currentSystemVersion !== config.globalManifest.version && '(IDLE)'}
              </div>
              <div className={`col-span-3 rounded-xl border flex items-center justify-center text-[9px] font-black transition-all ${updateState === 'ready' || updateState === 'applying' ? 'bg-amber-500 border-amber-400 text-black animate-pulse' : (config.currentSystemVersion === config.globalManifest.version && updateState === 'success') ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-zinc-800 border-white/5 text-white/20'}`}>
                SYSTEM B
              </div>
              <div className="col-span-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-[9px] font-black text-emerald-400">
                USER DATA (PERSISTENT)
              </div>
           </div>
           <p className="text-[10px] text-zinc-500 leading-relaxed italic">
            ZypherOS utilizes an <b>A/B Partitioning</b> system. Updates are staged in the background. 
            Reboot to switch to the new version instantly.
           </p>
        </div>

        {(updateState === 'downloading' || updateState === 'ready' || updateState === 'applying' || updateState === 'success') && (
          <div className="space-y-4 animate-in slide-in-from-bottom-2">
            <div className="flex justify-between items-end mb-2">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Progress</p>
                  <p className="text-sm font-bold text-white">
                    {updateState === 'downloading' ? `Downloading v${newVersionFound}...` : 
                     updateState === 'ready' ? 'Ready to Install' : 
                     updateState === 'applying' ? 'Switching slots...' : 'Update Applied'}
                  </p>
               </div>
               <span className="text-xl font-black font-mono text-indigo-400">{Math.floor(downloadProgress)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
               <div className={`h-full transition-all duration-300 ${updateState === 'success' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]'}`} style={{ width: `${downloadProgress}%` }} />
            </div>

            {updateState === 'ready' && (
              <button 
                onClick={applyUpdate}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Zap size={18} fill="currentColor" />
                INSTALL & REBOOT
              </button>
            )}

            <div className="bg-black/60 rounded-2xl border border-white/5 p-4 h-32 overflow-y-auto custom-scrollbar font-mono text-[10px] text-zinc-500 space-y-1">
              {updateLog.map((log, i) => <div key={i} className="flex gap-2"><span className="text-indigo-500/50">OTA {" >>"}</span> {log}</div>)}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
               <History size={20} />
            </div>
            <div>
               <p className="text-sm font-bold">Cloud Status</p>
               <p className="text-[10px] text-zinc-500 uppercase font-black">Latest release: v{config.globalManifest.version}</p>
            </div>
         </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
        <div className="flex items-center gap-6">
          <img src={currentUser?.avatar} className="w-20 h-20 rounded-full border-2 border-indigo-500/30" alt="" />
          <div>
            <h2 className="text-xl font-black">{currentUser?.name}</h2>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">{currentUser?.role}</p>
          </div>
        </div>
        <button onClick={() => os.logout()} className="flex items-center gap-2 px-6 py-2 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-black transition-all">
          <LogOut size={16}/> LOGOUT
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">Manage Users</h3>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-lg border border-white/10 transition-all">
            <Plus size={16}/> ADD USER
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {config.users.map(u => (
            <div key={u.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <img src={u.avatar} className="w-10 h-10 rounded-full" alt="" />
                <span className="font-bold text-sm">{u.name} {u.id === currentUser?.id && <span className="text-[10px] text-indigo-400 ml-2">(You)</span>}</span>
              </div>
              {u.id !== currentUser?.id && u.role !== 'admin' && (
                <button onClick={() => removeUser(u.id)} className="p-2 text-white/20 hover:text-rose-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex bg-[#0d0d0f] text-white font-sans overflow-hidden">
      <div className="w-64 bg-black/40 p-6 flex flex-col gap-6 border-r border-white/5">
        <h1 className="text-xl font-black mb-4">Settings</h1>
        <div className="flex flex-col gap-1">
          {[
            { id: 'display', name: 'Appearance', icon: <Palette size={18} /> },
            { id: 'updates', name: 'Software Update', icon: <RefreshCw size={18} /> },
            { id: 'account', name: 'Users & Security', icon: <User size={18} /> },
            { id: 'about', name: 'Zypher Info', icon: <Info size={18} /> },
          ].map(s => (
            <button key={s.id} onClick={() => setActiveTab(s.id)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${activeTab === s.id ? 'bg-white/10 text-white border border-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              <span className={activeTab === s.id ? 'text-indigo-400' : 'text-white/20'}>{s.icon}</span>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto">
          {activeTab === 'updates' && renderUpdates()}
          {activeTab === 'account' && renderAccount()}
          {activeTab === 'display' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-black mb-6">Appearance</h2>
              <div className="grid grid-cols-2 gap-4">
                {WALLPAPERS.map(wp => (
                  <button key={wp.url} onClick={() => setConfig(p => ({ ...p, wallpaper: wp.url }))} className={`relative aspect-video rounded-2xl overflow-hidden border-2 transition-all ${config.wallpaper === wp.url ? 'border-indigo-500 scale-95' : 'border-transparent hover:border-white/20'}`}>
                    <img src={wp.url} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in text-center py-12">
              <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-indigo-900/50">
                <Cpu size={48} />
              </div>
              <h2 className="text-3xl font-black">ZypherOS v{config.currentSystemVersion}</h2>
              <p className="text-white/40 max-w-sm mx-auto">Standalone Hybrid Kernel. Optimized for persistence and atomic upgrades.</p>
              <div className="pt-12 text-[10px] font-bold text-white/10 uppercase tracking-[0.4em]">Partition Status: HEALTHY</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
