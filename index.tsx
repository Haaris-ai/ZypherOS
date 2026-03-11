
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * ZYPH BIOS: Service Worker & Kernel Persistence Bridge
 * Fixed for cross-origin preview environments and sandboxed frames
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      // Check if location is valid for URL construction
      if (!window.location.href || window.location.href.startsWith('about:')) {
        console.log('[Zypher OS] Kernel Bridge: Sandboxed environment detected. Service worker disabled.');
        return;
      }

      const swUrl = new URL('./sw.js', window.location.href);
      
      // Strict same-origin check to satisfy browser security requirements
      if (swUrl.origin === window.location.origin) {
        navigator.serviceWorker.register(swUrl.pathname)
          .then((registration) => {
            console.log('[Zypher OS] Kernel Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[Zypher OS] Kernel Service Worker registration bypassed:', error.message);
          });
      } else {
        console.log('[Zypher OS] Kernel Bridge: Running in Cross-Origin Preview Mode. Offline capabilities disabled.');
      }
    } catch (e) {
      // Catch URL construction failures in specific sandboxed environments (e.g. about:srcdoc)
      console.log('[Zypher OS] Kernel Bridge: Non-standard environment. Skipping Service Worker registration.');
    }
  });
}
