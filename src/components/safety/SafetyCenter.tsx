import React, { useState } from 'react';
import { useHuman } from '../../context/HumanContext';
import { 
  X, 
  Shield, 
  PhoneCall, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Eye, 
  Share2 
} from 'lucide-react';

export const SafetyCenter: React.FC = () => {
  const { isSafetyCenterOpen, setIsSafetyCenterOpen, currentUser, safetyReports, submitSafetyReport, showToast } = useHuman();

  const [activeTab, setActiveTab] = useState<'helplines' | 'tips' | 'privacy' | 'report'>('helplines');
  
  // Report form
  const [reportTargetType, setReportTargetType] = useState<'user' | 'activity' | 'community'>('user');
  const [reportTargetTitle, setReportTargetTitle] = useState('');
  const [reportReason, setReportReason] = useState('Harassment');
  const [reportDetails, setReportDetails] = useState('');

  if (!isSafetyCenterOpen) return null;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTargetTitle.trim() || !reportDetails.trim()) return;
    submitSafetyReport(reportTargetType, reportTargetTitle, reportReason, reportDetails);
    setReportTargetTitle('');
    setReportDetails('');
    setActiveTab('helplines');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-charcoal-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md h-full sm:h-auto sm:max-h-[85vh] bg-white sm:rounded-3xl shadow-elevated border border-sand-200 overflow-hidden flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-sand-200 flex items-center justify-between bg-sand-50">
          <div className="flex items-center gap-2 text-forest-700">
            <Shield className="w-5 h-5" />
            <h2 className="text-base font-extrabold text-charcoal-900 tracking-tight">
              Safety Center & Trust
            </h2>
          </div>
          <button
            onClick={() => setIsSafetyCenterOpen(false)}
            className="w-8 h-8 rounded-full bg-sand-200 hover:bg-sand-300 flex items-center justify-center text-charcoal-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-sand-200 px-4 pt-2 bg-sand-50/50 gap-2">
          <button
            onClick={() => setActiveTab('helplines')}
            className={`pb-2 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'helplines'
                ? 'border-terracotta-500 text-terracotta-600'
                : 'border-transparent text-charcoal-500'
            }`}
          >
            Helplines
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`pb-2 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'tips'
                ? 'border-terracotta-500 text-terracotta-600'
                : 'border-transparent text-charcoal-500'
            }`}
          >
            Meetup Rules
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'privacy'
                ? 'border-terracotta-500 text-terracotta-600'
                : 'border-transparent text-charcoal-500'
            }`}
          >
            Location Privacy
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`pb-2 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'report'
                ? 'border-terracotta-500 text-terracotta-600'
                : 'border-transparent text-charcoal-500'
            }`}
          >
            Report
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 no-scrollbar">
          
          {/* Tab 1: Emergency Helplines */}
          {activeTab === 'helplines' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-forest-50 border border-forest-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  <span className="text-xs font-bold text-forest-900">
                    Your Safety Verification
                  </span>
                </div>
                <p className="text-[11px] text-forest-700 leading-relaxed">
                  Status: <strong>Verified Jaipur Resident</strong> · {currentUser.attendanceRate}% Attendance Reliability.
                </p>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block pt-1">
                Official Jaipur Emergency Numbers
              </span>

              {/* National Emergency 112 */}
              <a
                href="tel:112"
                className="p-3.5 rounded-2xl bg-white border border-sand-200 shadow-soft hover:bg-sand-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center font-extrabold text-sm">
                    112
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal-900">
                      National Emergency (India)
                    </h4>
                    <span className="text-[11px] text-charcoal-500">
                      All-in-one Police, Fire & Medical
                    </span>
                  </div>
                </div>
                <PhoneCall className="w-4 h-4 text-terracotta-500 group-hover:scale-110 transition-transform" />
              </a>

              {/* Jaipur Women Helpline 1090 */}
              <a
                href="tel:1090"
                className="p-3.5 rounded-2xl bg-white border border-sand-200 shadow-soft hover:bg-sand-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-extrabold text-sm">
                    1090
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal-900">
                      Jaipur Women Safety Helpline
                    </h4>
                    <span className="text-[11px] text-charcoal-500">
                      Dedicated Rajasthan police cell
                    </span>
                  </div>
                </div>
                <PhoneCall className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              </a>

              {/* Ambulance 108 */}
              <a
                href="tel:108"
                className="p-3.5 rounded-2xl bg-white border border-sand-200 shadow-soft hover:bg-sand-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-sm">
                    108
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal-900">
                      Ambulance Emergency
                    </h4>
                    <span className="text-[11px] text-charcoal-500">
                      Medical response in Jaipur
                    </span>
                  </div>
                </div>
                <PhoneCall className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          )}

          {/* Tab 2: Meetup Safety Rules */}
          {activeTab === 'tips' && (
            <div className="space-y-3 text-xs text-charcoal-700 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-sand-100 border border-sand-200 space-y-2">
                <h4 className="font-bold text-charcoal-900">4 Core Meetup Principles</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-terracotta-600">1.</span>
                    <span><strong>Meet in Public:</strong> Every HUMAN activity is anchored at licensed cafes, parks (like Central Park & Jawahar Circle), or verified studios. Never in private homes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-terracotta-600">2.</span>
                    <span><strong>Daylight & Group Focus:</strong> Most activities occur in morning or evening hours with confirmed group circles of 4 to 12 participants.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-terracotta-600">3.</span>
                    <span><strong>Tell a Friend:</strong> Tap "Share Activity" to let a friend or family member know what activity and neighborhood you are attending.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-terracotta-600">4.</span>
                    <span><strong>Freedom to Leave:</strong> You are always free to leave any gathering whenever you wish. Zero obligation.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Location Privacy */}
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-2">
                <div className="flex items-center gap-2 text-charcoal-900 font-bold text-xs">
                  <MapPin className="w-4 h-4 text-terracotta-500" />
                  <span>Strict Neighborhood-Level Resolution</span>
                </div>
                <p className="text-[11px] text-charcoal-600 leading-relaxed">
                  HUMAN never accesses or stores your exact home address. All recommendations and discovery use approximate centers of Jaipur neighborhoods (e.g. C-Scheme or Malviya Nagar).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-2">
                <div className="flex items-center gap-2 text-charcoal-900 font-bold text-xs">
                  <Eye className="w-4 h-4 text-terracotta-500" />
                  <span>Profile Discoverability</span>
                </div>
                <p className="text-[11px] text-charcoal-600 leading-relaxed">
                  Only verified members who join activities in Jaipur can view your shared interests.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Report an Incident */}
          {activeTab === 'report' && (
            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                  Report Type
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['user', 'activity', 'community'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setReportTargetType(type)}
                      className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                        reportTargetType === type
                          ? 'bg-charcoal-900 text-white border-charcoal-900'
                          : 'bg-sand-100 text-charcoal-700 border-sand-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                  Name / Title of Target *
                </label>
                <input
                  type="text"
                  required
                  value={reportTargetTitle}
                  onChange={(e) => setReportTargetTitle(e.target.value)}
                  placeholder="e.g. Activity name or person's name"
                  className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none font-semibold text-charcoal-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                  Reason
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none font-semibold text-charcoal-800"
                >
                  <option value="Harassment">Harassment or disrespect</option>
                  <option value="Spam">Spam or commercial promotion</option>
                  <option value="Fake identity">Fake identity</option>
                  <option value="Unsafe behavior">Unsafe or inappropriate behavior</option>
                  <option value="Fraud">Fraud or payment dispute</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                  What happened? *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide concise details for our Jaipur moderation team..."
                  className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 rounded-xl focus:outline-none text-charcoal-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-soft"
              >
                Submit Confidential Report
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
