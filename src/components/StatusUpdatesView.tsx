import React, { useState } from 'react';
import { CommunityStatus, Persona } from '../types';
import { Plus, X, ShieldCheck, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';

interface Props {
  statuses: CommunityStatus[];
  currentPersona: Persona;
  t: TranslationDictionary;
  onAddStatus: (caption: string, imageUrl?: string) => void;
}

export const StatusUpdatesView: React.FC<Props> = ({
  statuses,
  currentPersona,
  t,
  onAddStatus,
}) => {
  const [activeStory, setActiveStory] = useState<CommunityStatus | null>(null);
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [captionInput, setCaptionInput] = useState('');

  const handlePostStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captionInput.trim()) return;
    onAddStatus(captionInput.trim(), currentPersona.avatar);
    setCaptionInput('');
    setIsAddingStatus(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#111b21] h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-[#202c33]/70 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span>{t.updatesTab}</span>
          <span className="text-xs font-normal text-slate-400">· Gokuldham Society Stories</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Photos and announcements from neighbors that disappear after 24 hours.
        </p>
      </div>

      <div className="p-4 sm:p-6 max-w-3xl space-y-6">
        {/* Post My Status Card */}
        <div className="flex items-center justify-between p-3.5 bg-[#202c33] rounded-2xl border border-slate-700/60 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentPersona.avatar}
                alt={currentPersona.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-600"
              />
              <button
                onClick={() => setIsAddingStatus(true)}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00a884] rounded-full flex items-center justify-center text-white border-2 border-[#111b21]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">My Community Status</h3>
              <p className="text-xs text-slate-400">Tap to share an update with society members</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingStatus(true)}
            className="px-3.5 py-1.5 bg-[#00a884]/10 hover:bg-[#00a884]/20 text-[#00a884] text-xs font-semibold rounded-xl border border-[#00a884]/30 transition-colors"
          >
            Post Update
          </button>
        </div>

        {/* Recent Community Stories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Recent Updates</span>
            <span>{statuses.length} active</span>
          </div>

          <div className="space-y-2">
            {statuses.map(status => (
              <div
                key={status.id}
                onClick={() => setActiveStory(status)}
                className="flex items-center justify-between p-3 bg-[#202c33]/50 hover:bg-[#202c33] rounded-2xl border border-slate-700/40 cursor-pointer transition-all hover:scale-[1.005]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* WhatsApp green circular ring around avatar */}
                  <div className="p-0.5 rounded-full border-2 border-[#00a884]">
                    <img
                      src={status.imageUrl || currentPersona.avatar}
                      alt={status.authorName}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {status.authorName}
                    </h4>
                    <p className="text-xs text-slate-300 truncate max-w-sm sm:max-w-md">
                      {status.caption}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3 text-[#00a884]" />
                      <span>{status.timestamp}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#111b21] rounded-3xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl border border-slate-700 relative">
            {/* Top Progress bar */}
            <div className="absolute top-0 inset-x-0 p-3 z-20 flex gap-1">
              <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-[pulse_5s_ease-in-out]" />
              </div>
            </div>

            {/* Header */}
            <div className="relative z-20 flex items-center justify-between p-4 pt-6 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.imageUrl || currentPersona.avatar}
                  alt={activeStory.authorName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-white/50"
                />
                <div>
                  <h4 className="text-sm font-semibold text-white leading-tight">
                    {activeStory.authorName}
                  </h4>
                  <span className="text-[11px] text-slate-300">{activeStory.timestamp}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Visual */}
            <div className="relative aspect-[4/5] bg-black flex items-center justify-center overflow-hidden">
              {activeStory.imageUrl ? (
                <img
                  src={activeStory.imageUrl}
                  alt={activeStory.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 text-center text-white text-lg font-medium">
                  {activeStory.caption}
                </div>
              )}
              {/* Bottom Gradient with caption */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/70 to-transparent">
                <p className="text-sm text-white font-medium leading-relaxed drop-shadow-sm">
                  {activeStory.caption}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#00a884] font-medium mt-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Resident of Gokuldham RWA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Status Modal */}
      {isAddingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#111b21] border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Post Community Status</h3>
              <button onClick={() => setIsAddingStatus(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePostStatus} className="space-y-4">
              <textarea
                rows={3}
                required
                value={captionInput}
                onChange={e => setCaptionInput(e.target.value)}
                placeholder="What is happening in your wing or flat? (e.g. Terrace solar work started, or found lost package)"
                className="w-full bg-[#202c33] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884] resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish 24h Community Story</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
