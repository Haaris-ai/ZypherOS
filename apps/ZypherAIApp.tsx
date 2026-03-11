
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, Cpu, Zap, Shield, Terminal, MessageSquare, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const LOCAL_KNOWLEDGE = {
  "who are you": "I am the Zypher Neural Engine, a lightweight local AI integrated into ZypherOS.",
  "version": "ZypherOS v2.5.0-LTS running on Mica-Hybrid Kernel.",
  "status": "All systems nominal. Neural Engine at 2% load.",
  "help": "I can help you manage files, launch apps, or explain how the Zypher Multi-Kernel works. You can also use 'sudo apt' in the Terminal for package management.",
  "kernel": "The Mica-Hybrid kernel allows ZypherOS to run macOS, Windows, and Linux binaries in a unified web sandbox.",
  "apt": "The 'sudo apt' command is the Debian package manager for ZypherOS. Use it in the Terminal to install, update, or remove system packages.",
};

const ZypherAIApp: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string, type?: 'local' | 'cloud'}[]>([
    { role: 'ai', content: "Neural Engine initialized. Local mode active. How can I assist you today?", type: 'local' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    // 1. Check Local Knowledge Base (Instant & Free)
    const lowerMsg = userMsg.toLowerCase();
    const localMatch = Object.entries(LOCAL_KNOWLEDGE).find(([key]) => lowerMsg.includes(key));

    if (localMatch) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: localMatch[1], type: 'local' }]);
        setIsTyping(false);
      }, 500);
      return;
    }

    // 2. Fallback to Lightweight Cloud AI (Flash Lite)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: userMsg,
        config: {
          systemInstruction: "You are the Zypher Neural Engine, a lightweight AI assistant for ZypherOS. Keep responses extremely concise and technical.",
        }
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.text || "I'm having trouble processing that right now.", type: 'cloud' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Neural Engine link interrupted. Please check your connection.", type: 'local' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0c] text-zinc-300 font-sans overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/20">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Zypher Neural Engine</h1>
            <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-emerald-500">
              <Zap size={10} fill="currentColor" /> Local Mode Active
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
           <div className="flex items-center gap-1"><Cpu size={12}/> NPU: 0.4 TOPS</div>
           <div className="flex items-center gap-1"><Shield size={12}/> Encrypted</div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed relative group ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white/5 border border-white/10 rounded-tl-none'
            }`}>
              {msg.role === 'ai' && (
                <div className={`absolute -top-5 left-0 text-[9px] font-black uppercase tracking-widest ${msg.type === 'local' ? 'text-emerald-500' : 'text-indigo-400'}`}>
                  {msg.type === 'local' ? 'Local Inference' : 'Cloud Bridge'}
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-black/40 border-t border-white/5">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Neural Engine..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all active:scale-90"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[10px] text-center text-white/20 mt-4 uppercase font-black tracking-widest">
          Optimized for local execution on Zypher ARM64
        </p>
      </div>
    </div>
  );
};

export default ZypherAIApp;
