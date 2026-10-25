import React from 'react';
import { useHuman } from '../../context/HumanContext';
import { IntentSelector } from './IntentSelector';
import { NearYouCarousel } from './NearYouCarousel';
import { CompatiblePeople } from './CompatiblePeople';
import { ActivityCard } from '../activity/ActivityCard';
import { 
  Calendar, 
  Users, 
  Camera, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Compass,
  MapPin
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    currentUser, 
    activities, 
    communities, 
    memories, 
    selectedIntent, 
    selectedNeighborhood, 
    setSelectedActivityDetail,
    setSelectedCommunityDetail,
    setActiveCoordinationActivity,
    setActiveTab,
    setProofOfPresenceModal
  } = useHuman();

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter activities if intent or neighborhood selected
  const filteredActivities = activities.filter((act) => {
    if (selectedIntent && act.intent !== selectedIntent) return false;
    if (selectedNeighborhood !== 'All' && act.neighborhood !== selectedNeighborhood) return false;
    return true;
  });

  const joinedActivities = activities.filter((a) => a.isJoined);
  const myCommunities = communities.filter((c) => c.isMember);

  return (
    <div className="flex-1 w-full pb-28 px-4 pt-4 space-y-6 animate-fade-in">
      
      {/* Top Greeting & Headline */}
      <div className="pt-2">
        <span className="text-xs font-semibold text-terracotta-600 block mb-0.5">
          {getGreeting()}, {currentUser.name}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-charcoal-900 leading-tight">
          What do you feel like doing?
        </h1>
        <p className="text-xs text-charcoal-500 mt-1">
          Tap an intent to find experiences and people in Jaipur.
        </p>
      </div>

      {/* 8 Intent Cards */}
      <IntentSelector />

      {/* Upcoming Plans Card (If user has joined any activities) */}
      {joinedActivities.length > 0 && (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-white shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              Your Next Plan
            </span>
            <button 
              onClick={() => setActiveTab('plans')}
              className="text-xs font-semibold underline underline-offset-2 hover:text-white/80"
            >
              View All ({joinedActivities.length})
            </button>
          </div>

          <h3 className="text-base font-extrabold leading-snug mb-1">
            {joinedActivities[0].title}
          </h3>
          <p className="text-xs text-white/90 mb-3 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{joinedActivities[0].displayDate}</span>
            <span>·</span>
            <MapPin className="w-3.5 h-3.5" />
            <span>{joinedActivities[0].venueName}</span>
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-white/20">
            <button
              onClick={() => setActiveCoordinationActivity(joinedActivities[0])}
              className="flex-1 py-2 px-3 rounded-full bg-white text-charcoal-900 text-xs font-bold shadow-soft text-center hover:bg-sand-50 transition-colors"
            >
              Open Coordination Space
            </button>
            <button
              onClick={() => setProofOfPresenceModal({ isOpen: true, activity: joinedActivities[0] })}
              className="py-2 px-3 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-colors"
              title="Confirm you showed up"
            >
              Confirm Presence
            </button>
          </div>
        </div>
      )}

      {/* Module 1: Near You Carousel */}
      <NearYouCarousel />

      {/* Module 2: People you might get along with */}
      <CompatiblePeople />

      {/* Module 3: Happening This Week */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Happening This Week</span>
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-800 flex items-center gap-0.5"
          >
            <span>Explore map</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3.5">
          {filteredActivities.slice(0, 3).map((act) => (
            <ActivityCard key={act.id} activity={act} layout="card" />
          ))}
        </div>
      </div>

      {/* Module 4: Your Jaipur Communities */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Communities in Jaipur</span>
          </h3>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-800"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {communities.slice(0, 4).map((comm) => (
            <div
              key={comm.id}
              onClick={() => setSelectedCommunityDetail(comm)}
              className="p-3 bg-white rounded-2xl border border-sand-200 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-20 w-full rounded-xl overflow-hidden mb-2">
                <img
                  src={comm.coverImage}
                  alt={comm.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-semibold backdrop-blur-sm">
                  {comm.memberCount} members
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-charcoal-900 leading-tight mb-1 truncate">
                  {comm.name}
                </h4>
                <p className="text-[10px] text-charcoal-500 line-clamp-2 leading-tight">
                  {comm.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module 5: Recent Memories */}
      {memories.length > 0 && (
        <div className="w-full pt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Recent Memories</span>
            </h3>
            <button
              onClick={() => setActiveTab('you')}
              className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-800"
            >
              All memories
            </button>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-sand-200 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider">
                {memories[0].neighborhood} · {memories[0].dateString}
              </span>
              <span className="text-[10px] text-charcoal-400">
                {memories[0].privacy}
              </span>
            </div>
            <h4 className="text-sm font-bold text-charcoal-900 mb-1">
              {memories[0].activityTitle}
            </h4>
            <p className="text-xs text-charcoal-600 line-clamp-3 leading-relaxed mb-3">
              "{memories[0].story}"
            </p>
            <div className="flex items-center gap-2">
              {memories[0].photos.slice(0, 3).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Memory"
                  className="w-14 h-14 rounded-xl object-cover border border-sand-200"
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
