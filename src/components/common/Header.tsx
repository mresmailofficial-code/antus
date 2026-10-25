import React, { useState } from 'react';
import { MapPin, Shield, ChevronDown, Bell, Sparkles } from 'lucide-react';
import { useHuman } from '../../context/HumanContext';
import { JaipurNeighborhood } from '../../types';

const NEIGHBORHOODS: (JaipurNeighborhood | 'All')[] = [
  'All',
  'C-Scheme',
  'Malviya Nagar',
  'Raja Park',
  'Vaishali Nagar',
  'MI Road / Pink City',
  'Jawahar Circle',
  'Tonk Road',
];

export const Header: React.FC = () => {
  const { 
    selectedNeighborhood, 
    setSelectedNeighborhood, 
    setIsSafetyCenterOpen,
    viewMode,
    setViewMode,
    isAdminMode,
    setIsAdminMode,
    showToast
  } = useHuman();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-nav border-b border-sand-200/80 px-4 py-3">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-terracotta-500 animate-pulse-subtle" />
            <span className="font-extrabold text-xl tracking-tight text-charcoal-900">
              HUMAN
            </span>
          </div>

          {/* Jaipur Neighborhood Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand-100 hover:bg-sand-200 text-charcoal-700 text-xs font-semibold border border-sand-300 transition-colors"
              title="Change Jaipur Neighborhood"
            >
              <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
              <span>
                Jaipur · {selectedNeighborhood === 'All' ? 'All Areas' : selectedNeighborhood}
              </span>
              <ChevronDown className="w-3 h-3 text-charcoal-500" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-sand-200 py-2 z-50 animate-slide-up">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                    Jaipur Neighborhoods
                  </div>
                  {NEIGHBORHOODS.map((nh) => (
                    <button
                      key={nh}
                      onClick={() => {
                        setSelectedNeighborhood(nh);
                        setIsDropdownOpen(false);
                        showToast(
                          nh === 'All' ? 'Showing All Jaipur' : `Filtered to ${nh}`,
                          `Discovering experiences in ${nh}`
                        );
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-sand-100 transition-colors ${
                        selectedNeighborhood === nh
                          ? 'text-terracotta-600 font-bold bg-terracotta-50'
                          : 'text-charcoal-700'
                      }`}
                    >
                      <span>{nh === 'All' ? 'All of Jaipur' : nh}</span>
                      {selectedNeighborhood === nh && (
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Actions: Safety, Admin Switcher & View Mode */}
        <div className="flex items-center gap-2">
          {/* Safety Center Quick Action */}
          <button
            onClick={() => setIsSafetyCenterOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-charcoal-700 bg-sand-100 hover:bg-forest-50 hover:text-forest-600 border border-sand-200 transition-colors"
            title="Open Safety Center (Jaipur Helplines & Tips)"
          >
            <Shield className="w-3.5 h-3.5 text-forest-500" />
            <span className="hidden sm:inline">Safety</span>
          </button>

          {/* Admin Operations Toggle */}
          <button
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              showToast(
                !isAdminMode ? 'Admin Portal Enabled' : 'Returned to User View',
                !isAdminMode ? 'Viewing Jaipur city operations & moderation' : 'Browsing HUMAN as user'
              );
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
              isAdminMode 
                ? 'bg-charcoal-900 text-sand-50 border-charcoal-800' 
                : 'bg-sand-100 text-charcoal-600 border-sand-200 hover:bg-sand-200'
            }`}
            title="Toggle Admin Operations Portal"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isAdminMode ? 'Exit Admin' : 'Admin'}</span>
          </button>

          {/* Viewport Frame Switcher (iPhone / Android / Responsive Web) */}
          <div className="hidden md:flex items-center bg-sand-100 p-0.5 rounded-full border border-sand-200 text-[11px] font-medium text-charcoal-600">
            <button
              onClick={() => setViewMode('iphone')}
              className={`px-2 py-1 rounded-full transition-all ${
                viewMode === 'iphone' ? 'bg-white shadow-soft text-charcoal-900 font-bold' : 'hover:text-charcoal-900'
              }`}
            >
              iPhone
            </button>
            <button
              onClick={() => setViewMode('android')}
              className={`px-2 py-1 rounded-full transition-all ${
                viewMode === 'android' ? 'bg-white shadow-soft text-charcoal-900 font-bold' : 'hover:text-charcoal-900'
              }`}
            >
              Android
            </button>
            <button
              onClick={() => setViewMode('web')}
              className={`px-2 py-1 rounded-full transition-all ${
                viewMode === 'web' ? 'bg-white shadow-soft text-charcoal-900 font-bold' : 'hover:text-charcoal-900'
              }`}
            >
              Web
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
