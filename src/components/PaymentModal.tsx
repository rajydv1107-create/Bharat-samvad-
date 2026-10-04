import React, { useState } from 'react';
import { UpiPaymentData, Persona } from '../types';
import { IndianRupee, ShieldCheck, CheckCircle2, ArrowLeft, Smartphone, Building, Sparkles } from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';

interface Props {
  paymentData: UpiPaymentData;
  payer: Persona;
  t: TranslationDictionary;
  onSuccess: (txnRef: string) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<Props> = ({
  paymentData,
  payer,
  t,
  onSuccess,
  onClose,
}) => {
  const [upiPin, setUpiPin] = useState('');
  const [selectedApp, setSelectedApp] = useState<'bhim' | 'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedTxn, setGeneratedTxn] = useState('');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const txnId = `UPI/${Date.now().toString().slice(-8)}/${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedTxn(txnId);
      setIsProcessing(false);
      setIsCompleted(true);
      setTimeout(() => {
        onSuccess(txnId);
      }, 1600);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111b21] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#202c33] border-b border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 font-semibold text-white text-sm">
              <IndianRupee className="w-4 h-4 text-[#00a884]" />
              <span>WhatsApp Pay & UPI Bharat</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#00a884] font-medium bg-[#00a884]/10 px-2 py-0.5 rounded-full border border-[#00a884]/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NPCI Verified</span>
          </div>
        </div>

        {/* Content */}
        {isCompleted ? (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#00a884]/20 border-2 border-[#00a884] flex items-center justify-center mx-auto text-[#00a884]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
              <p className="text-sm text-slate-400 mt-1">₹{paymentData.amount.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 bg-[#202c33] rounded-xl border border-slate-700/50 text-xs space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-[#00a884]">{generatedTxn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient UPI:</span>
                <span>{paymentData.upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paid from:</span>
                <span>{payer.name} ({payer.flat})</span>
              </div>
            </div>
            <p className="text-xs text-[#00a884] font-medium flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Receipt generated in community chat!</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="text-center py-4 bg-[#202c33]/70 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Payment Total</span>
              <div className="flex items-center justify-center text-3xl font-extrabold text-white mt-1">
                <IndianRupee className="w-6 h-6 mr-0.5 text-[#00a884]" />
                <span>{paymentData.amount.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 px-4">{paymentData.note}</p>
            </div>

            {/* Recipient Details */}
            <div className="p-3 bg-[#202c33] rounded-xl border border-slate-700/40 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Payee:</span>
                </span>
                <span className="font-medium text-white">{paymentData.upiId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Paying from:</span>
                </span>
                <span className="text-slate-200">{payer.name} ({payer.upiId})</span>
              </div>
            </div>

            {/* App Selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-medium">Select UPI Gateway</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'gpay', label: 'Google Pay' },
                  { id: 'phonepe', label: 'PhonePe' },
                  { id: 'paytm', label: 'Paytm' },
                  { id: 'bhim', label: 'BHIM UPI' },
                ].map(app => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedApp(app.id as any)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                      selectedApp === app.id
                        ? 'bg-[#00a884]/20 border-[#00a884] text-white shadow-sm'
                        : 'bg-[#202c33] border-slate-700/60 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {app.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated UPI PIN input */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-medium">Enter 4 or 6 Digit UPI PIN</span>
              <input
                type="password"
                maxLength={6}
                value={upiPin}
                onChange={e => setUpiPin(e.target.value)}
                placeholder="• • • • • •"
                className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-4 py-2.5 text-center text-lg tracking-[0.4em] font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#00a884]"
              />
              <p className="text-[11px] text-slate-500 text-center">
                UPI PIN is processed on-device and never stored or transmitted.
              </p>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00a884]/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Contacting Bank & NPCI...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Pay ₹{paymentData.amount.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
