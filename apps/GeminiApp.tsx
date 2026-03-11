
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Cpu, Zap, Shield, Database } from 'lucide-react';
import { gemini } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const GeminiApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Zypher Core AI v1.0 initialized. Local Intelligence Engine is standby. How can I assist with your system today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await gemini.chat(input);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response || 'Error: Local processing pipeline interrupted.' };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0c] text-white font-sans">
      {/* Native System Header */}
      <div className="px-6 py-4 bg-zinc-900/50 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Zypher Core AI</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Local Engine Active</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <p className="text-[9px] text-white/30 font-bold uppercase">Neural Load</p>
            <div className="h-1 w-24 bg-white/5 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-indigo-500 w-[15%] transition-all"></div>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/5 mx-2"></div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
            <Zap size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold text-white/60">ZEL-ACCEL: ON</span>
          </div>
        </div>
      </div>

      {/* Local Context Banner */}
      <div className="bg-indigo-500/5 px-6 py-2 border-b border-indigo-500/10 flex items-center gap-3">
        <Database size={10} className="text-indigo-400" />
        <p className="text-[10px] text-indigo-300/60 font-mono">
          Context: C:\Users\zypher\SystemRoot\ActiveContext.json [READONLY]
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-zinc-800 text-indigo-400 border border-white/5'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-white/5'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-800 text-indigo-400 flex items-center justify-center border border-white/5">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="bg-zinc-900 text-zinc-500 px-5 py-3.5 rounded-2xl rounded-tl-none border border-white/5 italic text-xs flex items-center gap-3">
              <Zap size={12} className="animate-pulse text-indigo-500" />
              Localizing response via ZEL...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-zinc-900/30 border-t border-white/5">
        <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto w-full">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command local engine (e.g., 'Check ZEL status', 'List system files')..."
            className="w-full bg-zinc-900 border border-white/10 focus:border-indigo-500/50 rounded-2xl py-4 pl-6 pr-14 text-[13px] text-white placeholder:text-white/10 focus:outline-none transition-all shadow-inner"
          />
          <button 
            type="submit"
            className="absolute right-3 p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="mt-3 flex items-center justify-center gap-4 text-[9px] text-white/20 font-bold uppercase tracking-widest">
           <span className="flex items-center gap-1"><Shield size={10}/> Sandbox Secured</span>
           <span className="flex items-center gap-1"><Cpu size={10}/> ARM64 Native</span>
        </div>
      </div>
    </div>
  );
};

export default GeminiApp;
