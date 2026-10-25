import React, { useState } from 'react';
import { useHuman } from '../../context/HumanContext';
import { ActivityCategory, HumanIntent, JaipurNeighborhood } from '../../types';
import { JAIPUR_COORDINATES } from '../../data/jaipurSeedData';
import { SmartIntentInput } from './SmartIntentInput';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Camera, 
  Check, 
  ArrowRight,
  Info
} from 'lucide-react';

const CATEGORIES: ActivityCategory[] = [
  'Sports & Fitness',
  'Photography',
  'Art & Design',
  'Books & Writing',
  'Music',
  'Food & Cooking',
  'Tech & Startups',
  'Travel & Heritage',
  'Learning',
];

const NEIGHBORHOODS: JaipurNeighborhood[] = [
  'C-Scheme',
  'Malviya Nagar',
  'Raja Park',
  'Vaishali Nagar',
  'MI Road / Pink City',
  'Jawahar Circle',
  'Tonk Road',
];

const PRESET_IMAGES: { [key in ActivityCategory]: string } = {
  'Photography': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
  'Sports & Fitness': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  'Art & Design': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
  'Books & Writing': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
  'Music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  'Food & Cooking': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  'Tech & Startups': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  'Travel & Heritage': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  'Learning': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
};

export const CreateWizard: React.FC = () => {
  const { createActivity, setActiveTab, setSelectedActivityDetail, selectedNeighborhood } = useHuman();

  const [activeTabMode, setActiveTabMode] = useState<'smart' | 'step'>('smart');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Photography');
  const [neighborhood, setNeighborhood] = useState<JaipurNeighborhood>(
    selectedNeighborhood === 'All' ? 'C-Scheme' : selectedNeighborhood
  );
  const [venueName, setVenueName] = useState('Tapri Central');
  const [meetingPointDetails, setMeetingPointDetails] = useState('Outside main entrance on terrace');
  const [displayDate, setDisplayDate] = useState('Saturday · 5:30 PM');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [capacity, setCapacity] = useState(8);
  const [experienceLevel, setExperienceLevel] = useState<'Beginner friendly' | 'All levels' | 'Advanced'>('Beginner friendly');
  const [isPaid, setIsPaid] = useState(false);
  const [priceINR, setPriceINR] = useState(0);
  const [upiId, setUpiId] = useState('smile@okhdfcbank');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES['Photography']);

  const handleApplySmartParsed = (parsed: any) => {
    setTitle(parsed.title);
    setCategory(parsed.category);
    setNeighborhood(parsed.neighborhood);
    setDisplayDate(parsed.displayDate);
    setCapacity(parsed.capacity);
    setDescription(parsed.description);
    setCoverImage(PRESET_IMAGES[parsed.category as ActivityCategory] || PRESET_IMAGES['Photography']);
    setActiveTabMode('step');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const coords = JAIPUR_COORDINATES[neighborhood] || [26.9066, 75.8010];

    const created = createActivity({
      title,
      description: description || `Meet up in ${neighborhood} for ${title}. Looking forward to connecting with fellow Jaipur locals!`,
      intent: 'connect',
      category,
      neighborhood,
      venueName: venueName || `${neighborhood} Public Cafe`,
      address: `${venueName}, ${neighborhood}, Jaipur`,
      coordinates: coords,
      startTime: new Date(Date.now() + 86400000).toISOString(),
      displayDate,
      durationMinutes,
      capacity,
      isPaid,
      priceINR: isPaid ? priceINR : 0,
      experienceLevel,
      whatToBring: ['Comfortable clothes', 'Water bottle', 'Curiosity'],
      meetingPointDetails,
      safetyNotice: 'Public verified venue. Respectful community guidelines apply.',
      coverImage,
    });

    setSelectedActivityDetail(created);
    setActiveTab('home');
  };

  return (
    <div className="flex-1 w-full pb-28 px-4 pt-4 space-y-4 animate-fade-in">
      
      {/* Title */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600">
          Make a Real-World Plan
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-charcoal-900 leading-tight">
          Create an Activity
        </h1>
        <p className="text-xs text-charcoal-500">
          Gather people in Jaipur around what you want to do.
        </p>
      </div>

      {/* Mode Switcher: Smart Intent vs Detailed Form */}
      <div className="flex items-center p-1 bg-sand-200/80 rounded-2xl">
        <button
          onClick={() => setActiveTabMode('smart')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTabMode === 'smart'
              ? 'bg-white text-charcoal-900 shadow-soft'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
          <span>Smart Intent (Fast)</span>
        </button>

        <button
          onClick={() => setActiveTabMode('step')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabMode === 'step'
              ? 'bg-white text-charcoal-900 shadow-soft'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          Detailed Form
        </button>
      </div>

      {/* Mode 1: Smart Intent NLP */}
      {activeTabMode === 'smart' && (
        <SmartIntentInput onApplyParsed={handleApplySmartParsed} />
      )}

      {/* Mode 2: Step-by-Step Form */}
      {activeTabMode === 'step' && (
        <form onSubmit={handlePublish} className="space-y-4 bg-white p-5 rounded-3xl border border-sand-200 shadow-soft">
          
          {/* Title */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Street Photography Walk at C-Scheme"
              className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-charcoal-900"
            />
          </div>

          {/* Category & Neighborhood */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as ActivityCategory;
                  setCategory(cat);
                  setCoverImage(PRESET_IMAGES[cat]);
                }}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none font-semibold text-charcoal-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                Jaipur Area
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value as JaipurNeighborhood)}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none font-semibold text-charcoal-800"
              >
                {NEIGHBORHOODS.map((nh) => (
                  <option key={nh} value={nh}>
                    {nh}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Venue & Meeting Point */}
          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                Venue Name (Public Cafe / Park / Studio)
              </label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. Tapri Central, Stepout Cafe, Jawahar Circle"
                className="w-full px-3.5 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none font-medium text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                Exact Landmark Meeting Point
              </label>
              <input
                type="text"
                value={meetingPointDetails}
                onChange={(e) => setMeetingPointDetails(e.target.value)}
                placeholder="e.g. Outside ground floor entrance near the banyan tree"
                className="w-full px-3.5 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none font-medium text-charcoal-900"
              />
            </div>
          </div>

          {/* Date & Spots */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                When (Day & Time)
              </label>
              <input
                type="text"
                value={displayDate}
                onChange={(e) => setDisplayDate(e.target.value)}
                placeholder="e.g. Saturday · 6:00 PM"
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none font-semibold text-charcoal-800"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                Max People (Capacity)
              </label>
              <input
                type="number"
                min={2}
                max={30}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 6)}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none font-semibold text-charcoal-800"
              />
            </div>
          </div>

          {/* Free or Paid (UPI) */}
          <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-charcoal-900">Paid Activity?</h4>
                <span className="text-[10px] text-charcoal-500">
                  Most activities are free. Paid activities collect via UPI at venue.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-4 h-4 accent-terracotta-500"
              />
            </div>

            {isPaid && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sand-200">
                <div>
                  <label className="text-[10px] font-bold text-charcoal-600 block mb-0.5">
                    Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    min={50}
                    step={50}
                    value={priceINR}
                    onChange={(e) => setPriceINR(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-sand-300 rounded-lg font-bold text-charcoal-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-charcoal-600 block mb-0.5">
                    Host UPI VPA ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-sand-300 rounded-lg text-charcoal-800 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
              Description & Vibe
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will you do together? What's the conversational tone?"
              className="w-full px-3.5 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none text-charcoal-800"
            />
          </div>

          {/* Cover image preview */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
              Cover Image
            </label>
            <div className="relative h-24 rounded-2xl overflow-hidden border border-sand-200">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-sm">
                Auto-assigned for {category}
              </span>
            </div>
          </div>

          {/* Publish CTA */}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-terracotta-600 to-terracotta-500 hover:from-terracotta-700 hover:to-terracotta-600 text-white text-xs font-extrabold shadow-card transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Publish to Jaipur</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

    </div>
  );
};
