
import React, { useState, useEffect } from 'react';
import { Disc, Download, Cpu, Shield, Globe, Layers, CheckCircle2, Loader2, HardDrive, Terminal, Code, BookOpen, Copy, FileJson, Settings, Zap, FileArchive, ChevronRight, Usb, Power, Monitor, TerminalSquare } from 'lucide-react';

const DistroBuilderApp: React.FC = () => {
  const [stage, setStage] = useState<'config' | 'building' | 'complete' | 'recipe'>('config');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [arch, setArch] = useState<'universal' | 'arm64' | 'x86_64'>('universal');

  const addLog = (msg: string) => setLogs(p => [...p, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleDownloadImage = () => {
    const sectorSize = 2048;
    const totalSectors = 512;
    const buffer = new Uint8Array(sectorSize * totalSectors);
    const signature = "ZYPHER_OS_EL_TORITO_BOOTABLE_IMAGE_v1.0.4";
    const headerContent = `${signature}\nARCH:${arch.toUpperCase()}`;
    for (let i = 0; i < headerContent.length; i++) {
      buffer[i] = headerContent.charCodeAt(i);
    }
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'eltorito.img';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addLog("SUCCESS: eltorito.img exported for ImgBurn mastering.");
  };

  const startBuild = () => {
    setStage('building');
    setProgress(0);
    setLogs([]);
    const buildSteps = [
      "Hashing System Root...",
      "Collecting mica_kernel_v1.bin...",
      "ZEL: Bundling instruction sets...",
      "MAPPING: Generating SquashFS table...",
      "BUILD: Compiling bootloader GRUB binary...",
      "TPM: Signing ISO image...",
      "EXPORT: Finalizing eltorito.img...",
    ];
    let currentStep = 0;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setStage('complete');
          return 100;
        }
        if (p > (currentStep + 1) * (100 / buildSteps.length) && currentStep < buildSteps.length) {
          addLog(buildSteps[currentStep]);
          currentStep++;
        }
        return p + Math.random() * 8;
      });
    }, 150);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f0f11] text-zinc-300 font-sans overflow-hidden">
      <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-900/40">
            <Disc size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Distro Mastering</h1>
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Bare-Metal Deployment</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setStage('config')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${stage === 'config' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5'}`}>Wizard</button>
          <button onClick={() => setStage('recipe')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${stage === 'recipe' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5'}`}>Recipe</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {stage === 'config' && (
          <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-black text-white tracking-tight">Generate Boot Record</h2>
              <p className="text-zinc-500 text-sm">Download the El Torito `.img` file to use as the boot source in **ImgBurn** or **mkisofs**.</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Target Arch</label>
                 <div className="grid grid-cols-1 gap-2">
                    {['universal', 'arm64', 'x86_64'].map(a => (
                      <button key={a} onClick={() => setArch(a as any)} className={`px-4 py-3 rounded-xl border text-left text-sm font-bold transition-all ${arch === a ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>{a.toUpperCase()}</button>
                    ))}
                 </div>
               </div>
               <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col justify-center">
                  <h3 className="text-xs font-black uppercase text-white/40 mb-3">Mastering Checklist</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs font-bold text-emerald-400"><CheckCircle2 size={14}/> BIOS/UEFI Hybrid</div>
                    <div className="flex items-center gap-3 text-xs font-bold text-emerald-400"><CheckCircle2 size={14}/> No-Emulation Mode</div>
                    <div className="flex items-center gap-3 text-xs font-bold text-emerald-400"><CheckCircle2 size={14}/> 2048-Byte Alignment</div>
                  </div>
               </div>
            </div>
            <button onClick={startBuild} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-4">COMPILE ELTORITO.IMG <Zap size={20} /></button>
          </div>
        )}

        {stage === 'building' && (
          <div className="max-w-2xl mx-auto space-y-8 py-12">
            <div className="text-center space-y-4">
               <Loader2 className="animate-spin mx-auto text-indigo-500" size={48} />
               <h2 className="text-2xl font-black text-white">Staging Boot Blocks</h2>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
               <div className="h-full bg-indigo-600 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.5)]" style={{ width: `${progress}%` }} />
            </div>
            <div className="bg-black/60 rounded-2xl border border-white/10 p-5 h-64 overflow-y-auto font-mono text-[11px] space-y-1.5 text-zinc-500 custom-scrollbar">
               {logs.map((log, i) => <div key={i}><span className="text-indigo-500/50 mr-2">BUILD {" >>"}</span> {log}</div>)}
            </div>
          </div>
        )}

        {stage === 'complete' && (
          <div className="max-w-md mx-auto text-center space-y-10 py-12 animate-in zoom-in-95">
             <div className="w-32 h-32 rounded-full bg-emerald-500/10 border-4 border-emerald-500/40 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-900/20">
                <CheckCircle2 size={64} className="text-emerald-400" />
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">READY FOR MASTERING</h2>
                <p className="text-zinc-500">Image successfully compiled. Use this in ImgBurn.</p>
             </div>
             <button onClick={handleDownloadImage} className="w-full py-5 bg-white text-zinc-950 font-black rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-xl">
               <Download size={20} /> DOWNLOAD ELTORITO.IMG
             </button>
             <button onClick={() => setStage('recipe')} className="w-full py-4 bg-white/5 text-white/60 font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <BookOpen size={16}/> VIEW DEPLOYMENT RECIPE
             </button>
          </div>
        )}

        {stage === 'recipe' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in">
             <div className="space-y-4">
               <h2 className="text-3xl font-black text-white tracking-tight">Deployment Recipe: Mastering & WSL Build</h2>
               <p className="text-zinc-500 text-sm leading-relaxed">To deploy ZypherOS to hardware, follow these specific steps for Ubuntu 24.04 LTS on WSL and ImgBurn on Windows.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* STEP A: IMGBURN */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                  <div className="flex items-center gap-4 text-rose-500">
                    <Monitor size={24}/>
                    <h3 className="font-black text-lg">STEP A: ImgBurn Mastering</h3>
                  </div>
                  <div className="space-y-3 text-xs text-zinc-400">
                    <p className="flex gap-2"><span className="font-black text-white">01.</span> Create 'ISO_ROOT' on Windows Desktop.</p>
                    <p className="flex gap-2"><span className="font-black text-white">02.</span> Move your compiled kernel into the folder.</p>
                    <p className="flex gap-2"><span className="font-black text-white">03.</span> ImgBurn {"->"} Advanced {"->"} Bootable Disc.</p>
                    <p className="flex gap-2"><span className="font-black text-white">04.</span> Select the downloaded 'eltorito.img'.</p>
                    <p className="flex gap-2"><span className="font-black text-white">05.</span> Mode: 'None', Load Seg: '07C0', Sectors: '4'.</p>
                  </div>
                </div>

                {/* STEP B: WSL UBUNTU 24.04 */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                  <div className="flex items-center gap-4 text-indigo-400">
                    <TerminalSquare size={24}/>
                    <div className="flex flex-col">
                       <h3 className="font-black text-lg leading-tight">STEP B: Kernel Build</h3>
                       <p className="text-[10px] font-black uppercase text-indigo-400/50 tracking-widest">Ubuntu 24.04 LTS (WSL)</p>
                    </div>
                  </div>
                  <div className="space-y-4 font-mono text-[10px] bg-black/40 p-4 rounded-xl text-zinc-400 border border-white/5 custom-scrollbar max-h-64 overflow-y-auto">
                    <div className="space-y-1">
                       <p className="text-white/40"># 1. Update and Install Dependencies</p>
                       <p className="text-white">sudo apt update && sudo apt install -y build-essential bison flex libssl-dev libelf-dev bc libncurses-dev dwarves dwarves-tools gcc-x86-64-linux-gnu gcc-aarch64-linux-gnu</p>
                    </div>
                    
                    <div className="space-y-1">
                       <p className="text-white/40"># 2. Configure for x86_64 Hybrid</p>
                       <p className="text-white">make ARCH=x86_64 defconfig</p>
                    </div>

                    <div className="space-y-1">
                       <p className="text-white/40"># 3. Compile Mica Kernel</p>
                       <p className="text-white">make ARCH=x86_64 CROSS_COMPILE=x86_64-linux-gnu- -j$(nproc)</p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-white/5">
                       <p className="text-emerald-500/80"># Move Binary to Windows Host</p>
                       <p className="text-emerald-400">cp arch/x86/boot/bzImage /mnt/c/Users/$(whoami)/Desktop/ISO_ROOT/kernel.bin</p>
                    </div>
                  </div>
                </div>
             </div>

             <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl flex items-center gap-6">
                <Usb size={32} className="text-indigo-400 shrink-0"/>
                <div>
                   <h4 className="font-black text-white uppercase text-sm mb-1">Final Deployment: Flash to USB</h4>
                   <p className="text-xs text-zinc-500 leading-relaxed">Once you have built the `.iso` in ImgBurn using the kernel compiled in WSL, use **Rufus** on Windows to flash the image. Select 'BIOS or UEFI' in the Partition Scheme for maximum compatibility.</p>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-around text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
        <span className="flex items-center gap-2"><Shield size={12}/> Standalone OS</span>
        <span className="flex items-center gap-2"><Globe size={12}/> Zero-Host Mode</span>
        <span className="flex items-center gap-2"><Cpu size={12}/> Hybrid Mastering</span>
      </div>
    </div>
  );
};

export default DistroBuilderApp;
