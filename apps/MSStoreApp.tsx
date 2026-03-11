
import React, { useState, useEffect, useContext } from 'react';
import { Search, Download, Star, ChevronRight, Layout, Zap, Monitor, Globe, Loader2 } from 'lucide-react';
import { StoreService, AppData } from '../services/StoreService';
import { OSContext } from '../App';

const MSStoreApp: React.FC = () => {
  const os = useContext(OSContext);
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async (query?: string) => {
    setLoading(true);
    const results = await StoreService.fetchMSStoreApps(query || 'top windows apps');
    setApps(results);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApps(searchQuery);
  };

  if (!os) return null;

  return (
    <div className="h-full flex flex-col bg-[#1c1c1c] text-white font-sans overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sky-600 rounded flex items-center justify-center">
            <Layout size={24} />
          </div>
          <h1 className="text-xl font-bold">Microsoft Store</h1>
        </div>
        <form onSubmit={handleSearch} className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input 
            type="text" 
            placeholder="Search apps, games, and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:bg-white/10 transition-all"
          />
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-sky-500" size={48} />
            <p className="text-sm font-bold animate-pulse uppercase tracking-widest text-sky-500/60">Connecting to Microsoft Servers...</p>
          </div>
        ) : (
          <>
            <div className="relative h-64 rounded-2xl overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Banner" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-12 gap-2">
                <span className="text-sky-400 font-bold text-xs uppercase tracking-widest">Featured Game</span>
                <h2 className="text-4xl font-black">{apps[0]?.name || 'Halo Infinite'}</h2>
                <p className="text-white/60 max-w-sm">{apps[0]?.description || 'Experience the legendary combat on ZypherOS ZEL runtime.'}</p>
                <button className="mt-4 px-8 py-2 bg-sky-500 hover:bg-sky-400 rounded-md font-bold text-sm self-start transition-all">Get it now</button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-bold">Top Windows Apps</h3>
                <button className="text-sky-400 text-sm flex items-center gap-1 hover:underline">See all <ChevronRight size={14}/></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {apps.map(app => {
                  const isInstalled = os.config.installedAppIds.includes(app.id);
                  const isUpdating = os.updatingApps.has(app.id);

                  return (
                    <div key={app.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
                      <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform overflow-hidden">
                        <img src={app.icon} className="w-full h-full object-contain" alt={app.name} referrerPolicy="no-referrer" />
                      </div>
                      <h4 className="font-bold text-sm text-center mb-1 truncate">{app.name}</h4>
                      <p className="text-[10px] text-white/40 text-center mb-3">{app.category}</p>
                      <button 
                        disabled={isInstalled || isUpdating}
                        onClick={() => os.installApp(app.id)}
                        className={`w-full py-2 rounded-md text-[11px] font-bold transition-all border ${isInstalled ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 hover:bg-sky-600'}`}
                      >
                        {isUpdating ? <Loader2 size={12} className="animate-spin mx-auto" /> : (isInstalled ? 'Installed' : 'Install')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MSStoreApp;
