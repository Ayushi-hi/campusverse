import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Flame, 
  Calendar, 
  Bot, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  X, 
  Compass,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { 
  Building, 
  CampusEvent, 
  EventCategory, 
  StudentProfile, 
  TimetableEntry 
} from '../types';
import { playTapSound } from '../utils/soundEffects';

interface TopNavProps {
  buildings: Building[];
  events: CampusEvent[];
  activeCategoryFilter: EventCategory | 'all';
  isLiveMode: boolean;
  userRole: 'student' | 'admin';
  studentProfile: StudentProfile;
  nextClass: TimetableEntry | null;
  onFilterChange: (category: EventCategory | 'all') => void;
  onToggleLiveMode: () => void;
  onToggleUserRole: () => void;
  onSelectBuilding: (building: Building) => void;
  onSelectEvent: (event: CampusEvent) => void;
  onOpenTimetable: () => void;
  onOpenCopilot: () => void;
  onOpenAdminModal: () => void;
  onStartRoute: (toBuildingId: string, roomName?: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  buildings,
  events,
  activeCategoryFilter,
  isLiveMode,
  userRole,
  studentProfile,
  nextClass,
  onFilterChange,
  onToggleLiveMode,
  onToggleUserRole,
  onSelectBuilding,
  onSelectEvent,
  onOpenTimetable,
  onOpenCopilot,
  onOpenAdminModal,
  onStartRoute
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute search matches across buildings, rooms, professors, and events
  const query = searchQuery.trim().toLowerCase();
  
  const matchingBuildings = query ? buildings.filter(b => 
    b.name.toLowerCase().includes(query) ||
    b.code.toLowerCase().includes(query) ||
    b.tagline.toLowerCase().includes(query) ||
    b.rooms.some(r => r.name.toLowerCase().includes(query) || r.roomNumber.toLowerCase().includes(query) || (r.currentProf && r.currentProf.toLowerCase().includes(query)))
  ) : [];

  const matchingEvents = query ? events.filter(e =>
    e.title.toLowerCase().includes(query) ||
    e.description.toLowerCase().includes(query) ||
    e.organizer.toLowerCase().includes(query) ||
    e.tags.some(t => t.toLowerCase().includes(query))
  ) : [];

  const totalResults = matchingBuildings.length + matchingEvents.length;

  const filterChips: { id: EventCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '⚡' },
    { id: 'classes', label: 'Classes', icon: '📚' },
    { id: 'labs', label: 'Labs', icon: '🧪' },
    { id: 'events', label: 'Events', icon: '🎉' },
    { id: 'hackathons', label: 'Hackathons', icon: '💻' },
    { id: 'clubs', label: 'Clubs', icon: '🎨' },
    { id: 'sports', label: 'Sports', icon: '🏀' },
    { id: 'food', label: 'Food', icon: '🍕' }
  ];

  return (
    <header className="relative z-30 flex flex-col bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-sm">
      {/* Upper Bar: Brand, Search, Live Mode, Role Switcher */}
      <div className="flex items-center justify-between px-4 py-2.5 gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base tracking-wider text-slate-900">
                  CAMPUS<span className="text-blue-600">VERSE</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                  LIVE 3D
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Interactive Sunlit Campus Twin
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="campus-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search classrooms, labs, profs, events..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100/90 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Search Dropdown */}
          {isSearchOpen && searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-50">
              <div className="p-2.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                <span>Search Results</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{totalResults} found</span>
              </div>

              {totalResults === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No buildings or events matching "{searchQuery}"
                </div>
              ) : (
                <div className="p-1 space-y-1">
                  {/* Buildings */}
                  {matchingBuildings.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        playTapSound();
                        onSelectBuilding(b);
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          {b.code}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                            {b.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {b.rooms.length} Rooms • {b.activeEventsCount} Active Events
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}

                  {/* Events */}
                  {matchingEvents.map(e => (
                    <button
                      key={e.id}
                      onClick={() => {
                        playTapSound();
                        onSelectEvent(e);
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-sm shrink-0">
                          🎉
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-purple-600">
                            {e.title}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                            <span>{e.venueName}</span>
                            <span>•</span>
                            <span className="text-blue-600 font-semibold">{e.startTime}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls: Live Mode Toggle, Next Class Pill, Role & Copilot */}
        <div className="flex items-center gap-2">
          {/* CAMPUS LIVE MODE BUTTON */}
          <button
            id="btn-toggle-campus-live"
            onClick={() => {
              playTapSound();
              onToggleLiveMode();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              isLiveMode 
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white shadow-rose-500/20 ring-2 ring-rose-300' 
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${isLiveMode ? 'text-yellow-200 fill-yellow-200 animate-pulse' : 'text-amber-500'}`} />
            <span className="hidden sm:inline">LIVE NOW</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isLiveMode ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
              12
            </span>
          </button>

          {/* NEXT CLASS ACTION PILL */}
          {nextClass && (
            <button
              id="top-btn-next-class"
              onClick={() => {
                playTapSound();
                onStartRoute(nextClass.buildingId, nextClass.venueName);
              }}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 text-xs font-semibold transition-all group"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Next: {nextClass.subject.split(' ')[0]} ({nextClass.startTime})</span>
              <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full shadow-sm group-hover:bg-blue-700">
                🚶 Navigate
              </span>
            </button>
          )}

          {/* Timetable Trigger */}
          <button
            id="top-btn-timetable"
            onClick={() => {
              playTapSound();
              onOpenTimetable();
            }}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors shadow-sm"
            title="My Timetable"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* AI Copilot Trigger */}
          <button
            id="top-btn-copilot"
            onClick={() => {
              playTapSound();
              onOpenCopilot();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-900 hover:border-blue-400 text-xs font-semibold transition-all shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          {/* Admin Switcher / Profile Badge */}
          <div className="flex items-center pl-1 border-l border-slate-200">
            {userRole === 'admin' ? (
              <div className="flex items-center gap-1.5">
                <button
                  id="top-btn-admin-panel"
                  onClick={onOpenAdminModal}
                  className="px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold hover:bg-rose-200 flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  Admin
                </button>
                <button
                  onClick={onToggleUserRole}
                  className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                >
                  Switch
                </button>
              </div>
            ) : (
              <button
                id="top-btn-student-profile"
                onClick={onToggleUserRole}
                className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-400 transition-all"
                title="Click to toggle Admin view"
              >
                <img
                  src={studentProfile.avatar}
                  alt={studentProfile.name}
                  className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lower Bar: Filter Chips */}
      <div className="flex items-center gap-1.5 px-4 py-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 bg-slate-50/80">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
          Filter:
        </span>
        {filterChips.map(chip => {
          const isActive = activeCategoryFilter === chip.id;
          return (
            <button
              key={chip.id}
              id={`filter-chip-${chip.id}`}
              onClick={() => {
                playTapSound();
                onFilterChange(chip.id);
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
