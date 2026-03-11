
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Globe } from 'lucide-react';

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [inputValue, setInputValue] = useState('https://www.google.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputValue;
    if (!target.startsWith('http')) target = 'https://' + target;
    setUrl(target);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0c] text-zinc-300">
      {/* Browser Nav */}
      <div className="bg-zinc-900/50 border-b border-white/5 p-2 flex items-center gap-3">
        <div className="flex items-center gap-1 text-zinc-500">
          <button className="p-1.5 hover:bg-white/5 rounded-full transition-colors"><ArrowLeft size={16} /></button>
          <button className="p-1.5 hover:bg-white/5 rounded-full transition-colors"><ArrowRight size={16} /></button>
          <button className="p-1.5 hover:bg-white/5 rounded-full transition-colors"><RotateCw size={16} /></button>
          <button className="p-1.5 hover:bg-white/5 rounded-full transition-colors"><Home size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
            <Globe size={14} />
          </div>
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-blue-500/50 rounded-full py-1.5 pl-9 pr-4 text-sm text-white transition-all focus:outline-none"
          />
        </form>

        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10">
          <img src="https://picsum.photos/32/32" alt="Avatar" referrerPolicy="no-referrer" />
        </div>
      </div>

      {/* Simulated Iframe Content */}
      <div className="flex-1 flex flex-col items-center justify-center bg-black/20 text-center p-12">
        <div className="w-24 h-24 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/10">
          <Globe size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Zypher Browser</h2>
        <p className="text-zinc-500 max-w-md mb-8">
          The security sandbox is preventing the rendering of external iframe: <span className="font-mono text-blue-400">{url}</span>
        </p>
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
          {['Google', 'GitHub', 'YouTube', 'Wikipedia', 'Zypher Cloud', 'AI Studio'].map(item => (
            <button key={item} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-white/10 hover:shadow-lg transition-all text-sm font-medium text-white">
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowserApp;
