
import React, { useState, useContext, useEffect } from 'react';
import { Globe, Cloud, Download, Server, Code, CheckCircle2, Copy, FileJson, ArrowRight, ExternalLink, Activity, Info, Zap, ShieldCheck, Loader2, Key, ShieldAlert, Fingerprint, Network, Link, Settings2 } from 'lucide-react';
import { OSContext } from '../App';

const DevPortalApp: React.FC = () => {
  const os = useContext(OSContext);
  const [version, setVersion] = useState(os?.config.globalManifest.version || '1.1.0');
  const [isoUrl, setIsoUrl] = useState(os?.config.globalManifest.url || 'https://cdn.zypher-os.io/releases/zypher-v110.iso');
  const [activeTab, setActiveTab] = useState<'releases' | 'cdn' | 'security'>('releases');
  const [isPushing, setIsPushing] = useState(false);
  const [pushProgress, setPushProgress] = useState(0);
  const [pushLogs, setPushLogs] = useState<string[]>([]);
  
  // Simulated Local Keys
  const [devKey, setDevKey] = useState(os?.config.deployment.apiKey || 'zsk_live_8f3d29a1b4c5e6f7a8b9c0d1e2f3a4b5');
  const [fingerprint] = useState('SHA256: 8A:7F:C2:9D:4B:11:0E:99:AA:BB:CC:DD:EE:FF:00:11');

  if (!os) return null;

  const manifestObj = {
    version: version,
    image_url: isoUrl,
    developer_id: os.config.currentUserId || "DEV_MASTER_01",
    signing_key_id: devKey.substring(0, 12) + "...",
    force_atomic_switch: true,
    checksum: "sha256-8a7f...d92c",
    release_notes: "Production build pushed via Zypher Dev Portal.",
    timestamp: Date.now()
  };

  const manifestJson = JSON.stringify(manifestObj, null, 2);

  const addPushLog = (msg: string) => setPushLogs(p => [...p, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handlePush = async () => {
    setIsPushing(true);
    setPushProgress(0);
    setPushLogs([]);

    const isSim = os.config.deployment.isSimulation;
    const endpoint = os.config.deployment.productionUrl;

    addPushLog(`Initiating ${isSim ? 'SIMULATED' : 'PRODUCTION'} Pipeline...`);
    await new Promise(r => setTimeout(r, 800));
    
    addPushLog(`Authenticating with Private Key Hash...`);
    setPushProgress(20);
    await new Promise(r => setTimeout(r, 600));

    if (!isSim && endpoint) {
      addPushLog(`Connecting to Production Host: ${new URL(endpoint).hostname}...`);
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Zypher-Key': devKey,
            'X-Zypher-Version': version
          },
          body: manifestJson
        });

        if (response.ok) {
          // Fixed: Using correctly defined addPushLog instead of undefined addLog
          addPushLog(`HTTP 200: Manifest successfully broadcasted.`);
          setPushProgress(80);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err: any) {
        addPushLog(`CRITICAL ERROR: ${err.message}`);
        addPushLog(`Aborting deployment.`);
        setTimeout(() => setIsPushing(false), 5000);
        return;
      }
    } else {
      addPushLog("Skipping network broadcast (Simulation Mode).");
      setPushProgress(60);
      await new Promise(r => setTimeout(r, 1200));
    }

    addPushLog("Updating internal OS manifest cache...");
    os.setConfig(prev => ({
      ...prev,
      globalManifest: {
        version,
        url: isoUrl,
        releaseNotes: "Production build signed and published.",
        pushedAt: Date.now()
      }
    }));

    setPushProgress(100);
    addPushLog("DEPLOYMENT SUCCESS. The update is now live.");
    
    setTimeout(() => setIsPushing(false), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0c] text-zinc-300 font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-900/50 p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-xl shadow-sky-900/40">
            <Cloud size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Distribution Portal</h1>
            <p className="text-[10px] text-sky-400 font-bold uppercase tracking-[0.2em]">Zypher Edge Network</p>
          </div>
        </div>
        
        <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
          {[
            { id: 'releases', label: 'Releases', icon: <Zap size={14}/> },
            { id: 'cdn', label: 'CDN Info', icon: <Globe size={14}/> },
            { id: 'security', label: 'Bridge Settings', icon: <Settings2 size={14}/> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-sky-600 text-white' : 'hover:bg-white/5'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          
          {activeTab === 'releases' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sky-400">
                      <Zap size={24} />
                      <h3 className="text-xl font-black text-white">Release Control</h3>
                    </div>
                    {os.config.deployment.isSimulation ? (
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[9px] font-black uppercase tracking-widest border border-amber-500/20">Simulation</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Production</span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20">New System Version</label>
                      <input 
                        type="text" 
                        value={version} 
                        onChange={(e) => setVersion(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-sky-500 outline-none text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20">ISO Binary Location (CDN)</label>
                      <input 
                        type="text" 
                        value={isoUrl} 
                        onChange={(e) => setIsoUrl(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-sky-500 outline-none text-white font-mono text-[11px]"
                      />
                    </div>

                    {!isPushing ? (
                      <button 
                        onClick={handlePush}
                        className={`w-full py-4 ${os.config.deployment.isSimulation ? 'bg-sky-600 hover:bg-sky-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-black rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2`}
                      >
                        {os.config.deployment.isSimulation ? <Activity size={18}/> : <Network size={18}/>}
                        {os.config.deployment.isSimulation ? 'PUSH SIMULATION' : 'PUBLISH TO PRODUCTION'}
                      </button>
                    ) : (
                      <div className="space-y-4">
                         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${pushProgress}%` }} />
                         </div>
                         <div className="bg-black/60 rounded-xl p-3 h-32 overflow-y-auto font-mono text-[9px] text-zinc-500 space-y-1 custom-scrollbar">
                           {pushLogs.map((log, i) => <div key={i}>{log}</div>)}
                         </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden flex flex-col">
                  <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileJson size={14} className="text-amber-400" />
                      <span className="text-[10px] font-black uppercase text-white/40">generated_manifest.json</span>
                    </div>
                    <button onClick={() => copyToClipboard(manifestJson)} className="text-white/20 hover:text-white"><Copy size={14}/></button>
                  </div>
                  <pre className="flex-1 p-6 font-mono text-[11px] text-zinc-400 overflow-y-auto">
                    {manifestJson}
                  </pre>
                </div>
              </div>

              <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-3xl p-6 flex items-center gap-4">
                <Info size={20} className="text-indigo-400 shrink-0" />
                <p className="text-xs text-indigo-300/60 leading-relaxed">
                  The Zypher Deployment Engine uses Atomic Switches. When you push, the system generates a delta-patch signed with your Private Key Fingerprint.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cdn' && (
            <div className="space-y-10 animate-in fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {[
                   { label: "Global Traffic", val: "1.2 TB", icon: <Globe className="text-sky-400"/> },
                   { label: "Total Downloads", val: "14,204", icon: <Download className="text-emerald-400"/> },
                   { label: "Server Health", val: "99.9%", icon: <Server className="text-rose-400"/> }
                 ].map(s => (
                   <div key={s.label} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">{s.icon}</div>
                      <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{s.label}</p>
                        <p className="text-2xl font-black text-white">{s.val}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="bg-black/60 border border-white/10 rounded-[40px] p-12 text-center space-y-4">
                <Activity size={48} className="mx-auto text-sky-500/50" />
                <h3 className="text-xl font-black text-white">Edge Node Distribution</h3>
                <p className="text-zinc-500 max-w-sm mx-auto text-sm">Your manifest and ISO are currently mirrored on 12 global nodes.</p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
               <div className="space-y-4">
                 <h2 className="text-3xl font-black text-white tracking-tight italic">Bridge Settings</h2>
                 <p className="text-zinc-500 leading-relaxed">Configure the real-world connection between ZypherOS and your distribution server.</p>
               </div>

               <div className="grid grid-cols-1 gap-8">
                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <Link className="text-indigo-400" size={24} />
                           <h4 className="text-xl font-black text-white">Production Endpoint</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase cursor-pointer">Simulation</label>
                          <button 
                            onClick={() => os.setConfig(prev => ({ ...prev, deployment: { ...prev.deployment, isSimulation: !prev.deployment.isSimulation } }))}
                            className={`w-12 h-6 rounded-full transition-colors relative ${!os.config.deployment.isSimulation ? 'bg-emerald-600' : 'bg-white/10'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${!os.config.deployment.isSimulation ? 'left-7' : 'left-1'}`} />
                          </button>
                          <label className="text-[10px] font-bold text-white/40 uppercase cursor-pointer">Production</label>
                        </div>
                     </div>
                     
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-white/20 tracking-widest">Webhook / API URL</label>
                           <input 
                              type="text" 
                              placeholder="https://api.yourdomain.com/publish-os"
                              value={os.config.deployment.productionUrl}
                              onChange={(e) => os.setConfig(p => ({ ...p, deployment: { ...p.deployment, productionUrl: e.target.value } }))}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-indigo-500 outline-none text-white font-mono text-xs"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-white/20 tracking-widest">Secret Auth Token</label>
                           <input 
                              type="password" 
                              placeholder="••••••••••••••••"
                              value={os.config.deployment.apiKey}
                              onChange={(e) => os.setConfig(p => ({ ...p, deployment: { ...p.deployment, apiKey: e.target.value } }))}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-indigo-500 outline-none text-white font-mono text-xs"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[32px] p-10 flex items-center gap-8">
                     <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                        <ShieldCheck size={40} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-2xl font-black text-white tracking-tight">Deployment Security</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                           In Production mode, your secret token is sent via the <code>X-Zypher-Key</code> header. 
                           Ensure your endpoint is HTTPS-enabled to prevent interception.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>

      <div className="p-4 bg-black border-t border-white/5 flex items-center justify-around text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
        <span className="flex items-center gap-2"><Cloud size={12}/> GATEWAY: {os.config.deployment.isSimulation ? 'LOCAL_STUB' : 'LIVE_PROD'}</span>
        <span className="flex items-center gap-2"><Globe size={12}/> {os.config.deployment.productionUrl ? new URL(os.config.deployment.productionUrl).hostname : 'DISCONNECTED'}</span>
        <span className="flex items-center gap-2"><CheckCircle2 size={12}/> AUTO-SIGN: ENABLED</span>
      </div>
    </div>
  );
};

export default DevPortalApp;
