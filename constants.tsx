
import React from 'react';
import { 
  Chrome, Folder, Settings, Terminal, Box, Sparkles, ShoppingBag, 
  Activity, Monitor, Trash2, Cpu, Gamepad2, Layers, Smartphone, 
  Apple, Layout, Play, Music, Video, Mail, MessageSquare, 
  Code, Palette, Zap, Shield, Database, Globe, Camera, Disc, Cloud,
  BrainCircuit
} from 'lucide-react';
import { AppConfig } from './types';

// Lazy load actual components
import BrowserApp from './apps/BrowserApp';
import FilesApp from './apps/FilesApp';
import SettingsApp from './apps/SettingsApp';
import TerminalApp from './apps/TerminalApp';
import ZypherRunnerApp from './apps/ZypherRunnerApp';
import GeminiApp from './apps/GeminiApp';
import TaskManagerApp from './apps/TaskManagerApp';
import GameCenterApp from './apps/GameCenterApp';
import MSStoreApp from './apps/MSStoreApp';
import AppleStoreApp from './apps/AppleStoreApp';
import GooglePlayApp from './apps/GooglePlayApp';
import XcodeApp from './apps/XcodeApp';
import CameraApp from './apps/CameraApp';
import DistroBuilderApp from './apps/DistroBuilderApp';
import KernelDashboard from './apps/KernelDashboard';
import DevPortalApp from './apps/DevPortalApp';
import PackageManagerApp from './apps/PackageManagerApp';
import ZypherAIApp from './apps/ZypherAIApp';

export const APPS_REGISTRY: AppConfig[] = [
  // Core System Apps
  { id: 'chrome', name: 'Browser', icon: 'chrome', color: 'bg-blue-500', component: <BrowserApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'files', name: 'Files', icon: 'folder', color: 'bg-amber-500', component: <FilesApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'terminal', name: 'Terminal', icon: 'terminal', color: 'bg-zinc-800', component: <TerminalApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'package-manager', name: 'Package Manager', icon: 'box', color: 'bg-indigo-600', component: <PackageManagerApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'kernel-dash', name: 'Kernel Dashboard', icon: 'activity', color: 'bg-emerald-600', component: <KernelDashboard />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'distro-builder', name: 'Distro Builder', icon: 'disc', color: 'bg-rose-600', component: <DistroBuilderApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'dev-portal', name: 'Dev Portal', icon: 'cloud', color: 'bg-sky-600', component: <DevPortalApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'camera', name: 'Camera', icon: 'camera', color: 'bg-zinc-700', component: <CameraApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'ms-store', name: 'Microsoft Store', icon: 'layout', color: 'bg-sky-600', component: <MSStoreApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'apple-store', name: 'App Store', icon: 'apple', color: 'bg-zinc-100', component: <AppleStoreApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'google-play', name: 'Google Play', icon: 'smartphone', color: 'bg-emerald-500', component: <GooglePlayApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'zypher-runner', name: 'Zypher Hub', icon: 'layers', color: 'bg-indigo-600', component: <ZypherRunnerApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'neural-engine', name: 'Neural Engine', icon: 'brain-circuit', color: 'bg-indigo-600', component: <ZypherAIApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'gemini', name: 'Zypher Core AI', icon: 'sparkles', color: 'bg-gradient-to-br from-indigo-500 to-purple-600', component: <GeminiApp />, isPinned: true, platform: 'native', isInitial: true },
  { id: 'game-center', name: 'Game Center', icon: 'gamepad', color: 'bg-rose-500', component: <GameCenterApp />, isPinned: false, platform: 'native', isInitial: true },
  { id: 'task-manager', name: 'Task Manager', icon: 'activity', color: 'bg-zinc-700', component: <TaskManagerApp />, isPinned: false, platform: 'native', isInitial: true },
  { id: 'settings', name: 'Settings', icon: 'settings', color: 'bg-gray-500', component: <SettingsApp />, isPinned: false, platform: 'native', isInitial: true },

  // macOS Runtime Apps
  { id: 'mac-xcode', name: 'Xcode', icon: 'code', color: 'bg-blue-500', component: <XcodeApp />, platform: 'macos', category: 'Developer', size: '12.4 GB', rating: 4.9, isInitial: false },

  // Windows Apps
  { id: 'win-office', name: 'Office 365', icon: 'layout', color: 'bg-orange-500', component: <div className="p-8">Office 365 Running in ZEL...</div>, platform: 'windows', category: 'Productivity', size: '2.4 GB', rating: 4.8 },
  { id: 'win-vscode', name: 'VS Code', icon: 'code', color: 'bg-blue-600', component: <div className="p-8">VS Code Window</div>, platform: 'windows', category: 'Developer', size: '450 MB', rating: 4.9 },
  { id: 'win-spotify', name: 'Spotify Win', icon: 'music', color: 'bg-emerald-500', component: <div className="p-8">Spotify Windows Client</div>, platform: 'windows', category: 'Music', size: '120 MB', rating: 4.7 },
  { id: 'win-steam', name: 'Steam', icon: 'gamepad', color: 'bg-slate-700', component: <div className="p-8">Steam Engine Launcher</div>, platform: 'windows', category: 'Gaming', size: '1.2 GB', rating: 4.5 },

  // Android Apps
  { id: 'and-gmail', name: 'Gmail', icon: 'mail', color: 'bg-red-500', component: <div className="p-8">Gmail for ARC-Z</div>, platform: 'android', category: 'Communication', size: '65 MB', rating: 4.6 },
  { id: 'and-whatsapp', name: 'WhatsApp', icon: 'message-square', color: 'bg-emerald-600', component: <div className="p-8">WhatsApp Mobile View</div>, platform: 'android', category: 'Communication', size: '82 MB', rating: 4.8 },
  { id: 'and-tiktok', name: 'TikTok', icon: 'video', color: 'bg-black', component: <div className="p-8">TikTok ARC-Z View</div>, platform: 'android', category: 'Social', size: '110 MB', rating: 4.4 },
  { id: 'and-instagram', name: 'Instagram', icon: 'smartphone', color: 'bg-pink-600', component: <div className="p-8">Instagram Feed</div>, platform: 'android', category: 'Social', size: '94 MB', rating: 4.2 },
];

export const getIcon = (id: string, size = 20) => {
  switch (id) {
    case 'chrome': return <Chrome size={size} />;
    case 'folder': return <Folder size={size} />;
    case 'settings': return <Settings size={size} />;
    case 'terminal': return <Terminal size={size} />;
    case 'box': return <Box size={size} />;
    case 'layers': return <Layers size={size} />;
    case 'sparkles': return <Sparkles size={size} />;
    case 'shopping-bag': return <ShoppingBag size={size} />;
    case 'activity': return <Activity size={size} />;
    case 'monitor': return <Monitor size={size} />;
    case 'trash': return <Trash2 size={size} />;
    case 'cpu': return <Cpu size={size} />;
    case 'gamepad': return <Gamepad2 size={size} />;
    case 'apple': return <Apple size={size} />;
    case 'smartphone': return <Smartphone size={size} />;
    case 'layout': return <Layout size={size} />;
    case 'play': return <Play size={size} />;
    case 'music': return <Music size={size} />;
    case 'video': return <Video size={size} />;
    case 'mail': return <Mail size={size} />;
    case 'message-square': return <MessageSquare size={size} />;
    case 'code': return <Code size={size} />;
    case 'palette': return <Palette size={size} />;
    case 'zap': return <Zap size={size} />;
    case 'shield': return <Shield size={size} />;
    case 'database': return <Database size={size} />;
    case 'globe': return <Globe size={size} />;
    case 'camera': return <Camera size={size} />;
    case 'disc': return <Disc size={size} />;
    case 'cloud': return <Cloud size={size} />;
    case 'brain-circuit': return <BrainCircuit size={size} />;
    default: return <Box size={size} />;
  }
};
