import React, { useState, useRef, useEffect } from 'react';
import {
  CommunitySubgroup,
  Message,
  Persona,
  MessageType,
  UpiPaymentData,
  EmergencyData,
} from '../types';
import {
  Lock,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  Check,
  CheckCheck,
  ShieldCheck,
  IndianRupee,
  Vote,
  AlertTriangle,
  Play,
  Pause,
  ArrowDown,
  ArrowLeft,
  Info,
  Sparkles,
  Heart,
  ThumbsUp,
  Image,
  Pin,
  Clock,
} from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';
import { encryptText } from '../crypto/e2ee';

interface Props {
  subgroup: CommunitySubgroup;
  messages: Message[];
  currentPersona: Persona;
  allPersonas: Persona[];
  t: TranslationDictionary;
  onBack?: () => void;
  onSendMessage: (msg: Partial<Message>) => void;
  onOpenSecurityModal: () => void;
  onOpenInspector: (msg: Message) => void;
  onOpenCall: () => void;
  onOpenPollModal: () => void;
  onOpenUpiModal: () => void;
  onOpenEmergencyModal: () => void;
  onPayUpi: (msgId: string, upiData: UpiPaymentData) => void;
  onVotePoll: (msgId: string, optionId: string) => void;
  onPledgeEmergency: (msgId: string) => void;
  onReaction: (msgId: string, emoji: string) => void;
}

export const ChatWindow: React.FC<Props> = ({
  subgroup,
  messages,
  currentPersona,
  allPersonas,
  t,
  onBack,
  onSendMessage,
  onOpenSecurityModal,
  onOpenInspector,
  onOpenCall,
  onOpenPollModal,
  onOpenUpiModal,
  onOpenEmergencyModal,
  onPayUpi,
  onVotePoll,
  onPledgeEmergency,
  onReaction,
}) => {
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voicePlaybackSpeed, setVoicePlaybackSpeed] = useState<number>(1);
  const [reactionTargetId, setReactionTargetId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Voice Recording Simulation
  const startRecording = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    recordTimerRef.current = setInterval(() => {
      setRecordSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopAndSendRecording = async () => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setIsRecording(false);

    if (recordSeconds >= 1) {
      const e2ee = await encryptText(
        `[Voice note - ${recordSeconds}s]`,
        subgroup.id,
        currentPersona.fingerprint
      );

      const waveform = Array.from({ length: 18 }, () => Math.floor(Math.random() * 70) + 20);

      onSendMessage({
        type: 'voice',
        content: `Voice note (${recordSeconds} seconds)`,
        isEncrypted: true,
        e2eePayload: e2ee,
        voiceData: {
          duration: recordSeconds,
          waveform,
        },
      });
    }
  };

  const cancelRecording = () => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setIsRecording(false);
    setRecordSeconds(0);
  };

  const handleSendTextMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');
    setShowEmojiBar(false);
    setShowAttachMenu(false);

    // Perform real Web Crypto AES-GCM encryption
    const e2ee = await encryptText(text, subgroup.id, currentPersona.fingerprint);

    onSendMessage({
      type: 'text',
      content: text,
      isEncrypted: true,
      e2eePayload: e2ee,
    });
  };

  const quickReactions = ['🙏', '🇮🇳', '👍', '❤️', '👏', '🪔', '😂'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b141a] overflow-hidden relative">
      {/* Top Chat Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#202c33] border-b border-slate-700/60 z-20 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
              title="Back to Chats"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <img
              src={subgroup.avatar}
              alt={subgroup.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            {subgroup.isEncrypted && (
              <div className="absolute -bottom-1 -right-1 bg-[#00a884] text-white p-0.5 rounded-full border border-[#202c33]">
                <Lock className="w-2.5 h-2.5" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
              <span>{subgroup.name}</span>
              {/* Indian Tiranga Flag Badge */}
              <div className="flex flex-col h-2.5 w-3.5 rounded-xs overflow-hidden border border-black/30 shadow-xs shrink-0" title="Indian Local Community">
                <div className="h-[3.3px] bg-[#FF9933]" />
                <div className="h-[3.3px] bg-white flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#000080]" />
                </div>
                <div className="h-[3.3px] bg-[#138808]" />
              </div>
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <button
                onClick={onOpenSecurityModal}
                className="flex items-center gap-1 text-[#00a884] hover:underline"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>{t.e2eeVerifiedBadge}</span>
              </button>
              <span>·</span>
              <span>{subgroup.memberCount} {t.membersCount}</span>
              {subgroup.disappearingTimerDays && subgroup.disappearingTimerDays > 0 ? (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 text-slate-400">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{subgroup.disappearingTimerDays}d</span>
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onOpenCall}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Encrypted Audio Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenCall}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Encrypted Video Call"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSecurityModal}
            className="p-2 rounded-full text-[#00a884] hover:bg-[#00a884]/15 transition-colors"
            title={t.verifySecurityCode}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Body with WhatsApp Doodle Background */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 whatsapp-chat-bg-dark">
        {/* Pinned Announcement Notice if any */}
        {subgroup.pinnedNotice && (
          <div className="max-w-md mx-auto p-2.5 bg-[#182229]/95 border border-[#00a884]/30 rounded-xl text-xs text-slate-200 flex items-start gap-2.5 shadow-md">
            <Pin className="w-4 h-4 text-[#00a884] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-[#00a884] block text-[11px] uppercase tracking-wide">
                Pinned Society Notice
              </span>
              <p className="mt-0.5 text-slate-300 text-[11px] leading-relaxed">
                {subgroup.pinnedNotice}
              </p>
            </div>
          </div>
        )}

        {/* E2EE WhatsApp Style Banner Notice */}
        <div
          onClick={onOpenSecurityModal}
          className="max-w-md mx-auto p-2.5 bg-[#182229]/90 border border-amber-500/20 hover:border-amber-500/40 rounded-xl text-center cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-center gap-1.5 text-amber-300/90 text-xs font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px]">{t.e2eeBanner}</span>
          </div>
          <span className="text-[10px] text-amber-400/80 hover:underline mt-0.5 block font-medium">
            Tap to verify 60-digit security safety numbers
          </span>
        </div>

        {/* Message Stream */}
        {messages.map(msg => {
          const isMe = msg.senderId === currentPersona.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-md text-xs sm:text-sm ${
                  isMe
                    ? 'bg-[#005c4b] text-slate-100 rounded-tr-none'
                    : 'bg-[#202c33] text-slate-100 rounded-tl-none'
                }`}
              >
                {/* Sender Header for group chats */}
                {!isMe && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-emerald-400 text-xs truncate">
                      {msg.senderName}
                    </span>
                    {msg.senderFlat && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({msg.senderFlat})
                      </span>
                    )}
                    {msg.senderRole && (
                      <span className="text-[10px] text-slate-400">· {msg.senderRole}</span>
                    )}
                  </div>
                )}

                {/* Inspect E2EE Lock Icon in Bubble Top Right */}
                <button
                  onClick={() => onOpenInspector(msg)}
                  className="absolute top-2 right-2 p-1 text-slate-400/60 hover:text-[#25d366] transition-colors"
                  title="Inspect Web Crypto AES-GCM Ciphertext"
                >
                  <Lock className="w-3 h-3" />
                </button>

                {/* Content Renderers by Message Type */}
                {msg.type === 'text' && (
                  <div className="whitespace-pre-wrap leading-relaxed pr-5">
                    {msg.content}
                  </div>
                )}

                {/* Voice Note Bubble */}
                {msg.type === 'voice' && msg.voiceData && (
                  <div className="flex items-center gap-3 py-1 pr-6">
                    <button
                      onClick={() =>
                        setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id)
                      }
                      className="w-10 h-10 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 hover:bg-[#008f6f] transition-colors"
                    >
                      {playingVoiceId === msg.id ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1 h-6">
                        {msg.voiceData.waveform.map((bar, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${bar}%` }}
                            className={`w-1 rounded-full transition-all ${
                              playingVoiceId === msg.id ? 'bg-[#25d366]' : 'bg-slate-400'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>
                          {playingVoiceId === msg.id ? 'Playing voice note' : 'Encrypted Audio'}
                        </span>
                        <span>0:{msg.voiceData.duration.toString().padStart(2, '0')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setVoicePlaybackSpeed(s => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))
                      }
                      className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-slate-300 font-mono hover:text-white"
                    >
                      {voicePlaybackSpeed}x
                    </button>
                  </div>
                )}

                {/* Poll Card Bubble */}
                {msg.type === 'poll' && msg.pollData && (
                  <div className="space-y-3 py-1 pr-4 min-w-[260px] sm:min-w-[320px]">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <Vote className="w-4 h-4 text-[#00a884]" />
                      <span>{msg.pollData.question}</span>
                    </div>

                    <div className="space-y-2">
                      {msg.pollData.options.map(option => {
                        const totalVotes =
                          msg.pollData?.options.reduce((sum, o) => sum + o.votes.length, 0) || 0;
                        const pct =
                          totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
                        const hasVoted = option.votes.includes(currentPersona.id);

                        return (
                          <div
                            key={option.id}
                            onClick={() => onVotePoll(msg.id, option.id)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                              hasVoted
                                ? 'bg-[#00a884]/20 border-[#00a884] text-white'
                                : 'bg-[#182229]/60 border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-medium">
                              <span>{option.text}</span>
                              <span className="font-mono text-[11px] text-slate-300">
                                {pct}% ({option.votes.length})
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden">
                              <div
                                style={{ width: `${pct}%` }}
                                className="h-full bg-[#00a884] rounded-full transition-all duration-300"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* UPI Payment Card Bubble */}
                {msg.type === 'upi_payment' && msg.upiData && (
                  <div className="space-y-3 py-1 pr-4 min-w-[260px] sm:min-w-[300px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <IndianRupee className="w-4 h-4 text-[#00a884]" />
                        <span>WhatsApp Pay Request</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-[#00a884] bg-[#00a884]/15 px-2 py-0.5 rounded border border-[#00a884]/30">
                        {msg.upiData.category}
                      </span>
                    </div>

                    <div className="p-3 bg-[#111b21]/70 rounded-xl border border-slate-700/60">
                      <div className="text-2xl font-extrabold text-white flex items-center">
                        <IndianRupee className="w-5 h-5 mr-0.5 text-[#00a884]" />
                        <span>{msg.upiData.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{msg.upiData.note}</p>
                      <div className="text-[11px] text-slate-400 mt-1.5 flex justify-between">
                        <span>UPI VPA:</span>
                        <span className="font-mono text-slate-200">{msg.upiData.upiId}</span>
                      </div>
                    </div>

                    {msg.upiData.status === 'completed' ? (
                      <div className="p-2.5 bg-[#00a884]/20 border border-[#00a884]/40 rounded-xl flex items-center gap-2 text-xs text-[#25d366] font-semibold">
                        <CheckCheck className="w-4 h-4 shrink-0" />
                        <span>{t.paymentSuccess} ({msg.upiData.txnReference})</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onPayUpi(msg.id, msg.upiData!)}
                        className="w-full py-2 bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                      >
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>{t.payViaUpi} ₹{msg.upiData.amount.toLocaleString('en-IN')}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Emergency Alert Bubble */}
                {msg.type === 'emergency_alert' && msg.emergencyData && (
                  <div className="space-y-3 py-1 pr-4 min-w-[260px] sm:min-w-[320px]">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                      <span>{t.emergencyAlert}</span>
                    </div>

                    <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl space-y-1.5 text-xs text-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Required:</span>
                        <span className="font-bold text-red-400 text-sm bg-red-500/20 px-2 py-0.5 rounded">
                          {msg.emergencyData.bloodGroup}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Patient:</span>
                        <span>{msg.emergencyData.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hospital:</span>
                        <span className="text-right">{msg.emergencyData.hospital}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Direct Contact:</span>
                        <span className="font-mono text-emerald-400">{msg.emergencyData.contactPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Units Pledged:</span>
                        <span>
                          {msg.emergencyData.unitsPledged} / {msg.emergencyData.unitsNeeded} Units
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onPledgeEmergency(msg.id)}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>{t.volunteerPledge}</span>
                    </button>
                  </div>
                )}

                {/* Reactions Badge */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 -mb-1 flex-wrap">
                    {msg.reactions.map((r, i) => (
                      <span
                        key={i}
                        onClick={() => onReaction(msg.id, r.emoji)}
                        className="bg-[#111b21] hover:bg-slate-800 border border-slate-700/60 rounded-full px-2 py-0.5 text-xs cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] text-slate-300 font-mono">
                          {r.userIds.length}
                        </span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Timestamp & Double Blue Ticks */}
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                  )}
                </div>
              </div>

              {/* Hover quick reaction trigger */}
              <div
                className={`absolute top-0 ${
                  isMe ? '-left-16' : '-right-16'
                } hidden group-hover:flex items-center gap-0.5 bg-[#202c33] p-1 rounded-full border border-slate-700 shadow-md z-10`}
              >
                {quickReactions.slice(0, 4).map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => onReaction(msg.id, emoji)}
                    className="w-6 h-6 hover:scale-125 transition-transform text-xs flex items-center justify-center"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Menu Popup */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-4 bg-[#202c33] border border-slate-700 rounded-2xl p-3 shadow-2xl z-30 grid grid-cols-3 gap-3 animate-in slide-in-from-bottom-2 duration-150">
          <button
            onClick={() => {
              setShowAttachMenu(false);
              onOpenPollModal();
            }}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-700/60 text-slate-200 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
              <Vote className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">{t.createPoll}</span>
          </button>

          <button
            onClick={() => {
              setShowAttachMenu(false);
              onOpenUpiModal();
            }}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-700/60 text-slate-200 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-[#25d366] flex items-center justify-center mb-1">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">{t.requestUpi}</span>
          </button>

          <button
            onClick={() => {
              setShowAttachMenu(false);
              onOpenEmergencyModal();
            }}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-700/60 text-slate-200 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">{t.emergencyAlert}</span>
          </button>
        </div>
      )}

      {/* Emoji Bar Popup */}
      {showEmojiBar && (
        <div className="absolute bottom-16 left-12 bg-[#202c33] border border-slate-700 rounded-2xl p-2.5 shadow-2xl z-30 flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-150">
          {['🙏', '🇮🇳', '👍', '❤️', '👏', '🪔', '🚩', '🤝', '😊', '🔥'].map(emoji => (
            <button
              key={emoji}
              onClick={() => {
                setInputText(prev => prev + emoji);
              }}
              className="text-lg hover:scale-125 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="px-4 py-2.5 bg-[#202c33] border-t border-slate-700/60 flex items-center gap-2 z-20">
        {isRecording ? (
          <div className="flex-1 flex items-center justify-between bg-[#111b21] px-4 py-2 rounded-2xl border border-red-500/50">
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold animate-pulse">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>{t.listening}</span>
              <span className="font-mono text-white">0:{recordSeconds.toString().padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={cancelRecording}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Cancel
              </button>
              <button
                onClick={stopAndSendRecording}
                className="p-1.5 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowEmojiBar(!showEmojiBar)}
              className="p-2 text-slate-400 hover:text-white rounded-full transition-colors"
              title="Emojis"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2 text-slate-400 hover:text-white rounded-full transition-colors"
              title="Attach Community Document, Poll, or UPI"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <form onSubmit={handleSendTextMessage} className="flex-1 flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={t.typeMessage}
                className="w-full bg-[#2a3942] text-white placeholder-slate-400 text-xs sm:text-sm px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#00a884]"
              />
            </form>

            {inputText.trim() ? (
              <button
                onClick={() => handleSendTextMessage()}
                className="p-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full shadow-md transition-colors"
                title="Send Encrypted Message"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="p-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full shadow-md transition-colors"
                title={t.recordVoice}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
