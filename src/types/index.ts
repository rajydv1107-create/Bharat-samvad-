import { EncryptedPayload } from '../crypto/e2ee';

export type LanguageCode = 'en' | 'hi' | 'hinglish' | 'mr' | 'ta' | 'gu';

export interface Persona {
  id: string;
  name: string;
  role: string;
  flat: string;
  phone: string;
  avatar: string;
  isVerified: boolean;
  fingerprint: string;
  upiId: string;
}

export type ChatType = 'announcement' | 'private_e2ee' | 'general' | 'emergency' | 'bazaar';

export interface CommunitySubgroup {
  id: string;
  communityId: string;
  name: string;
  description: string;
  type: ChatType;
  isEncrypted: boolean;
  adminOnlyPost: boolean;
  avatar: string;
  memberCount: number;
  lastMessageText?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  pinnedNotice?: string;
  safetyNumber?: string;
  disappearingTimerDays?: number; // 0 for off, 1, 7, 90
}

export interface Community {
  id: string;
  name: string;
  tagline: string;
  type: 'RWA' | 'Housing Society' | 'Gram Panchayat' | 'Mohalla Samiti';
  city: string;
  state: string;
  pincode: string;
  verifiedGovtReg: string;
  totalMembers: number;
  bannerImage: string;
  avatarImage: string;
  secretaryName: string;
  announcementChannelId: string;
  subgroupIds: string[];
}

export type MessageType =
  | 'text'
  | 'voice'
  | 'image'
  | 'poll'
  | 'upi_payment'
  | 'emergency_alert'
  | 'document';

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // User IDs who voted
}

export interface PollData {
  question: string;
  options: PollOption[];
  allowMultiple?: boolean;
}

export interface UpiPaymentData {
  amount: number;
  note: string;
  category: 'maintenance' | 'festival_chanda' | 'security_fund' | 'bazaar' | 'emergency';
  upiId: string;
  status: 'requested' | 'completed';
  payerName?: string;
  paidAt?: string;
  txnReference?: string;
}

export interface EmergencyData {
  bloodGroup?: string;
  patientName?: string;
  hospital?: string;
  contactPhone?: string;
  urgency: 'CRITICAL' | 'URGENT' | 'RESOLVED';
  unitsNeeded?: number;
  unitsPledged?: number;
}

export interface VoiceData {
  duration: number; // in seconds
  waveform: number[];
  audioUrl?: string;
}

export interface MediaData {
  url: string;
  caption?: string;
  fileName?: string;
  fileSize?: string;
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderFlat?: string;
  timestamp: string;
  type: MessageType;
  content: string; // Plaintext (or decrypted preview)
  isEncrypted: boolean;
  e2eePayload?: EncryptedPayload;
  status: 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
  pollData?: PollData;
  upiData?: UpiPaymentData;
  emergencyData?: EmergencyData;
  voiceData?: VoiceData;
  mediaData?: MediaData;
  isPinned?: boolean;
  forwarded?: boolean;
}

export interface CommunityStatus {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  imageUrl?: string;
  caption: string;
  viewed: boolean;
}

export interface CallParticipant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  speaking: boolean;
}
