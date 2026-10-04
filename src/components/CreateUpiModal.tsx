import React, { useState } from 'react';
import { IndianRupee, X, Building, Sparkles } from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';
import { Persona } from '../types';

interface Props {
  t: TranslationDictionary;
  currentPersona: Persona;
  onSubmit: (amount: number, note: string, category: 'maintenance' | 'festival_chanda' | 'security_fund' | 'bazaar') => void;
  onClose: () => void;
}

export const CreateUpiModal: React.FC<Props> = ({
  t,
  currentPersona,
  onSubmit,
  onClose,
}) => {
  const [amount, setAmount] = useState<number>(2200);
  const [note, setNote] = useState('Society Maintenance for October 2026');
  const [category, setCategory] = useState<'maintenance' | 'festival_chanda' | 'security_fund' | 'bazaar'>('maintenance');

  const presetAmounts = [501, 1100, 2200, 3500, 5000];

  const handleCategorySelect = (cat: 'maintenance' | 'festival_chanda' | 'security_fund' | 'bazaar') => {
    setCategory(cat);
    if (cat === 'maintenance') {
      setAmount(2200);
      setNote('Society Maintenance for October 2026');
    } else if (cat === 'festival_chanda') {
      setAmount(1100);
      setNote('Diwali Mela & Cultural Chanda Contribution');
    } else if (cat === 'security_fund') {
      setAmount(500);
      setNote('Staff Diwali Bonus & Security Appreciation');
    } else {
      setAmount(450);
      setNote('Local Fresh Grocery / Dairy Settlement');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !note.trim()) return;
    onSubmit(amount, note.trim(), category);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111b21] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#202c33] border-b border-slate-700">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <IndianRupee className="w-5 h-5 text-[#00a884]" />
            <span>{t.requestUpi}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Purpose</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleCategorySelect('maintenance')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  category === 'maintenance'
                    ? 'bg-[#00a884]/20 border-[#00a884] text-white'
                    : 'bg-[#202c33] border-slate-700/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-semibold">{t.maintenanceBill}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Society dues & bills</div>
              </button>

              <button
                type="button"
                onClick={() => handleCategorySelect('festival_chanda')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  category === 'festival_chanda'
                    ? 'bg-[#00a884]/20 border-[#00a884] text-white'
                    : 'bg-[#202c33] border-slate-700/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-semibold">{t.festivalChanda}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Utsav & Celebrations</div>
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Amount (₹ INR)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4 text-[#00a884]" />
              </div>
              <input
                type="number"
                min="10"
                max="100000"
                required
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-[#202c33] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-base font-semibold text-white focus:outline-none focus:border-[#00a884]"
              />
            </div>
            {/* Quick chips */}
            <div className="flex gap-2 pt-1 flex-wrap">
              {presetAmounts.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    amount === val
                      ? 'bg-[#00a884] text-white border-[#00a884]'
                      : 'bg-[#202c33] text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Note / Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Payment Note / Bill Description</label>
            <input
              type="text"
              required
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884]"
            />
          </div>

          {/* Destination UPI VPA */}
          <div className="p-3 bg-[#202c33] rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Receiving UPI ID:</span>
            </span>
            <span className="font-mono text-[#00a884] font-medium">{currentPersona.upiId}</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white font-medium rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Official UPI Request Card</span>
          </button>
        </form>
      </div>
    </div>
  );
};
