import React, { useState } from 'react';
import { ActivityCategory, HumanIntent, JaipurNeighborhood } from '../../types';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

interface ParsedActivityIntent {
  title: string;
  category: ActivityCategory;
  neighborhood: JaipurNeighborhood;
  displayDate: string;
  capacity: number;
  intent: HumanIntent;
  description: string;
}

interface SmartIntentInputProps {
  onApplyParsed: (parsed: ParsedActivityIntent) => void;
}

export const SmartIntentInput: React.FC<SmartIntentInputProps> = ({ onApplyParsed }) => {
  const [naturalText, setNaturalText] = useState('');
  const [parsedResult, setParsedResult] = useState<ParsedActivityIntent | null>(null);

  const samplePrompts = [
    'Want to play football Saturday evening near Malviya Nagar with 10 people',
    'Street photography walk Sunday 5pm in C-Scheme with chai',
    'Silent book reading Friday afternoon at cafe in Raja Park',
    'Morning run Sunday 6am around Jawahar Circle Patrika Gate',
    'Pottery clay workshop this weekend in Vaishali Nagar',
  ];

  const parseIntent = (text: string) => {
    const lower = text.toLowerCase();

    // 1. Detect Category & Intent
    let category: ActivityCategory = 'Sports & Fitness';
    let intent: HumanIntent = 'play';
    let title = 'Spontaneous Meetup';

    if (lower.includes('photo') || lower.includes('camera')) {
      category = 'Photography';
      intent = 'create';
      title = 'Golden Hour Photo Walk';
    } else if (lower.includes('football') || lower.includes('turf') || lower.includes('soccer')) {
      category = 'Sports & Fitness';
      intent = 'play';
      title = 'Friendly Football Match';
    } else if (lower.includes('run') || lower.includes('jog') || lower.includes('5k')) {
      category = 'Sports & Fitness';
      intent = 'play';
      title = 'Morning Run & Coffee';
    } else if (lower.includes('book') || lower.includes('read')) {
      category = 'Books & Writing';
      intent = 'talk';
      title = 'Silent Reading & Book Chat';
    } else if (lower.includes('pottery') || lower.includes('clay') || lower.includes('art') || lower.includes('paint')) {
      category = 'Art & Design';
      intent = 'create';
      title = 'Handmade Clay Workshop';
    } else if (lower.includes('startup') || lower.includes('tech') || lower.includes('code')) {
      category = 'Tech & Startups';
      intent = 'grow';
      title = 'Indie Builders & Tech Mixer';
    } else if (lower.includes('music') || lower.includes('jam') || lower.includes('guitar')) {
      category = 'Music';
      intent = 'connect';
      title = 'Acoustic Rooftop Jam';
    } else if (lower.includes('heritage') || lower.includes('walk') || lower.includes('hawa mahal')) {
      category = 'Travel & Heritage';
      intent = 'experience';
      title = 'Old City Heritage Walk';
    }

    // 2. Detect Neighborhood
    let neighborhood: JaipurNeighborhood = 'C-Scheme';
    if (lower.includes('malviya')) neighborhood = 'Malviya Nagar';
    else if (lower.includes('raja park')) neighborhood = 'Raja Park';
    else if (lower.includes('vaishali')) neighborhood = 'Vaishali Nagar';
    else if (lower.includes('pink city') || lower.includes('mi road') || lower.includes('hawa mahal')) neighborhood = 'MI Road / Pink City';
    else if (lower.includes('jawahar circle') || lower.includes('patrika')) neighborhood = 'Jawahar Circle';

    // 3. Detect Time & Day
    let displayDate = 'This Weekend · 6:00 PM';
    if (lower.includes('saturday')) {
      displayDate = lower.includes('morning') ? 'Saturday · 7:00 AM' : 'Saturday · 6:00 PM';
    } else if (lower.includes('sunday')) {
      displayDate = lower.includes('morning') ? 'Sunday · 6:30 AM' : 'Sunday · 5:30 PM';
    } else if (lower.includes('friday')) {
      displayDate = 'Friday · 5:00 PM';
    } else if (lower.includes('today')) {
      displayDate = 'Today · 6:30 PM';
    } else if (lower.includes('tomorrow')) {
      displayDate = 'Tomorrow · 6:00 PM';
    }

    // 4. Detect Capacity
    let capacity = 8;
    const numberMatch = text.match(/\b(\d+)\b/);
    if (numberMatch && parseInt(numberMatch[1]) >= 2 && parseInt(numberMatch[1]) <= 30) {
      capacity = parseInt(numberMatch[1]);
    }

    const parsed: ParsedActivityIntent = {
      title: `${title} — ${neighborhood}`,
      category,
      neighborhood,
      displayDate,
      capacity,
      intent,
      description: text.trim(),
    };

    setParsedResult(parsed);
  };

  return (
    <div className="p-4 rounded-3xl bg-white border border-sand-200 shadow-soft space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-charcoal-900">
            Smart Intent Quick-Create
          </h4>
          <span className="text-[10px] text-charcoal-500">
            Type naturally. HUMAN formats the activity in Jaipur.
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <textarea
          rows={3}
          value={naturalText}
          onChange={(e) => {
            setNaturalText(e.target.value);
            if (e.target.value.length > 5) {
              parseIntent(e.target.value);
            } else {
              setParsedResult(null);
            }
          }}
          placeholder="e.g. Want to play football Saturday evening near Malviya Nagar ground with 10 people"
          className="w-full p-3 text-xs bg-sand-50 border border-sand-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-charcoal-900 font-medium"
        />

        {/* Example prompts */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setNaturalText(sample);
                parseIntent(sample);
              }}
              className="text-[10px] px-2.5 py-1 rounded-full bg-sand-100 hover:bg-sand-200 text-charcoal-600 whitespace-nowrap border border-sand-200 transition-colors"
            >
              "{sample.slice(0, 32)}..."
            </button>
          ))}
        </div>
      </div>

      {/* Live Parsed Preview */}
      {parsedResult && (
        <div className="p-3.5 rounded-2xl bg-terracotta-50/80 border border-terracotta-200 space-y-2.5 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700 flex items-center gap-1">
              <Check className="w-3 h-3 text-terracotta-600" />
              <span>Parsed Activity Preview</span>
            </span>
            <span className="text-[10px] font-bold text-charcoal-600">
              {parsedResult.capacity} Spots
            </span>
          </div>

          <h4 className="text-xs font-bold text-charcoal-900">
            {parsedResult.title}
          </h4>

          <div className="flex flex-wrap gap-2 text-[10px] text-charcoal-700">
            <span className="px-2 py-0.5 rounded-full bg-white border border-sand-200">
              📍 {parsedResult.neighborhood}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white border border-sand-200">
              🗓️ {parsedResult.displayDate}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white border border-sand-200">
              🏷️ {parsedResult.category}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onApplyParsed(parsedResult)}
            className="w-full py-2 px-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-soft"
          >
            <span>Use this & Finalize</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
