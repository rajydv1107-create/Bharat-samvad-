import React from 'react';
import { Download, X, Smartphone, Monitor, Apple, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { IndiaAppLogo } from './IndiaAppLogo';

interface Props {
  isInstallable: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<Props> = ({
  isInstallable,
  isIOS,
  onInstall,
  onClose,
}) => {
  const handleTriggerInstall = async () => {
    if (isInstallable) {
      await onInstall();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111b21] border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#202c33] border-b border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <IndiaAppLogo size="sm" showText={false} />
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Install BharatSamvaad App</span>
              </h2>
              <p className="text-[11px] text-slate-400">Fast, offline-ready local community network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-slate-200 text-xs">
          {/* Main App Showcase Card */}
          <div className="p-4 bg-gradient-to-r from-[#075e54]/30 to-[#202c33] rounded-2xl border border-[#00a884]/40 flex items-center gap-3.5">
            <IndiaAppLogo size="lg" showText={false} />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white">BharatSamvaad India</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Get full-screen native experience on your Android phone, iPhone, or PC.
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00a884] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Direct 1-Click Launch:</span>
                <span className="text-slate-400 ml-1">Opens instantly from your mobile home screen without opening browser tabs.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#00a884] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Offline Community Access:</span>
                <span className="text-slate-400 ml-1">Cached emergency speed-dial, society directory, and recent RWA notices work even without mobile data.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#00a884] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Lightweight & Safe:</span>
                <span className="text-slate-400 ml-1">Uses less than 2 MB storage. No Play Store / App Store account required.</span>
              </div>
            </div>
          </div>

          {/* Device Specific Instructions */}
          {isInstallable ? (
            <div className="pt-2">
              <button
                onClick={handleTriggerInstall}
                className="w-full py-3 bg-[#00a884] hover:bg-[#008f6f] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00a884]/20 transition-all active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>Install BharatSamvaad App Now</span>
              </button>
            </div>
          ) : isIOS ? (
            /* iOS Safari Step-by-Step Guide */
            <div className="p-3.5 bg-[#202c33] rounded-2xl border border-slate-700/60 space-y-2.5">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Apple className="w-4 h-4 text-slate-300" />
                <span>How to Install on iPhone / iPad (Safari):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li>
                  Tap the <strong className="text-white">Share</strong> button (box with an upward arrow <span className="text-blue-400">⎋</span>) at the bottom toolbar of Safari.
                </li>
                <li>
                  Scroll down the share sheet and tap <strong className="text-white">Add to Home Screen</strong>.
                </li>
                <li>
                  Tap <strong className="text-[#00a884]">Add</strong> in the top-right corner.
                </li>
              </ol>
            </div>
          ) : (
            /* Android / Desktop Chrome Guide if prompt is not immediately available */
            <div className="p-3.5 bg-[#202c33] rounded-2xl border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Smartphone className="w-4 h-4 text-[#00a884]" />
                <span>How to Install in Chrome / Edge / Brave:</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Tap the <strong>three dots menu (⋮)</strong> at the top right of your browser, then select <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home Screen"</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#202c33] border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-[#25d366]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PWA Verified Standard</span>
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2 py-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
