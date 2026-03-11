
import React, { useState, useContext } from 'react';
import { ShieldAlert, ArrowLeft, Key, Lock, CheckCircle2 } from 'lucide-react';
import { OSContext } from '../App';

interface RecoveryScreenProps {
  onBack: () => void;
}

const RecoveryScreen: React.FC<RecoveryScreenProps> = ({ onBack }) => {
  const os = useContext(OSContext);
  const [masterKey, setMasterKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleRecovery = () => {
    if (!os) return;
    // Check against the actual saved key
    if (masterKey.trim().toUpperCase() === os.config.recoveryKey.trim().toUpperCase()) {
      setStep(2);
    } else {
      alert("Invalid Master Key. Please check your records.");
    }
  };

  const handleReset = () => {
    if (!os) return;
    os.setConfig(prev => ({
      ...prev,
      users: prev.users.map(u => ({ ...u, password: newPassword }))
    }));
    setStep(3);
    setTimeout(() => onBack(), 2000);
  };

  return (
    <div className="fixed inset-0 z-[10001] bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10 border border-white/5 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
        <div className="flex items-center gap-4 text-rose-500">
          <ShieldAlert size={40} />
          <div>
            <h2 className="text-2xl font-black">Recovery Mode</h2>
            <p className="text-xs font-bold uppercase tracking-widest opacity-50">Secure Kernel Access</p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2">
            <p className="text-sm text-white/40 leading-relaxed">Please enter your Master Recovery Key provided during the initial system setup.</p>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                placeholder="Enter Recovery Token"
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 font-mono text-sm focus:outline-none focus:border-rose-500 transition-all uppercase"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={onBack} className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-black transition-all flex items-center justify-center gap-2">
                <ArrowLeft size={16}/> CANCEL
              </button>
              <button onClick={handleRecovery} className="flex-1 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-xs font-black shadow-lg shadow-rose-900/20 transition-all active:scale-95">
                VERIFY KEY
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2">
            <p className="text-sm text-white/40 leading-relaxed">Recovery key verified. Set a new master encryption key for the system.</p>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="password" 
                placeholder="New encryption key"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            <button onClick={handleReset} className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black transition-all active:scale-95">
              RESET SYSTEM KEY
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4 animate-in scale-90">
             <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
               <CheckCircle2 className="text-emerald-400" size={32} />
             </div>
             <p className="font-bold text-emerald-400">System Key Decrypted Successfully</p>
             <p className="text-xs text-white/20">Returning to login screen...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoveryScreen;
