import React from 'react';
import { useHuman } from '../../context/HumanContext';
import { ActivityCard } from '../activity/ActivityCard';
import { ArrowRight, MapPin } from 'lucide-react';

export const NearYouCarousel: React.FC = () => {
  const { activities, selectedNeighborhood, setActiveTab } = useHuman();

  // Filter activities near selected neighborhood or all
  const filteredActivities = activities.filter((act) => {
    if (selectedNeighborhood === 'All') return true;
    return act.neighborhood === selectedNeighborhood;
  });

  const displayList = filteredActivities.length > 0 ? filteredActivities : activities;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Near You in {selectedNeighborhood === 'All' ? 'Jaipur' : selectedNeighborhood}</span>
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('explore')}
          className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-800 flex items-center gap-0.5"
        >
          <span>See all</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Horizontal scrolling carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar scroll-smooth">
        {displayList.slice(0, 5).map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            layout="compact"
          />
        ))}
      </div>
    </div>
  );
};
