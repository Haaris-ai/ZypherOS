
import React, { useState } from 'react';
import { Play, Square, ChevronRight, Folder, FileCode, Search, Settings, Terminal, Layers, Info, Code } from 'lucide-react';

const XcodeApp: React.FC = () => {
  const [activeFile, setActiveFile] = useState('ContentView.swift');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStatus, setBuildStatus] = useState('Ready');

  const files = [
    { name: 'ZypherApp.swift', type: 'swift' },
    { name: 'ContentView.swift', type: 'swift' },
    { name: 'Assets.xcassets', type: 'folder' },
    { name: 'Info.plist', type: 'file' },
  ];

  const swiftCode = `import SwiftUI

struct ContentView: View {
    @State private var isBooting = false
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "cpu.fill")
                .resizable()
                .aspectRatio(contentValue: .fit)
                .frame(width: 80, height: 80)
                .foregroundStyle(.tint)
            
            Text("Welcome to ZypherOS")
                .font(.largeTitle)
                .fontWeight(.black)
            
            Button(action: { isBooting.toggle() }) {
                Text(isBooting ? "Kernel Active" : "Boot Kernel")
                    .fontWeight(.bold)
                    .padding()
                    .background(Color.blue)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}`;

  const handleBuild = () => {
    setIsBuilding(true);
    setBuildStatus('Building ZypherApp (ARM64)...');
    setTimeout(() => {
      setBuildStatus('Running ZypherApp on Nectar Engine');
      setIsBuilding(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#dcdcdc] font-sans overflow-hidden">
      {/* Xcode Header */}
      <div className="h-10 bg-[#2d2d2d] border-b border-black/20 flex items-center px-4 justify-between select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button 
              onClick={handleBuild}
              disabled={isBuilding}
              className={`p-1 rounded hover:bg-white/10 ${isBuilding ? 'text-blue-400' : 'text-zinc-400'}`}
            >
              <Play size={16} fill={isBuilding ? "currentColor" : "none"} />
            </button>
            <button className="p-1 rounded hover:bg-white/10 text-zinc-400">
              <Square size={14} fill="currentColor" />
            </button>
          </div>
          <div className="h-6 w-[1px] bg-white/10 mx-1" />
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-white/80">ZypherApp</span>
            <ChevronRight size={12} className="text-white/20" />
            <span className="text-white/40">Any Mac (ARM64)</span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="bg-black/20 border border-white/5 rounded px-3 py-1 text-[11px] text-center text-white/60 font-medium">
            {buildStatus}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
             <span className="text-[10px] font-bold">ZEL ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigator */}
        <div className="w-64 bg-[#262626] border-r border-black/20 flex flex-col">
          <div className="p-2 flex items-center gap-2 border-b border-black/10">
            <Folder size={14} className="text-blue-400" />
            <span className="text-[11px] font-bold tracking-tight text-white/50">PROJECT NAVIGATOR</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-4 py-1 flex items-center gap-2 text-xs hover:bg-white/5 cursor-pointer">
              <ChevronRight size={12} className="text-white/20 rotate-90" />
              <Folder size={14} className="text-blue-400" />
              <span className="font-medium">ZypherApp</span>
            </div>
            {files.map(file => (
              <div 
                key={file.name}
                onClick={() => setActiveFile(file.name)}
                className={`ml-8 px-4 py-1 flex items-center gap-2 text-xs cursor-pointer ${activeFile === file.name ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-white/60'}`}
              >
                {file.type === 'swift' ? <FileCode size={14} className="text-blue-400" /> : <Folder size={14} className="text-zinc-500" />}
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Editor */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          <div className="h-8 bg-[#2d2d2d] border-b border-black/20 flex items-center px-4 gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 text-[10px] text-white/80 font-medium whitespace-nowrap px-2 py-1 bg-[#1e1e1e] border-t-2 border-blue-500 rounded-t-sm">
              <FileCode size={12} className="text-blue-400" />
              {activeFile}
            </div>
          </div>
          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar selection:bg-blue-500/30">
            <pre className="text-[#dcdcdc] leading-relaxed">
              {activeFile.endsWith('.swift') ? swiftCode : `// Content for ${activeFile}`}
            </pre>
          </div>
          
          {/* Bottom - Debug Area */}
          <div className="h-32 bg-[#1e1e1e] border-t border-black/40 flex flex-col">
            <div className="px-4 py-1.5 bg-[#2d2d2d] border-b border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Terminal size={10}/> Console</span>
              </div>
            </div>
            <div className="flex-1 p-4 font-mono text-[11px] text-zinc-500 overflow-y-auto">
              <div>[ZypherKernel] Initializing sandboxed Darwin runtime...</div>
              <div>[Nectar] Loaded framework: SwiftUI</div>
              <div>[Nectar] Memory pressure: 1.2%</div>
              {isBuilding && <div className="text-blue-400 animate-pulse mt-1">{" >>"} Compiling source files...</div>}
              {buildStatus.startsWith('Running') && <div className="text-emerald-500 mt-1">{" >>"} Application started (PID: 1024)</div>}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Inspectors */}
        <div className="w-12 bg-[#2d2d2d] border-l border-black/40 flex flex-col items-center py-4 gap-6">
          <button className="text-white/20 hover:text-white/60 transition-colors"><Info size={20}/></button>
          <button className="text-blue-500"><Code size={20}/></button>
          <button className="text-white/20 hover:text-white/60 transition-colors"><Layers size={20}/></button>
          <div className="mt-auto">
            <button className="text-white/20 hover:text-white/60 transition-colors"><Settings size={20}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XcodeApp;
