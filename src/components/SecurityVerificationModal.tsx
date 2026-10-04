import React, { useState } from 'react';
import { CommunitySubgroup, Persona } from '../types';
import { ShieldCheck, QrCode, CheckCircle2, Copy, Lock, ArrowLeft, RefreshCw, Key } from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';

interface Props {
  subgroup: CommunitySubgroup;
  currentPersona: Persona;
  allPersonas: Persona[];
  t: TranslationDictionary;
  onClose: () => void;
}

export const SecurityVerificationModal: React.FC<Props> = ({
  subgroup,
  currentPersona,
  allPersonas,
  t,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [comparingWith, setComparingWith] = useState<string>(
    allPersonas.find(p => p.id !== currentPersona.id)?.id || ''
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  const selectedOtherPersona = allPersonas.find(p => p.id === comparingWith) || allPersonas[0];
  const safetyCode = subgroup.safetyNumber || '49201 84729 01824 55921 78401 22910 83910 47291 99281 38491 20491 58201';
  const codeBlocks = safetyCode.split(' ');

  const handleCopy = () => {
    navigator.clipboard.writeText(safetyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScanSimulation = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111b21] border border-slate-700/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#202c33] border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#00a884]" />
              <h2 className="text-base font-semibold text-white">{t.verifySecurityCode}</h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#00a884] font-medium px-2.5 py-1 bg-[#00a884]/10 rounded-full border border-[#00a884]/20">
            <ShieldCheck className="w-4 h-4" />
            <span>AES-GCM-256</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          {/* Info Banner */}
          <div className="text-center space-y-1">
            <h3 className="text-sm font-semibold text-white">{subgroup.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              {t.qrCodeScanInstruction}
            </p>
          </div>

          {/* QR Code and Key Lock Card */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner max-w-[220px] mx-auto relative group">
            <svg
              className="w-44 h-44 text-slate-900"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* Decorative QR code matrix */}
              <rect x="0" y="0" width="28" height="28" fill="#111" />
              <rect x="4" y="4" width="20" height="20" fill="#fff" />
              <rect x="8" y="8" width="12" height="12" fill="#111" />

              <rect x="72" y="0" width="28" height="28" fill="#111" />
              <rect x="76" y="4" width="20" height="20" fill="#fff" />
              <rect x="80" y="8" width="12" height="12" fill="#111" />

              <rect x="0" y="72" width="28" height="28" fill="#111" />
              <rect x="4" y="76" width="20" height="20" fill="#fff" />
              <rect x="8" y="80" width="12" height="12" fill="#111" />

              {/* Data blocks */}
              <rect x="36" y="8" width="6" height="6" fill="#111" />
              <rect x="48" y="14" width="8" height="6" fill="#111" />
              <rect x="60" y="8" width="6" height="8" fill="#111" />
              <rect x="36" y="32" width="10" height="10" fill="#111" />
              <rect x="54" y="32" width="8" height="8" fill="#111" />
              <rect x="70" y="36" width="6" height="6" fill="#111" />
              <rect x="84" y="34" width="6" height="6" fill="#111" />
              <rect x="8" y="36" width="6" height="12" fill="#111" />
              <rect x="20" y="40" width="6" height="6" fill="#111" />

              {/* Center Lock Badge */}
              <circle cx="50" cy="50" r="14" fill="#00a884" />
              <path
                d="M45 48 v-3 a5 5 0 0 1 10 0 v3 m-7 0 h14 a2 2 0 0 1 2 2 v6 a2 2 0 0 1 -2 2 h-14 a2 2 0 0 1 -2 -2 v-6 a2 2 0 0 1 2 -2"
                stroke="#fff"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />

              <rect x="34" y="74" width="6" height="12" fill="#111" />
              <rect x="46" y="68" width="8" height="6" fill="#111" />
              <rect x="62" y="72" width="10" height="10" fill="#111" />
              <rect x="80" y="76" width="8" height="8" fill="#111" />
            </svg>

            {isVerified && (
              <div className="absolute -bottom-3 bg-[#00a884] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Match</span>
              </div>
            )}
          </div>

          {/* 60 Digit Number Blocks */}
          <div className="bg-[#202c33] rounded-xl p-4 border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-300">{t.safetyNumberLabel}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[#00a884] hover:text-[#25d366] transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center font-mono text-sm font-semibold tracking-wider text-slate-100">
              {codeBlocks.map((block, idx) => (
                <div
                  key={idx}
                  className="bg-[#111b21] py-1.5 px-1 rounded-lg border border-slate-700/30 text-xs sm:text-sm text-[#00a884]"
                >
                  {block}
                </div>
              ))}
            </div>
          </div>

          {/* Persona Pair Comparison */}
          <div className="bg-[#202c33]/60 rounded-xl p-3 border border-slate-700/40 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Compare Keys With Neighbor:</span>
              <select
                value={comparingWith}
                onChange={e => setComparingWith(e.target.value)}
                className="bg-[#111b21] border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#00a884] outline-none"
              >
                {allPersonas
                  .filter(p => p.id !== currentPersona.id)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.flat})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="bg-[#111b21] p-2 rounded border border-slate-700/40">
                <div className="text-slate-400 text-[10px] truncate">{currentPersona.name}</div>
                <div className="text-[#00a884] font-medium truncate">{currentPersona.fingerprint}</div>
              </div>
              <div className="bg-[#111b21] p-2 rounded border border-slate-700/40">
                <div className="text-slate-400 text-[10px] truncate">{selectedOtherPersona.name}</div>
                <div className="text-[#00a884] font-medium truncate">{selectedOtherPersona.fingerprint}</div>
              </div>
            </div>
          </div>

          {/* Verification Action */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleScanSimulation}
              disabled={isVerifying}
              className="w-full py-2.5 px-4 bg-[#00a884] hover:bg-[#008f6f] text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00a884]/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Safety Number...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mark as Verified Member</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Matches confirm that no intermediary or third-party can decrypt communications in this community group.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
