import React from 'react';
import { Community, CommunitySubgroup, Persona } from '../types';
import { Building, ShieldCheck, Users, Lock, ChevronRight, Phone, FileText, Bell, MapPin } from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  community: Community;
  subgroups: CommunitySubgroup[];
  allPersonas: Persona[];
  t: TranslationDictionary;
  onSelectSubgroup: (subgroupId: string) => void;
}

export const CommunityHubView: React.FC<Props> = ({
  community,
  subgroups,
  allPersonas,
  t,
  onSelectSubgroup,
}) => {
  const connectedSubgroups = subgroups.filter(s => community.subgroupIds.includes(s.id));
  const announcementGroup = connectedSubgroups.find(s => s.type === 'announcement') || connectedSubgroups[0];

  return (
    <div className="flex-1 flex flex-col bg-[#111b21] h-full overflow-y-auto">
      {/* Community Banner & Hero */}
      <div className="relative">
        <div className="h-44 sm:h-52 w-full overflow-hidden relative">
          <img
            src={community.bannerImage}
            alt={community.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111b21] via-black/40 to-transparent" />
        </div>

        <div className="px-6 relative -mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-3.5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 bg-[#202c33] shadow-xl shrink-0">
              <img
                src={community.avatarImage}
                alt={community.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {community.name}
                </h1>
                <div className="flex items-center text-xs text-[#00a884] font-semibold bg-[#00a884]/15 px-2 py-0.5 rounded-full border border-[#00a884]/30 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  <span>Verified RWA</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{community.city}, {community.state} - {community.pincode}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{community.totalMembers} Residents</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl space-y-6">
        {/* Registration & Tagline Notice */}
        <div className="p-4 bg-[#202c33] rounded-2xl border border-slate-700/60 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Govt. Society Registration No:</span>
            <span className="font-mono text-[#00a884] font-medium bg-[#111b21] px-2.5 py-1 rounded border border-slate-700/50">
              {community.verifiedGovtReg}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed border-t border-slate-700/40 pt-2">
            {community.tagline}
          </p>
        </div>

        {/* PWA Home Screen Install Banner */}
        <PWAInstallButton variant="banner" />

        {/* Announcement Channel Featured Card */}
        {announcementGroup && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Official Broadcast Hub
            </span>
            <div
              onClick={() => onSelectSubgroup(announcementGroup.id)}
              className="p-4 bg-gradient-to-r from-[#005c4b]/30 to-[#202c33] border border-[#00a884]/40 rounded-2xl cursor-pointer hover:border-[#00a884] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#00a884] text-white">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#25d366] transition-colors flex items-center gap-2">
                    <span>{announcementGroup.name}</span>
                    <span className="text-[10px] text-slate-300 bg-black/40 px-2 py-0.5 rounded font-normal">
                      Admin Broadcast
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                    {announcementGroup.lastMessageText || announcementGroup.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#00a884] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}

        {/* Connected Sub-Groups */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Community Sub-Groups ({connectedSubgroups.length})</span>
            <span>All Encrypted</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {connectedSubgroups.map(subgroup => (
              <div
                key={subgroup.id}
                onClick={() => onSelectSubgroup(subgroup.id)}
                className="p-3.5 bg-[#202c33]/60 hover:bg-[#202c33] rounded-2xl border border-slate-700/50 cursor-pointer transition-all hover:border-slate-500 flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={subgroup.avatar}
                      alt={subgroup.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-[#00a884] transition-colors">
                        {subgroup.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {subgroup.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/40 pt-2">
                  <span className="flex items-center gap-1 text-[#00a884]">
                    <Lock className="w-3 h-3" />
                    <span>256-bit E2EE</span>
                  </span>
                  <span>{subgroup.memberCount} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Society Emergency Contacts Directory */}
        <div className="p-4 bg-[#202c33] rounded-2xl border border-slate-700/50 space-y-3">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-400" />
            <span>Emergency Directory (Speed Dial)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#111b21] rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">Gate 1 Security Cabin</div>
              <div className="font-semibold text-white mt-0.5">Extn: 101 / +91 97110 00101</div>
              <div className="text-[10px] text-[#00a884] mt-0.5">24x7 Active Guard</div>
            </div>

            <div className="p-3 bg-[#111b21] rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">Ambulance & Kokilaben Hospital</div>
              <div className="font-semibold text-white mt-0.5">108 / 022-42696969</div>
              <div className="text-[10px] text-red-400 mt-0.5">Nearest Emergency Room</div>
            </div>

            <div className="p-3 bg-[#111b21] rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">Goregaon Police Station</div>
              <div className="font-semibold text-white mt-0.5">100 / 022-28723412</div>
              <div className="text-[10px] text-blue-400 mt-0.5">Local Beat Inspector</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
