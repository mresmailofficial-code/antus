import React from 'react';
import { Home, Compass, Plus, CalendarCheck, User } from 'lucide-react';
import { useHuman } from '../../context/HumanContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, activities, currentUser } = useHuman();

  const joinedCount = activities.filter((a) => a.isJoined).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass-nav border-t border-sand-200/90 pb-safe">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors py-1 px-2.5 rounded-xl ${
            activeTab === 'home' 
              ? 'text-terracotta-600 font-bold' 
              : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Tab 2: Explore */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 transition-colors py-1 px-2.5 rounded-xl ${
            activeTab === 'explore' 
              ? 'text-terracotta-600 font-bold' 
              : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Explore</span>
        </button>

        {/* Tab 3: Create (Elevated action button) */}
        <button
          onClick={() => setActiveTab('create')}
          className="relative -top-2 flex flex-col items-center group focus:outline-none"
          title="Create an Activity or Community"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-terracotta-600 to-terracotta-400 text-white flex items-center justify-center shadow-card group-hover:scale-105 group-active:scale-95 transition-all">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className={`text-[10px] font-semibold mt-0.5 ${
            activeTab === 'create' ? 'text-terracotta-600' : 'text-charcoal-500'
          }`}>
            Create
          </span>
        </button>

        {/* Tab 4: Plans */}
        <button
          onClick={() => setActiveTab('plans')}
          className={`relative flex flex-col items-center gap-1 transition-colors py-1 px-2.5 rounded-xl ${
            activeTab === 'plans' 
              ? 'text-terracotta-600 font-bold' 
              : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <div className="relative">
            <CalendarCheck className={`w-5 h-5 ${activeTab === 'plans' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {joinedCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-terracotta-500 text-white text-[9px] font-bold flex items-center justify-center">
                {joinedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Plans</span>
        </button>

        {/* Tab 5: You */}
        <button
          onClick={() => setActiveTab('you')}
          className={`flex flex-col items-center gap-1 transition-colors py-1 px-2.5 rounded-xl ${
            activeTab === 'you' 
              ? 'text-terracotta-600 font-bold' 
              : 'text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <div className="relative">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className={`w-5 h-5 rounded-full object-cover border ${
                activeTab === 'you' ? 'border-terracotta-500 ring-2 ring-terracotta-200' : 'border-sand-300'
              }`}
            />
          </div>
          <span className="text-[10px] tracking-tight">You</span>
        </button>

      </div>
    </nav>
  );
};
