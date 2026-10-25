import React from 'react';
import { HumanIntent } from '../../types';
import { useHuman } from '../../context/HumanContext';

interface IntentCardItem {
  id: HumanIntent;
  emoji: string;
  title: string;
  tagline: string;
  bgGradient: string;
}

const INTENT_ITEMS: IntentCardItem[] = [
  {
    id: 'talk',
    emoji: '❤️',
    title: 'Talk',
    tagline: 'I want someone to talk to.',
    bgGradient: 'from-rose-50 to-orange-50 border-rose-200/70',
  },
  {
    id: 'connect',
    emoji: '🤝',
    title: 'Connect',
    tagline: 'I want to meet people.',
    bgGradient: 'from-amber-50 to-orange-50 border-amber-200/70',
  },
  {
    id: 'create',
    emoji: '🎭',
    title: 'Create',
    tagline: 'I want to create something.',
    bgGradient: 'from-terracotta-50 to-rose-50 border-terracotta-200/70',
  },
  {
    id: 'experience',
    emoji: '🎉',
    title: 'Experience',
    tagline: 'I want to do something fun.',
    bgGradient: 'from-yellow-50 to-amber-50 border-yellow-200/70',
  },
  {
    id: 'grow',
    emoji: '🌱',
    title: 'Grow',
    tagline: 'I want to learn.',
    bgGradient: 'from-emerald-50 to-teal-50 border-emerald-200/70',
  },
  {
    id: 'belong',
    emoji: '🏠',
    title: 'Belong',
    tagline: 'I want to find my community.',
    bgGradient: 'from-stone-50 to-sand-100 border-sand-300',
  },
  {
    id: 'play',
    emoji: '🏃',
    title: 'Play',
    tagline: 'I want to get active.',
    bgGradient: 'from-blue-50 to-sky-50 border-blue-200/70',
  },
  {
    id: 'surprise',
    emoji: '✨',
    title: 'Surprise me',
    tagline: 'Show me something unexpected.',
    bgGradient: 'from-purple-50 to-pink-50 border-purple-200/70',
  },
];

export const IntentSelector: React.FC = () => {
  const { selectedIntent, setSelectedIntent, showToast } = useHuman();

  const handleSelectIntent = (intent: HumanIntent) => {
    if (selectedIntent === intent) {
      setSelectedIntent(null);
      showToast('Filters cleared', 'Showing all activities in Jaipur.');
    } else {
      setSelectedIntent(intent);
      const found = INTENT_ITEMS.find((i) => i.id === intent);
      showToast(`Filter: ${found?.title}`, found?.tagline || '');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
          What do you feel like doing?
        </h3>
        {selectedIntent && (
          <button
            onClick={() => setSelectedIntent(null)}
            className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-800"
          >
            Reset filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {INTENT_ITEMS.map((item) => {
          const isSelected = selectedIntent === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectIntent(item.id)}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'ring-2 ring-terracotta-500 border-terracotta-500 bg-terracotta-50 shadow-card scale-[1.01]'
                  : `bg-white hover:bg-gradient-to-br ${item.bgGradient} shadow-soft hover:shadow-card`
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse" />
                )}
              </div>
              <h4 className="text-xs font-bold text-charcoal-900 leading-tight mb-0.5">
                {item.title}
              </h4>
              <p className="text-[11px] text-charcoal-500 leading-tight line-clamp-2">
                {item.tagline}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
