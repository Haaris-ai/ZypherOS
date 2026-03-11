
import React, { useState, useEffect } from 'react';
import { Activity, Database, Shield, Cpu, Terminal, Zap, Hash, Layers } from 'lucide-react';

const KernelDashboard: React.FC = () => {
  const [interrupts, setInterrupts] = useState<{ id: string, freq: number }[]>([
    { id: 'IRQ0 (Timer)', freq: 100 },
    { id: 'IRQ1 (Keyboard)', freq: 0 },
    { id: 'IRQ8 (RTC)', freq: 1 },
    { id: 'IRQ14 (Disk)', freq: 12 },
    { id: 'IRQ23 (Bridge)', freq: 45 },
  ]);

  const [kernelLogs, setKernelLogs] = useState<string[]>([]);
  const [translationStats, setTranslationStats] = useState({ x86_to_arm: 0, arm_to_x86: 0 });

  useEffect(() => {
    const logPool = [
      "SYSCALL: execve('/usr/bin/ms-store', ...)",
      "ZEL_BRIDGE: x86_64 JIT Translation block committed at 0x4015",
      "KERNEL: Page Fault at 0xFFAA0012 (Handled via Swap)",
      "MICA_CORE: Swapping context to Ring-3 (User Mode)",
      "SEC: Sandboxed process (PID: 1024) blocked from /etc/shadow",
      "V-PFE: Page Table expanded to 1.4GB virtual space",
      "BRIDGE: Instruction set mismatch detected. Running Nectar polyfill.",
      "IO: Virtual NIC buffering 12.4kb/s traffic",
      "TPM: Signature verified for session_key_4"
    ];

    const timer = setInterval(() => {
      setKernelLogs(p => [logPool[Math.floor(Math.random() * logPool.length)], ...p].slice(0, 50));
      setInterrupts(p => p.map(i => ({ ...i, freq: Math.floor(Math.random() * 200) })));
      setTranslationStats(prev => ({
        x86_to_arm: prev.x86_to_arm + Math.floor(Math.random() * 100),
        arm_to_x86: prev.arm_to_x86 + Math.floor(Math.random() * 20)
      }));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#050505] text-[#777] font-mono text-xs overflow-hidden">
      <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-emerald-500 animate-pulse" />
          <h1 className="text-sm font-black uppercase tracking-widest text-white">Zypher Mica-Kernel v1.0.4-LTS</h1>
        </div>
        <div className="flex gap-6 items-center">
           <div className="flex items-center gap-2 text-white/40"><Zap size={14}/> <span>UPTIME: 00:14:42</span></div>
           <div className="flex items-center gap-2 text-white/40"><Hash size={14}/> <span>BUILD: STANDALONE-HYBRID</span></div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-1 p-1 bg-white/5">
        <div className="col-span-3 flex flex-col bg-black overflow-hidden border border-white/5">
          <div className="px-3 py-1.5 bg-white/5 border-b border-white/5 flex items-center gap-2 uppercase font-black text-[10px] text-white/20">
            <Terminal size={12}/> Kernel_Ring_Buffer.log
          </div>
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-0.5 font-mono text-[11px]">
            {kernelLogs.map((log, i) => (
              <div key={i} className="animate-in slide-in-from-left-1 border-l border-white/5 pl-2 mb-1">
                <span className="text-white/10 mr-2">[{new Date().toLocaleTimeString()}]</span> 
                <span className={log.includes('ZEL') || log.includes('BRIDGE') ? 'text-indigo-400' : log.includes('SEC') ? 'text-rose-400' : ''}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
           <div className="flex-1 bg-black border border-white/5 p-4 space-y-6">
              <h2 className="text-[10px] font-black uppercase text-white/20 border-b border-white/10 pb-1 flex items-center gap-2">
                 <Activity size={12}/> Interrupt Vector
              </h2>
              <div className="space-y-4">
                {interrupts.map(irq => (
                  <div key={irq.id} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-white/40">{irq.id}</span>
                      <span className="text-emerald-500">{irq.freq} TPS</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500/40 transition-all duration-500" style={{ width: `${Math.min(100, (irq.freq/200)*100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5">
                 <h2 className="text-[10px] font-black uppercase text-white/20 mb-3">Bridge Translation</h2>
                 <div className="space-y-3">
                    <div className="flex justify-between">
                       <span className="text-white/40">X86 {"->"} ARM64</span>
                       <span className="text-indigo-400">{translationStats.x86_to_arm.toLocaleString()} ops</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-white/40">ARM64 {"->"} X86</span>
                       <span className="text-indigo-400">{translationStats.arm_to_x86.toLocaleString()} ops</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="h-1/3 bg-black border border-white/5 p-4 flex flex-col items-center justify-center text-center gap-3">
              <Layers size={24} className="text-emerald-500 opacity-20" />
              <div className="text-[10px] font-black uppercase text-white/20">Memory Persistence</div>
              <div className="text-2xl font-black text-white tabular-nums tracking-tighter">1.4 GB / 16 GB</div>
              <div className="text-[9px] text-emerald-500/40 uppercase font-black">Virtual Paging Active</div>
           </div>
        </div>
      </div>

      <div className="p-2 bg-white/5 border-t border-white/5 text-[9px] uppercase font-black tracking-[0.3em] flex justify-between px-6 text-white/20">
         <span>Stand-alone Hardware Mode: ON</span>
         <span>Security: Ring-0 Root Access</span>
         <span>Bridge Version: ZEL-HYBRID-v2</span>
      </div>
    </div>
  );
};

export default KernelDashboard;
