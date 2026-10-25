import React from 'react';
import { Activity } from '../../types';
import { useHuman } from '../../context/HumanContext';
import { Check, X, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface ProofOfPresenceModalProps {
  activity: Activity;
  onClose: () => void;
}

export const ProofOfPresenceModal: React.FC<ProofOfPresenceModalProps> = ({ activity, onClose }) => {
  const { confirmAttendance } = useHuman();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-elevated border border-sand-200 text-center animate-slide-up">
        
        <div className="w-14 h-14 rounded-2xl bg-forest-50 text-forest-600 mx-auto flex items-center justify-center shadow-soft">
          <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest-600 block mb-1">
            Proof of Presence
          </span>
          <h3 className="text-xl font-extrabold text-charcoal-900 tracking-tight">
            Did you make it?
          </h3>
          <p className="text-xs text-charcoal-500 mt-1">
            {activity.title} at {activity.venueName}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 text-left space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-800">
            <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
            <span>{activity.neighborhood}, Jaipur</span>
          </div>
          <p className="text-[11px] text-charcoal-600 leading-relaxed">
            Lightweight private confirmation. Builds your real-world reputation score and unlocks automatic memories. Never shared publicly.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => confirmAttendance(activity.id, false)}
            className="flex-1 py-3 rounded-full bg-sand-100 hover:bg-sand-200 text-charcoal-700 text-xs font-bold transition-colors"
          >
            I Couldn't Go
          </button>

          <button
            onClick={() => confirmAttendance(activity.id, true)}
            className="flex-1 py-3 rounded-full bg-forest-600 hover:bg-forest-700 text-white text-xs font-extrabold shadow-card transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Yes, I was there</span>
          </button>
        </div>

      </div>
    </div>
  );
};
