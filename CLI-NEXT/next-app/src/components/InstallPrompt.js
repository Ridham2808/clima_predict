'use client';

import { useState, useEffect } from 'react';
import { SmartphoneDevice, Xmark } from 'iconoir-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA: Running in standalone mode');
      setIsInstalled(true);
      return;
    }

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (reg) => console.log('PWA: Service Worker registered', reg.scope),
          (err) => console.log('PWA: Service Worker registration failed', err)
        );
      });
    }

    // Capture the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA: App installed successfully');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('PWA: No deferred prompt available');
      return;
    }

    // Show the native browser install dialog
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: User response to install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowPrompt(false);
    }

    // Clear the deferred prompt regardless of outcome
    setDeferredPrompt(null);
  };

  // Don't show if installed, or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-32 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
      <div className="bg-[#1A1A1A]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] p-3 rounded-2xl shadow-lg shadow-[#00D09C]/20">
            <SmartphoneDevice width={24} height={24} className="text-[#0D0D0D]" />
          </div>
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-tight">ClimaPredict App</h4>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">Install for full experience</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="p-2 text-white/20 hover:text-white/40 transition-colors"
          >
            <Xmark width={20} height={20} />
          </button>
          <button
            onClick={handleInstallClick}
            className="bg-[#00D09C] hover:bg-[#00D09C]/90 text-[#0D0D0D] font-black py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#00D09C]/20"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
