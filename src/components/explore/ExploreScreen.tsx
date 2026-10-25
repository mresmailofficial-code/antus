import React, { useState } from 'react';
import { useHuman } from '../../context/HumanContext';
import { ActivityFilters } from './ActivityFilters';
import { ActivityCard } from '../activity/ActivityCard';
import { JaipurMap } from './JaipurMap';
import { PeopleList } from './PeopleList';
import { Search, Map as MapIcon, ListFilter, Users, Calendar, Sparkles } from 'lucide-react';

export const ExploreScreen: React.FC = () => {
  const { activities, communities, setSelectedCommunityDetail, selectedNeighborhood } = useHuman();

  const [activeSegment, setActiveSegment] = useState<'activities' | 'communities' | 'people' | 'map'>('activities');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterNeighborhood, setFilterNeighborhood] = useState(selectedNeighborhood);
  const [selectedTime, setSelectedTime] = useState('Anytime');
  const [selectedPrice, setSelectedPrice] = useState('All');

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = 
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        act.venueName.toLowerCase().includes(q) ||
        act.neighborhood.toLowerCase().includes(q);
      if (!matchText) return false;
    }

    // Category
    if (selectedCategory !== 'All' && act.category !== selectedCategory) {
      return false;
    }

    // Neighborhood
    if (filterNeighborhood !== 'All' && act.neighborhood !== filterNeighborhood) {
      return false;
    }

    // Price
    if (selectedPrice === 'Free' && act.isPaid) return false;
    if (selectedPrice === 'Paid (UPI)' && !act.isPaid) return false;

    return true;
  });

  // Filter communities
  const filteredCommunities = communities.filter((comm) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      comm.name.toLowerCase().includes(q) ||
      comm.tagline.toLowerCase().includes(q) ||
      comm.description.toLowerCase().includes(q) ||
      (comm.neighborhood && comm.neighborhood.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 w-full pb-28 px-4 pt-4 space-y-4 animate-fade-in">
      
      {/* Title & Prompt */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600">
          Discover Jaipur
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-charcoal-900 leading-tight">
          What could I do?
        </h1>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search activities, chai walks, football, pottery..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-terracotta-500 shadow-soft text-charcoal-900"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-charcoal-400 hover:text-charcoal-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Segmented Mode Switcher */}
      <div className="flex items-center p-1 bg-sand-200/70 rounded-2xl">
        <button
          onClick={() => setActiveSegment('activities')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSegment === 'activities'
              ? 'bg-white text-charcoal-900 shadow-soft'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          Activities
        </button>

        <button
          onClick={() => setActiveSegment('communities')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSegment === 'communities'
              ? 'bg-white text-charcoal-900 shadow-soft'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          Communities
        </button>

        <button
          onClick={() => setActiveSegment('people')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSegment === 'people'
              ? 'bg-white text-charcoal-900 shadow-soft'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          People
        </button>

        <button
          onClick={() => setActiveSegment('map')}
          className={`flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeSegment === 'map'
              ? 'bg-terracotta-500 text-white shadow-soft'
              : 'text-terracotta-700 hover:text-terracotta-800'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Map</span>
        </button>
      </div>

      {/* Segment 1: Activities List */}
      {activeSegment === 'activities' && (
        <div className="space-y-3">
          <ActivityFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedNeighborhood={filterNeighborhood}
            setSelectedNeighborhood={setFilterNeighborhood}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
          />

          <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold px-1 pt-1">
            <span>{filteredActivities.length} activities found in Jaipur</span>
            <button
              onClick={() => setActiveSegment('map')}
              className="text-terracotta-600 hover:underline flex items-center gap-1"
            >
              <MapIcon className="w-3 h-3" />
              <span>Show on Map</span>
            </button>
          </div>

          {filteredActivities.length > 0 ? (
            <div className="space-y-3 pt-1">
              {filteredActivities.map((act) => (
                <ActivityCard key={act.id} activity={act} layout="card" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-sand-200">
              <span className="text-3xl mb-2 block">🌿</span>
              <h4 className="text-sm font-bold text-charcoal-900 mb-1">
                Nothing matches those filters yet
              </h4>
              <p className="text-xs text-charcoal-500 mb-4">
                Be the first to create something for people in this neighborhood!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setFilterNeighborhood('All');
                  setSelectedPrice('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-sand-100 hover:bg-sand-200 text-charcoal-800 text-xs font-bold rounded-full transition-colors"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Segment 2: Communities */}
      {activeSegment === 'communities' && (
        <div className="space-y-3 pt-1">
          <p className="text-xs text-charcoal-500 px-1">
            Real groups in Jaipur that gather regularly around shared passions.
          </p>

          <div className="space-y-3.5">
            {filteredCommunities.map((comm) => (
              <div
                key={comm.id}
                onClick={() => setSelectedCommunityDetail(comm)}
                className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-soft hover:shadow-card transition-all cursor-pointer"
              >
                <div className="relative h-32 w-full">
                  <img
                    src={comm.coverImage}
                    alt={comm.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-bold bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      {comm.category}
                    </span>
                    <span className="text-[11px] font-medium">
                      {comm.memberCount} members
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-bold text-charcoal-900 mb-1">
                    {comm.name}
                  </h3>
                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed mb-3">
                    {comm.description}
                  </p>

                  <div className="pt-2 border-t border-sand-100 flex items-center justify-between">
                    <span className="text-[10px] text-terracotta-600 font-bold uppercase tracking-wider">
                      {comm.neighborhood || 'City-wide Jaipur'}
                    </span>
                    <span className="text-xs font-bold text-charcoal-700">
                      {comm.isMember ? 'Joined' : 'Explore Group →'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Segment 3: People */}
      {activeSegment === 'people' && (
        <PeopleList searchQuery={searchQuery} />
      )}

      {/* Segment 4: Interactive Jaipur Map */}
      {activeSegment === 'map' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-600 px-1 font-semibold">
            <span>Tap pins to preview activities in Jaipur</span>
            <button
              onClick={() => setActiveSegment('activities')}
              className="text-terracotta-600 hover:underline"
            >
              Back to list
            </button>
          </div>
          <JaipurMap activities={filteredActivities} />
        </div>
      )}

    </div>
  );
};
