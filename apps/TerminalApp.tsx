
import React, { useState, useEffect, useRef, useContext } from 'react';
import { OSContext } from '../App';
import { APPS_REGISTRY } from '../constants';
import { StoreService } from '../services/StoreService';
import { AppData } from '../services/StoreService';

type TerminalMode = 'native' | 'windows' | 'macos' | 'kernel';

const TerminalApp: React.FC = () => {
  const os = useContext(OSContext);
  const [mode, setMode] = useState<TerminalMode>('native');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([
    'Zypher Multi-Kernel [Version 1.0.4-LTS-OTA]',
    '(c) 2026 Zypher Systems. All rights reserved.',
    '',
    'Arch: ARM64-NEON (Native) | X86_64-AVX (Zypher Bridge)',
    'Persistence: ENABLED (/dev/nvme0n1p3 mounted to /home)',
    'Type "help" for a list of system commands.',
    'Package Manager: sudo apt is now active.',
    ''
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!os) return null;
  const { config, fs } = os;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const getCurrentPath = () => {
    if (!currentFolderId) return '/';
    const path: string[] = [];
    let current = config.fileSystem.find(i => i.id === currentFolderId);
    while (current) {
      path.unshift(current.name);
      current = config.fileSystem.find(i => i.id === current.parentId);
    }
    return '/' + path.join('/');
  };

  const getPrompt = () => {
    const user = config.users.find(u => u.id === config.currentUserId)?.name || 'zypher';
    const path = getCurrentPath();
    
    switch (mode) {
      case 'windows': return `PS ${path.replace(/\//g, '\\')}> `;
      case 'macos': return `${user}@MacBook-Pro ${path === '/' ? '~' : path} % `;
      case 'kernel': return `root@zypher-kernel:${path}# `;
      default: return `${user}@os:${path}$ `;
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawInput = input.trim();
    if (!rawInput) return;

    const args = rawInput.split(' ');
    const cmd = args[0].toLowerCase();
    
    const newHistory = [...history, `${getPrompt()}${rawInput}`];

    const addLines = (lines: string | string[]) => {
      if (Array.isArray(lines)) {
        newHistory.push(...lines);
      } else {
        newHistory.push(lines);
      }
    };

    switch (cmd) {
      case 'help':
        addLines([
          'Zypher-Shell Commands:',
          '  - ls: List files and directories',
          '  - cd <dir>: Change directory',
          '  - pwd: Print working directory',
          '  - cat <file>: Display file content',
          '  - mkdir <name>: Create directory',
          '  - touch <name>: Create empty file',
          '  - rm <name>: Remove file or directory',
          '  - clear: Clear terminal screen',
          '  - whoami: Show current user',
          '  - date: Show current system time',
          '  - echo <text>: Print text to terminal',
          '  - neofetch: Show system information',
          '  - lsblk: View atomic partition slots',
          '  - zypher-update: Check for cloud updates',
          '  - zypher-pkg <install|remove|list> <app>: Package manager',
          '  - apt <update|install|remove|list>: Debian package manager (requires sudo)',
          '  - sudo su: Enter root kernel mode',
          '  - exit: Close terminal'
        ]);
        break;

      case 'apt':
        const aptSubCmd = args[1];
        if (aptSubCmd === 'list') {
          addLines('Listing installed packages (apt)...');
          config.installedAppIds.forEach(id => {
            const app = APPS_REGISTRY.find(a => a.id === id);
            if (app) addLines(`${app.id}/now ${app.version || '1.0.0'} arm64 [installed]`);
          });
        } else if (aptSubCmd) {
          addLines('E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)');
          addLines('E: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), are you root?');
        } else {
          addLines([
            'apt 2.6.1 (arm64)',
            'Usage: apt [options] command',
            '',
            'Commands:',
            '  list - list packages based on package names',
            '  install - install packages (requires sudo)',
            '  remove - remove packages (requires sudo)',
            '  update - update list of available packages (requires sudo)'
          ]);
        }
        break;

      case 'zypher-pkg':
        const subCmd = args[1];
        const appName = args[2];
        if (subCmd === 'list') {
          addLines('Installed Packages:');
          config.installedAppIds.forEach(id => {
            const app = APPS_REGISTRY.find(a => a.id === id);
            if (app) addLines(`  - ${app.id} (${app.name})`);
          });
        } else if (subCmd === 'install' && appName) {
          const app = APPS_REGISTRY.find(a => a.id === appName);
          if (app) {
            addLines(`Installing ${app.name}...`);
            os.installApp(app.id);
          } else {
            addLines(`Package not found: ${appName}`);
          }
        } else if (subCmd === 'remove' && appName) {
          const app = APPS_REGISTRY.find(a => a.id === appName);
          if (app) {
            addLines(`Removing ${app.name}...`);
            os.uninstallApp(app.id);
          } else {
            addLines(`Package not found: ${appName}`);
          }
        } else {
          addLines('Usage: zypher-pkg <install|remove|list> [package_name]');
        }
        break;

      case 'ls':
        const items = fs.getFolderContent(currentFolderId);
        if (items.length > 0) {
          const output = items.map(item => {
            return `${item.type === 'folder' ? '[DIR] ' : '      '}${item.name}${item.extension ? '.' + item.extension : ''}`;
          }).join('\n');
          addLines(output.split('\n'));
        }
        break;

      case 'cd':
        const target = args[1];
        if (!target || target === '/') {
          setCurrentFolderId(null);
        } else if (target === '..') {
          const current = config.fileSystem.find(i => i.id === currentFolderId);
          setCurrentFolderId(current?.parentId || null);
        } else if (target === '/mnt/c' || target === 'C:' || target === '/c') {
          addLines([
            'ZEL_BRIDGE: Mapping Windows C:\\ drive to /mnt/c...',
            'Accessing host filesystem via drvfs...',
            'Directory: /mnt/c'
          ]);
          // We don't actually change the folder ID to keep them in the sandbox, 
          // but we provide the visual feedback they expect.
        } else {
          const folder = fs.getFolderContent(currentFolderId).find(i => i.name.toLowerCase() === target.toLowerCase() && i.type === 'folder');
          if (folder) {
            setCurrentFolderId(folder.id);
          } else {
            addLines(`cd: no such directory: ${target}`);
          }
        }
        break;

      case 'mount':
        if (args[1] === '-t' && args[2] === 'drvfs' && args[3] === 'C:') {
          addLines('C: successfully mounted to /mnt/c (drvfs)');
        } else {
          addLines([
            'sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)',
            'proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)',
            'udev on /dev type devtmpfs (rw,nosuid,relatime,size=3991244k,nr_inodes=997811,mode=755)',
            'devpts on /dev/pts type devpts (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000)',
            'tmpfs on /run type tmpfs (rw,nosuid,nodev,noexec,relatime,size=804364k,mode=755)',
            '/dev/nvme0n1p1 on / type ext4 (rw,relatime,errors=remount-ro)',
            'C: on /mnt/c type drvfs (rw,noatime,uid=1000,gid=1000,case=off)'
          ]);
        }
        break;

      case 'pwd':
        addLines(getCurrentPath());
        break;

      case 'cat':
        const fileName = args[1];
        if (!fileName) {
          addLines('cat: missing operand');
        } else {
          const file = fs.getFolderContent(currentFolderId).find(i => (i.name + (i.extension ? '.' + i.extension : '')).toLowerCase() === fileName.toLowerCase() && i.type === 'file');
          if (file) {
            addLines(file.content || '(File is empty)');
          } else {
            addLines(`cat: ${fileName}: No such file`);
          }
        }
        break;

      case 'mkdir':
        const dirName = args[1];
        if (!dirName) {
          addLines('mkdir: missing operand');
        } else {
          fs.add({ name: dirName, type: 'folder', parentId: currentFolderId });
        }
        break;

      case 'touch':
        const newFileName = args[1];
        if (!newFileName) {
          addLines('touch: missing operand');
        } else {
          const parts = newFileName.split('.');
          const ext = parts.length > 1 ? parts.pop() : undefined;
          const name = parts.join('.');
          fs.add({ name: name || newFileName, type: 'file', extension: ext, parentId: currentFolderId, content: '' });
        }
        break;

      case 'rm':
        const rmTarget = args[1];
        if (!rmTarget) {
          addLines('rm: missing operand');
        } else {
          const item = fs.getFolderContent(currentFolderId).find(i => (i.name + (i.extension ? '.' + i.extension : '')).toLowerCase() === rmTarget.toLowerCase());
          if (item) {
            fs.remove(item.id);
          } else {
            addLines(`rm: cannot remove '${rmTarget}': No such file or directory`);
          }
        }
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'whoami':
        addLines(config.users.find(u => u.id === config.currentUserId)?.name || 'zypher');
        break;

      case 'date':
        addLines(new Date().toString());
        break;

      case 'echo':
        addLines(args.slice(1).join(' '));
        break;

      case 'neofetch':
        addLines([
          '            .-/+oossssoo+/-.               zypher@os',
          '        `:+ssssssssssssssssss+:`           ---------',
          '      -+ssssssssssssssssssyyssss+-         OS: ZypherOS v' + config.currentSystemVersion + ' ARM64',
          '    .ossssssssssssssssssdMMMNysssso.       Kernel: 6.1.0-zypher-nectar',
          '   /ssssssssssshdmmNNmmyNMMMMhssssss/      Uptime: 42 mins',
          '  +ssssssssshmydMMMMMMMNddddyssssssss+     Packages: 124 (dpkg)',
          ' /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Shell: zypher-sh 1.0',
          '.ssssssssdMMMMMMMMMMMMMMMMMMMMdssssssss.   Resolution: 1920x1080',
          'ssssssssNMMMMMMMMMMMMMMMMMMMMMMNssssssss   DE: Zypher-Shell (Mica)',
          'ssssssssNMMMMMMMMMMMMMMMMMMMMMMNssssssss   WM: Zypher-WM',
          'ssssssssdMMMMMMMMMMMMMMMMMMMMMMdssssssss   CPU: Broadcom BCM2712 (4) @ 2.400GHz',
          ' /sssssssshNMMMMMMMMMMMMMMMMMNhssssssss/   GPU: VideoCore VII',
          '  +ssssssssshmydMMMMMMMMMMNmyhsssssss+     Memory: 1240MiB / 8192MiB',
          '   /ssssssssssshdmmNNNNmmyhssssssssss/     Package Manager: apt (dpkg)',
          '    .osssssssssssssssssssssssssssso.       ',
          '      -+ssssssssssssssssssssssss+-         ',
          '        `:+ssssssssssssssssss+:`           ',
          '            .-/+oossssoo+/-.               '
        ]);
        break;

      case 'lsblk':
        addLines([
          'NAME          MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINTS',
          'nvme0n1       259:0    0 238.5G  0 disk  ',
          '├─nvme0n1p1   259:1    0     8G  1 part  / (active system_a)',
          '├─nvme0n1p2   259:2    0     8G  1 part  (idle system_b)',
          '└─nvme0n1p3   259:3    0 222.5G  0 part  /home (persistent)'
        ]);
        break;

      case 'zypher-update':
        addLines([
          'Checking OTA manifest...',
          'Current Version: ' + config.currentSystemVersion,
          'Latest Version: ' + config.globalManifest.version,
          'Download pending. Please visit Settings App to apply Atomic Switch.'
        ]);
        break;

      case 'sudo':
        const subCmdSudo = args[1];
        if (!subCmdSudo) {
          addLines([
            'usage: sudo -h | -K | -k | -V',
            'usage: sudo -v [-knS] [-p prompt] [-u user]',
            'usage: sudo -l [-knS] [-g group] [-h host] [-p prompt] [-U user] [-u user] [command]',
            'usage: sudo [-AbEHknPS] [-C num] [-D directory] [-g group] [-h host] [-p prompt] [-R directory] [-T timeout] [-u user] [command]',
            'usage: sudo -e [-knS] [-C num] [-D directory] [-g group] [-h host] [-p prompt] [-R directory] [-T timeout] [-u user] file ...'
          ]);
        } else if (subCmdSudo === 'su') {
          setMode('kernel');
          addLines('Switching to root kernel mode...');
        } else if (subCmdSudo === 'apt') {
          const aptCmd = args[2];
          const pkgName = args[3];
          
          if (aptCmd === 'update') {
            addLines([
              'Hit:1 http://deb.zypheros.org/debian bookworm InRelease',
              'Get:2 http://security.zypheros.org/debian-security bookworm-security InRelease [48.9 kB]',
              'Get:3 http://deb.zypheros.org/debian bookworm-updates InRelease [52.1 kB]',
              'Fetched 101 kB in 1s (101 kB/s)',
              'Reading package lists... Done',
              'Building dependency tree... Done',
              'Reading state information... Done',
              'All packages are up to date.'
            ]);
          } else if (aptCmd === 'search' && pkgName) {
            addLines(`Searching Zypher Edge Repositories for '${pkgName}'...`);
            StoreService.fetchLinuxPackages(pkgName).then(results => {
              if (results.length > 0) {
                const lines = results.map(p => `${p.id}/${p.platform} ${p.version} arm64\n  ${p.description}`);
                setHistory(prev => [...prev, ...lines]);
              } else {
                setHistory(prev => [...prev, `No results found for '${pkgName}'`]);
              }
            });
          } else if (aptCmd === 'list') {
            addLines('Listing installed packages (apt)...');
            config.installedAppIds.forEach(id => {
              const app = APPS_REGISTRY.find(a => a.id === id);
              if (app) addLines(`${app.id}/now ${app.version || '1.0.0'} arm64 [installed]`);
            });
          } else if (aptCmd === 'install' && pkgName) {
            const app = APPS_REGISTRY.find(a => a.id === pkgName);
            if (app) {
              addLines([
                `Reading package lists... Done`,
                `Building dependency tree... Done`,
                `Reading state information... Done`,
                `The following NEW packages will be installed:`,
                `  ${app.id}`,
                `0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.`,
                `Need to get ${app.size || '10MB'} of archives.`,
                `After this operation, ${app.size || '10MB'} of additional disk space will be used.`,
                `Get:1 http://deb.zypheros.org/debian bookworm/main arm64 ${app.id} [${app.size || '10MB'}]`,
                `Selecting previously unselected package ${app.id}.`,
                `(Reading database ... 124052 files and directories currently installed.)`,
                `Preparing to unpack .../${app.id}_arm64.deb ...`,
                `Unpacking ${app.id} (1.0.0) ...`,
                `Setting up ${app.id} (1.0.0) ...`,
                `Processing triggers for zypher-kernel (6.1.0) ...`
              ]);
              os.installApp(app.id);
            } else {
              addLines(`Package '${pkgName}' not found in local cache. Fetching from Edge Network...`);
              StoreService.fetchLinuxPackages(pkgName).then(results => {
                const remoteApp = results.find(r => r.id.toLowerCase() === pkgName.toLowerCase() || r.name.toLowerCase() === pkgName.toLowerCase());
                if (remoteApp) {
                  setHistory(prev => [...prev, 
                    `Found remote package: ${remoteApp.name} (${remoteApp.version})`,
                    `Get:1 http://deb.debian.org/debian sid/main arm64 ${remoteApp.id} [${remoteApp.size}]`,
                    `Unpacking ${remoteApp.id}...`,
                    `Setting up ${remoteApp.id}...`,
                    `Done. (Note: Remote binary mapped to ZEL-Linux runtime)`
                  ]);
                  // In a real OS we'd add to registry, here we simulate the success
                } else {
                  setHistory(prev => [...prev, `E: Unable to locate package ${pkgName}`]);
                }
              });
            }
          }
 else if (aptCmd === 'remove' && pkgName) {
            const app = APPS_REGISTRY.find(a => a.id === pkgName);
            if (app) {
              addLines([
                `Reading package lists... Done`,
                `Building dependency tree... Done`,
                `Reading state information... Done`,
                `The following packages will be REMOVED:`,
                `  ${app.id}`,
                `0 upgraded, 0 newly installed, 1 to remove and 0 not upgraded.`,
                `After this operation, ${app.size || '10MB'} disk space will be freed.`,
                `(Reading database ... 124052 files and directories currently installed.)`,
                `Removing ${app.id} (1.0.0) ...`,
                `Processing triggers for zypher-kernel (6.1.0) ...`
              ]);
              os.uninstallApp(app.id);
            } else {
              addLines(`E: Package '${pkgName}' is not installed, so not removed`);
            }
          } else {
            addLines([
              'apt 2.6.1 (arm64)',
              'Usage: apt [options] command',
              '',
              'Commands:',
              '  list - list packages based on package names',
              '  search - search in package descriptions',
              '  show - show package details',
              '  install - install packages',
              '  reinstall - reinstall packages',
              '  remove - remove packages',
              '  autoremove - Remove automatically all unused packages',
              '  update - update list of available packages',
              '  upgrade - upgrade the system by installing/upgrading packages',
              '  full-upgrade - upgrade the system by removing/installing/upgrading packages',
              '  edit-sources - edit the source information file',
              '  satisfy - satisfy dependency strings'
            ]);
          }
        } else {
          addLines(`sudo: ${subCmdSudo}: command not found`);
        }
        break;

      case 'exit':
        addLines('Session terminated. Please close the window.');
        break;

      default:
        addLines(`Command not found: ${cmd}`);
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="h-full p-4 font-mono text-sm flex flex-col overflow-hidden bg-black text-emerald-500">
      <div className="flex-1 overflow-y-auto mb-2 custom-scrollbar" ref={scrollRef}>
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex items-start gap-2 border-t border-white/5 pt-2">
        <span className="font-bold shrink-0 text-blue-400">
          {getPrompt()}
        </span>
        <input 
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none border-none text-inherit focus:ring-0 p-0"
        />
      </form>
    </div>
  );
};

export default TerminalApp;
