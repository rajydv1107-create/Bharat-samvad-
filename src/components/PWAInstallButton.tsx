import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface Props {
  variant?: 'header' | 'banner' | 'icon';
  className?: string;
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed as a standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-2.5 py-1 bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 ${className}`}
          title="Install BharatSamvaad App"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      )}

      {variant === 'icon' && (
        <button
          onClick={handleClick}
          className={`p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors ${className}`}
          title="Install App"
        >
          <Download className="w-4 h-4 text-[#25d366]" />
        </button>
      )}

      {variant === 'banner' && (
        <div
          onClick={handleClick}
          className={`p-3 bg-gradient-to-r from-[#005c4b]/30 to-[#202c33] border border-[#00a884]/40 hover:border-[#00a884] rounded-2xl cursor-pointer transition-all flex items-center justify-between group ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00a884] text-white flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#25d366] transition-colors flex items-center gap-1.5">
                <span>Install BharatSamvaad App</span>
                <span className="text-[9px] bg-[#00a884]/20 text-[#25d366] px-1.5 py-0.2 rounded font-mono">
                  PWA
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Add to your phone or PC home screen for fast offline access.
              </p>
            </div>
          </div>
          <button className="px-3 py-1 bg-[#00a884] text-white text-xs font-semibold rounded-lg shrink-0 group-hover:bg-[#008f6f]">
            Install
          </button>
        </div>
      )}

      {showModal && (
        <PWAInstallModal
          isInstallable={isInstallable}
          isIOS={isIOS}
          onInstall={install}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
