import React, { useState } from 'react';
import { Lock, X, Users, Shield, Clock } from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';
import { ChatType } from '../types';

interface Props {
  t: TranslationDictionary;
  onSubmit: (name: string, description: string, type: ChatType, disappearingDays: number) => void;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<Props> = ({ t, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ChatType>('private_e2ee');
  const [disappearingDays, setDisappearingDays] = useState<number>(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), description.trim(), type, disappearingDays);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111b21] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#202c33] border-b border-slate-700">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Lock className="w-5 h-5 text-[#00a884]" />
            <span>{t.newGroup}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Group Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. 🔐 Wing C & D Residents (Private E2EE)"
              className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Description & Rules</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Neighborhood private group for flat coordination, parking, and security."
              className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884] resize-none"
            />
          </div>

          {/* Group Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Channel Type</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setType('private_e2ee')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  type === 'private_e2ee'
                    ? 'bg-[#00a884]/20 border-[#00a884] text-white'
                    : 'bg-[#202c33] border-slate-700/60 text-slate-300'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#00a884]" />
                  <span>Private E2EE</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">256-bit AES-GCM encrypted peer chats</div>
              </button>

              <button
                type="button"
                onClick={() => setType('announcement')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  type === 'announcement'
                    ? 'bg-[#00a884]/20 border-[#00a884] text-white'
                    : 'bg-[#202c33] border-slate-700/60 text-slate-300'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>RWA Broadcast</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Admins only post, all residents receive</div>
              </button>
            </div>
          </div>

          {/* Disappearing Messages */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Disappearing Messages Timer</span>
            </label>
            <select
              value={disappearingDays}
              onChange={e => setDisappearingDays(Number(e.target.value))}
              className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00a884]"
            >
              <option value={0}>Off (Keep messages indefinitely)</option>
              <option value={1}>24 Hours</option>
              <option value={7}>7 Days (Recommended for security)</option>
              <option value={90}>90 Days</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Create & Generate E2EE Group Keys</span>
          </button>
        </form>
      </div>
    </div>
  );
};
