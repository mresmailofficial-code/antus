import React, { useState } from 'react';
import { useHuman } from '../../context/HumanContext';
import { 
  Users, 
  Activity as ActivityIcon, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { activities, safetyReports, resolveSafetyReport, communities, showToast } = useHuman();

  const [activeTab, setActiveTab] = useState<'metrics' | 'reports' | 'verification' | 'neighborhoods'>('metrics');

  const [verificationQueue, setVerificationQueue] = useState([
    {
      id: 'ver_1',
      name: 'Kabir Mehta',
      neighborhood: 'C-Scheme',
      type: 'Aadhaar / Government ID',
      role: 'Jaipur Photographers Lead',
      status: 'verified',
    },
    {
      id: 'ver_2',
      name: 'Ananya Sharma',
      neighborhood: 'Malviya Nagar',
      type: 'MNIT University Student ID',
      role: 'Jaipur Run Club Pacer',
      status: 'verified',
    },
    {
      id: 'ver_3',
      name: 'Priya Rathore',
      neighborhood: 'Vaishali Nagar',
      type: 'Studio Registration & PAN',
      role: 'Ceramics Host',
      status: 'pending',
    },
  ]);

  const handleApproveVerification = (id: string) => {
    setVerificationQueue((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'verified' } : v))
    );
    showToast('Verification Approved', 'Issued Trusted Host badge to user.', 'success');
  };

  const handleRejectVerification = (id: string) => {
    setVerificationQueue((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'rejected' } : v))
    );
    showToast('Verification Dismissed', 'User notified of document re-upload requirement.');
  };

  return (
    <div className="flex-1 w-full pb-28 px-4 pt-4 space-y-5 animate-fade-in">
      
      {/* Header */}
      <div className="p-4 rounded-3xl bg-charcoal-900 text-sand-50 space-y-1 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Jaipur Operations Console</span>
          </span>
          <span className="text-[10px] font-semibold bg-charcoal-800 px-2 py-0.5 rounded-full text-emerald-400">
            Live System
          </span>
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">
          City Operations & Trust
        </h1>
        <p className="text-xs text-charcoal-400">
          Monitoring real-world participation, moderation, and verification for Jaipur launch.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1 bg-sand-200/80 rounded-2xl">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'metrics' ? 'bg-white text-charcoal-900 shadow-soft' : 'text-charcoal-600'
          }`}
        >
          Metrics
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reports' ? 'bg-white text-charcoal-900 shadow-soft' : 'text-charcoal-600'
          }`}
        >
          Reports ({safetyReports.length})
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'verification' ? 'bg-white text-charcoal-900 shadow-soft' : 'text-charcoal-600'
          }`}
        >
          Verification
        </button>
        <button
          onClick={() => setActiveTab('neighborhoods')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'neighborhoods' ? 'bg-white text-charcoal-900 shadow-soft' : 'text-charcoal-600'
          }`}
        >
          Neighborhoods
        </button>
      </div>

      {/* Tab 1: Real-World Metrics */}
      {activeTab === 'metrics' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-4 bg-white rounded-3xl border border-sand-200 shadow-soft">
              <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-forest-500" />
                <span>Intent-to-Completion</span>
              </div>
              <span className="text-2xl font-extrabold text-charcoal-900 block">
                74.2%
              </span>
              <span className="text-[10px] text-forest-600 font-medium">
                +12% above goal (Target: 60%)
              </span>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-sand-200 shadow-soft">
              <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-semibold mb-1">
                <Users className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Active Jaipur Locals</span>
              </div>
              <span className="text-2xl font-extrabold text-charcoal-900 block">
                3,420
              </span>
              <span className="text-[10px] text-charcoal-500 font-medium">
                Across 5 key neighborhoods
              </span>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-sand-200 shadow-soft">
              <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-semibold mb-1">
                <ActivityIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>Live Activities</span>
              </div>
              <span className="text-2xl font-extrabold text-charcoal-900 block">
                {activities.length}
              </span>
              <span className="text-[10px] text-charcoal-500 font-medium">
                8 active categories
              </span>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-sand-200 shadow-soft">
              <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                <span>Presence Confirmations</span>
              </div>
              <span className="text-2xl font-extrabold text-charcoal-900 block">
                96.4%
              </span>
              <span className="text-[10px] text-forest-600 font-medium">
                Low no-show rate (&lt; 4%)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-sand-100 border border-sand-200">
            <h4 className="text-xs font-bold text-charcoal-900 mb-1">
              Guiding Principle
            </h4>
            <p className="text-[11px] text-charcoal-600 leading-relaxed italic">
              "HUMAN is not trying to win the screen-time war. HUMAN is trying to help people leave the screen and live."
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Reports Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 px-1">
            Safety & Moderation Audit Queue
          </span>

          {safetyReports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 bg-white rounded-3xl border border-sand-200 shadow-soft space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {rep.reason}
                </span>
                <span className="text-[10px] text-charcoal-400">
                  {rep.timestamp}
                </span>
              </div>

              <h4 className="text-xs font-bold text-charcoal-900">
                Target: {rep.targetTitle} ({rep.targetType})
              </h4>

              <p className="text-xs text-charcoal-600 leading-relaxed">
                "{rep.details}"
              </p>

              <div className="pt-2 border-t border-sand-100 flex items-center justify-between">
                <span className="text-[11px] text-charcoal-500">
                  Reported by {rep.reporterName}
                </span>

                {rep.status === 'pending' ? (
                  <button
                    onClick={() => resolveSafetyReport(rep.id)}
                    className="px-3 py-1 rounded-full bg-forest-600 text-white text-xs font-bold hover:bg-forest-700 transition-colors shadow-soft"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-forest-600">
                    ✓ Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Verification Review */}
      {activeTab === 'verification' && (
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 px-1">
            Host & Organizer Identity Review
          </span>

          {verificationQueue.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-3xl border border-sand-200 shadow-soft flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-charcoal-900">
                    {item.name}
                  </h4>
                  {item.status === 'verified' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                  )}
                </div>
                <span className="text-[11px] text-charcoal-600 block">
                  {item.role} · {item.neighborhood}
                </span>
                <span className="text-[10px] text-charcoal-400 block font-mono">
                  Document: {item.type}
                </span>
              </div>

              {item.status === 'pending' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleApproveVerification(item.id)}
                    className="p-2 rounded-full bg-forest-50 hover:bg-forest-100 text-forest-700 transition-colors"
                    title="Approve"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => handleRejectVerification(item.id)}
                    className="p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                    title="Reject"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] font-bold text-forest-600 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200">
                  Verified
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Neighborhood Density Breakdown */}
      {activeTab === 'neighborhoods' && (
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 px-1">
            Jaipur Neighborhood Cluster Density
          </span>

          <div className="space-y-2">
            {[
              { name: 'C-Scheme', activities: 4, communities: 3, density: 'High', vibe: 'Upscale Cafés & Creatives' },
              { name: 'Malviya Nagar', activities: 2, communities: 2, density: 'High', vibe: 'Students, Tech & Sports' },
              { name: 'Raja Park', activities: 2, communities: 1, density: 'Medium', vibe: 'Study Spots, Books & Music' },
              { name: 'Vaishali Nagar', activities: 1, communities: 1, density: 'Medium', vibe: 'Studios & Workshops' },
              { name: 'MI Road / Pink City', activities: 2, communities: 2, density: 'High', vibe: 'Heritage & Co-working' },
              { name: 'Jawahar Circle', activities: 1, communities: 1, density: 'Medium', vibe: 'Running & Open Gardens' },
            ].map((nh) => (
              <div
                key={nh.name}
                className="p-3.5 bg-white rounded-2xl border border-sand-200 shadow-soft flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900">
                    {nh.name}
                  </h4>
                  <span className="text-[11px] text-charcoal-500">
                    {nh.vibe}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-terracotta-600 block">
                    {nh.activities} Activities
                  </span>
                  <span className="text-[10px] text-charcoal-400 font-semibold">
                    Density: {nh.density}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
