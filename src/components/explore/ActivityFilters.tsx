import React from 'react';
import { ActivityCategory, JaipurNeighborhood } from '../../types';

interface ActivityFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedNeighborhood: JaipurNeighborhood | 'All' | string;
  setSelectedNeighborhood: (nh: any) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedPrice: string;
  setSelectedPrice: (price: string) => void;
}

const CATEGORIES = [
  'All',
  'Photography',
  'Sports & Fitness',
  'Art & Design',
  'Books & Writing',
  'Tech & Startups',
  'Music',
  'Travel & Heritage',
];

const NEIGHBORHOODS = [
  'All',
  'C-Scheme',
  'Malviya Nagar',
  'Raja Park',
  'Vaishali Nagar',
  'MI Road / Pink City',
  'Jawahar Circle',
];

const TIMES = ['Anytime', 'Today', 'Tomorrow', 'This Weekend'];
const PRICES = ['All', 'Free', 'Paid (UPI)'];

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedNeighborhood,
  setSelectedNeighborhood,
  selectedTime,
  setSelectedTime,
  selectedPrice,
  setSelectedPrice,
}) => {
  return (
    <div className="w-full space-y-2 py-1">
      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-charcoal-900 text-white shadow-soft'
                  : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200 border border-sand-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Filters: Neighborhood, Time, Price */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {/* Neighborhood select */}
        <select
          value={selectedNeighborhood}
          onChange={(e) => setSelectedNeighborhood(e.target.value)}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white border border-sand-300 text-charcoal-800 focus:outline-none shrink-0"
        >
          {NEIGHBORHOODS.map((nh) => (
            <option key={nh} value={nh}>
              {nh === 'All' ? 'All Jaipur' : nh}
            </option>
          ))}
        </select>

        {/* Time select */}
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white border border-sand-300 text-charcoal-800 focus:outline-none shrink-0"
        >
          {TIMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Price select */}
        <select
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white border border-sand-300 text-charcoal-800 focus:outline-none shrink-0"
        >
          {PRICES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
