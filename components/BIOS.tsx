
import React, { useState } from 'react';
import { BIOSConfig } from '../types';
import { Save, LogOut, ChevronRight } from 'lucide-react';

interface BIOSProps {
  config: BIOSConfig;
  onSave: (config: BIOSConfig) => void;
  onExit: () => void;
}

const BIOS: React.FC<BIOSProps> = ({ config, onSave, onExit }) => {
  const [localConfig, setLocalConfig] = useState<BIOSConfig>(config);
  const [activeTab, setActiveTab] = useState<'main' | 'advanced' | 'boot' | 'exit'>('main');

  return (
    <div className="fixed inset-0 bg-[#0000a8] text-white font-mono flex flex-col uppercase text-sm border-[10px] border-[#c0c0c0]">
      <div className="bg-[#c0c0c0] text-[#0000a8] px-4 py-1 flex justify-between font-bold">
        <span>Zypher Setup Utility v2.10</span>
        <span>Copyright (C) 2025 Zypher Systems</span>
      </div>

      <div className="flex bg-[#0000a8] border-b border-[#c0c0c0]">
        {['Main', 'Advanced', 'Boot', 'Exit'].map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t.toLowerCase() as any)}
            className={`px-8 py-2 font-bold ${activeTab === t.toLowerCase() ? 'bg-[#c0c0c0] text-[#0000a8]' : 'hover:bg-white/10'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-8 space-y-4">
          {activeTab === 'main' && (
            <div className="space-y-4">
               <div className="flex justify-between w-96"><span>System Date:</span> <span>[{new Date().toLocaleDateString()}]</span></div>
               <div className="flex justify-between w-96"><span>System Time:</span> <span>[{new Date().toLocaleTimeString()}]</span></div>
               <div className="mt-8 opacity-60">
                  <p>CPU Type: Zypher-X86-ARM Hybrid</p>
                  <p>CPU Speed: 3.40 GHz</p>
                  <p>Total Memory: 16384 MB</p>
               </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
               <button 
                 onClick={() => setLocalConfig(p => ({ ...p, vtEnabled: !p.vtEnabled }))}
                 className="flex justify-between w-[500px] hover:bg-white/10 px-2 py-1"
               >
                 <span>Virtualization Tech (VT-x):</span>
                 <span>[{localConfig.vtEnabled ? 'Enabled' : 'Disabled'}]</span>
               </button>
               <button 
                 onClick={() => setLocalConfig(p => ({ ...p, secureBoot: !p.secureBoot }))}
                 className="flex justify-between w-[500px] hover:bg-white/10 px-2 py-1"
               >
                 <span>Secure Boot:</span>
                 <span>[{localConfig.secureBoot ? 'Enabled' : 'Disabled'}]</span>
               </button>
               <button 
                 onClick={() => setLocalConfig(p => ({ ...p, cpuOverclock: !p.cpuOverclock }))}
                 className="flex justify-between w-[500px] hover:bg-white/10 px-2 py-1 text-rose-400"
               >
                 <span>AI Overclocking:</span>
                 <span>[{localConfig.cpuOverclock ? 'Enabled' : 'Disabled'}]</span>
               </button>
            </div>
          )}

          {activeTab === 'boot' && (
            <div className="space-y-4">
               <p className="font-bold underline mb-4 text-[#ffff00]">Boot Option Priorities</p>
               {localConfig.bootOrder.map((dev, i) => (
                 <div key={dev} className="flex gap-4 items-center px-2">
                    <span className="opacity-60">Boot Option #{i+1}:</span>
                    <span className="font-bold">[{dev}]</span>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'exit' && (
             <div className="space-y-8 flex flex-col items-center justify-center h-full">
                <button 
                  onClick={() => onSave(localConfig)}
                  className="w-80 p-4 border-2 border-white hover:bg-white hover:text-[#0000a8] transition-colors flex items-center justify-center gap-4"
                >
                  <Save size={20}/> Save Changes and Reset
                </button>
                <button 
                  onClick={onExit}
                  className="w-80 p-4 border-2 border-white hover:bg-white hover:text-[#0000a8] transition-colors flex items-center justify-center gap-4"
                >
                  <LogOut size={20}/> Discard Changes and Exit
                </button>
             </div>
          )}
        </div>

        <div className="w-80 bg-[#0000a8] border-l border-[#c0c0c0] p-6 text-[11px] space-y-4">
           <p className="text-[#ffff00]">Item Specific Help</p>
           <p className="opacity-80">Use [↑/↓] to select items, [Enter] to change values, [F10] to save and exit.</p>
           <p className="opacity-80 leading-relaxed">Zypher UEFI provides direct low-level access to the Mica-Hybrid translation kernel hardware parameters.</p>
        </div>
      </div>

      <div className="bg-[#c0c0c0] text-[#0000a8] px-4 py-1 flex gap-10 font-bold text-[11px]">
        <span>F1: Help</span>
        <span>↑↓: Select Item</span>
        <span>Enter: Select</span>
        <span>+/-: Change Opt.</span>
        <span>F10: Save and Exit</span>
        <span>ESC: Exit</span>
      </div>
    </div>
  );
};

export default BIOS;
