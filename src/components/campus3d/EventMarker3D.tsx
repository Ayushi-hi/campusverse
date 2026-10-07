import React from 'react';
import { Html } from '@react-three/drei';
import { CampusEvent, EventCategory } from '../../types';
import { campusTo3D } from './coordinateUtils';
import { playMarkerSound } from '../../utils/soundEffects';
import { 
  GraduationCap, 
  Laptop, 
  Sparkles, 
  Users, 
  Mic, 
  Trophy, 
  Coffee, 
  MapPin, 
  FlaskConical,
  Flame
} from 'lucide-react';

interface EventMarker3DProps {
  event: CampusEvent;
  buildingX: number;
  buildingY: number;
  buildingFloors: number;
  isSelected: boolean;
  onSelect: (event: CampusEvent) => void;
}

export const EventMarker3D: React.FC<EventMarker3DProps> = ({
  event,
  buildingX,
  buildingY,
  buildingFloors,
  isSelected,
  onSelect
}) => {
  // Building 3D position
  const [baseX, , baseZ] = campusTo3D(buildingX, buildingY, 0);

  // Offset marker height above roof
  const roofHeight = buildingFloors * 1.8 + 2.8;

  // Stagger markers if multiple events exist on same building
  const hash = event.id.charCodeAt(event.id.length - 1) % 4;
  const offsetX = (hash - 1.5) * 2.2;
  const offsetZ = ((hash % 2) - 0.5) * 1.8;
  const heightOffset = roofHeight + (hash % 3) * 0.8;

  const getCategoryColor = (cat: EventCategory) => {
    switch (cat) {
      case 'classes': return { bg: 'bg-blue-600', glow: '#3b82f6', border: 'border-blue-400' };
      case 'labs': return { bg: 'bg-cyan-600', glow: '#06b6d4', border: 'border-cyan-400' };
      case 'hackathons': return { bg: 'bg-purple-600', glow: '#a855f7', border: 'border-purple-400' };
      case 'workshops': return { bg: 'bg-emerald-600', glow: '#10b981', border: 'border-emerald-400' };
      case 'clubs': return { bg: 'bg-amber-600', glow: '#f59e0b', border: 'border-amber-400' };
      case 'events': return { bg: 'bg-rose-600', glow: '#f43f5e', border: 'border-rose-400' };
      case 'sports': return { bg: 'bg-sky-600', glow: '#0284c7', border: 'border-sky-400' };
      case 'food': return { bg: 'bg-orange-600', glow: '#f97316', border: 'border-orange-400' };
      default: return { bg: 'bg-indigo-600', glow: '#6366f1', border: 'border-indigo-400' };
    }
  };

  const getCategoryIcon = (cat: EventCategory) => {
    switch (cat) {
      case 'classes': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'labs': return <FlaskConical className="w-3.5 h-3.5" />;
      case 'hackathons': return <Laptop className="w-3.5 h-3.5" />;
      case 'workshops': return <Sparkles className="w-3.5 h-3.5" />;
      case 'clubs': return <Users className="w-3.5 h-3.5" />;
      case 'events': return <Mic className="w-3.5 h-3.5" />;
      case 'sports': return <Trophy className="w-3.5 h-3.5" />;
      case 'food': return <Coffee className="w-3.5 h-3.5" />;
      default: return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const colorScheme = getCategoryColor(event.category);

  return (
    <group position={[baseX + offsetX, heightOffset, baseZ + offsetZ]}>
      {/* 3D Stem Line connecting marker to building roof */}
      <mesh position={[0, -heightOffset / 2 + (buildingFloors * 1.8) / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, heightOffset - buildingFloors * 1.8, 6]} />
        <meshBasicMaterial color={colorScheme.glow} transparent opacity={0.5} />
      </mesh>

      {/* Floating 3D HTML Badge */}
      <Html
        center
        distanceFactor={45}
        zIndexRange={[100, 0]}
      >
        <div
          id={`marker-3d-${event.id}`}
          onClick={(e) => {
            e.stopPropagation();
            playMarkerSound();
            onSelect(event);
          }}
          className={`relative group cursor-pointer select-none transition-all duration-200 transform hover:scale-115 ${
            isSelected ? 'scale-120' : ''
          }`}
        >
          {/* Animated Pulsing Radar Rings if Event is Live Now */}
          {event.isLiveNow && (
            <span className="absolute -inset-1 rounded-full animate-ping opacity-60 pointer-events-none"
              style={{ backgroundColor: colorScheme.glow }}
            />
          )}

          {/* Interactive Floating Pill */}
          <div 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-2xl backdrop-blur-md border ${
              colorScheme.bg
            } ${colorScheme.border} ${
              isSelected ? 'ring-4 ring-white shadow-[0_0_25px_rgba(255,255,255,0.8)]' : ''
            }`}
            style={{
              boxShadow: `0 8px 24px ${colorScheme.glow}90`
            }}
          >
            <span className="shrink-0">
              {getCategoryIcon(event.category)}
            </span>

            <span className="max-w-[120px] truncate font-medium tracking-tight text-[11px]">
              {event.title.split(':')[0]}
            </span>

            {event.isLiveNow && (
              <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-white/20 text-[9px] font-bold uppercase tracking-wider text-emerald-200">
                <Flame className="w-2.5 h-2.5 text-emerald-300" />
                Live
              </span>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};
