import React, { useState } from 'react';
import { Activity } from '../../types';
import { useHuman } from '../../context/HumanContext';
import { 
  ArrowLeft, 
  MapPin, 
  Send, 
  Navigation, 
  Shield, 
  PhoneCall, 
  Clock, 
  Users, 
  AlertTriangle,
  Smile
} from 'lucide-react';

interface CoordinationSpaceProps {
  activity: Activity;
  onBack: () => void;
}

export const CoordinationSpace: React.FC<CoordinationSpaceProps> = ({ activity, onBack }) => {
  const { 
    currentUser, 
    messages, 
    sendMessage, 
    setIsSafetyCenterOpen, 
    showToast,
    submitSafetyReport
  } = useHuman();

  const threadId = `thread_${activity.id}`;
  const threadMessages = messages[threadId] || [
    {
      id: 'msg_welcome',
      threadId,
      senderId: activity.host.id,
      senderName: activity.host.name,
      senderAvatar: activity.host.avatar,
      content: `Welcome to the coordination group for ${activity.title}! We are meeting at ${activity.venueName}. Feel free to ask any questions here.`,
      timestamp: 'Yesterday',
      isHost: true,
    }
  ];

  const [inputContent, setInputContent] = useState('');
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;
    sendMessage(threadId, inputContent.trim());
    setInputContent('');
  };

  const getGoogleMapsDirections = () => {
    const [lat, lng] = activity.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(activity.venueName + ', ' + activity.neighborhood + ', Jaipur')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex-1 w-full h-full bg-sand-50 flex flex-col relative z-20 pb-safe animate-fade-in">
      
      {/* Header Bar */}
      <div className="glass-nav border-b border-sand-200/90 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-sand-200 text-charcoal-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-xs font-bold text-charcoal-900 line-clamp-1">
              {activity.title}
            </h2>
            <span className="text-[10px] text-terracotta-600 font-semibold block">
              Coordination Space · {activity.neighborhood}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowSafetyModal(true)}
          className="p-1.5 rounded-full bg-sand-100 hover:bg-forest-50 text-forest-600 border border-sand-200 transition-colors"
          title="Meeting Safety & Helplines"
        >
          <Shield className="w-4 h-4" />
        </button>
      </div>

      {/* Meeting Point Banner */}
      <div className="bg-white border-b border-sand-200 px-4 py-3 shadow-soft flex items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
              Meeting Point
            </div>
            <div className="text-xs font-bold text-charcoal-900 truncate">
              {activity.venueName}
            </div>
            <p className="text-[11px] text-charcoal-600 line-clamp-1">
              {activity.meetingPointDetails}
            </p>
          </div>
        </div>

        <button
          onClick={getGoogleMapsDirections}
          className="px-3 py-1.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-800 text-xs font-bold flex items-center gap-1 shrink-0 border border-sand-300 transition-colors"
        >
          <Navigation className="w-3 h-3 text-terracotta-600" />
          <span>Map</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        
        {/* Coordination Notice */}
        <div className="text-center py-2">
          <span className="px-3 py-1 rounded-full bg-sand-200/80 text-[10px] font-semibold text-charcoal-600 inline-block">
            Temporary group chat for confirmed attendees · Showing up together
          </span>
        </div>

        {threadMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover border border-sand-200 mb-0.5"
                />
              )}

              <div
                className={`max-w-[78%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-charcoal-900 text-white rounded-br-sm shadow-soft'
                    : 'bg-white text-charcoal-900 border border-sand-200 rounded-bl-sm shadow-soft'
                }`}
              >
                {!isMe && (
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-bold text-[10px] text-terracotta-600">
                      {msg.senderName}
                    </span>
                    {msg.isHost && (
                      <span className="px-1.5 py-0.2 rounded bg-terracotta-100 text-terracotta-700 text-[9px] font-bold">
                        Host
                      </span>
                    )}
                  </div>
                )}
                <p>{msg.content}</p>
                <span
                  className={`text-[9px] block text-right mt-1 ${
                    isMe ? 'text-charcoal-300' : 'text-charcoal-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-sand-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="Message coordination group..."
          className="flex-1 px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-charcoal-900"
        />
        <button
          type="submit"
          disabled={!inputContent.trim()}
          className="w-10 h-10 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-sand-300 text-white flex items-center justify-center transition-all shadow-soft"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

      {/* Safety & Emergency Modal for this Meetup */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-elevated border border-sand-200 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-forest-600">
                <Shield className="w-5 h-5" />
                <h3 className="text-sm font-bold text-charcoal-900">
                  Jaipur Meetup Safety
                </h3>
              </div>
              <button
                onClick={() => setShowSafetyModal(false)}
                className="text-xs text-charcoal-400 hover:text-charcoal-700"
              >
                Close
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-forest-50 border border-forest-200 text-xs text-forest-800 space-y-1">
              <span className="font-bold block">Public Meeting Checklist:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-forest-700">
                <li>Always meet at public venues (like {activity.venueName}).</li>
                <li>Stay with the group during the activity.</li>
                <li>Feel free to leave at any moment if uncomfortable.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <a
                href="tel:112"
                className="w-full py-2.5 px-4 rounded-xl bg-charcoal-900 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-charcoal-800 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-terracotta-400" />
                <span>Call Emergency Helpline (112)</span>
              </a>

              <a
                href="tel:1090"
                className="w-full py-2.5 px-4 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-900 text-xs font-bold flex items-center justify-center gap-2 border border-sand-300 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-forest-600" />
                <span>Jaipur Women Safety Helpline (1090)</span>
              </a>
            </div>

            <button
              onClick={() => {
                setShowSafetyModal(false);
                submitSafetyReport('activity', activity.title, 'Concern in meetup', 'Reported from coordination space');
              }}
              className="w-full text-center text-xs text-rose-600 hover:underline pt-1"
            >
              Report an issue with this activity
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
