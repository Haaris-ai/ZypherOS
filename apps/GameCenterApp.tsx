
import React, { useState } from 'react';
import { Gamepad2, Play, Download, Settings, Shield, Zap, Info, Cpu, Layers, Activity } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  developer: string;
  icon: string;
  banner: string;
  description: string;
  version: string;
  status: 'installed' | 'not_installed' | 'updating';
  type: 'Java' | 'Bedrock' | 'Native';
}

const GAMES: Game[] = [
  {
    id: 'mc-java',
    name: 'Minecraft: Java Edition',
    developer: 'Mojang Studios',
    icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/minecraft_logo_icon_168974.png',
    banner: 'https://images.unsplash.com/photo-1649232822435-010484501460?q=80&w=2000&auto=format&fit=crop',
    description: 'The original version of Minecraft. Java Edition has cross-platform play between Windows, Linux and macOS, and also supports user-created skins and mods.',
    version: '1.21.1',
    status: 'installed',
    type: 'Java'
  },
  {
    id: 'mc-bedrock',
    name: 'Minecraft: Bedrock Edition',
    developer: 'Mojang Studios',
    icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/minecraft_logo_icon_168974.png',
    banner: 'https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?q=80&w=2000&auto=format&fit=crop',
    description: 'Experience the world of Minecraft on ZypherOS. Optimized for ZEL ARM64 Translation Layer.',
    version: '1.20.80',
    status: 'installed',
    type: 'Bedrock'
  },
  {
    id: 'roblox',
    name: 'Roblox Client',
    developer: 'Roblox Corp',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Roblox_player_icon.png',
    banner: 'https://images.unsplash.com/photo-1605898835373-0234440b883e?q=80&w=2000&auto=format&fit=crop',
    description: 'Roblox is an online game platform and game creation system that allows users to program games and play games created by other users.',
    version: 'v2.628',
    status: 'not_installed',
    type: 'Native'
  }
];

const GameCenterApp: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game>(GAMES[0]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);

  const handleLaunch = () => {
    setIsLaunching(true);
    setLaunchProgress(0);
    const interval = setInterval(() => {
      setLaunchProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLaunching(false);
            alert(`${selectedGame.name} has launched! ZEL (Zypher Emulation Layer) is now handling DirectX to WebGL translation.`);
          }, 500);
          return 100;
        }
        return p + Math.random() * 20;
      });
    }, 200);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900 border-r border-white/5 p-4 flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <Gamepad2 className="text-rose-500" size={24} />
            <h1 className="text-lg font-bold tracking-tight">Game Center</h1>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mb-2">My Library</p>
            {GAMES.map(game => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${selectedGame.id === game.id ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
              >
                <img src={game.icon} alt="" className="w-6 h-6 rounded shadow-sm object-contain" />
                <span className="font-medium truncate">{game.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-1">
             <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-all">
                <Settings size={14} /> Settings
             </button>
             <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-all">
                <Shield size={14} /> Security Sandbox
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col relative">
          {/* Banner */}
          <div className="h-72 w-full relative shrink-0">
            <img src={selectedGame.banner} className="w-full h-full object-cover opacity-60" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div className="flex items-center gap-6">
                <img src={selectedGame.icon} className="w-24 h-24 rounded-2xl shadow-2xl border border-white/10 p-2 bg-zinc-900" alt="" />
                <div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg">{selectedGame.name}</h2>
                  <p className="text-zinc-400 mt-1 font-medium">{selectedGame.developer} • {selectedGame.type}</p>
                </div>
              </div>

              {isLaunching ? (
                <div className="w-64 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Initializing ZEL...</span>
                      <span className="text-xs font-mono">{Math.floor(launchProgress)}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 transition-all duration-300" 
                        style={{ width: `${launchProgress}%` }}
                      />
                   </div>
                </div>
              ) : (
                <button 
                  onClick={handleLaunch}
                  className="bg-rose-600 hover:bg-rose-500 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-rose-900/20 transition-all active:scale-95 flex items-center gap-3 group"
                >
                  <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                  PLAY NOW
                </button>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-8 grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Info size={20} className="text-rose-500" />
                  About this game
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {selectedGame.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                       <Zap size={18} className="text-amber-400" />
                       <span className="text-sm font-bold">ZEL Optimization</span>
                    </div>
                    <p className="text-xs text-zinc-500">Enhanced DirectX 12 to WebGL 2.0 translation enabled for this title.</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                       <Shield size={18} className="text-emerald-400" />
                       <span className="text-sm font-bold">Cloud Verified</span>
                    </div>
                    <p className="text-xs text-zinc-500">Security scanned and containerized for native ZypherOS execution.</p>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/5 space-y-4">
                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">Specifications</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Version</span>
                    <span className="font-mono">{selectedGame.version}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Runtime</span>
                    <span className="text-rose-400 font-medium">{selectedGame.type}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Arch</span>
                    <span className="text-indigo-400 font-medium">Hybrid (ZEL)</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-rose-500">
                  <Activity size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-white/30 uppercase">System Status</p>
                   <p className="text-xs font-medium text-emerald-400">Ready for Launch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCenterApp;
