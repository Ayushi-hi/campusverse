import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  CampusEvent, 
  EventCategory, 
  NavigationRoute, 
  StudentProfile 
} from '../types';
import { CampusScene3D } from './campus3d/CampusScene3D';
import { CameraPreset } from './campus3d/CampusCameraController';
import { 
  RotateCcw, 
  Layers, 
  Sun, 
  Sunset, 
  Moon, 
  Compass, 
  Navigation2, 
  Eye, 
  Scan, 
  Flame, 
  Footprints,
  Info,
  Volume2,
  VolumeX,
  Wind,
  Coffee,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Crosshair
} from 'lucide-react';
import { toggleSound, isSoundEnabled, playTapSound } from '../utils/soundEffects';

interface CampusMapProps {
  buildings: Building[];
  events: CampusEvent[];
  selectedBuilding: Building | null;
  selectedEvent: CampusEvent | null;
  activeCategoryFilter: EventCategory | 'all';
  isLiveMode: boolean;
  activeRoute: NavigationRoute | null;
  studentProfile: StudentProfile;
  onSelectBuilding: (building: Building) => void;
  onSelectEvent: (event: CampusEvent) => void;
  onStartRoute: (toBuildingId: string, roomName?: string) => void;
  onSetStudentLocation?: (buildingId: string) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  buildings,
  events,
  selectedBuilding,
  selectedEvent,
  activeCategoryFilter,
  isLiveMode,
  activeRoute,
  studentProfile,
  onSelectBuilding,
  onSelectEvent,
  onStartRoute,
  onSetStudentLocation
}) => {
  // Camera & Atmosphere State - Default to Bright Daylight!
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('isometric');
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset' | 'night'>('day');
  const [isBreezeWeather, setIsBreezeWeather] = useState<boolean>(true);
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());
  const [hoveredBuilding, setHoveredBuilding] = useState<Building | null>(null);
  
  // Building Inspection / Floor Explorer State
  const [inspectedFloor, setInspectedFloor] = useState<number>(0); // 0 = all
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(true);

  const studentCurrentBuilding = buildings.find(b => b.id === studentProfile.currentLocationBuildingId) || buildings[0];
  const liveEventsCount = events.filter(e => e.isLiveNow).length;

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playTapSound();
  };

  const handleLocateMe = () => {
    playTapSound();
    onSelectBuilding(studentCurrentBuilding);
    setCameraPreset('isometric');
  };

  return (
    <div 
      id="campus-map-3d-viewport" 
      className="relative w-full h-full overflow-hidden bg-sky-50 select-none"
    >
      {/* 1. Real 3D Canvas Scene */}
      <Suspense fallback={
        <div className="w-full h-full flex flex-col items-center justify-center bg-sky-50 text-blue-600 gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="font-mono text-xs tracking-wider uppercase text-slate-600 font-semibold">
            Loading Sunlit 3D Campus...
          </div>
        </div>
      }>
        <CampusScene3D
          buildings={buildings}
          events={events}
          selectedBuilding={selectedBuilding}
          selectedEvent={selectedEvent}
          activeCategoryFilter={activeCategoryFilter}
          isLiveMode={isLiveMode}
          activeRoute={activeRoute}
          studentProfile={studentProfile}
          cameraPreset={cameraPreset}
          lightingMode={lightingMode}
          inspectedFloor={inspectedFloor}
          isXRayMode={isXRayMode}
          isBreezeWeather={isBreezeWeather}
          onSelectBuilding={(b) => {
            onSelectBuilding(b);
            setInspectedFloor(0);
          }}
          onSelectEvent={onSelectEvent}
          onHoverBuilding={setHoveredBuilding}
          hoveredBuilding={hoveredBuilding}
        />
      </Suspense>

      {/* 2. Top-Right HUD Controls: Lighting Switcher, Presets, Weather & Audio */}
      <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2.5">
        {/* Lighting Mode & Weather Switcher */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xl border border-slate-200/90 p-1.5 rounded-2xl shadow-xl">
          <button
            id="map-btn-lighting-day"
            onClick={() => {
              playTapSound();
              setLightingMode('day');
            }}
            title="Sunny Daylight Mode"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              lightingMode === 'day' 
                ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Day</span>
          </button>
          <button
            id="map-btn-lighting-sunset"
            onClick={() => {
              playTapSound();
              setLightingMode('sunset');
            }}
            title="Golden Hour / Sunset"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              lightingMode === 'sunset' 
                ? 'bg-orange-100 text-orange-800 border border-orange-300 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sunset className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Sunset</span>
          </button>
          <button
            id="map-btn-lighting-night"
            onClick={() => {
              playTapSound();
              setLightingMode('night');
            }}
            title="Starlit Evening Mode"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              lightingMode === 'night' 
                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Night</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

          {/* Weather Breeze Toggle */}
          <button
            onClick={() => {
              playTapSound();
              setIsBreezeWeather(!isBreezeWeather);
            }}
            title={isBreezeWeather ? "Spring Breeze On (Floating Petals)" : "Clear Atmosphere"}
            className={`p-1.5 rounded-xl text-xs transition-all ${
              isBreezeWeather
                ? 'bg-pink-100 text-pink-700 border border-pink-200'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Wind className="w-4 h-4" />
          </button>

          {/* Sound Effects Toggle */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? "Mute Sound Effects" : "Enable Sound Effects"}
            className={`p-1.5 rounded-xl text-xs transition-all ${
              soundOn 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Camera Preset Angles Toolbar */}
        <div className="flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200/90 p-1.5 rounded-2xl shadow-xl gap-1">
          <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 px-2 py-0.5 uppercase">
            3D Angles
          </div>

          <button
            id="cam-preset-isometric"
            onClick={() => {
              playTapSound();
              setCameraPreset('isometric');
            }}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraPreset === 'isometric' 
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-sm' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Isometric 3D</span>
          </button>

          <button
            id="cam-preset-overview"
            onClick={() => {
              playTapSound();
              setCameraPreset('overview');
            }}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraPreset === 'overview' 
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-sm' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scan className="w-3.5 h-3.5 text-blue-600" />
            <span>Bird's Eye / Drone</span>
          </button>

          <button
            id="cam-preset-street"
            onClick={() => {
              playTapSound();
              setCameraPreset('street');
            }}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraPreset === 'street' 
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-sm' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Footprints className="w-3.5 h-3.5 text-blue-600" />
            <span>Walkway Level</span>
          </button>

          <button
            id="cam-preset-north"
            onClick={() => {
              playTapSound();
              setCameraPreset('north');
            }}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraPreset === 'north' 
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-sm' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Snap North</span>
          </button>

          <div className="h-[1px] bg-slate-100 my-0.5" />

          <button
            id="cam-reset"
            onClick={() => {
              playTapSound();
              setCameraPreset('isometric');
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>

        {/* Student Presence Live Chip */}
        <button
          onClick={handleLocateMe}
          title="Click to focus on your avatar"
          className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-2.5 text-xs text-slate-700 shadow-xl flex items-center gap-2.5 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left group"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-emerald-600">Your Location</div>
            <div className="font-bold text-slate-800 truncate max-w-[130px]">
              {studentCurrentBuilding.name.split('(')[0]}
            </div>
          </div>
          <Crosshair className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 ml-1" />
        </button>
      </div>

      {/* 3. Top-Left Quick Status & Controls Guide */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-2 rounded-2xl shadow-lg text-xs text-slate-700">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800">Campus 3D Twin</span>
          <span className="text-slate-300">|</span>
          <span className="text-amber-600 font-semibold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            {liveEventsCount} Live Now
          </span>
        </div>

        {/* Quick Shortcuts Toolbar */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200/80 p-1 rounded-xl shadow-md">
          <button
            onClick={() => onStartRoute('canteen')}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors"
          >
            <Coffee className="w-3 h-3 text-orange-500" />
            <span>Café</span>
          </button>
          <button
            onClick={() => onStartRoute('central-library')}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
          >
            <BookOpen className="w-3 h-3 text-emerald-500" />
            <span>Library</span>
          </button>
          <button
            onClick={handleLocateMe}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
          >
            <Crosshair className="w-3 h-3 text-blue-500" />
            <span>Locate Me</span>
          </button>
        </div>

        {/* Mouse 3D Controls Help Pill */}
        {showControlsGuide && (
          <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl text-[11px] text-slate-600 shadow-md">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Left-Click Drag: <strong>Orbit</strong> • Click Ground: <strong>Walk</strong> • Scroll: <strong>Zoom</strong></span>
            </div>
            <button 
              onClick={() => setShowControlsGuide(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 4. Selected Building 3D Inspector HUD (Bottom-Center) */}
      <AnimatePresence>
        {selectedBuilding && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-xl w-[92%]"
          >
            <div className="bg-white/95 backdrop-blur-2xl border border-blue-200/90 rounded-3xl p-4 shadow-2xl text-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-bold text-sm text-white shadow-md shrink-0"
                  style={{ backgroundColor: selectedBuilding.color }}
                >
                  {selectedBuilding.code}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{selectedBuilding.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                      {selectedBuilding.floors} Floors
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{selectedBuilding.tagline}</p>
                </div>
              </div>

              {/* Floor Explorer & X-Ray Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Floor Selection Pills */}
                <div className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200">
                  <button
                    onClick={() => {
                      playTapSound();
                      setInspectedFloor(0);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium ${
                      inspectedFloor === 0 
                        ? 'bg-blue-600 text-white font-bold shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                  {Array.from({ length: selectedBuilding.floors }).map((_, f) => (
                    <button
                      key={f}
                      onClick={() => {
                        playTapSound();
                        setInspectedFloor(f + 1);
                      }}
                      className={`px-2 py-1 text-xs rounded-lg transition-all font-medium ${
                        inspectedFloor === f + 1 
                          ? 'bg-blue-600 text-white font-bold shadow-sm' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      F{f + 1}
                    </button>
                  ))}
                </div>

                {/* X-Ray / Glass Mode Toggle */}
                <button
                  onClick={() => {
                    playTapSound();
                    setIsXRayMode(!isXRayMode);
                  }}
                  title="Toggle Glass X-Ray Mode"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isXRayMode 
                      ? 'bg-purple-100 text-purple-800 border-purple-300' 
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                  <span>X-Ray</span>
                </button>

                {/* Start Navigation Action */}
                <button
                  onClick={() => {
                    playTapSound();
                    onStartRoute(selectedBuilding.id);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all"
                >
                  <Navigation2 className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Building Quick Hover Preview Tooltip */}
      <AnimatePresence>
        {hoveredBuilding && !selectedBuilding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-blue-300 rounded-2xl px-4 py-2.5 shadow-2xl text-slate-800 flex items-center gap-3">
              <span 
                className="px-2 py-0.5 rounded text-xs font-mono font-bold text-white uppercase shadow-sm"
                style={{ backgroundColor: hoveredBuilding.color }}
              >
                {hoveredBuilding.code}
              </span>
              <div>
                <div className="font-bold text-xs text-slate-900">{hoveredBuilding.name}</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-2">
                  <span>{hoveredBuilding.floors} Floors</span>
                  <span>•</span>
                  <span>{hoveredBuilding.rooms.length} Rooms</span>
                  <span>•</span>
                  <span className="text-blue-600 font-semibold">{hoveredBuilding.activeEventsCount} Events</span>
                </div>
              </div>
              <span className="text-[10px] text-blue-600 font-mono border-l border-slate-200 pl-3">
                Click to inspect
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Bottom-Left Category Legend */}
      <div className="absolute bottom-4 left-4 z-20 hidden lg:flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 px-4 py-2 rounded-2xl text-[11px] text-slate-700 shadow-md">
        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Pins:</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Classes</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Hackathons</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Workshops</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Clubs</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Major Events</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Food</span>
      </div>
    </div>
  );
};
