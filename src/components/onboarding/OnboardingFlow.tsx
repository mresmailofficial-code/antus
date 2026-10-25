import React, { useState } from 'react';
import { useHuman } from '../../context/HumanContext';
import { JaipurNeighborhood } from '../../types';
import { 
  ArrowRight, 
  Check, 
  MapPin, 
  Bell, 
  Camera, 
  Compass, 
  Sparkles, 
  Users, 
  Calendar,
  Flame,
  Heart
} from 'lucide-react';

const INTENT_OPTIONS = [
  { id: 'meet_people', label: 'Meet people', icon: '🤝' },
  { id: 'make_friends', label: 'Make friends', icon: '🌱' },
  { id: 'do_something', label: 'Do something this week', icon: '⚡' },
  { id: 'regular_group', label: 'Find a regular group', icon: '🏠' },
  { id: 'create_something', label: 'Create something', icon: '🎭' },
  { id: 'learn_something', label: 'Learn something', icon: '💡' },
  { id: 'get_active', label: 'Get active', icon: '🏃' },
  { id: 'explore_jaipur', label: 'Explore Jaipur', icon: '🏰' },
];

const INTEREST_OPTIONS = [
  { id: 'Photography', label: 'Photography', image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=300&q=80' },
  { id: 'Filmmaking', label: 'Filmmaking', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=300&q=80' },
  { id: 'Music', label: 'Music & Jamming', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80' },
  { id: 'Art & Design', label: 'Art & Pottery', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=300&q=80' },
  { id: 'Sports & Fitness', label: 'Football & Sports', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=80' },
  { id: 'Running', label: 'Running & 5Ks', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=300&q=80' },
  { id: 'Books & Writing', label: 'Books & Writing', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=300&q=80' },
  { id: 'Food & Cooking', label: 'Food & Chai Cafes', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80' },
  { id: 'Travel & Heritage', label: 'Heritage & Walks', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=300&q=80' },
  { id: 'Tech & Startups', label: 'Tech & Startups', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80' },
];

const PEOPLE_PREFERENCES = [
  'Deep conversations',
  'Fun & playful',
  'Creative',
  'Adventurous',
  'Learning-focused',
  'Quiet companionship',
  'Active & sporty',
];

const JAIPUR_NEIGHBORHOODS: JaipurNeighborhood[] = [
  'C-Scheme',
  'Malviya Nagar',
  'Raja Park',
  'Vaishali Nagar',
  'MI Road / Pink City',
  'Jawahar Circle',
  'Tonk Road',
];

export const OnboardingFlow: React.FC = () => {
  const { currentUser, completeOnboarding, activities, joinActivity, setSelectedActivityDetail } = useHuman();

  const [step, setStep] = useState(1);
  const [selectedIntents, setSelectedIntents] = useState<string[]>(['meet_people', 'create_something']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Photography', 'Art & Design', 'Food & Cooking']);
  const [selectedPeoplePrefs, setSelectedPeoplePrefs] = useState<string[]>(['Deep conversations', 'Creative']);
  const [locationGranted, setLocationGranted] = useState(true);
  const [notificationsGranted, setNotificationsGranted] = useState(true);
  
  const [profileName, setProfileName] = useState(currentUser.name || 'Smile');
  const [profileBio, setProfileBio] = useState(currentUser.bio || 'I like conversations that last longer than the coffee.');
  const [profileNeighborhood, setProfileNeighborhood] = useState<JaipurNeighborhood>(currentUser.neighborhood || 'C-Scheme');

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter((i) => i !== item));
      }
    } else {
      setList([...list, item]);
    }
  };

  const handleFinishOnboarding = () => {
    completeOnboarding({
      name: profileName,
      bio: profileBio,
      neighborhood: profileNeighborhood,
      interests: selectedInterests,
      peoplePreferences: selectedPeoplePrefs,
    });
  };

  // 3 Curated recommendations for their neighborhood
  const recommendedActivities = activities
    .filter((a) => a.neighborhood === profileNeighborhood || a.neighborhood === 'C-Scheme')
    .slice(0, 3);

  return (
    <div className="flex-1 w-full bg-sand-50 flex flex-col justify-between p-6 animate-fade-in relative z-20 overflow-y-auto">
      
      {/* Step Indicator Progress Bar */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between text-[11px] font-semibold text-charcoal-500 mb-2">
          <span>Step {step} of 7</span>
          <span className="text-terracotta-600 font-bold">HUMAN Jaipur</span>
        </div>
        <div className="w-full h-1.5 bg-sand-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-terracotta-500 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Screen 1: Welcome */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-center text-left py-4">
          <div className="w-14 h-14 rounded-2xl bg-terracotta-100 flex items-center justify-center mb-6 text-terracotta-600 shadow-soft">
            <Heart className="w-7 h-7 fill-terracotta-500 stroke-terracotta-600" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600 mb-2">
            Starting in Jaipur
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-charcoal-900 leading-tight mb-4">
            Welcome to HUMAN.
          </h1>
          <p className="text-base text-charcoal-600 leading-relaxed mb-6">
            A place to find people, experiences, and communities that make life feel more alive.
          </p>
          <div className="p-4 rounded-2xl bg-sand-100 border border-sand-200 mb-6">
            <p className="text-xs text-charcoal-700 italic font-medium leading-relaxed">
              “Tap what you want to do. Find your people. Show up. HUMAN remembers the rest.”
            </p>
          </div>
          <p className="text-xs text-charcoal-500">
            No endless feeds. No vanity followers. Optimized for real-world participation.
          </p>
        </div>
      )}

      {/* Screen 2: What brings you here? */}
      {step === 2 && (
        <div className="flex-1 flex flex-col py-2">
          <h2 className="text-2xl font-bold tracking-tight text-charcoal-900 mb-2">
            What brings you here?
          </h2>
          <p className="text-xs text-charcoal-600 mb-5">
            Select whatever resonates with you right now in Jaipur.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 overflow-y-auto pr-1">
            {INTENT_OPTIONS.map((item) => {
              const isSelected = selectedIntents.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(selectedIntents, setSelectedIntents, item.id)}
                  className={`p-3.5 rounded-2xl text-left border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-terracotta-50 border-terracotta-500 shadow-soft text-charcoal-900'
                      : 'bg-white border-sand-200 text-charcoal-700 hover:border-sand-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-terracotta-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Screen 3: What are you into? */}
      {step === 3 && (
        <div className="flex-1 flex flex-col py-2">
          <h2 className="text-2xl font-bold tracking-tight text-charcoal-900 mb-2">
            What are you into?
          </h2>
          <p className="text-xs text-charcoal-600 mb-4">
            Pick activities you’d love to do with people in Jaipur.
          </p>
          <div className="grid grid-cols-2 gap-2.5 flex-1 overflow-y-auto pr-1">
            {INTEREST_OPTIONS.map((item) => {
              const isSelected = selectedInterests.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(selectedInterests, setSelectedInterests, item.id)}
                  className={`relative rounded-2xl overflow-hidden text-left h-24 p-2.5 flex flex-col justify-end transition-all border ${
                    isSelected
                      ? 'ring-2 ring-terracotta-500 border-terracotta-500 shadow-card'
                      : 'border-sand-200 hover:opacity-90'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="text-white text-xs font-bold leading-tight drop-shadow-sm">
                      {item.label}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-terracotta-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Screen 4: People style */}
      {step === 4 && (
        <div className="flex-1 flex flex-col py-2">
          <h2 className="text-2xl font-bold tracking-tight text-charcoal-900 mb-2">
            What kind of people do you enjoy?
          </h2>
          <p className="text-xs text-charcoal-600 mb-5">
            This helps us match conversational vibes and activity pace.
          </p>
          <div className="flex flex-wrap gap-2 flex-1 content-start">
            {PEOPLE_PREFERENCES.map((pref) => {
              const isSelected = selectedPeoplePrefs.includes(pref);
              return (
                <button
                  key={pref}
                  onClick={() => toggleItem(selectedPeoplePrefs, setSelectedPeoplePrefs, pref)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-terracotta-500 text-white border-terracotta-600 shadow-soft'
                      : 'bg-white text-charcoal-700 border-sand-200 hover:bg-sand-100'
                  }`}
                >
                  {pref}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Screen 5: Permissions */}
      {step === 5 && (
        <div className="flex-1 flex flex-col justify-center py-2 space-y-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-charcoal-900 mb-2">
              Permissions that respect you
            </h2>
            <p className="text-xs text-charcoal-600">
              No tracking, no battery drain, zero ads. Only what makes real-world meetups safe.
            </p>
          </div>

          {/* Location permission explanation */}
          <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900">Approximate Location</h4>
                  <span className="text-[11px] text-charcoal-500">Jaipur neighborhood level</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={locationGranted}
                onChange={(e) => setLocationGranted(e.target.checked)}
                className="w-4 h-4 accent-terracotta-500"
              />
            </div>
            <p className="text-[11px] text-charcoal-600 leading-relaxed pl-11">
              Used strictly to discover activities and compatible people in C-Scheme, Malviya Nagar, or your chosen area. Never shares your exact residence.
            </p>
          </div>

          {/* Notifications permission */}
          <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900">Activity Reminders</h4>
                  <span className="text-[11px] text-charcoal-500">Only critical coordination</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsGranted}
                onChange={(e) => setNotificationsGranted(e.target.checked)}
                className="w-4 h-4 accent-terracotta-500"
              />
            </div>
            <p className="text-[11px] text-charcoal-600 leading-relaxed pl-11">
              We never spam. You only get alerts about your joined activities, host meeting point updates, and safety checks.
            </p>
          </div>
        </div>
      )}

      {/* Screen 6: Create Profile */}
      {step === 6 && (
        <div className="flex-1 flex flex-col py-2 space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-charcoal-900 mb-1">
              Your Jaipur Profile
            </h2>
            <p className="text-xs text-charcoal-600">
              Keep it simple. You can always update this later.
            </p>
          </div>

          <div className="flex items-center gap-4 py-2">
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-terracotta-500 shadow-card"
            />
            <div className="flex-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-500 font-semibold"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
              Primary Neighborhood in Jaipur
            </label>
            <select
              value={profileNeighborhood}
              onChange={(e) => setProfileNeighborhood(e.target.value as JaipurNeighborhood)}
              className="w-full px-3 py-2 text-xs bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-500 font-semibold text-charcoal-800"
            >
              {JAIPUR_NEIGHBORHOODS.map((nh) => (
                <option key={nh} value={nh}>
                  {nh}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
              Short Bio
            </label>
            <textarea
              rows={3}
              value={profileBio}
              onChange={(e) => setProfileBio(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-charcoal-800"
              placeholder="What do you enjoy? What kind of conversations or things to do?"
            />
          </div>
        </div>
      )}

      {/* Screen 7: First 3 Recommendations */}
      {step === 7 && (
        <div className="flex-1 flex flex-col py-2">
          <div className="mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600">
              Ready for you in Jaipur
            </span>
            <h2 className="text-xl font-bold tracking-tight text-charcoal-900">
              First activities near {profileNeighborhood}
            </h2>
            <p className="text-xs text-charcoal-600">
              Pick one to attend in the next 48 hours to start your real-world journey.
            </p>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
            {recommendedActivities.map((act) => {
              const isJoined = act.isJoined;
              return (
                <div
                  key={act.id}
                  className="p-3 bg-white rounded-2xl border border-sand-200 shadow-soft flex items-center justify-between gap-3 hover:border-sand-300 transition-all"
                >
                  <img
                    src={act.coverImage}
                    alt={act.title}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-charcoal-900 truncate">
                      {act.title}
                    </h4>
                    <span className="text-[11px] text-terracotta-600 block">
                      {act.displayDate}
                    </span>
                    <span className="text-[10px] text-charcoal-500 block truncate">
                      {act.venueName} · {act.neighborhood}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (!isJoined) {
                        joinActivity(act.id);
                      }
                      setSelectedActivityDetail(act);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 ${
                      isJoined
                        ? 'bg-forest-50 text-forest-600 border border-forest-200'
                        : 'bg-terracotta-500 hover:bg-terracotta-600 text-white'
                    }`}
                  >
                    {isJoined ? "You're Going" : 'Join'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Action Button */}
      <div className="pt-4 flex items-center justify-between border-t border-sand-200/80 mt-2">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 px-3 py-2"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 7 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 bg-charcoal-900 hover:bg-charcoal-800 text-sand-50 px-5 py-2.5 rounded-full text-xs font-bold shadow-soft transition-transform active:scale-95"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleFinishOnboarding}
            className="flex items-center gap-2 bg-gradient-to-r from-terracotta-600 to-terracotta-500 hover:from-terracotta-700 hover:to-terracotta-600 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-card transition-transform active:scale-95"
          >
            <span>Step into Jaipur</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};
