import React from 'react';
import { Community } from '../../types';
import { useHuman } from '../../context/HumanContext';
import { X, Users, CheckCircle2, Shield, Calendar, Bell, Bookmark, ArrowRight } from 'lucide-react';

interface CommunityDetailModalProps {
  community: Community;
  onClose: () => void;
}

export const CommunityDetailModal: React.FC<CommunityDetailModalProps> = ({ community, onClose }) => {
  const { toggleJoinCommunity, activities, setSelectedActivityDetail, isItemSaved, toggleSaveItem } = useHuman();

  const isSaved = isItemSaved(community.id);
  const communityActivities = activities.filter((a) => a.communityId === community.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] bg-sand-50 sm:rounded-3xl shadow-elevated border border-sand-200 overflow-hidden flex flex-col z-10 animate-slide-up">
        
        {/* Top Header Floating Close & Save */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal-900 shadow-soft hover:bg-white transition-colors pointer-events-auto"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={() => toggleSaveItem('community', community.id, community.name, community.tagline, community.coverImage)}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal-900 shadow-soft hover:bg-white transition-colors pointer-events-auto"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          
          {/* Cover Hero */}
          <div className="relative h-56 w-full">
            <img
              src={community.coverImage}
              alt={community.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-terracotta-500 inline-block mb-1">
                {community.category} · {community.neighborhood || 'Jaipur City'}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
                {community.name}
              </h1>
            </div>
          </div>

          <div className="p-5 space-y-5">
            
            {/* Quick Stats Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-sand-200 shadow-soft">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-terracotta-600" />
                <span className="text-xs font-bold text-charcoal-800">
                  {community.memberCount} Members in Jaipur
                </span>
              </div>
              <span className="text-[11px] text-forest-600 font-semibold bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                Verified Community
              </span>
            </div>

            {/* Description & Tagline */}
            <div>
              <h4 className="text-xs font-bold text-charcoal-900 italic mb-1">
                "{community.tagline}"
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                {community.description}
              </p>
            </div>

            {/* Organizer */}
            <div className="p-3.5 rounded-2xl bg-white border border-sand-200 shadow-soft flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={community.organizer.avatar}
                  alt={community.organizer.name}
                  className="w-10 h-10 rounded-full object-cover border border-sand-300"
                />
                <div>
                  <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">
                    Community Lead
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-charcoal-900">
                      {community.organizer.name}
                    </span>
                    <CheckCircle2 className="w-3 h-3 text-forest-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Community Rules */}
            {community.rules.length > 0 && (
              <div className="p-4 rounded-2xl bg-sand-100 border border-sand-200">
                <h4 className="text-xs font-bold text-charcoal-900 mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Community Guidelines</span>
                </h4>
                <ul className="space-y-1.5">
                  {community.rules.map((rule, idx) => (
                    <li key={idx} className="text-[11px] text-charcoal-700 flex items-start gap-2">
                      <span className="text-terracotta-500 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Announcements */}
            {community.announcements.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-2 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-terracotta-500" />
                  <span>Recent Announcements</span>
                </h4>
                <div className="space-y-2">
                  {community.announcements.map((ann) => (
                    <div key={ann.id} className="p-3 rounded-2xl bg-white border border-sand-200 shadow-soft">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-charcoal-800">
                          {ann.authorName}
                        </span>
                        <span className="text-[10px] text-charcoal-400">
                          {ann.timeAgo}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-600 leading-relaxed">
                        {ann.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Community Activities */}
            {communityActivities.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                  <span>Upcoming Activities by this Group</span>
                </h4>
                <div className="space-y-2.5">
                  {communityActivities.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => {
                        onClose();
                        setSelectedActivityDetail(act);
                      }}
                      className="p-3 bg-white rounded-2xl border border-sand-200 shadow-soft flex items-center justify-between gap-3 hover:border-sand-300 transition-all cursor-pointer"
                    >
                      <img
                        src={act.coverImage}
                        alt={act.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-charcoal-900 truncate">
                          {act.title}
                        </h5>
                        <span className="text-[11px] text-terracotta-600 block">
                          {act.displayDate}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-charcoal-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom CTA: Join / Leave */}
        <div className="p-4 bg-white border-t border-sand-200 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-charcoal-400 block font-semibold uppercase">
              Membership
            </span>
            <span className="text-xs font-extrabold text-charcoal-900">
              Free to Join
            </span>
          </div>

          <button
            onClick={() => toggleJoinCommunity(community.id)}
            className={`py-2.5 px-6 rounded-full text-xs font-extrabold shadow-card transition-all active:scale-95 ${
              community.isMember
                ? 'bg-sand-100 hover:bg-rose-50 hover:text-rose-600 text-charcoal-700 border border-sand-200'
                : 'bg-gradient-to-r from-terracotta-600 to-terracotta-500 hover:from-terracotta-700 hover:to-terracotta-600 text-white'
            }`}
          >
            {community.isMember ? 'Joined Community (Leave)' : 'Join Community'}
          </button>
        </div>

      </div>
    </div>
  );
};
