import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Flame, 
  Navigation, 
  Wifi, 
  Footprints, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { Building, CampusEvent, StudentProfile } from '../types';
import { playTapSound, playTeleportSound } from '../utils/soundEffects';

interface BuildingDrawerProps {
  building: Building | null;
  events: CampusEvent[];
  studentProfile: StudentProfile;
  onClose: () => void;
  onSelectEvent: (event: CampusEvent) => void;
  onStartRoute: (toBuildingId: string, roomName?: string) => void;
  onSetStudentLocation: (buildingId: string) => void;
}

export const BuildingDrawer: React.FC<BuildingDrawerProps> = ({
  building,
  events,
  studentProfile,
  onClose,
  onSelectEvent,
  onStartRoute,
  onSetStudentLocation
}) => {
  if (!building) return null;

  const buildingEvents = events.filter(e => e.buildingId === building.id);
  const isStudentHere = studentProfile.currentLocationBuildingId === building.id;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        id="building-detail-drawer"
        className="fixed right-0 top-0 bottom-0 z-40 w-full sm:w-[440px] bg-white/98 backdrop-blur-2xl border-l border-slate-200 shadow-2xl flex flex-col text-slate-800 overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="relative p-5 pb-4 border-b border-slate-100 bg-slate-50/70">
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span 
              className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase text-white shadow-sm"
              style={{ backgroundColor: building.color }}
            >
              {building.code}
            </span>

            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              building.crowdLevel === 'Packed' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              building.crowdLevel === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              Crowd: {building.crowdLevel}
            </span>

            {isStudentHere && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Footprints className="w-3 h-3" />
                Current Spot
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold font-display text-slate-900 mt-2">
            {building.name}
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            {building.tagline}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-[10px] text-slate-400 font-medium">Total Floors</div>
              <div className="text-sm font-bold text-slate-800">{building.floors}F</div>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-[10px] text-slate-400 font-medium">Classrooms</div>
              <div className="text-sm font-bold text-blue-600">{building.activeClassroomsCount}</div>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-[10px] text-slate-400 font-medium">Active Events</div>
              <div className="text-sm font-bold text-purple-600">{building.activeEventsCount}</div>
            </div>
          </div>

          {/* Action Row: Navigate / Set as Location */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => {
                playTapSound();
                onStartRoute(building.id);
              }}
              className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>NAVIGATE HERE</span>
            </button>

            <button
              onClick={() => {
                playTeleportSound();
                onSetStudentLocation(building.id);
              }}
              className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Footprints className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isStudentHere ? 'You are here' : 'Set as Location'}</span>
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* About & Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              About This Building
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {building.description}
            </p>
          </div>

          {/* Facilities Badges */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Key Facilities & Tech
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {building.facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-medium flex items-center gap-1"
                >
                  <Wifi className="w-3 h-3 text-blue-600" />
                  {fac}
                </span>
              ))}
            </div>
          </div>

          {/* Floor & Room Directory */}
          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Rooms & Labs Directory ({building.rooms.length})</span>
              <span className="text-[10px] text-slate-400 font-mono">Live Status</span>
            </h3>

            <div className="space-y-2">
              {building.rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded">
                        {room.roomNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {room.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Floor {room.floor}
                      </span>
                    </div>

                    {room.currentClass ? (
                      <div className="text-[11px] text-slate-700 flex items-center gap-1.5 pt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-semibold text-blue-700">{room.currentClass}</span>
                        {room.currentProf && (
                          <span className="text-slate-500 font-normal">({room.currentProf})</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500">
                        Open for self-study / collaboration
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      room.isOccupied
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {room.isOccupied ? 'Occupied' : 'Available'}
                    </span>

                    <button
                      onClick={() => {
                        playTapSound();
                        onStartRoute(building.id, room.name);
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5"
                    >
                      <span>Route</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events Happening Here */}
          {buildingEvents.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Events In This Building ({buildingEvents.length})</span>
              </h3>

              <div className="space-y-2">
                {buildingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      playTapSound();
                      onSelectEvent(evt);
                    }}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-300 shadow-sm cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-800 group-hover:text-purple-900">
                        {evt.title}
                      </span>
                      <span className="text-[10px] text-blue-600 font-mono font-bold">
                        {evt.startTime}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-2">
                      <span>📍 {evt.venueName}</span>
                      <span>•</span>
                      <span>👥 {evt.attendeesCount} attending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
