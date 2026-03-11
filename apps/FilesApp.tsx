
import React, { useState, useContext, useRef } from 'react';
import { Folder, File, HardDrive, Clock, Star, Trash2, Search, MoreVertical, LayoutGrid, List, Monitor, Cpu, Layers, Apple, Box, ArrowLeft, Upload, Plus, Download } from 'lucide-react';
import { OSContext } from '../App';
import { FileSystemItem } from '../types';

const FilesApp: React.FC = () => {
  const os = useContext(OSContext);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!os) return null;
  const { fs, config } = os;

  const currentItems = fs.getFolderContent(currentFolderId);
  const currentFolderName = currentFolderId ? config.fileSystem.find(i => i.id === currentFolderId)?.name : 'Zypher Drive';

  const getFileIcon = (item: FileSystemItem, size: number) => {
    if (item.type === 'folder') return <Folder size={size} className="text-amber-500 fill-amber-500/20" />;
    
    switch (item.category) {
      case 'macos': return <Apple size={size} className="text-zinc-200" />;
      case 'linux': return <Box size={size} className="text-amber-600" />;
      case 'android': return <Layers size={size} className="text-emerald-400" />;
      case 'windows': return <Cpu size={size} className="text-indigo-400" />;
      default: return <File size={size} className="text-blue-400" />;
    }
  };

  const handleBack = () => {
    if (!currentFolderId) return;
    const currentFolder = config.fileSystem.find(i => i.id === currentFolderId);
    setCurrentFolderId(currentFolder?.parentId || null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fs.add({
        name: file.name,
        type: 'file',
        size: (file.size / 1024).toFixed(1) + ' KB',
        extension: file.name.split('.').pop(),
        parentId: currentFolderId
      });
    }
  };

  const handleHostDownload = (e: React.MouseEvent, item: FileSystemItem) => {
    e.stopPropagation();
    
    let blob: Blob;
    // Special handling for eltorito.img to ensure 2048-byte sector alignment
    if (item.name === 'eltorito' || item.name === 'eltorito.img') {
      const size = 2048;
      const buffer = new Uint8Array(size);
      const signature = "ZYPHER_BOOT_v1_ELTORITO_READY";
      for(let i = 0; i < signature.length; i++) buffer[i] = signature.charCodeAt(i);
      blob = new Blob([buffer], { type: 'application/octet-stream' });
    } else {
      const content = item.content || `ZypherOS Virtual Binary: ${item.name}\nSize: ${item.size || 'N/A'}`;
      blob = new Blob([content], { type: 'text/plain' });
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.name + (item.extension ? '.' + item.extension : '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`Host Bridge: Exporting '${item.name}' to real machine...`);
  };

  const createFolder = () => {
    const name = prompt("Folder Name:");
    if (name) {
      fs.add({
        name,
        type: 'folder',
        parentId: currentFolderId
      });
    }
  };

  const handleAction = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
    } else {
      alert(`Opening ${item.name}... ZypherOS is analyzing binary headers.`);
    }
  };

  return (
    <div className="h-full flex bg-[#0d0d0f] text-white font-sans">
      {/* Sidebar */}
      <div className="w-56 bg-black/40 border-r border-white/5 flex flex-col p-4 gap-6">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 px-3">Volumes</div>
          <button 
            onClick={() => setCurrentFolderId(null)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${!currentFolderId ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-white/40 hover:bg-white/5'}`}
          >
            <HardDrive size={18} />
            Zypher Drive
          </button>
          <button className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-sm text-white/40">
            <Monitor size={18} />
            System Root
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-4">
            {currentFolderId && (
              <button onClick={handleBack} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-lg font-black">{currentFolderName}</h2>
            <div className="h-4 w-[1px] bg-white/5" />
            <div className="flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all" title="Upload from Windows">
                <Upload size={18} />
              </button>
              <button onClick={createFolder} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all" title="New Folder">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white/10 text-white' : 'text-white/30 hover:bg-white/5'}`}>
              <LayoutGrid size={18} />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white/10 text-white' : 'text-white/30 hover:bg-white/5'}`}>
              <List size={18} />
            </button>
          </div>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

        {/* Content */}
        <div 
          className={`flex-1 overflow-y-auto p-6 custom-scrollbar ${view === 'grid' ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 content-start' : 'flex flex-col'}`}
          onContextMenu={(e) => { e.preventDefault(); /* Could add context menu here */ }}
        >
          {currentItems.length === 0 && (
            <div className="col-span-full h-full flex flex-col items-center justify-center text-white/10 py-12">
               <Folder size={64} strokeWidth={1} />
               <p className="text-sm font-bold mt-4">This folder is empty</p>
            </div>
          )}

          {currentItems.map((item) => (
            <div 
              key={item.id} 
              onDoubleClick={() => handleAction(item)}
              className={view === 'grid' 
                ? "flex flex-col items-center gap-3 p-4 rounded-3xl hover:bg-white/5 cursor-pointer group transition-all border border-transparent hover:border-white/5 active:scale-95 relative"
                : "flex items-center gap-4 px-6 py-3 hover:bg-white/5 border-b border-white/5 text-sm cursor-pointer transition-colors group"
              }
            >
              <div className={`${view === 'grid' ? 'w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl group-hover:scale-110 transition-transform shadow-xl' : ''}`}>
                {getFileIcon(item, view === 'grid' ? 32 : 18)}
              </div>
              <div className={`flex-1 ${view === 'grid' ? 'text-center w-full' : 'flex items-center gap-4'}`}>
                <span className={`text-[11px] font-bold truncate block ${view === 'grid' ? 'w-full px-1' : 'flex-1'}`}>{item.name}</span>
                {view === 'list' && <span className="w-24 text-[10px] text-white/20 font-bold uppercase">{item.size || '--'}</span>}
              </div>
              
              <div className="flex gap-1 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleHostDownload(e, item)}
                  className="p-1.5 text-white/20 hover:text-emerald-400 transition-all rounded-lg hover:bg-emerald-500/10"
                  title="Download to Host PC"
                >
                  <Download size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); fs.remove(item.id); }}
                  className="p-1.5 text-white/20 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilesApp;
