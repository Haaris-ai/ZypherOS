
import React, { useState, useEffect, useContext } from 'react';
import { Search, Bell, Smartphone, Gamepad2, PlaySquare, Book, MoreVertical, Download, Star, Loader2 } from 'lucide-react';
import { StoreService, AppData } from '../services/StoreService';
import { OSContext } from '../App';

const GooglePlayApp: React.FC = () => {
  const os = useContext(OSContext);
  const [activeTab, setActiveTab] = useState('apps');
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async (query?: string) => {
    setLoading(true);
    const results = await StoreService.fetchGooglePlayApps(query || 'trending apps');
    setApps(results);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApps(searchQuery);
  };

  if (!os) return null;

  return (
    <div className="h-full flex flex-col bg-[#0a0a0c] text-zinc-300 font-sans overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-zinc-900/50">
        <div className="flex items-center gap-6">
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Google_Play_Arrow_logo.svg/1200px-Google_Play_Arrow_logo.svg.png" className="w-8 h-8 object-contain" alt="Play logo" />
           <form onSubmit={handleSearch} className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search apps & games"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
           </form>
        </div>
        <div className="flex items-center gap-4">
           <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"><Bell size={20}/></button>
           <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/20">Z</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
         <div className="px-8 py-4 flex gap-8 border-b border-white/5 bg-black/20">
            {[
              { id: 'games', icon: <Gamepad2 size={18}/>, label: 'Games' },
              { id: 'apps', icon: <Smartphone size={18}/>, label: 'Apps' },
              { id: 'offers', icon: <PlaySquare size={18}/>, label: 'Offers' },
              { id: 'books', icon: <Book size={18}/>, label: 'Books' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-2 text-sm font-medium transition-all relative ${activeTab === tab.id ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />}
              </button>
            ))}
         </div>

         <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-emerald-500" size={48} />
                <p className="text-sm font-bold animate-pulse uppercase tracking-widest text-emerald-500/60">Connecting to Google Play Servers...</p>
              </div>
            ) : (
              <>
                <section>
                   <h3 className="text-xl font-bold mb-6 text-white">Recommended for you</h3>
                   <div className="flex gap-10 overflow-x-auto pb-4 no-scrollbar">
                      {apps.map(app => (
                        <div key={app.id} className="flex flex-col items-center gap-2 group cursor-pointer min-w-[100px]">
                           <div className="w-24 h-24 rounded-[28%] bg-white/5 shadow-md border border-white/10 flex items-center justify-center p-4 group-hover:scale-105 group-hover:bg-white/10 transition-all overflow-hidden">
                              <img src={app.icon} className="w-full h-full object-contain" alt={app.name} referrerPolicy="no-referrer" />
                           </div>
                           <div className="text-center">
                              <h4 className="text-xs font-bold truncate w-24 text-zinc-300">{app.name}</h4>
                              <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-500">
                                 {app.rating} <Star size={8} fill="currentColor" />
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>

                <section>
                   <h3 className="text-xl font-bold mb-6 text-white">Popular Apps</h3>
                   <div className="space-y-4">
                      {apps.slice(0, 5).map((app, i) => (
                        <div key={app.id} className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-2xl transition-all group border border-transparent hover:border-white/5">
                           <span className="text-sm font-bold text-zinc-600 w-4">{i + 1}</span>
                           <img src={app.icon} className="w-16 h-16 rounded-2xl object-contain border border-white/10 p-2 bg-black/20" alt={app.name} referrerPolicy="no-referrer" />
                           <div className="flex-1">
                              <h4 className="font-bold text-white">{app.name}</h4>
                              <p className="text-xs text-zinc-500">{app.category} • {app.size}</p>
                              <div className="flex items-center gap-1 mt-1">
                                 <Star size={10} className="text-zinc-500" />
                                 <span className="text-[10px] text-zinc-500">{app.rating}</span>
                              </div>
                           </div>
                           <button 
                            onClick={() => os.installApp(app.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
                           >
                             Install
                           </button>
                        </div>
                      ))}
                   </div>
                </section>
              </>
            )}
         </div>
      </div>
    </div>
  );
};

export default GooglePlayApp;
