import React, { useState } from 'react';
import { useHuman } from '../../context/HumanContext';
import { 
  CheckCircle2, 
  MapPin, 
  Shield, 
  Bookmark, 
  Users, 
  Camera, 
  Settings, 
  Plus, 
  Lock, 
  RotateCcw,
  Sparkles,
  Heart
} from 'lucide-react';

export const YouScreen: React.FC = () => {
  const { 
    currentUser, 
    memories, 
    savedItems, 
    communities, 
    resetOnboarding, 
    setIsSafetyCenterOpen,
    addMemory,
    showToast,
    toggleSaveItem
  } = useHuman();

  const [activeSubTab, setActiveSubTab] = useState<'memories' | 'saved' | 'communities' | 'trust'>('memories');
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);

  // New memory form states
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemStory, setNewMemStory] = useState('');
  const [newMemNeighborhood, setNewMemNeighborhood] = useState(currentUser.neighborhood);
  const [newMemPrivacy, setNewMemPrivacy] = useState<'only_me' | 'friends' | 'community' | 'public'>('friends');

  const myCommunities = communities.filter((c) => c.isMember);

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemTitle.trim()) return;

    addMemory({
      activityTitle: newMemTitle,
      neighborhood: newMemNeighborhood,
      dateString: 'September 2026',
      story: newMemStory || 'Spent a warm evening sharing real conversations in Jaipur.',
      photos: [
        'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
      ],
      participants: [
        { name: currentUser.name, avatar: currentUser.avatar }
      ],
      privacy: newMemPrivacy,
    });

    setNewMemTitle('');
    setNewMemStory('');
    setShowAddMemoryModal(false);
  };

  return (
    <div className="flex-1 w-full pb-28 px-4 pt-4 space-y-5 animate-fade-in">
      
      {/* Profile Header Card */}
      <div className="p-5 rounded-3xl bg-white border border-sand-200 shadow-soft space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-terracotta-500 shadow-card"
              />
              {currentUser.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-forest-500 text-white flex items-center justify-center border-2 border-white shadow-soft">
                  <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-extrabold text-charcoal-900 leading-tight">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                  {currentUser.reliabilityBadge}
                </span>
              </div>
              <span className="text-xs font-semibold text-charcoal-700 block">
                {currentUser.headline}
              </span>
              <span className="text-[11px] text-charcoal-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-terracotta-500" />
                <span>{currentUser.neighborhood}, {currentUser.city}</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-charcoal-600 leading-relaxed italic">
          "{currentUser.bio}"
        </p>

        {/* Real-World Trust Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sand-100 text-center">
          <div className="p-2 rounded-2xl bg-sand-50">
            <span className="text-sm font-extrabold text-charcoal-900 block">
              {currentUser.attendanceRate}%
            </span>
            <span className="text-[10px] text-charcoal-500 uppercase tracking-wider font-semibold">
              Attendance
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-sand-50">
            <span className="text-sm font-extrabold text-charcoal-900 block">
              {currentUser.completedActivitiesCount}
            </span>
            <span className="text-[10px] text-charcoal-500 uppercase tracking-wider font-semibold">
              Activities Met
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-sand-50">
            <span className="text-sm font-extrabold text-charcoal-900 block">
              {myCommunities.length}
            </span>
            <span className="text-[10px] text-charcoal-500 uppercase tracking-wider font-semibold">
              Communities
            </span>
          </div>
        </div>

        {/* Interests pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {currentUser.interests.map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-0.5 rounded-full bg-sand-100 text-[10px] font-semibold text-charcoal-700 border border-sand-200"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex items-center p-1 bg-sand-200/80 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('memories')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'memories' ? 'bg-white text-charcoal-900 shadow-soft' : 'text-charcoal-600'
          }`}
        >
          Memories ({memories.length})
        </button>
        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'saved' ? 'bg-white text-charcoal-900 shadow-soft' : 'text-charcoal-600'
          }`}
        >
          Saved ({savedItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('communities')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'communities' ? 'bg-white text-charcoal-900 shadow-soft' : 'text-charcoal-600'
          }`}
        >
          Communities ({myCommunities.length})
        </button>
      </div>

      {/* Sub-tab 1: Memories Timeline */}
      {activeSubTab === 'memories' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Your Life Happened in Jaipur</span>
            </h3>
            <button
              onClick={() => setShowAddMemoryModal(true)}
              className="text-xs font-bold text-terracotta-600 hover:text-terracotta-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Memory</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="p-4 rounded-3xl bg-white border border-sand-200 shadow-soft space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider">
                    {mem.neighborhood} · {mem.dateString}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-charcoal-400 bg-sand-50 px-2 py-0.5 rounded-full border border-sand-200">
                    <Lock className="w-2.5 h-2.5" />
                    <span className="capitalize">{mem.privacy}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-charcoal-900">
                  {mem.activityTitle}
                </h3>

                <p className="text-xs text-charcoal-600 leading-relaxed">
                  "{mem.story}"
                </p>

                {/* Photo Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {mem.photos.map((pic, idx) => (
                    <img
                      key={idx}
                      src={pic}
                      alt="Memory artifact"
                      className="w-full h-20 rounded-xl object-cover border border-sand-200"
                    />
                  ))}
                </div>

                {/* People met */}
                <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs text-charcoal-500">
                  <div className="flex items-center -space-x-1.5">
                    {mem.participants.map((p, idx) => (
                      <img
                        key={idx}
                        src={p.avatar}
                        alt={p.name}
                        title={p.name}
                        className="w-6 h-6 rounded-full object-cover border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="text-[11px]">
                    {mem.participants.length} people connected
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Saved Items */}
      {activeSubTab === 'saved' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Saved for Later
            </h3>
            <span className="text-xs font-semibold text-charcoal-500">
              {savedItems.length} items
            </span>
          </div>

          {savedItems.length > 0 ? (
            <div className="space-y-2">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-2xl border border-sand-200 shadow-soft flex items-center justify-between gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-charcoal-900 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-charcoal-500 block truncate">
                      {item.subtitle}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSaveItem(item.type, item.itemId, item.title, item.subtitle, item.image)}
                    className="text-xs font-semibold text-rose-600 hover:underline shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-3xl border border-sand-200">
              <Bookmark className="w-6 h-6 text-charcoal-300 mx-auto mb-2" />
              <p className="text-xs text-charcoal-500">
                You haven't saved any activities or communities yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 3: Communities */}
      {activeSubTab === 'communities' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Communities You Belong To
            </h3>
          </div>

          <div className="space-y-2">
            {myCommunities.map((comm) => (
              <div
                key={comm.id}
                className="p-3 bg-white rounded-2xl border border-sand-200 shadow-soft flex items-center justify-between gap-3"
              >
                <img
                  src={comm.coverImage}
                  alt={comm.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-charcoal-900 truncate">
                    {comm.name}
                  </h4>
                  <span className="text-[11px] text-charcoal-500 block truncate">
                    {comm.memberCount} members · {comm.category}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-forest-600 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200">
                  Member
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety & App Settings */}
      <div className="pt-2 space-y-2">
        <button
          onClick={() => setIsSafetyCenterOpen(true)}
          className="w-full p-3.5 bg-white rounded-2xl border border-sand-200 flex items-center justify-between text-xs font-bold text-charcoal-800 hover:bg-sand-50 transition-colors shadow-soft"
        >
          <div className="flex items-center gap-2 text-forest-700">
            <Shield className="w-4 h-4 text-forest-600" />
            <span>Safety Center & Emergency Numbers</span>
          </div>
          <span className="text-charcoal-400">→</span>
        </button>

        <button
          onClick={() => {
            resetOnboarding();
            showToast('Onboarding Reset', 'You can re-experience the Jaipur onboarding flow.');
          }}
          className="w-full p-3.5 bg-sand-100 hover:bg-sand-200 rounded-2xl border border-sand-200 flex items-center justify-between text-xs font-bold text-charcoal-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-terracotta-600" />
            <span>Replay Jaipur Onboarding Tour</span>
          </div>
          <span className="text-charcoal-400">↺</span>
        </button>
      </div>

      {/* Create Memory Modal */}
      {showAddMemoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-md animate-fade-in">
          <form onSubmit={handleCreateMemory} className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-elevated border border-sand-200 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal-900">
                You made a memory
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMemoryModal(false)}
                className="text-xs text-charcoal-400 hover:text-charcoal-700"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                Experience Title *
              </label>
              <input
                type="text"
                required
                value={newMemTitle}
                onChange={(e) => setNewMemTitle(e.target.value)}
                placeholder="e.g. Evening tea & film talk at Stepout"
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none font-bold text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                Story / Reflection
              </label>
              <textarea
                rows={3}
                value={newMemStory}
                onChange={(e) => setNewMemStory(e.target.value)}
                placeholder="What made this meetup feel human? What did you talk about?"
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none text-charcoal-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                Privacy
              </label>
              <select
                value={newMemPrivacy}
                onChange={(e) => setNewMemPrivacy(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none font-semibold text-charcoal-800"
              >
                <option value="only_me">Only Me (Private Journal)</option>
                <option value="friends">Selected Friends</option>
                <option value="community">Community Only</option>
                <option value="public">Public</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-soft transition-colors"
            >
              Save Memory
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
