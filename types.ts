
import React from 'react';

export type AppID = 'chrome' | 'files' | 'settings' | 'terminal' | 'zypher-runner' | 'gemini' | 'store' | 'task-manager' | 'game-center' | 'ms-store' | 'apple-store' | 'google-play' | 'camera' | 'distro-builder' | 'kernel-dash' | string;

export type Platform = 'windows' | 'macos' | 'android' | 'linux' | 'native';

export interface AppConfig {
  id: AppID;
  name: string;
  icon: string;
  color: string;
  component: React.Node;
  isPinned?: boolean;
  platform: Platform;
  isInitial?: boolean;
  category?: string;
  description?: string;
  size?: string;
  rating?: number;
  version?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  avatar: string;
  password?: string;
  isFaceIDEnrolled: boolean;
  role: 'admin' | 'user';
}

export interface WindowState {
  id: AppID;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  extension?: string;
  category?: string;
  parentId: string | null;
  content?: string;
  createdAt: number;
}

export interface BIOSConfig {
  secureBoot: boolean;
  cpuOverclock: boolean;
  bootOrder: string[];
  vtEnabled: boolean;
  memoryFrequency: number;
}

export interface GlobalManifest {
  version: string;
  url: string;
  releaseNotes: string;
  pushedAt: number;
}

export interface OSConfig {
  layout: 'chrome' | 'windows';
  theme: 'dark' | 'light';
  wallpaper: string;
  accentColor: string;
  shelfOpacity: number;
  showDesktopIcons: boolean;
  glassMode: boolean;
  isWifiEnabled: boolean;
  connectedWifi: string | null;
  isEthernetConnected: boolean;
  isBluetoothEnabled: boolean;
  connectedBluetoothDevice: string | null;
  isFirstBoot: boolean;
  users: UserAccount[];
  currentUserId: string | null;
  recoveryKey: string;
  fileSystem: FileSystemItem[];
  installedAppIds: string[];
  bios: BIOSConfig;
  globalManifest: GlobalManifest;
  currentSystemVersion: string;
  deployment: {
    productionUrl: string;
    apiKey: string;
    isSimulation: boolean;
  };
}

export interface OSContextType {
  config: OSConfig;
  setConfig: React.Dispatch<React.SetStateAction<OSConfig>>;
  installApp: (id: string) => Promise<void>;
  uninstallApp: (id: string) => Promise<void>;
  openApp: (id: AppID) => void;
  systemAction: (action: 'shutdown' | 'restart') => void;
  updatingApps: Set<string>;
  isAuthenticated: boolean;
  setAuthenticated: (val: boolean) => void;
  logout: () => void;
  fs: {
    add: (item: Omit<FileSystemItem, 'id' | 'createdAt'>) => void;
    remove: (id: string) => void;
    getFolderContent: (parentId: string | null) => FileSystemItem[];
  };
}

export interface DesktopIcon {
  id: string;
  appId: AppID;
  name: string;
  icon: string;
  x: number;
  y: number;
}

export interface DragState {
  appId: AppID;
  source: 'desktop' | 'shelf';
  iconId?: string;
  initialX: number;
  initialY: number;
}
