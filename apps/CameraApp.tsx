
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Image as ImageIcon, RotateCw, Settings, Grid, Circle, Download, Trash2, Flashlight } from 'lucide-react';

const CameraApp: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImages(prev => [dataUrl, ...prev]);
        
        // Flash animation
        setFlash(true);
        setTimeout(() => setFlash(false), 100);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-white font-sans overflow-hidden">
      {/* Top Controls */}
      <div className="px-6 py-4 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6">
           <button className="text-white/60 hover:text-white transition-colors"><Settings size={20}/></button>
           <button className="text-white/60 hover:text-white transition-colors"><Grid size={20}/></button>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40">
              4K • 60 FPS
           </div>
        </div>
      </div>

      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-full object-cover scale-x-[-1]" 
        />
        
        <canvas ref={canvasRef} className="hidden" />

        {flash && <div className="absolute inset-0 bg-white z-50 animate-pulse" />}

        {/* Framing Guides */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-y-0 left-1/3 w-[1px] bg-white" />
          <div className="absolute inset-y-0 left-2/3 w-[1px] bg-white" />
          <div className="absolute inset-x-0 top-1/3 h-[1px] bg-white" />
          <div className="absolute inset-x-0 top-2/3 h-[1px] bg-white" />
        </div>

        {/* Gallery Preview */}
        {capturedImages.length > 0 && (
          <div className="absolute left-8 bottom-32 flex flex-col gap-3 group">
            {capturedImages.slice(0, 3).map((img, i) => (
              <div key={i} className="w-12 h-12 rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl transition-all hover:scale-110 hover:border-white/60 cursor-pointer">
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Shutter Controls */}
      <div className="px-12 py-10 bg-zinc-900/80 backdrop-blur-xl flex items-center justify-around">
        <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all">
          <RotateCw size={20} />
        </button>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 border-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10'}`}
          >
            <Video size={24} className={isRecording ? 'text-white' : 'text-white/60'} />
          </button>

          <button 
            onClick={takePhoto}
            className="w-20 h-20 rounded-full border-4 border-white/20 p-1 group hover:border-white/60 transition-all active:scale-90"
          >
            <div className="w-full h-full rounded-full bg-white shadow-xl transition-all group-hover:scale-95" />
          </button>

          <button className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all">
            <ImageIcon size={24} />
          </button>
        </div>

        <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all">
          <Flashlight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CameraApp;
