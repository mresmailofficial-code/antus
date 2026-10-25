import React, { useState } from 'react';
import { useHuman } from '../../context/HumanContext';
import { ChatWindow } from './ChatWindow';
import { 
  Calendar, 
  MessageSquare, 
  MapPin, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const PlansScreen: React.FC = () => {
  const { 
    activities, 
    conversations, 
    activeChatThreadId, 
    setActiveChatThreadId,
    setActiveCoordinationActivity,
    setSelectedActivityDetail,
    setProofOfPresenceModal,
    setActiveTab
  } = useHuman();

  const [activeSegment, setActiveSegment] = useState<'all' | 'activities' | 'messages'>('all');

  const joinedActivities = activities.filter((a) => a.isJoined);
  const activeThread = conversations.find((c) => c.id === activeChatThreadId);

  // If a chat thread is currently selected, show the ChatWindow
  if (activeThread) {
    return (
      <ChatWindow
        thread={activeThread}
        onBack={() => setActiveChatThreadId(null)}
      />
    );
  }

  return (
    <div className="flex-1 w-full pb-28 px-4 pt-4 space-y-5 animate-fade-in">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600">
          Showing Up in Jaipur
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-charcoal-900 leading-tight">
          Plans & Conversations
        </h1>
        <p className="text-xs text-charcoal-500">
          Real-world activities you're attending and message channels.
        </p>
      </div>

      {/* Segment switcher */}
      <div className="flex items-center p-1 bg-sand-200/80 rounded-2xl">
        <button
          onClick={() => setActiveSegment('all')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSegment === 'all' ? 'bg-white text-charcoal-900 shadow-soft' : 'text-charcoal-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveSegment('activities')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSegment === 'activities' ? 'bg-white text-charcoal-900 shadow-soft' : 'text-charcoal-600'
          }`}
        >
          Joined ({joinedActivities.length})
        </button>
        <button
          onClick={() => setActiveSegment('messages')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSegment === 'messages' ? 'bg-white text-charcoal-900 shadow-soft' : 'text-charcoal-600'
          }`}
        >
          Messages ({conversations.length})
        </button>
      </div>

      {/* Section 1: Upcoming Joined Activities */}
      {(activeSegment === 'all' || activeSegment === 'activities') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Your Confirmed Activities</span>
            </h3>
            <span className="text-xs font-bold text-forest-600">
              {joinedActivities.length} Scheduled
            </span>
          </div>

          {joinedActivities.length > 0 ? (
            <div className="space-y-3">
              {joinedActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 bg-white rounded-3xl border border-sand-200 shadow-soft space-y-3 hover:shadow-card transition-all"
                >
                  <div 
                    onClick={() => setSelectedActivityDetail(act)}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <img
                      src={act.coverImage}
                      alt={act.title}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-terracotta-600 font-bold uppercase tracking-wider">
                        <span>{act.neighborhood}</span>
                        <span>·</span>
                        <span>{act.displayDate}</span>
                      </div>
                      <h4 className="text-xs font-bold text-charcoal-900 truncate mt-0.5">
                        {act.title}
                      </h4>
                      <span className="text-[11px] text-charcoal-500 block truncate">
                        {act.venueName}
                      </span>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="pt-2 border-t border-sand-100 flex items-center gap-2">
                    <button
                      onClick={() => setActiveCoordinationActivity(act)}
                      className="flex-1 py-2 px-3 rounded-full bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-terracotta-400" />
                      <span>Coordination Space</span>
                    </button>

                    <button
                      onClick={() => setProofOfPresenceModal({ isOpen: true, activity: act })}
                      className="py-2 px-3 rounded-full bg-sand-100 hover:bg-forest-50 text-charcoal-700 hover:text-forest-700 text-xs font-semibold border border-sand-200 transition-colors"
                      title="Confirm attendance"
                    >
                      Did you make it?
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-white rounded-3xl border border-sand-200">
              <span className="text-2xl mb-2 block">🗓️</span>
              <h4 className="text-xs font-bold text-charcoal-900 mb-1">
                No upcoming plans yet
              </h4>
              <p className="text-[11px] text-charcoal-500 mb-3">
                Explore activities in C-Scheme or Malviya Nagar and join one!
              </p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-1.5 rounded-full bg-terracotta-500 text-white text-xs font-bold"
              >
                Find something to do
              </button>
            </div>
          )}
        </div>
      )}

      {/* Section 2: Conversation Channels */}
      {(activeSegment === 'all' || activeSegment === 'messages') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Channels & Direct Chats</span>
            </h3>
          </div>

          <div className="space-y-2">
            {conversations.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setActiveChatThreadId(thread.id)}
                className="p-3.5 bg-white rounded-2xl border border-sand-200 shadow-soft hover:shadow-card transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="relative">
                  <img
                    src={thread.avatar}
                    alt={thread.title}
                    className="w-12 h-12 rounded-full object-cover border border-sand-200"
                  />
                  {thread.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-terracotta-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-charcoal-900 truncate">
                      {thread.title}
                    </h4>
                    <span className="text-[10px] text-charcoal-400">
                      {thread.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">
                    {thread.lastMessage}
                  </p>

                  {thread.contextReason && (
                    <span className="text-[9px] text-terracotta-600 font-semibold block truncate mt-0.5">
                      💡 {thread.contextReason}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
