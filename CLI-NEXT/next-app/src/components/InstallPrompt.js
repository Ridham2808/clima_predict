'use client';

import { useState, useEffect } from 'react';
import { SmartphoneDevice, Xmark, Download, ShareIos, Plus } from 'iconoir-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    if (window.localStorage.getItem('pwa-installed') === 'true') {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if already dismissed today
    const dismissedDate = window.localStorage.getItem('pwa-prompt-dismissed-date');
    const today = new Date().toDateString();

    if (dismissedDate === today) {
      return;
    }

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);

      setTimeout(() => {
        console.log('PWA: Showing install prompt');
        setShowPrompt(true);
      }, 1000);
    };

    const handleAppInstalled = () => {
      console.log('PWA: App installed');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      window.localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS or if no prompt event, show manual instructions after 2 seconds
    setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        console.log('PWA: No native prompt, showing manual instructions');
        setShowPrompt(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Native install for Android/Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowPrompt(false);
        setIsInstalled(true);
        window.localStorage.setItem('pwa-installed', 'true');
      }
      setDeferredPrompt(null);
    } else {
      // Show manual instructions for iOS or other browsers
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowInstructions(false);
    const today = new Date().toDateString();
    window.localStorage.setItem('pwa-prompt-dismissed-date', today);
  };

  if (isInstalled || !showPrompt) {
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

      {!showInstructions ? (
        <div className="fixed bottom-32 md:bottom-28 left-0 right-0 z-50 px-4 md:px-6 install-prompt-animate">
          <div className="max-w-md mx-auto bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D09C]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#4D9FFF]/10 rounded-full blur-2xl" />

            <div className="flex items-start gap-3 md:gap-4 relative z-10">
              <div className="bg-gradient-to-br from-[#00D09C] to-[#4D9FFF] rounded-2xl p-3 md:p-3.5 flex-shrink-0 shadow-lg shadow-[#00D09C]/20">
                <SmartphoneDevice width={24} height={24} className="text-white md:w-7 md:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-black text-white mb-1 tracking-tight uppercase">
                  Install ClimaPredict
                </h3>
                <p className="text-xs text-white/60 mb-4 md:mb-5 leading-relaxed font-medium">
                  {isIOS
                    ? 'Add to your home screen for quick access and offline support.'
                    : 'Install our app for instant access and offline features.'}
                </p>
                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] text-[#0D0D0D] font-black text-sm py-3 md:py-3.5 px-4 md:px-6 rounded-xl md:rounded-2xl active:scale-95 transition-all shadow-lg shadow-[#00D09C]/30 uppercase tracking-wide touch-target"
                  >
                    {deferredPrompt ? 'Install' : 'How to Install'}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 md:px-6 py-3 md:py-3.5 text-white/40 hover:text-white/70 transition-colors font-bold text-xs md:text-sm uppercase tracking-widest touch-target"
                  >
                    Later
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0 mt-1 p-2 touch-target"
                aria-label="Close"
              >
                <Xmark width={16} height={16} className="md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 install-prompt-animate">
          <div className="max-w-md w-full bg-gradient-to-br from-[#0D0D0D] to-black rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00D09C]/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                  Installation Guide
                </h3>
                <button
                  onClick={handleDismiss}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <Xmark width={24} height={24} />
                </button>
              </div>

              {isIOS ? (
                <div className="space-y-4">
                  <p className="text-white/60 text-sm font-medium mb-6">
                    Follow these steps to add ClimaPredict to your home screen:
                  </p>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="bg-[#00D09C] text-[#0D0D0D] rounded-xl p-2 font-black text-sm">1</div>
                      <div className="flex-1">
                        <p className="text-white font-bold mb-1">Tap the Share button</p>
                        <p className="text-white/50 text-sm flex items-center gap-2">
                          <ShareIos width={20} height={20} className="text-[#00D09C]" />
                          At the bottom of Safari
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="bg-[#00D09C] text-[#0D0D0D] rounded-xl p-2 font-black text-sm">2</div>
                      <div className="flex-1">
                        <p className="text-white font-bold mb-1">Select "Add to Home Screen"</p>
                        <p className="text-white/50 text-sm flex items-center gap-2">
                          <Plus width={20} height={20} className="text-[#00D09C]" />
                          Scroll down in the menu
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="bg-[#00D09C] text-[#0D0D0D] rounded-xl p-2 font-black text-sm">3</div>
                      <div className="flex-1">
                        <p className="text-white font-bold mb-1">Tap "Add"</p>
                        <p className="text-white/50 text-sm">The app will appear on your home screen</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white/60 text-sm font-medium mb-6">
                    To install ClimaPredict:
                  </p>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="bg-[#00D09C] text-[#0D0D0D] rounded-xl p-2 font-black text-sm">1</div>
                      <div className="flex-1">
                        <p className="text-white font-bold mb-1">Open browser menu</p>
                        <p className="text-white/50 text-sm">Tap the three dots (⋮) in the corner</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="bg-[#00D09C] text-[#0D0D0D] rounded-xl p-2 font-black text-sm">2</div>
                      <div className="flex-1">
                        <p className="text-white font-bold mb-1">Select "Install app" or "Add to Home screen"</p>
                        <p className="text-white/50 text-sm flex items-center gap-2">
                          <Download width={20} height={20} className="text-[#00D09C]" />
                          Look for this option
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="bg-[#00D09C] text-[#0D0D0D] rounded-xl p-2 font-black text-sm">3</div>
                      <div className="flex-1">
                        <p className="text-white font-bold mb-1">Confirm installation</p>
                        <p className="text-white/50 text-sm">The app will be added to your device</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleDismiss}
                className="w-full mt-8 bg-gradient-to-r from-[#00D09C] to-[#4D9FFF] text-[#0D0D0D] font-black py-4 rounded-2xl uppercase tracking-wide shadow-lg shadow-[#00D09C]/30 active:scale-95 transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
