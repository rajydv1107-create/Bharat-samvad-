import React, { useState } from 'react';
import {
  CommunitySubgroup,
  Persona,
  LanguageCode,
} from '../types';
import {
  MessageSquare,
  Users,
  CircleDashed,
  Phone,
  Search,
  Lock,
  Plus,
  ShieldCheck,
  CheckCheck,
  Globe,
  UserCheck,
  ChevronDown,
  Bell,
  Sparkles,
} from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';
import { IndiaAppLogo } from './IndiaAppLogo';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  activeTab: 'chats' | 'communities' | 'status' | 'calls';
  onTabChange: (tab: 'chats' | 'communities' | 'status' | 'calls') => void;
  subgroups: CommunitySubgroup[];
  selectedSubgroupId: string;
  onSelectSubgroup: (id: string) => void;
  currentPersona: Persona;
  allPersonas: Persona[];
  onSelectPersona: (persona: Persona) => void;
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  onOpenCreateGroup: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  subgroups,
  selectedSubgroupId,
  onSelectSubgroup,
  currentPersona,
  allPersonas,
  onSelectPersona,
  currentLanguage,
  onChangeLanguage,
  t,
  onOpenCreateGroup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'e2ee' | 'announcements' | 'emergency'>('all');
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Filter Subgroups
  const filteredSubgroups = subgroups.filter(subgroup => {
    const matchesSearch =
      subgroup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subgroup.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'e2ee') return subgroup.type === 'private_e2ee';
    if (filterType === 'announcements') return subgroup.type === 'announcement';
    if (filterType === 'emergency') return subgroup.type === 'emergency';
    return true;
  });

  const languageNames: Record<LanguageCode, string> = {
    en: 'English',
    hi: 'हिन्दी',
    hinglish: 'Hinglish',
    mr: 'मराठी',
    ta: 'தமிழ்',
    gu: 'ગુજરાતી',
  };

  return (
    <div className="w-full md:w-96 lg:w-[420px] bg-[#111b21] border-r border-slate-700/60 flex flex-col h-full shrink-0 select-none">
      {/* Top Brand Bar with Indian Flag Logo */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#202c33] border-b border-slate-700/60">
        <IndiaAppLogo size="md" showText={true} tagline="सुरक्षित भारतीय समुदाय" />

        <div className="flex items-center gap-1.5">
          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowPersonaMenu(false);
              }}
              className="flex items-center gap-1 text-xs px-2 py-1 bg-[#111b21] hover:bg-slate-700 rounded-lg text-slate-200 border border-slate-700/60 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#00a884]" />
              <span className="font-medium text-[11px]">{languageNames[currentLanguage]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-36 bg-[#202c33] border border-slate-700 rounded-xl shadow-2xl py-1 z-30 animate-in fade-in duration-100">
                {(Object.keys(languageNames) as LanguageCode[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      onChangeLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-700 transition-colors ${
                      currentLanguage === lang ? 'text-[#25d366] font-semibold bg-black/20' : 'text-slate-300'
                    }`}
                  >
                    <span>{languageNames[lang]}</span>
                    {currentLanguage === lang && <div className="w-1.5 h-1.5 rounded-full bg-[#00a884]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Group Button */}
          <button
            onClick={onOpenCreateGroup}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title={t.newGroup}
          >
            <Plus className="w-5 h-5 text-[#00a884]" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs (WhatsApp style: Chats, Communities, Status, Calls) */}
      <div className="grid grid-cols-4 bg-[#202c33] border-b border-slate-700/60 text-xs font-semibold">
        <button
          onClick={() => onTabChange('chats')}
          className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition-all ${
            activeTab === 'chats'
              ? 'border-[#00a884] text-[#00a884]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4" />
            <span className="absolute -top-1 -right-2 bg-[#00a884] text-white text-[9px] font-bold px-1 rounded-full">
              6
            </span>
          </div>
          <span className="text-[11px] truncate">{t.chatsTab}</span>
        </button>

        <button
          onClick={() => onTabChange('communities')}
          className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition-all ${
            activeTab === 'communities'
              ? 'border-[#00a884] text-[#00a884]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[11px] truncate">{t.communitiesTab}</span>
        </button>

        <button
          onClick={() => onTabChange('status')}
          className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition-all ${
            activeTab === 'status'
              ? 'border-[#00a884] text-[#00a884]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <CircleDashed className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#25d366] rounded-full" />
          </div>
          <span className="text-[11px] truncate">{t.updatesTab}</span>
        </button>

        <button
          onClick={() => onTabChange('calls')}
          className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition-all ${
            activeTab === 'calls'
              ? 'border-[#00a884] text-[#00a884]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span className="text-[11px] truncate">{t.callsTab}</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="p-2.5 bg-[#111b21] border-b border-slate-800 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-[#202c33] text-white placeholder-slate-400 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00a884]"
          />
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-[#00a884] text-white shadow-sm'
                : 'bg-[#202c33] text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => setFilterType('e2ee')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-colors flex items-center gap-1 ${
              filterType === 'e2ee'
                ? 'bg-[#00a884] text-white shadow-sm'
                : 'bg-[#202c33] text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>{t.filterEncrypted}</span>
          </button>
          <button
            onClick={() => setFilterType('announcements')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-colors flex items-center gap-1 ${
              filterType === 'announcements'
                ? 'bg-[#00a884] text-white shadow-sm'
                : 'bg-[#202c33] text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Bell className="w-3 h-3" />
            <span>{t.filterAnnouncements}</span>
          </button>
          <button
            onClick={() => setFilterType('emergency')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-colors ${
              filterType === 'emergency'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-[#202c33] text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.filterEmergency}
          </button>
        </div>
      </div>

      {/* Subgroups & Chats List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {/* PWA Install Banner */}
        <div className="p-2.5">
          <PWAInstallButton variant="banner" />
        </div>

        {filteredSubgroups.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No matching community chats or notices found.
          </div>
        ) : (
          filteredSubgroups.map(subgroup => {
            const isSelected = subgroup.id === selectedSubgroupId && activeTab === 'chats';
            return (
              <div
                key={subgroup.id}
                onClick={() => {
                  onSelectSubgroup(subgroup.id);
                  onTabChange('chats');
                }}
                className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer transition-all hover:bg-[#202c33]/70 ${
                  isSelected ? 'bg-[#2a3942]' : ''
                }`}
              >
                {/* Avatar with lock badge */}
                <div className="relative shrink-0">
                  <img
                    src={subgroup.avatar}
                    alt={subgroup.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-slate-700"
                  />
                  {subgroup.isEncrypted && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-[#00a884] text-white p-0.5 rounded-full border border-[#111b21]">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Info Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-white truncate max-w-[200px]">
                      {subgroup.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {subgroup.lastMessageTime || '12:00 PM'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-slate-400 truncate max-w-[210px] leading-tight">
                      {subgroup.lastMessageText || subgroup.description}
                    </p>

                    {subgroup.unreadCount && subgroup.unreadCount > 0 ? (
                      <span className="w-4 h-4 bg-[#00a884] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {subgroup.unreadCount}
                      </span>
                    ) : (
                      <CheckCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Persona Switcher Bar (Crucial for testing India Community chats!) */}
      <div className="p-2.5 bg-[#202c33] border-t border-slate-700/60 relative">
        <div
          onClick={() => setShowPersonaMenu(!showPersonaMenu)}
          className="flex items-center justify-between p-2 rounded-xl bg-[#111b21] hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentPersona.avatar}
              alt={currentPersona.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-600 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  {currentPersona.name}
                </span>
                <span className="text-[10px] text-[#00a884] bg-[#00a884]/15 px-1 rounded font-medium shrink-0">
                  {currentPersona.flat}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 truncate block">
                {currentPersona.role}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        </div>

        {/* Persona Selector Popover */}
        {showPersonaMenu && (
          <div className="absolute bottom-16 inset-x-2.5 bg-[#202c33] border border-slate-700 rounded-2xl shadow-2xl p-2 z-30 space-y-1 animate-in slide-in-from-bottom-2 duration-150">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              {t.switchPersona} (Simulation)
            </div>
            {allPersonas.map(persona => (
              <div
                key={persona.id}
                onClick={() => {
                  onSelectPersona(persona);
                  setShowPersonaMenu(false);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                  currentPersona.id === persona.id
                    ? 'bg-[#00a884]/20 border border-[#00a884]/40 text-white'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">
                      {persona.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{persona.flat}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {persona.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
