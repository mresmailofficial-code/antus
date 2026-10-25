import React from 'react';
import { Activity } from '../../types';
import { useHuman } from '../../context/HumanContext';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Shield, 
  Navigation, 
  Download, 
  MessageSquare, 
  Share2, 
  Bookmark,
  AlertCircle
} from 'lucide-react';

interface ActivityDetailModalProps {
  activity: Activity;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ activity, onClose }) => {
  const { 
    joinActivity, 
    leaveActivity, 
    setActiveCoordinationActivity, 
    isItemSaved, 
    toggleSaveItem,
    showToast 
  } = useHuman();

  const isSaved = isItemSaved(activity.id);
  const spotsLeft = activity.capacity - activity.participantIds.length;

  // Generate .ics calendar download
  const downloadCalendarEvent = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HUMAN Jaipur//Activity//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${activity.title}`,
      `DESCRIPTION:${activity.description.replace(/\n/g, ' ')}`,
      `LOCATION:${activity.venueName}, ${activity.neighborhood}, Jaipur`,
      `DTSTART:${new Date(activity.startTime).toISOString().replace(/-|:|\.\d+/g, '')}`,
      `DTEND:${new Date(new Date(activity.startTime).getTime() + activity.durationMinutes * 60000).toISOString().replace(/-|:|\.\d+/g, '')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activity.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Calendar Exported', 'Activity added to your calendar file.', 'success');
  };

  const getGoogleMapsDirections = () => {
    const [lat, lng] = activity.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(activity.venueName + ', ' + activity.neighborhood + ', Jaipur')}`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: `Join me for "${activity.title}" in ${activity.neighborhood}, Jaipur on HUMAN!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Share this Jaipur activity with your friends.', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] bg-sand-50 sm:rounded-3xl shadow-elevated border border-sand-200 overflow-hidden flex flex-col z-10 animate-slide-up">
        
        {/* Top Header Floating Actions */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal-900 shadow-soft hover:bg-white transition-colors pointer-events-auto"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => toggleSaveItem('activity', activity.id, activity.title, activity.venueName, activity.coverImage)}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal-900 shadow-soft hover:bg-white transition-colors"
              title="Save activity"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal-900 shadow-soft hover:bg-white transition-colors"
              title="Share activity"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          
          {/* Hero Photography */}
          <div className="relative h-64 w-full">
            <img
              src={activity.coverImage}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-terracotta-500 text-white text-[11px] font-bold">
                  {activity.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium">
                  {activity.experienceLevel}
                </span>
                <span className="ml-auto px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                  {activity.isPaid ? `₹${activity.priceINR}` : 'Free Activity'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
                {activity.title}
              </h1>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-5 space-y-5">
            
            {/* Host Section */}
            <div className="p-3.5 rounded-2xl bg-white border border-sand-200 shadow-soft flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activity.host.avatar}
                  alt={activity.host.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-sand-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-charcoal-900">
                      Hosted by {activity.host.name}
                    </span>
                    {activity.host.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                    )}
                  </div>
                  <span className="text-[11px] text-charcoal-500 block">
                    {activity.host.headline || activity.host.reliabilityBadge}
                  </span>
                  <span className="text-[10px] text-forest-600 font-semibold block">
                    {activity.host.attendanceRate}% Attendance Reliability
                  </span>
                </div>
              </div>
            </div>

            {/* Time & Meeting Location */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-white rounded-2xl border border-sand-200 shadow-soft">
                <div className="flex items-center gap-2 text-terracotta-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">When</span>
                </div>
                <h4 className="text-xs font-bold text-charcoal-900">
                  {activity.displayDate}
                </h4>
                <span className="text-[11px] text-charcoal-500 block mt-0.5">
                  {activity.durationMinutes} Minutes
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-sand-200 shadow-soft">
                <div className="flex items-center gap-2 text-terracotta-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Where</span>
                </div>
                <h4 className="text-xs font-bold text-charcoal-900 truncate">
                  {activity.venueName}
                </h4>
                <span className="text-[11px] text-charcoal-500 block truncate mt-0.5">
                  {activity.neighborhood}, Jaipur
                </span>
              </div>
            </div>

            {/* If Joined: "YOU'RE GOING" highlight card */}
            {activity.isJoined && (
              <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-forest-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-forest-600" />
                    <span className="text-sm font-extrabold text-forest-800">
                      YOU'RE GOING
                    </span>
                  </div>
                  <span className="text-xs font-bold text-forest-700 bg-forest-100 px-2.5 py-0.5 rounded-full">
                    Confirmed
                  </span>
                </div>

                <p className="text-xs text-forest-700 leading-relaxed">
                  Meeting Point: <strong className="text-forest-900">{activity.meetingPointDetails}</strong>
                </p>

                {/* Quick actions for attendee */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      setActiveCoordinationActivity(activity);
                    }}
                    className="py-2 px-3 rounded-xl bg-forest-600 text-white text-xs font-bold shadow-soft flex items-center justify-center gap-1.5 hover:bg-forest-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enter Group Chat</span>
                  </button>

                  <button
                    onClick={getGoogleMapsDirections}
                    className="py-2 px-3 rounded-xl bg-white border border-forest-300 text-forest-800 text-xs font-bold shadow-soft flex items-center justify-center gap-1.5 hover:bg-forest-50 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-forest-600" />
                    <span>Get Directions</span>
                  </button>
                </div>

                <button
                  onClick={downloadCalendarEvent}
                  className="w-full py-1.5 text-xs text-forest-700 hover:text-forest-900 flex items-center justify-center gap-1 font-semibold"
                >
                  <Download className="w-3 h-3" />
                  <span>Add to Phone Calendar (.ics)</span>
                </button>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-1.5">
                About this Activity
              </h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                {activity.description}
              </p>
            </div>

            {/* Participants */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                  People Joining ({activity.participantIds.length} / {activity.capacity})
                </h3>
                <span className="text-[11px] font-semibold text-terracotta-600">
                  {spotsLeft > 0 ? `${spotsLeft} spots available` : 'Full group'}
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-sand-200 flex items-center justify-between">
                <div className="flex items-center -space-x-2 overflow-hidden">
                  <img
                    src={activity.host.avatar}
                    alt={activity.host.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white ring-1 ring-sand-300"
                    title={`Host: ${activity.host.name}`}
                  />
                  {activity.participantIds.slice(0, 4).map((id, idx) => (
                    <div
                      key={id + idx}
                      className="w-9 h-9 rounded-full bg-sand-200 border-2 border-white text-charcoal-700 font-bold text-xs flex items-center justify-center"
                    >
                      P{idx + 1}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-charcoal-500 font-medium">
                  Small, friendly circle
                </span>
              </div>
            </div>

            {/* What to bring */}
            {activity.whatToBring.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-1.5">
                  What to Bring
                </h3>
                <ul className="space-y-1.5">
                  {activity.whatToBring.map((item, idx) => (
                    <li key={idx} className="text-xs text-charcoal-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety Notice */}
            <div className="p-3.5 rounded-2xl bg-sand-100 border border-sand-200 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-charcoal-900 mb-0.5">
                  Safe Public Venue in Jaipur
                </h4>
                <p className="text-[11px] text-charcoal-600 leading-relaxed">
                  {activity.safetyNotice} We always recommend meeting in daylight, staying with the group, and sharing your plans with a trusted contact.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Fixed Bottom Action CTA */}
        <div className="p-4 bg-white border-t border-sand-200 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-charcoal-400 block font-semibold uppercase">
              {activity.isPaid ? 'Price per person' : 'Participation'}
            </span>
            <span className="text-sm font-extrabold text-charcoal-900">
              {activity.isPaid ? `₹${activity.priceINR}` : 'Free'}
            </span>
          </div>

          {!activity.isJoined ? (
            <button
              onClick={() => joinActivity(activity.id)}
              disabled={spotsLeft <= 0}
              className={`flex-1 py-3 px-6 rounded-full text-xs font-extrabold shadow-card transition-all active:scale-95 ${
                spotsLeft <= 0
                  ? 'bg-sand-300 text-charcoal-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-terracotta-600 to-terracotta-500 hover:from-terracotta-700 hover:to-terracotta-600 text-white'
              }`}
            >
              {spotsLeft <= 0 ? 'Group is Full' : 'Join Activity'}
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-1 justify-end">
              <button
                onClick={() => {
                  onClose();
                  setActiveCoordinationActivity(activity);
                }}
                className="py-2.5 px-4 rounded-full bg-charcoal-900 text-white text-xs font-bold hover:bg-charcoal-800 transition-colors"
              >
                Coordination Chat
              </button>
              <button
                onClick={() => leaveActivity(activity.id)}
                className="py-2.5 px-3 rounded-full bg-sand-100 hover:bg-rose-50 hover:text-rose-600 text-charcoal-500 text-xs font-semibold transition-colors"
              >
                Leave
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
