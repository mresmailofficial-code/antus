import React from 'react';
import { useHuman } from '../../context/HumanContext';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const { viewMode } = useHuman();

  // If viewing in responsive full web mode, render cleanly edge-to-edge
  if (viewMode === 'web') {
    return (
      <div className="min-h-screen w-full bg-sand-50 text-charcoal-900 flex flex-col items-center">
        <div className="w-full max-w-2xl min-h-screen bg-sand-50 flex flex-col relative pb-20 shadow-sm border-x border-sand-200">
          {children}
        </div>
      </div>
    );
  }

  // Otherwise, render within the iPhone or Android device frame on desktop
  return (
    <div className="min-h-screen w-full bg-charcoal-950/95 py-6 px-4 flex flex-col items-center justify-center">
      {/* Device Bezel */}
      <div className={`relative w-full max-w-[420px] h-[860px] bg-charcoal-900 rounded-[52px] p-3 shadow-elevated border-4 ${
        viewMode === 'iphone' ? 'border-charcoal-700' : 'border-charcoal-800'
      } flex flex-col overflow-hidden ring-1 ring-white/10`}>
        
        {/* Hardware Notch / Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
          {viewMode === 'iphone' ? (
            <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-charcoal-950 ring-1 ring-charcoal-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-950/60" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-charcoal-800" />
          )}
        </div>

        {/* Status Bar */}
        <div className="w-full h-8 px-6 pt-1 flex items-center justify-between text-[11px] font-semibold text-charcoal-800 bg-sand-50 rounded-t-[42px] z-30 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-charcoal-700">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 fill-charcoal-700" />
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 w-full bg-sand-50 overflow-y-auto relative no-scrollbar flex flex-col">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="w-full h-5 bg-sand-50 flex items-center justify-center rounded-b-[42px] z-30">
          <div className="w-32 h-1 bg-charcoal-300 rounded-full" />
        </div>

      </div>
    </div>
  );
};
