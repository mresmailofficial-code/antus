import React from 'react';
import { Activity } from '../../types';
import { useHuman } from '../../context/HumanContext';
import { MapPin, Users, CheckCircle2, Bookmark, Calendar, ArrowUpRight } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  layout?: 'card' | 'compact' | 'horizontal';
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, layout = 'card' }) => {
  const { setSelectedActivityDetail, joinActivity, isItemSaved, toggleSaveItem } = useHuman();

  const isSaved = isItemSaved(activity.id);
  const spotsLeft = activity.capacity - activity.participantIds.length;

  if (layout === 'compact') {
    return (
      <div 
        onClick={() => setSelectedActivityDetail(activity)}
        className="w-64 shrink-0 bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-soft hover:shadow-card transition-all cursor-pointer group flex flex-col"
      >
        <div className="relative h-28 w-full overflow-hidden">
          <img
            src={activity.coverImage}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-charcoal-900/80 backdrop-blur-md text-white text-[10px] font-semibold">
            {activity.category}
          </div>
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveItem('activity', activity.id, activity.title, activity.venueName, activity.coverImage);
              }}
              className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-charcoal-800 hover:bg-white transition-colors"
            >
              <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600 block mb-0.5">
              {activity.displayDate}
            </span>
            <h4 className="text-xs font-bold text-charcoal-900 line-clamp-1 group-hover:text-terracotta-600 transition-colors">
              {activity.title}
            </h4>
            <span className="text-[11px] text-charcoal-500 flex items-center gap-1 mt-1 truncate">
              <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" />
              {activity.venueName} · {activity.neighborhood}
            </span>
          </div>

          <div className="mt-3 pt-2 border-t border-sand-100 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-charcoal-700">
              {activity.isPaid ? `₹${activity.priceINR}` : 'Free'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activity.isJoined 
                ? 'bg-forest-50 text-forest-600' 
                : 'bg-sand-100 text-charcoal-600'
            }`}>
              {activity.isJoined ? "You're Going" : `${spotsLeft} spots left`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default Standard Card
  return (
    <div 
      onClick={() => setSelectedActivityDetail(activity)}
      className="w-full bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-soft hover:shadow-card transition-all cursor-pointer group mb-3.5"
    >
      {/* Hero Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={activity.coverImage}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-charcoal-900 text-xs font-bold shadow-soft">
            {activity.category}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-charcoal-900/80 backdrop-blur-md text-white text-[11px] font-medium">
            {activity.experienceLevel}
          </span>
        </div>

        {/* Save Bookmark Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveItem('activity', activity.id, activity.title, activity.venueName, activity.coverImage);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal-800 hover:bg-white transition-colors shadow-soft"
          title="Save Activity"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
        </button>

        {/* Bottom Time & Location over image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-md">
            <Calendar className="w-3.5 h-3.5 text-terracotta-300" />
            <span>{activity.displayDate}</span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
            {activity.isPaid ? `₹${activity.priceINR}` : 'Free'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-base font-bold text-charcoal-900 leading-snug group-hover:text-terracotta-600 transition-colors">
            {activity.title}
          </h3>
        </div>

        <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed mb-3">
          {activity.description}
        </p>

        {/* Location line */}
        <div className="flex items-center gap-1 text-xs text-charcoal-500 font-medium mb-3">
          <MapPin className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
          <span className="truncate">{activity.venueName} · {activity.neighborhood}</span>
        </div>

        {/* Host & Actions row */}
        <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
          {/* Host profile info */}
          <div className="flex items-center gap-2">
            <img
              src={activity.host.avatar}
              alt={activity.host.name}
              className="w-7 h-7 rounded-full object-cover border border-sand-300"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-charcoal-800">
                  {activity.host.name}
                </span>
                {activity.host.isVerified && (
                  <CheckCircle2 className="w-3 h-3 text-forest-500" />
                )}
              </div>
              <span className="text-[10px] text-charcoal-400 block">
                {activity.host.reliabilityBadge}
              </span>
            </div>
          </div>

          {/* Join / Status CTA */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-charcoal-500">
              <Users className="w-3.5 h-3.5" />
              <span>{spotsLeft} spots left</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (activity.isJoined) {
                  setSelectedActivityDetail(activity);
                } else {
                  joinActivity(activity.id);
                }
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-soft active:scale-95 ${
                activity.isJoined
                  ? 'bg-forest-50 text-forest-600 border border-forest-200'
                  : 'bg-terracotta-500 hover:bg-terracotta-600 text-white'
              }`}
            >
              {activity.isJoined ? "You're Going" : 'Join'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
