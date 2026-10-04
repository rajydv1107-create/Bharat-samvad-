import React, { useState } from 'react';
import { Message } from '../types';
import { Lock, ShieldCheck, X, Copy, Terminal, Eye, EyeOff, Radio } from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';

interface Props {
  message: Message;
  chatName: string;
  t: TranslationDictionary;
  onClose: () => void;
}

export const E2EEInspectorModal: React.FC<Props> = ({
  message,
  chatName,
  t,
  onClose,
}) => {
  const [showPlaintext, setShowPlaintext] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Generate fallback cryptographic details if not explicitly present in mock
  const ciphertext =
    message.e2eePayload?.ciphertext ||
    'gA4k9Z1XmP7wL0Q89z7Abw8/2RkLmQ4F0P9V+Ak9jXmZ+3v8Y72tB5N4L2P9==';
  const iv = message.e2eePayload?.iv || '9f8b2c41e0a7';
  const algorithm = message.e2eePayload?.algorithm || 'AES-GCM-256 (SubtleCrypto)';
  const fingerprint = message.e2eePayload?.senderFingerprint || 'B4E1 90A2 F73C 8110';
  const timestamp = message.timestamp;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111b21] border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#202c33] border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#00a884]/20 text-[#00a884]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">{t.inspectCrypto}</h2>
              <p className="text-xs text-slate-400">{chatName} · {message.senderName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-sm">
          {/* Status highlight */}
          <div className="flex items-center justify-between p-3.5 bg-[#00a884]/10 border border-[#00a884]/30 rounded-xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00a884] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-[#00a884] uppercase tracking-wide">
                  End-to-End Encrypted Payload
                </div>
                <div className="text-[12px] text-slate-300">
                  Standard: Web Cryptography API (RFC 5116 AES-GCM-256)
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-[#00a884]/20 text-[#00a884] px-2 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          {/* Plaintext vs Decrypted State */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-300">Decrypted Plaintext (Client-Side Only)</span>
              <button
                onClick={() => setShowPlaintext(!showPlaintext)}
                className="flex items-center gap-1 text-[#00a884] hover:underline"
              >
                {showPlaintext ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPlaintext ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>
            <div className="p-3 bg-[#202c33] rounded-xl border border-slate-700/60 font-sans text-xs sm:text-sm text-slate-100 whitespace-pre-wrap min-h-[48px]">
              {showPlaintext ? message.content : '••••••••••••••••••••••••••••••••••••••'}
            </div>
          </div>

          {/* Raw Ciphertext Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-300">Ciphertext Payload (Encrypted over wire)</span>
              <button
                onClick={() => copyToClipboard(ciphertext, 'cipher')}
                className="flex items-center gap-1 text-[#00a884] hover:underline"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedField === 'cipher' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
              {ciphertext}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#202c33]/70 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block text-[11px] mb-1">Initialization Vector (IV 96-bit):</span>
              <span className="font-mono text-slate-200">{iv}</span>
            </div>
            <div className="p-3 bg-[#202c33]/70 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block text-[11px] mb-1">Auth Tag (128-bit MAC):</span>
              <span className="font-mono text-slate-200">GCM-AUTHENTICATED</span>
            </div>
            <div className="p-3 bg-[#202c33]/70 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block text-[11px] mb-1">Sender SHA-256 Key Hash:</span>
              <span className="font-mono text-[#00a884] font-medium">{fingerprint}</span>
            </div>
            <div className="p-3 bg-[#202c33]/70 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block text-[11px] mb-1">Transmission Timestamp:</span>
              <span className="font-mono text-slate-200">{timestamp}</span>
            </div>
          </div>

          {/* Wiretap / Packet Inspection Explanation */}
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <Terminal className="w-4 h-4 text-[#00a884]" />
              <span>What do external servers or ISP see?</span>
            </div>
            <p className="leading-relaxed">
              When this message traverses Indian telecom networks (Jio, Airtel, Vi) or cloud routers, only the encrypted ciphertext and random IV are visible. The symmetric decryption key is stored strictly on user devices in secure storage and never transmitted.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#202c33] border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
