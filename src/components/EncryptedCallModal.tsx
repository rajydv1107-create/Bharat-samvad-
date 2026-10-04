import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Lock, ShieldCheck, Volume2 } from 'lucide-react';
import { CommunitySubgroup, Persona } from '../types';
import { TranslationDictionary } from '../services/i18n';

interface Props {
  subgroup: CommunitySubgroup;
  currentPersona: Persona;
  allPersonas: Persona[];
  t: TranslationDictionary;
  onEndCall: () => void;
}

export const EncryptedCallModal: React.FC<Props> = ({
  subgroup,
  currentPersona,
  allPersonas,
  t,
  onEndCall,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [duration, setDuration] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    const speakerInterval = setInterval(() => {
      setActiveSpeaker(prev => (prev + 1) % 3);
    }, 3500);

    return () => {
      clearInterval(timer);
      clearInterval(speakerInterval);
    };
  }, []);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const callParticipants = [
    currentPersona,
    ...allPersonas.filter(p => p.id !== currentPersona.id).slice(0, 2),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111b21] border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
        {/* Top Call Banner */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#202c33]/70 border-b border-slate-800">
          <div className="flex items-center gap-2 text-[#00a884]">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">{t.callEncryptedNotice}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#00a884]" />
            <span>256-bit Secure</span>
          </div>
        </div>

        {/* Center Stage */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">{subgroup.name}</h2>
            <p className="text-xs text-slate-400">Gokuldham RWA Community Audio Bridge</p>
            <div className="text-sm font-mono text-[#00a884] font-medium pt-1">
              {formatDuration(duration)}
            </div>
          </div>

          {/* Participant Avatars Grid */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
            {callParticipants.map((p, idx) => {
              const isSpeaking = activeSpeaker === idx;
              return (
                <div key={p.id} className="flex flex-col items-center space-y-2">
                  <div
                    className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all ${
                      isSpeaking
                        ? 'border-[#00a884] shadow-lg shadow-[#00a884]/30 scale-105'
                        : 'border-slate-700'
                    }`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isSpeaking && (
                      <div className="absolute inset-0 bg-[#00a884]/20 flex items-center justify-center">
                        <Volume2 className="w-6 h-6 text-white animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-white truncate max-w-[90px]">
                      {p.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400">{p.flat}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pulsing Audio Waves Indicator */}
          <div className="flex items-center gap-1.5 h-6">
            {[40, 70, 95, 60, 85, 45, 100, 75, 50, 90, 65, 30].map((h, i) => (
              <span
                key={i}
                style={{ height: `${(h * (activeSpeaker + 1)) % 24 + 6}px` }}
                className="w-1 bg-[#00a884] rounded-full transition-all duration-300"
              />
            ))}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-center gap-6 p-6 bg-[#202c33] border-t border-slate-800">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full transition-all ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3.5 rounded-full transition-all ${
              isVideoOn
                ? 'bg-[#00a884] text-white'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
            title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={onEndCall}
            className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-transform active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
