
import React, { useState, useContext, useEffect } from 'react';
import { Apple, Search, ArrowRight, Download, Star, Command, ShieldCheck, Cpu, Loader2 } from 'lucide-react';
import { OSContext } from '../App';
import { StoreService, AppData } from '../services/StoreService';

const AppleStoreApp: React.FC = () => {
  const os = useContext(OSContext);
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async (query?: string) => {
    setLoading(true);
    const results = await StoreService.fetchAppleApps(query || 'popular');
    setApps(results);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApps(searchQuery);
  };

  if (!os) return null;

  return (
    <div className="h-full flex bg-[#0a0a0c] text-zinc-300 font-sans overflow-hidden">
      <div className="w-64 bg-zinc-900/50 backdrop-blur-md border-r border-white/5 flex flex-col p-6 gap-6 text-zinc-500">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
           Discover
        </h1>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input 
            type="text" 
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </form>
        <nav className="flex flex-col gap-1">
          {['Create', 'Work', 'Play', 'Develop', 'Categories', 'Updates'].map(item => (
            <button key={item} className={`px-3 py-1.5 text-sm font-medium rounded-lg text-left ${item === 'Develop' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-zinc-400 hover:text-white'}`}>
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-sm font-bold animate-pulse uppercase tracking-widest">Connecting to Apple Servers...</p>
          </div>
        ) : (
          <>
            <div>
               <h2 className="text-3xl font-black mb-6 text-white">Built for Zypher-Nectar</h2>
               <div className="grid grid-cols-2 gap-6">
                  {apps.map(app => {
                    const isInstalled = os.config.installedAppIds.includes(app.id);
                    const isUpdating = os.updatingApps.has(app.id);

                    return (
                      <div key={app.id} className="bg-white/5 rounded-3xl p-6 shadow-sm border border-white/10 flex items-center gap-5 hover:bg-white/[0.08] transition-all group">
                        <div className="w-24 h-24 flex items-center justify-center bg-black/20 rounded-2xl group-hover:rotate-3 transition-transform overflow-hidden">
                          <img src={app.icon} className="w-full h-full object-cover" alt={app.name} referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-black text-xl text-white truncate w-48">{app.name}</h3>
                          <p className="text-sm text-zinc-500">{app.category}</p>
                          <div className="mt-4 flex items-center justify-between">
                             <button 
                              disabled={isInstalled || isUpdating}
                              onClick={() => os.installApp(app.id)}
                              className={`px-6 py-1.5 rounded-full text-xs font-black transition-all ${isInstalled ? 'bg-white/5 text-zinc-600 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'}`}
                             >
                               {isUpdating ? <Loader2 size={12} className="animate-spin" /> : (isInstalled ? 'OPEN' : 'GET')}
                             </button>
                             <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{app.size}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
               <Apple className="absolute -right-10 -bottom-10 opacity-10 w-64 h-64" />
               <div className="relative z-10 max-w-lg space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-70">Zypher Exclusive</h4>
                  <h3 className="text-4xl font-black text-white">X-Hybrid Translation</h3>
                  <p className="text-white/80 leading-relaxed font-medium">ZypherOS uses the Nectar Kernel Bridge to execute macOS binaries directly on web-emulated ARM64 infrastructure with near-native performance.</p>
                  <div className="flex items-center gap-6 pt-4">
                     <div className="flex items-center gap-2 text-xs font-bold"><ShieldCheck size={16}/> Security Verified</div>
                     <div className="flex items-center gap-2 text-xs font-bold"><Cpu size={16}/> ARM-Native</div>
                  </div>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppleStoreApp;
