
import React, { useState, useContext } from 'react';
import { Search, LogOut, User } from 'lucide-react';
import { APPS_REGISTRY, getIcon } from '../constants';
import { AppID } from '../types';
import { OSContext } from '../App';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (id: AppID) => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({ isOpen, onClose, onLaunch }) => {
  const [search, setSearch] = useState('');
  const os = useContext(OSContext);

  if (!isOpen || !os) return null;

  const currentUser = os.config.users.find(u => u.id === os.config.currentUserId);

  // Only show apps that are initial OR installed via stores
  // ADDED: Special check for 'DEV' user for Dev Portal and Distro Builder visibility
  const visibleApps = APPS_REGISTRY.filter(app => {
    // Identity Check for Developer Tools
    const isDevOnlyApp = ['dev-portal', 'distro-builder'].includes(app.id);
    if (isDevOnlyApp && currentUser?.name !== 'DEV') {
      return false;
    }

    return (app.isInitial || os.config.installedAppIds.includes(app.id)) &&
           app.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="absolute inset-x-0 bottom-12 top-0 z-[9998] flex flex-col items-center justify-end pb-12 animate-in slide-in-from-bottom duration-300">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-zinc-900/90 rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col gap-8 max-h-[80%] overflow-hidden">
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input 
            autoFocus
            type="text"
            placeholder="Search apps, files, and more..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-6 custom-scrollbar pb-8">
          {visibleApps.map(app => (
            <button
              key={app.id}
              onClick={() => onLaunch(app.id)}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/10 group transition-all"
            >
              <div className={`w-16 h-16 rounded-3xl ${app.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform relative`}>
                {getIcon(app.icon, 32)}
                {os.updatingApps.has(app.id) && (
                  <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-medium text-white/90 text-center truncate w-full">{app.name}</span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{app.platform}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  <User size={20} />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{currentUser?.name || 'Guest'}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Zypher ID: {currentUser?.id.slice(0, 8) || 'N/A'}</span>
            </div>
          </div>
          <button 
            onClick={() => os.logout()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-500 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppDrawer;
