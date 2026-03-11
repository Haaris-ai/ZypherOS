
import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Network, Layers, Shield } from 'lucide-react';

const TaskManagerApp: React.FC = () => {
  const [processes, setProcesses] = useState([
    { name: 'Zypher Kernel', cpu: '0.1%', mem: '42 MB', status: 'System', priority: 'Critical' },
    { name: 'ZEL Translation Engine', cpu: '0.4%', mem: '128 MB', status: 'Active', priority: 'High' },
    { name: 'Zypher Core AI (Local)', cpu: '1.2%', mem: '890 MB', status: 'Standby', priority: 'Realtime' },
    { name: 'Zypher Shell UI', cpu: '0.5%', mem: '64 MB', status: 'Running', priority: 'Normal' },
    { name: 'File Indexer', cpu: '0.0%', mem: '12 MB', status: 'Idle', priority: 'Low' },
    { name: 'Network Stack', cpu: '0.1%', mem: '28 MB', status: 'Active', priority: 'High' },
  ]);

  const [activeTab, setActiveTab] = useState('processes');

  return (
    <div className="h-full flex flex-col bg-zinc-900 text-white font-sans overflow-hidden">
      {/* Header Tabs */}
      <div className="bg-zinc-800 p-1 flex border-b border-white/5">
        {[
          { id: 'processes', label: 'Processes', icon: <Layers size={14} /> },
          { id: 'performance', label: 'Performance', icon: <Activity size={14} /> },
          { id: 'app-history', label: 'App History', icon: <Activity size={14} /> },
          { id: 'startup', label: 'Startup', icon: <Shield size={14} /> },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all ${activeTab === tab.id ? 'bg-zinc-700 text-white' : 'text-white/40 hover:bg-zinc-700/50'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'processes' ? (
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-zinc-800 text-white/60 font-medium">
              <tr>
                <th className="px-6 py-3 border-b border-white/5">Process Name</th>
                <th className="px-6 py-3 border-b border-white/5">CPU</th>
                <th className="px-6 py-3 border-b border-white/5">Memory</th>
                <th className="px-6 py-3 border-b border-white/5">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {processes.map((p, i) => (
                <tr key={i} className="hover:bg-white/5 group transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Active' || p.status === 'Running' || p.status === 'Standby' ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                    {p.name}
                  </td>
                  <td className="px-6 py-4 text-white/60 font-mono">{p.cpu}</td>
                  <td className="px-6 py-4 text-white/60 font-mono">{p.mem}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.priority === 'Realtime' ? 'bg-purple-500/20 text-purple-400' :
                      p.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                      p.priority === 'High' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-white/10 text-white/40'
                    }`}>
                      {p.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 grid grid-cols-2 gap-4">
            {[
              { label: 'CPU (Zypher-ZEL Engine)', value: '8%', color: 'text-sky-400', icon: <Cpu /> },
              { label: 'Neural Memory', value: '890 MB / 4 GB', color: 'text-purple-400', icon: <Activity /> },
              { label: 'Disk Cache', value: '2%', color: 'text-emerald-400', icon: <HardDrive /> },
              { label: 'IO Virtualization', value: 'Minimal', color: 'text-amber-400', icon: <Network /> },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-white/20 mb-1">{stat.label}</p>
                  <h4 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h4>
                </div>
                <div className={`${stat.color} opacity-20`}>{stat.icon}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-zinc-800 border-t border-white/5 flex justify-between items-center px-6">
        <p className="text-[10px] text-white/30 font-bold uppercase">Kernel Uptime: 00:42:15</p>
        <button className="px-5 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-xs font-bold transition-all shadow-lg shadow-rose-900/20 active:scale-95">
          End Process
        </button>
      </div>
    </div>
  );
};

export default TaskManagerApp;
