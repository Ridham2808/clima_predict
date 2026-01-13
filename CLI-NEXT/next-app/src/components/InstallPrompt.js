'use client';

import { useState, useEffect } from 'react';
import { SmartphoneDevice, Xmark } from 'iconoir-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    if (window.localStorage.getItem('pwa-installed') === 'true') {
      return true;
    }
    return false;
  });

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);

      // Show our custom install prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000); // Show after 3 seconds
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      window.localStorage.setItem('pwa-installed', 'true');
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
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowPrompt(false);
      setIsInstalled(true);
      window.localStorage.setItem('pwa-installed', 'true');
    } else {
      console.log('User dismissed the install prompt');
      // Don't show again for this session
      setShowPrompt(false);
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for this session
    window.sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or if dismissed in this session
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  if (window.sessionStorage.getItem('pwa-prompt-dismissed') === 'true') {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .install-prompt-animate {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}} />
      <div className="fixed bottom-28 left-0 right-0 z-50 px-6 install-prompt-animate">
        <div className="max-w-md mx-auto bg-black/60 backdrop-blur-2xl rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D09C]/10 rounded-full blur-2xl" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-[#00D09C]/10 rounded-2xl p-3.5 flex-shrink-0 border border-[#00D09C]/20">
              <SmartphoneDevice width={28} height={28} className="text-[#00D09C]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-black text-white mb-1 tracking-tight">
                Premium Extension
              </h3>
              <p className="text-xs text-white/50 mb-5 leading-relaxed font-medium">
                Add ClimaPredict to your home screen for lightning-fast access and native experience.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] text-[#0D0D0D] font-bold py-3.5 px-6 rounded-2xl active:scale-95 transition-all shadow-lg shadow-[#00D09C]/20"
                >
                  Install Now
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-6 py-3.5 text-white/40 hover:text-white/70 transition-colors font-bold text-sm uppercase tracking-widest"
                >
                  Later
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0 mt-1"
              aria-label="Close"
            >
              <Xmark width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

