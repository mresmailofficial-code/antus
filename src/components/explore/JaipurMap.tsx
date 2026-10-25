import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Activity } from '../../types';
import { useHuman } from '../../context/HumanContext';
import { Calendar, MapPin, Users, X, ArrowRight } from 'lucide-react';

interface JaipurMapProps {
  activities: Activity[];
}

export const JaipurMap: React.FC<JaipurMapProps> = ({ activities }) => {
  const { setSelectedActivityDetail, joinActivity } = useHuman();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [activePinActivity, setActivePinActivity] = useState<Activity | null>(activities[0] || null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map is already initialized
    if (!mapInstanceRef.current) {
      // Initialize map centered at Jaipur coordinates
      const map = L.map(mapContainerRef.current, {
        center: [26.9066, 75.8010], // C-Scheme / Central Jaipur
        zoom: 13,
        zoomControl: false,
      });

      // Add CartoDB Positron / OSM tiles with warm tone
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Custom terracotta pin icon creator
    const createCustomIcon = (category: string, isSelected: boolean) => {
      const pinColor = isSelected ? '#C04128' : '#D95338';
      const size = isSelected ? 38 : 32;

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${pinColor};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(26,25,24,0.3);
            border: 2px solid white;
          ">
            <div style="
              transform: rotate(45deg);
              width: ${size * 0.4}px;
              height: ${size * 0.4}px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });
    };

    // Add markers for all activities
    activities.forEach((act) => {
      const isSelected = activePinActivity?.id === act.id;
      const marker = L.marker(act.coordinates, {
        icon: createCustomIcon(act.category, isSelected),
      }).addTo(map);

      marker.on('click', () => {
        setActivePinActivity(act);
        map.flyTo(act.coordinates, 14, { duration: 0.8 });
      });

      markersRef.current.push(marker);
    });

    return () => {
      // cleanup is handled on unmount
    };
  }, [activities, activePinActivity]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-sand-300 shadow-soft">
      {/* The Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Bottom Card Preview for Active Selected Pin */}
      {activePinActivity && (
        <div className="absolute bottom-4 left-4 right-4 z-20 animate-slide-up">
          <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-sand-200 shadow-elevated flex items-center gap-3">
            <img
              src={activePinActivity.coverImage}
              alt={activePinActivity.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider truncate">
                  {activePinActivity.neighborhood}
                </span>
                <span className="text-[10px] text-charcoal-400">·</span>
                <span className="text-[10px] text-charcoal-600 font-semibold truncate">
                  {activePinActivity.displayDate}
                </span>
              </div>
              <h4 className="text-xs font-bold text-charcoal-900 leading-snug line-clamp-1">
                {activePinActivity.title}
              </h4>
              <span className="text-[10px] text-charcoal-500 truncate block mt-0.5">
                {activePinActivity.venueName}
              </span>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setSelectedActivityDetail(activePinActivity)}
                  className="px-3 py-1 bg-charcoal-900 text-white rounded-full text-[11px] font-bold hover:bg-charcoal-800 transition-colors"
                >
                  View Details
                </button>
                {!activePinActivity.isJoined ? (
                  <button
                    onClick={() => joinActivity(activePinActivity.id)}
                    className="px-3 py-1 bg-terracotta-500 text-white rounded-full text-[11px] font-bold hover:bg-terracotta-600 transition-colors"
                  >
                    Join
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                    You're going
                  </span>
                )}
              </div>
            </div>

            {/* Dismiss preview */}
            <button
              onClick={() => setActivePinActivity(null)}
              className="w-6 h-6 rounded-full bg-sand-100 hover:bg-sand-200 text-charcoal-600 flex items-center justify-center shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
