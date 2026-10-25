import React from 'react';
import { useHuman } from '../../context/HumanContext';
import { SEED_USERS } from '../../data/jaipurSeedData';
import { UserProfile } from '../../types';
import { CheckCircle2, MessageCircle, MapPin, Sparkles, Plus } from 'lucide-react';

export const CompatiblePeople: React.FC = () => {
  const { currentUser, openDirectChatWithUser, showToast } = useHuman();

  // Find people who are not current user
  const otherUsers = SEED_USERS.filter((u) => u.id !== currentUser.id);

  const getSharedReason = (user: UserProfile) => {
    const sharedInterests = user.interests.filter((i) => currentUser.interests.includes(i));
    if (sharedInterests.length > 0) {
      return `You both enjoy ${sharedInterests.slice(0, 2).join(' & ')}.`;
    }
    if (user.neighborhood === currentUser.neighborhood) {
      return `Both active in ${user.neighborhood}.`;
    }
    return 'Looking for weekend activities in Jaipur.';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>People you might get along with</span>
        </h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
        {otherUsers.slice(0, 4).map((user) => {
          const reason = getSharedReason(user);
          return (
            <div
              key={user.id}
              className="w-64 shrink-0 bg-white rounded-2xl border border-sand-200 p-3.5 shadow-soft flex flex-col justify-between hover:shadow-card transition-all"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover border border-sand-300 shadow-soft"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-charcoal-900 truncate">
                        {user.name}
                      </h4>
                      {user.isVerified && (
                        <CheckCircle2 className="w-3 h-3 text-forest-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-charcoal-500 flex items-center gap-0.5 truncate">
                      <MapPin className="w-2.5 h-2.5 text-terracotta-500" />
                      {user.neighborhood}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-charcoal-600 line-clamp-2 leading-relaxed mb-2.5">
                  "{user.bio}"
                </p>

                {/* Compatibility context pill */}
                <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200/60 mb-3">
                  <span className="text-[10px] font-medium text-amber-900 block leading-tight">
                    {reason}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-sand-100">
                <button
                  onClick={() => openDirectChatWithUser(user)}
                  className="flex-1 py-1.5 px-2.5 rounded-full bg-sand-100 hover:bg-sand-200 text-charcoal-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3 h-3 text-terracotta-600" />
                  <span>Say Hello</span>
                </button>
                <button
                  onClick={() => {
                    showToast('Invitation Sent', `Invited ${user.name} to your next activity.`);
                  }}
                  className="p-1.5 rounded-full bg-sand-100 hover:bg-terracotta-50 text-charcoal-700 hover:text-terracotta-600 border border-sand-200 transition-colors"
                  title="Invite to Activity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
