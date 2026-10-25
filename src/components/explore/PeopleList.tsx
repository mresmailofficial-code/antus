import React from 'react';
import { SEED_USERS } from '../../data/jaipurSeedData';
import { useHuman } from '../../context/HumanContext';
import { UserProfile } from '../../types';
import { CheckCircle2, MessageCircle, MapPin, UserPlus } from 'lucide-react';

interface PeopleListProps {
  searchQuery: string;
}

export const PeopleList: React.FC<PeopleListProps> = ({ searchQuery }) => {
  const { currentUser, openDirectChatWithUser, showToast } = useHuman();

  const otherUsers = SEED_USERS.filter((u) => u.id !== currentUser.id);

  const filteredUsers = otherUsers.filter((user) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.neighborhood.toLowerCase().includes(q) ||
      user.interests.some((i) => i.toLowerCase().includes(q)) ||
      user.bio.toLowerCase().includes(q)
    );
  });

  const getCompatibilityReason = (user: UserProfile) => {
    const sharedInterests = user.interests.filter((i) => currentUser.interests.includes(i));
    if (sharedInterests.length > 0) {
      return `You both love ${sharedInterests.join(', ')}.`;
    }
    if (user.neighborhood === currentUser.neighborhood) {
      return `Both live or spend time in ${user.neighborhood}.`;
    }
    return 'Both looking for weekend activities in Jaipur.';
  };

  return (
    <div className="space-y-3.5 pt-1">
      {filteredUsers.map((user) => {
        const reason = getCompatibilityReason(user);
        return (
          <div
            key={user.id}
            className="p-4 bg-white rounded-3xl border border-sand-200 shadow-soft hover:shadow-card transition-all"
          >
            <div className="flex items-start gap-3.5 mb-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-13 h-13 rounded-full object-cover border border-sand-300 shadow-soft shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-charcoal-900 truncate">
                    {user.name}
                  </h3>
                  {user.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-500 shrink-0" />
                  )}
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sand-100 text-charcoal-600 ml-auto shrink-0">
                    {user.reliabilityBadge}
                  </span>
                </div>

                <span className="text-[11px] text-charcoal-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" />
                  <span>{user.neighborhood}, Jaipur</span>
                </span>

                {user.headline && (
                  <p className="text-xs font-semibold text-charcoal-800 mt-1">
                    {user.headline}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
              "{user.bio}"
            </p>

            {/* Interests tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-0.5 rounded-full bg-sand-100 text-[10px] font-medium text-charcoal-700"
                >
                  {interest}
                </span>
              ))}
            </div>

            {/* Connection reason banner */}
            <div className="p-2.5 rounded-2xl bg-terracotta-50/70 border border-terracotta-200/60 mb-3 flex items-center gap-2">
              <span className="text-xs">💡</span>
              <span className="text-[11px] font-medium text-charcoal-800">
                {reason}
              </span>
            </div>

            {/* Actions: Say Hello / Invite */}
            <div className="flex items-center gap-2 pt-1 border-t border-sand-100">
              <button
                onClick={() => openDirectChatWithUser(user)}
                className="flex-1 py-2 px-3 rounded-full bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-soft"
              >
                <MessageCircle className="w-3.5 h-3.5 text-terracotta-400" />
                <span>Say Hello</span>
              </button>

              <button
                onClick={() => {
                  showToast('Activity Invite Sent', `Invited ${user.name} to join your next Jaipur activity.`);
                }}
                className="py-2 px-3 rounded-full bg-sand-100 hover:bg-terracotta-50 text-charcoal-700 hover:text-terracotta-600 border border-sand-200 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
