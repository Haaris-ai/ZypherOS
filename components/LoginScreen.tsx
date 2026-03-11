
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Scan, ShieldCheck, Lock, ArrowRight, User, AlertCircle, ChevronLeft } from 'lucide-react';
import { OSContext } from '../App';
import RecoveryScreen from './RecoveryScreen';

interface LoginScreenProps {
  onLogin: () => void;
  wallpaper: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, wallpaper }) => {
  const os = useContext(OSContext);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(os?.config.currentUserId || null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isFaceIDActive, setIsFaceIDActive] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeUser = os?.config.users.find(u => u.id === selectedUserId);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!activeUser) return;
    if (activeUser.password && password !== activeUser.password) {
      setError("Incorrect Encryption Key");
      setPassword('');
      setTimeout(() => setError(null), 3000);
      return;
    }
    os?.setConfig(p => ({ ...p, currentUserId: activeUser.id }));
    setIsDecrypting(true);
    setTimeout(() => onLogin(), 2500);
  };

  const toggleFaceID = async () => {
    if (!activeUser?.isFaceIDEnrolled) {
      setError("Face ID not enrolled");
      setTimeout(() => setError(null), 2000);
      return;
    }
    setIsFaceIDActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => {
        stream.getTracks().forEach(t => t.stop());
        setIsFaceIDActive(false);
        handleLogin();
      }, 3000);
    } catch (err) { setIsFaceIDActive(false); }
  };

  if (showRecovery) return <RecoveryScreen onBack={() => setShowRecovery(false)} />;

  if (isDecrypting) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center font-mono text-emerald-500">
        <ShieldCheck className="animate-pulse mb-6" size={48} />
        <h2 className="text-xl font-bold tracking-tighter">DECRYPTING SESSION...</h2>
        <div className="w-64 h-1 bg-emerald-900 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[loading_2.5s_ease-in-out_infinite]" />
        </div>
        <style>{`@keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url('${wallpaper}')` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />
      
      <div className="relative w-full max-w-sm flex flex-col items-center text-center space-y-8 animate-in fade-in duration-700">
        {!selectedUserId ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-white">Select User</h1>
            <div className="grid grid-cols-2 gap-4">
              {os?.config.users.map(u => (
                <button key={u.id} onClick={() => setSelectedUserId(u.id)} className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all">
                  <img src={u.avatar} className="w-20 h-20 rounded-full border-2 border-white/20" alt={u.name} />
                  <span className="font-bold text-sm">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-6 animate-in slide-in-from-right-4">
            <button onClick={() => setSelectedUserId(null)} className="absolute left-0 top-0 text-white/40 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
              <ChevronLeft size={16}/> Back
            </button>
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                {isFaceIDActive ? <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover grayscale brightness-125" /> : <img src={activeUser?.avatar} className="w-full h-full object-cover" alt="" />}
              </div>
              {activeUser?.isFaceIDEnrolled && !isFaceIDActive && (
                <button onClick={toggleFaceID} className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-emerald-500 text-white shadow-xl hover:scale-110 transition-transform">
                  <Scan size={20} />
                </button>
              )}
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">{activeUser?.name}</h1>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-white/20'}`} size={18} />
                <input 
                  autoFocus 
                  type="password" 
                  placeholder="Key" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-center text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 transition-all font-mono ${error ? 'border-red-500 ring-1 ring-red-500/20' : 'border-white/10'}`}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/10 hover:bg-indigo-600 transition-all">
                  <ArrowRight size={20} />
                </button>
              </div>
              {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">{error}</p>}
            </form>
          </div>
        )}

        <div className="flex items-center gap-8 text-white/20 pt-8">
           <button onClick={() => setShowRecovery(true)} className="text-xs font-bold hover:text-white/40 transition-colors uppercase tracking-widest">Recovery</button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
