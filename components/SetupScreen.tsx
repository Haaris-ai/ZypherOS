
import React, { useState, useRef } from 'react';
import { Cpu, Globe, Wifi, Shield, User, ArrowRight, Loader2, Scan, CheckCircle2, Key } from 'lucide-react';
import { OSConfig, UserAccount } from '../types';

interface SetupScreenProps {
  onComplete: (setupData: Partial<OSConfig>) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);
  const [setupData, setSetupData] = useState({
    username: '',
    password: '',
    enrolledFace: false,
    recoveryKey: 'ZYPHER-SECURE-MASTER-' + Math.floor(Math.random() * 9999)
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  const startFaceEnroll = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => {
        stream.getTracks().forEach(t => t.stop());
        setSetupData(p => ({ ...p, enrolledFace: true }));
      }, 3000);
    } catch (e) { alert("Camera required for Face ID"); }
  };

  const finishSetup = () => {
    if (!setupData.recoveryKey.trim()) {
      alert("A recovery key is required for system security.");
      return;
    }
    setIsFinishing(true);
    setTimeout(() => {
      const primaryUser: UserAccount = {
        id: 'user-1',
        name: setupData.username || 'Zypher Admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + setupData.username,
        password: setupData.password,
        isFaceIDEnrolled: setupData.enrolledFace,
        role: 'admin'
      };
      onComplete({
        isFirstBoot: false,
        users: [primaryUser],
        currentUserId: primaryUser.id,
        recoveryKey: setupData.recoveryKey
      });
    }, 3000);
  };

  const steps = [
    { id: 1, title: 'Welcome', icon: <Cpu className="text-indigo-500" /> },
    { id: 2, title: 'Network', icon: <Wifi className="text-blue-500" /> },
    { id: 3, title: 'Account', icon: <User className="text-emerald-500" /> },
    { id: 4, title: 'Finalize', icon: <Shield className="text-rose-500" /> }
  ];

  if (isFinishing) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center font-mono text-indigo-400">
        <Loader2 className="animate-spin mb-6" size={48} />
        <h2 className="text-2xl font-bold tracking-tighter mb-2">INITIALIZING KERNEL</h2>
        <p className="text-xs opacity-50 uppercase tracking-widest animate-pulse">Building secure user enclave...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0c] text-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        {/* Navigation Sidebar */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Cpu size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight">ZypherOS Setup</h1>
          </div>
          <div className="space-y-4">
            {steps.map(s => (
              <div key={s.id} className={`flex items-center gap-4 transition-opacity ${step === s.id ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step === s.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10'}`}>
                  {s.id}
                </div>
                <span className="text-sm font-bold uppercase tracking-widest">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-10 min-h-[500px] flex flex-col relative overflow-hidden">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-4xl font-black">Ready to build the future?</h2>
              <p className="text-white/50 leading-relaxed">ZypherOS is a lightweight, cross-platform hybrid kernel designed for ARM64 and X86 architectures. Let's get your environment ready.</p>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                   <Globe className="text-blue-400" size={20} />
                   <span className="text-xs font-bold uppercase">Multi-Arch Support</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                   <Shield className="text-emerald-400" size={20} />
                   <span className="text-xs font-bold uppercase">Encrypted Session</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-4xl font-black">Stay Connected</h2>
              <p className="text-white/50">ZypherOS requires a network bridge for cloud-native features and binary translation updates.</p>
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Wifi className="text-emerald-400" />
                  <div>
                    <p className="font-bold">Zypher_Bridge_5G</p>
                    <p className="text-[10px] text-emerald-400/60 uppercase font-black">V-Network Active</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 overflow-y-auto no-scrollbar pb-12">
              <h2 className="text-4xl font-black">Identity Enclave</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Administrator Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Satoshi"
                    value={setupData.username}
                    onChange={(e) => setSetupData(p => ({ ...p, username: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Encryption Key</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={setupData.password}
                    onChange={(e) => setSetupData(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="pt-4 flex items-center gap-6">
                   <button 
                    onClick={startFaceEnroll}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${setupData.enrolledFace ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                   >
                     {setupData.enrolledFace ? <CheckCircle2 size={18}/> : <Scan size={18} />}
                     <span className="text-xs font-bold uppercase tracking-widest">{setupData.enrolledFace ? 'Face ID Active' : 'Enable Face ID'}</span>
                   </button>
                   {setupData.enrolledFace && (
                     <p className="text-[10px] text-white/30 italic">Face enrolled via secure cam bridge.</p>
                   )}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-4xl font-black">Secure Recovery</h2>
              <p className="text-white/50">Your system is fully containerized. If you lose your encryption key, you'll need this master recovery token to regain access.</p>
              
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Set Your Master Recovery Key</label>
                <div className="relative group">
                  <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    value={setupData.recoveryKey}
                    onChange={(e) => setSetupData(p => ({ ...p, recoveryKey: e.target.value.toUpperCase() }))}
                    className="w-full bg-indigo-500/5 border-2 border-dashed border-indigo-500/20 rounded-3xl py-6 pl-12 pr-6 text-center text-xl font-black font-mono tracking-tighter text-white focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="SET YOUR CUSTOM RECOVERY KEY"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest italic">Tip: Use a phrase you will never forget.</p>
              </div>
              
              <p className="text-xs text-rose-400 font-bold bg-rose-400/10 p-4 rounded-xl flex items-start gap-3 border border-rose-500/20">
                <Shield className="shrink-0 mt-0.5" size={16} />
                <span>Keep this key safe. It is the ONLY way to bypass encryption if you forget your password.</span>
              </p>
            </div>
          )}

          <div className="mt-auto flex justify-between items-center">
             <button 
              disabled={step === 1}
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 disabled:opacity-0 transition-all"
             >
               Back
             </button>
             <button 
              onClick={() => step < 4 ? setStep(s => s + 1) : finishSetup()}
              className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black shadow-xl shadow-indigo-900/40 transition-all active:scale-95"
             >
               {step === 4 ? 'START ZYPHER' : 'NEXT'}
               <ArrowRight size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
