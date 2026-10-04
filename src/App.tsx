/**
 * BharatSamvaad - India WhatsApp App for Local Community Communication
 * with End-to-End Encryption (E2EE) for Private Group Chats.
 *
 * Built with Web Cryptography API (SubtleCrypto AES-GCM-256),
 * 60-digit safety numbers, Indian community RWA/Panchayat hubs,
 * UPI integration simulation, and regional language support.
 */

import React, { useState, useEffect } from 'react';
import {
  Community,
  CommunitySubgroup,
  CommunityStatus,
  Message,
  Persona,
  LanguageCode,
  UpiPaymentData,
  EmergencyData,
  ChatType,
} from './types';
import {
  mockPersonas,
  mockCommunities,
  mockSubgroups,
  initialMessages,
  mockStatuses,
} from './data/mockCommunityData';
import { translations } from './services/i18n';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { CommunityHubView } from './components/CommunityHubView';
import { StatusUpdatesView } from './components/StatusUpdatesView';
import { SecurityVerificationModal } from './components/SecurityVerificationModal';
import { E2EEInspectorModal } from './components/E2EEInspectorModal';
import { EncryptedCallModal } from './components/EncryptedCallModal';
import { CreatePollModal } from './components/CreatePollModal';
import { CreateUpiModal } from './components/CreateUpiModal';
import { CreateEmergencyModal } from './components/CreateEmergencyModal';
import { CreateGroupModal } from './components/CreateGroupModal';
import { PaymentModal } from './components/PaymentModal';
import { generateSafetyNumber, encryptText } from './crypto/e2ee';
import { ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chats' | 'communities' | 'status' | 'calls'>('chats');
  const [currentPersona, setCurrentPersona] = useState<Persona>(mockPersonas[0]);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [subgroups, setSubgroups] = useState<CommunitySubgroup[]>(mockSubgroups);
  const [selectedSubgroupId, setSelectedSubgroupId] = useState<string>('subgroup_notices');
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [statuses, setStatuses] = useState<CommunityStatus[]>(mockStatuses);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  // Active Modals
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showInspectorMessage, setShowInspectorMessage] = useState<Message | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<{
    msgId: string;
    data: UpiPaymentData;
  } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[currentLanguage] || translations.en;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeSubgroup =
    subgroups.find(s => s.id === selectedSubgroupId) || subgroups[0];
  const activeCommunity = mockCommunities[0];
  const currentChatMessages = allMessages[activeSubgroup?.id || ''] || [];

  // Send message in current chat
  const handleSendMessage = (msgData: Partial<Message>) => {
    if (!activeSubgroup) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId: activeSubgroup.id,
      senderId: currentPersona.id,
      senderName: currentPersona.name,
      senderRole: currentPersona.role,
      senderFlat: currentPersona.flat,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: msgData.type || 'text',
      content: msgData.content || '',
      isEncrypted: msgData.isEncrypted ?? true,
      e2eePayload: msgData.e2eePayload,
      status: 'read',
      pollData: msgData.pollData,
      upiData: msgData.upiData,
      emergencyData: msgData.emergencyData,
      voiceData: msgData.voiceData,
    };

    setAllMessages(prev => ({
      ...prev,
      [activeSubgroup.id]: [...(prev[activeSubgroup.id] || []), newMessage],
    }));

    // Update last message preview in subgroup
    setSubgroups(prev =>
      prev.map(sub =>
        sub.id === activeSubgroup.id
          ? {
              ...sub,
              lastMessageText: newMessage.content,
              lastMessageTime: newMessage.timestamp,
            }
          : sub
      )
    );
  };

  // Poll Vote Handler
  const handleVotePoll = (msgId: string, optionId: string) => {
    setAllMessages(prev => {
      const chatMsgs = prev[activeSubgroup.id] || [];
      const updated = chatMsgs.map(msg => {
        if (msg.id === msgId && msg.pollData) {
          const newOptions = msg.pollData.options.map(opt => {
            if (opt.id === optionId) {
              const userAlreadyVoted = opt.votes.includes(currentPersona.id);
              return {
                ...opt,
                votes: userAlreadyVoted
                  ? opt.votes.filter(id => id !== currentPersona.id)
                  : [...opt.votes, currentPersona.id],
              };
            }
            // If not allowMultiple, remove vote from other options
            if (!msg.pollData?.allowMultiple) {
              return {
                ...opt,
                votes: opt.votes.filter(id => id !== currentPersona.id),
              };
            }
            return opt;
          });
          return { ...msg, pollData: { ...msg.pollData, options: newOptions } };
        }
        return msg;
      });
      return { ...prev, [activeSubgroup.id]: updated };
    });
  };

  // UPI Payment Success Handler
  const handlePaymentSuccess = (txnRef: string) => {
    if (!paymentTarget) return;

    setAllMessages(prev => {
      const chatMsgs = prev[activeSubgroup.id] || [];
      const updated = chatMsgs.map(msg => {
        if (msg.id === paymentTarget.msgId && msg.upiData) {
          return {
            ...msg,
            upiData: {
              ...msg.upiData,
              status: 'completed' as const,
              payerName: currentPersona.name,
              paidAt: new Date().toLocaleTimeString(),
              txnReference: txnRef,
            },
          };
        }
        return msg;
      });
      return { ...prev, [activeSubgroup.id]: updated };
    });

    setPaymentTarget(null);
    showToast(`Payment of ₹${paymentTarget.data.amount.toLocaleString('en-IN')} confirmed via UPI!`);
  };

  // Emergency Volunteer Pledge Handler
  const handlePledgeEmergency = (msgId: string) => {
    setAllMessages(prev => {
      const chatMsgs = prev[activeSubgroup.id] || [];
      const updated = chatMsgs.map(msg => {
        if (msg.id === msgId && msg.emergencyData) {
          const currentPledges = msg.emergencyData.unitsPledged || 0;
          return {
            ...msg,
            emergencyData: {
              ...msg.emergencyData,
              unitsPledged: currentPledges + 1,
            },
          };
        }
        return msg;
      });
      return { ...prev, [activeSubgroup.id]: updated };
    });
    showToast(`Thank you, ${currentPersona.name}! Your pledge has been forwarded to the hospital.`);
  };

  // Emoji Reaction Handler
  const handleReaction = (msgId: string, emoji: string) => {
    setAllMessages(prev => {
      const chatMsgs = prev[activeSubgroup.id] || [];
      const updated = chatMsgs.map(msg => {
        if (msg.id === msgId) {
          const reactions = msg.reactions || [];
          const existing = reactions.find(r => r.emoji === emoji);

          let newReactions;
          if (existing) {
            if (existing.userIds.includes(currentPersona.id)) {
              newReactions = reactions
                .map(r =>
                  r.emoji === emoji
                    ? { ...r, userIds: r.userIds.filter(u => u !== currentPersona.id) }
                    : r
                )
                .filter(r => r.userIds.length > 0);
            } else {
              newReactions = reactions.map(r =>
                r.emoji === emoji ? { ...r, userIds: [...r.userIds, currentPersona.id] } : r
              );
            }
          } else {
            newReactions = [...reactions, { emoji, userIds: [currentPersona.id] }];
          }
          return { ...msg, reactions: newReactions };
        }
        return msg;
      });
      return { ...prev, [activeSubgroup.id]: updated };
    });
  };

  // Create Subgroup or Announcement
  const handleCreateGroup = async (
    name: string,
    description: string,
    type: ChatType,
    disappearingDays: number
  ) => {
    const id = `subgroup_${Date.now()}`;
    const safetyNumber = await generateSafetyNumber(currentPersona.id, 'all_members', id);

    const newSub: CommunitySubgroup = {
      id,
      communityId: activeCommunity.id,
      name,
      description,
      type,
      isEncrypted: true,
      adminOnlyPost: type === 'announcement',
      avatar:
        type === 'announcement'
          ? activeCommunity.avatarImage
          : 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=160&q=80',
      memberCount: 1,
      unreadCount: 0,
      safetyNumber,
      disappearingTimerDays: disappearingDays,
    };

    setSubgroups([newSub, ...subgroups]);
    setSelectedSubgroupId(id);
    setActiveTab('chats');
    setShowCreateGroupModal(false);
    showToast(`Created new 256-bit encrypted community group "${name}"!`);
  };

  // Create Community Poll
  const handleCreatePoll = async (
    question: string,
    options: string[],
    allowMultiple: boolean
  ) => {
    const e2ee = await encryptText(
      `[Poll: ${question}]`,
      activeSubgroup.id,
      currentPersona.fingerprint
    );

    handleSendMessage({
      type: 'poll',
      content: question,
      isEncrypted: true,
      e2eePayload: e2ee,
      pollData: {
        question,
        options: options.map((opt, i) => ({ id: `opt_${i + 1}`, text: opt, votes: [] })),
        allowMultiple,
      },
    });

    setShowPollModal(false);
    showToast('Community Poll published to chat!');
  };

  // Create UPI Request
  const handleCreateUpiRequest = async (
    amount: number,
    note: string,
    category: 'maintenance' | 'festival_chanda' | 'security_fund' | 'bazaar'
  ) => {
    const e2ee = await encryptText(
      `[UPI Request: ₹${amount} - ${note}]`,
      activeSubgroup.id,
      currentPersona.fingerprint
    );

    handleSendMessage({
      type: 'upi_payment',
      content: note,
      isEncrypted: true,
      e2eePayload: e2ee,
      upiData: {
        amount,
        note,
        category,
        upiId: currentPersona.upiId,
        status: 'requested',
      },
    });

    setShowUpiModal(false);
    showToast(`UPI collection request for ₹${amount.toLocaleString('en-IN')} created!`);
  };

  // Create Emergency SOS Broadcast
  const handleCreateEmergency = async (data: EmergencyData, note: string) => {
    const e2ee = await encryptText(
      `[SOS Blood: ${data.bloodGroup} at ${data.hospital}]`,
      activeSubgroup.id,
      currentPersona.fingerprint
    );

    handleSendMessage({
      type: 'emergency_alert',
      content: note,
      isEncrypted: true,
      e2eePayload: e2ee,
      emergencyData: data,
    });

    setShowEmergencyModal(false);
    showToast('Emergency SOS alert broadcast to community network!');
  };

  // Add 24h Community Status
  const handleAddStatus = (caption: string, imageUrl?: string) => {
    const newStatus: CommunityStatus = {
      id: `st_${Date.now()}`,
      authorId: currentPersona.id,
      authorName: `${currentPersona.name} (${currentPersona.flat})`,
      authorRole: currentPersona.role,
      timestamp: 'Just now',
      imageUrl,
      caption,
      viewed: false,
    };
    setStatuses([newStatus, ...statuses]);
    showToast('Community status update posted successfully!');
  };

  return (
    <div className="flex h-screen w-screen bg-[#111b21] text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#00a884] text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Status Banner */}
      <OfflineIndicator />

      {/* Sidebar Component */}
      <div className={`${isMobileChatOpen ? 'hidden md:flex' : 'flex'} w-full md:w-96 lg:w-[420px] h-full shrink-0`}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={tab => {
            setActiveTab(tab);
            if (tab === 'chats') {
              setIsMobileChatOpen(true);
            } else {
              setIsMobileChatOpen(false);
            }
          }}
          subgroups={subgroups}
          selectedSubgroupId={selectedSubgroupId}
          onSelectSubgroup={id => {
            setSelectedSubgroupId(id);
            setIsMobileChatOpen(true);
          }}
          currentPersona={currentPersona}
          allPersonas={mockPersonas}
          onSelectPersona={p => {
            setCurrentPersona(p);
            showToast(`Active Persona switched to ${p.name} (${p.flat})`);
          }}
          currentLanguage={currentLanguage}
          onChangeLanguage={setCurrentLanguage}
          t={t}
          onOpenCreateGroup={() => setShowCreateGroupModal(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden ${!isMobileChatOpen && activeTab === 'chats' ? 'hidden md:flex' : 'flex'}`}>
        {activeTab === 'chats' && (
          <ChatWindow
            subgroup={activeSubgroup}
            messages={currentChatMessages}
            currentPersona={currentPersona}
            allPersonas={mockPersonas}
            t={t}
            onBack={() => setIsMobileChatOpen(false)}
            onSendMessage={handleSendMessage}
            onOpenSecurityModal={() => setShowSecurityModal(true)}
            onOpenInspector={msg => setShowInspectorMessage(msg)}
            onOpenCall={() => setShowCallModal(true)}
            onOpenPollModal={() => setShowPollModal(true)}
            onOpenUpiModal={() => setShowUpiModal(true)}
            onOpenEmergencyModal={() => setShowEmergencyModal(true)}
            onPayUpi={(msgId, data) => setPaymentTarget({ msgId, data })}
            onVotePoll={handleVotePoll}
            onPledgeEmergency={handlePledgeEmergency}
            onReaction={handleReaction}
          />
        )}

        {activeTab === 'communities' && (
          <CommunityHubView
            community={activeCommunity}
            subgroups={subgroups}
            allPersonas={mockPersonas}
            t={t}
            onSelectSubgroup={id => {
              setSelectedSubgroupId(id);
              setActiveTab('chats');
            }}
          />
        )}

        {activeTab === 'status' && (
          <StatusUpdatesView
            statuses={statuses}
            currentPersona={currentPersona}
            t={t}
            onAddStatus={handleAddStatus}
          />
        )}

        {activeTab === 'calls' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[#111b21]">
            <div className="w-16 h-16 rounded-full bg-[#00a884]/20 border border-[#00a884] flex items-center justify-center text-[#00a884]">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">End-to-End Encrypted Community Calls</h2>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                Audio and video calls with residents, RWA security, and emergency responders are protected with 256-bit peer encryption.
              </p>
            </div>
            <button
              onClick={() => setShowCallModal(true)}
              className="px-5 py-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#00a884]/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Start Group Audio Call in {activeSubgroup.name}</span>
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {showSecurityModal && (
        <SecurityVerificationModal
          subgroup={activeSubgroup}
          currentPersona={currentPersona}
          allPersonas={mockPersonas}
          t={t}
          onClose={() => setShowSecurityModal(false)}
        />
      )}

      {showInspectorMessage && (
        <E2EEInspectorModal
          message={showInspectorMessage}
          chatName={activeSubgroup.name}
          t={t}
          onClose={() => setShowInspectorMessage(null)}
        />
      )}

      {showCallModal && (
        <EncryptedCallModal
          subgroup={activeSubgroup}
          currentPersona={currentPersona}
          allPersonas={mockPersonas}
          t={t}
          onEndCall={() => setShowCallModal(false)}
        />
      )}

      {showPollModal && (
        <CreatePollModal
          t={t}
          onSubmit={handleCreatePoll}
          onClose={() => setShowPollModal(false)}
        />
      )}

      {showUpiModal && (
        <CreateUpiModal
          t={t}
          currentPersona={currentPersona}
          onSubmit={handleCreateUpiRequest}
          onClose={() => setShowUpiModal(false)}
        />
      )}

      {showEmergencyModal && (
        <CreateEmergencyModal
          t={t}
          onSubmit={handleCreateEmergency}
          onClose={() => setShowEmergencyModal(false)}
        />
      )}

      {showCreateGroupModal && (
        <CreateGroupModal
          t={t}
          onSubmit={handleCreateGroup}
          onClose={() => setShowCreateGroupModal(false)}
        />
      )}

      {paymentTarget && (
        <PaymentModal
          paymentData={paymentTarget.data}
          payer={currentPersona}
          t={t}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPaymentTarget(null)}
        />
      )}
    </div>
  );
}
