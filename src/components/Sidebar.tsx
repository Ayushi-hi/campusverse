import React, { useState } from 'react';
import { 
  Building, 
  CampusEvent, 
  TimetableEntry, 
  StudentProfile 
} from '../types';
import { 
  Flame, 
  Calendar, 
  Laptop, 
  Activity, 
  Clock, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Award,
  TrendingUp
} from 'lucide-react';
import { playTapSound } from '../utils/soundEffects';

interface SidebarProps {
  buildings: Building[];
  events: CampusEvent[];
  timetable: TimetableEntry[];
  studentProfile: StudentProfile;
  nextClass: TimetableEntry | null;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectBuilding: (building: Building) => void;
  onSelectEvent: (event: CampusEvent) => void;
  onStartRoute: (toBuildingId: string, roomName?: string) => void;
  onOpenTimetable: () => void;
  onRegisterEvent: (eventId: string) => void;
}

type TabType = 'live' | 'schedule' | 'events' | 'pulse';

export const Sidebar: React.FC<SidebarProps> = ({
  buildings,
  events,
  timetable,
  studentProfile,
  nextClass,
  isOpen,
  onToggleOpen,
  onSelectBuilding,
  onSelectEvent,
  onStartRoute,
  onOpenTimetable,
  onRegisterEvent
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('live');

  // Filter live events
  const liveEvents = events.filter(e => e.isLiveNow);

  const handleTabClick = (tab: TabType) => {
    playTapSound();
    setActiveTab(tab);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onToggleOpen}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside 
        id="campus-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border-r border-slate-200/90 flex flex-col transition-all duration-300 ease-in-out shadow-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-14'
        }`}
      >
        {/* Toggle Collapse Button for Desktop */}
        <button
          onClick={onToggleOpen}
          className="hidden lg:flex absolute -right-3 top-20 z-50 w-6 h-6 rounded-full bg-blue-600 text-white items-center justify-center shadow-md hover:scale-110 transition-transform"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Minimized Icon Bar when collapsed on desktop */}
        {!isOpen && (
          <div className="hidden lg:flex flex-col items-center py-4 gap-6 text-slate-500">
            <button 
              onClick={() => { handleTabClick('live'); onToggleOpen(); }} 
              className="p-2 rounded-xl hover:text-rose-600 hover:bg-slate-100 transition-colors"
              title="Campus Live"
            >
              <Flame className="w-5 h-5 text-amber-500" />
            </button>
            <button 
              onClick={() => { handleTabClick('schedule'); onToggleOpen(); }} 
              className="p-2 rounded-xl hover:text-blue-600 hover:bg-slate-100 transition-colors"
              title="My Schedule"
            >
              <Calendar className="w-5 h-5 text-blue-600" />
            </button>
            <button 
              onClick={() => { handleTabClick('events'); onToggleOpen(); }} 
              className="p-2 rounded-xl hover:text-purple-600 hover:bg-slate-100 transition-colors"
              title="Events & Hackathons"
            >
              <Laptop className="w-5 h-5 text-purple-600" />
            </button>
            <button 
              onClick={() => { handleTabClick('pulse'); onToggleOpen(); }} 
              className="p-2 rounded-xl hover:text-emerald-600 hover:bg-slate-100 transition-colors"
              title="Campus Pulse"
            >
              <Activity className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Full Sidebar Body when expanded */}
        {isOpen && (
          <div className="flex flex-col h-full overflow-hidden text-slate-800">
            {/* Greeting & Microcopy */}
            <div className="p-4 pb-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <span>👋 Hey, {studentProfile.name.split(' ')[0]}!</span>
                  <span className="text-emerald-700 text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200 font-bold">
                    Online
                  </span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 font-display mt-0.5">
                  Campus is bustling today ✨
                </h2>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{studentProfile.eventStreak} streak</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 p-2 gap-1 border-b border-slate-100 bg-slate-50 text-[11px] font-semibold">
              <button
                id="sidebar-tab-live"
                onClick={() => handleTabClick('live')}
                className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'live' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Live</span>
              </button>

              <button
                id="sidebar-tab-schedule"
                onClick={() => handleTabClick('schedule')}
                className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'schedule' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule</span>
              </button>

              <button
                id="sidebar-tab-events"
                onClick={() => handleTabClick('events')}
                className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'events' 
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Events</span>
              </button>

              <button
                id="sidebar-tab-pulse"
                onClick={() => handleTabClick('pulse')}
                className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'pulse' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Pulse</span>
              </button>
            </div>

            {/* Tab Contents Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* TAB 1: CAMPUS LIVE */}
              {activeTab === 'live' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                      Happening Right Now ({liveEvents.length})
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
                  </div>

                  {liveEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => {
                        playTapSound();
                        onSelectEvent(evt);
                      }}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                          LIVE NOW
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          {evt.startTime}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-2">
                        {evt.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1">
                        <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                        <span className="truncate">{evt.venueName}</span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">
                          👥 {evt.attendeesCount} students
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTapSound();
                            onStartRoute(evt.buildingId, evt.venueName);
                          }}
                          className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
                        >
                          <span>Walk there</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Hotspots Feed */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Live Campus Hotspots
                    </div>
                    <div className="space-y-1.5">
                      <div 
                        onClick={() => {
                          playTapSound();
                          onSelectBuilding(buildings.find(b => b.id === 'canteen')!);
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">☕</span>
                          <div>
                            <div className="text-xs font-semibold text-slate-900">The Neon Canteen</div>
                            <div className="text-[10px] text-slate-500">Peak Lunch Rush • Special Boba Deals</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          Packed
                        </span>
                      </div>

                      <div 
                        onClick={() => {
                          playTapSound();
                          onSelectBuilding(buildings.find(b => b.id === 'innovation-lab')!);
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">💻</span>
                          <div>
                            <div className="text-xs font-semibold text-slate-900">Innovation & AI Labs</div>
                            <div className="text-[10px] text-slate-500">AI Hackathon in Full Swing</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          140 Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MY SCHEDULE */}
              {activeTab === 'schedule' && (
                <div className="space-y-3">
                  {/* NEXT CLASS HERO CARD */}
                  {nextClass ? (
                    <div className="relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-blue-200 shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-600 text-white flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-2.5 h-2.5" />
                          NEXT CLASS
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-800">
                          {nextClass.startTime}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900 mt-2 font-display">
                        {nextClass.subject}
                      </h3>

                      <div className="mt-1.5 space-y-0.5 text-xs text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold">{nextClass.venueName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <span>👨‍🏫 {nextClass.professor}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">🚶 3 min walk away</span>
                        </div>
                      </div>

                      <button
                        id="btn-take-me-there"
                        onClick={() => {
                          playTapSound();
                          onStartRoute(nextClass.buildingId, nextClass.venueName);
                        }}
                        className="mt-3 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>TAKE ME THERE →</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-100 text-center text-xs text-slate-500">
                      No more classes scheduled for today! 🎉
                    </div>
                  )}

                  {/* Rest of Timetable Timeline */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Today's Timeline
                      </span>
                      <button 
                        onClick={() => {
                          playTapSound();
                          onOpenTimetable();
                        }}
                        className="text-[11px] text-blue-600 hover:underline font-semibold"
                      >
                        Edit / Upload
                      </button>
                    </div>

                    <div className="space-y-2">
                      {timetable.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between group hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-1.5 self-stretch rounded-full bg-blue-500 my-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-slate-900">
                                {item.subject}
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span>{item.startTime} - {item.endTime}</span>
                                <span>•</span>
                                <span className="text-blue-600 font-medium">{item.venueName}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              playTapSound();
                              onStartRoute(item.buildingId, item.venueName);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Navigate here"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EVENTS & HACKATHONS */}
              {activeTab === 'events' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 uppercase tracking-wider">
                      Upcoming & Featured
                    </span>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      {events.length} Total
                    </span>
                  </div>

                  {events.map((evt) => {
                    const isRegistered = studentProfile.registeredEventIds.includes(evt.id);
                    return (
                      <div
                        key={evt.id}
                        onClick={() => {
                          playTapSound();
                          onSelectEvent(evt);
                        }}
                        className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                            {evt.category}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {evt.startTime}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors mt-2">
                          {evt.title}
                        </h4>

                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                          {evt.description}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">
                            👥 {evt.attendeesCount} / {evt.maxParticipants}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playTapSound();
                              onRegisterEvent(evt.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              isRegistered
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                            }`}
                          >
                            {isRegistered ? '✓ Registered' : 'Register Now'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: CAMPUS PULSE & STREAKS */}
              {activeTab === 'pulse' && (
                <div className="space-y-3 text-xs">
                  {/* Activity Meter */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                        Campus Activity
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                        🔥 HIGH
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-lg font-extrabold text-blue-600 font-mono">340</div>
                        <div className="text-[10px] text-slate-500">Students Active</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-lg font-extrabold text-purple-600 font-mono">14</div>
                        <div className="text-[10px] text-slate-500">Live Sessions</div>
                      </div>
                    </div>
                  </div>

                  {/* Gamified Participation Streak */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-800 font-bold">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Event Participation Streak</span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1">
                      You've attended <strong className="text-amber-800">{studentProfile.eventStreak} campus events</strong> this month! Keep it up to unlock the Gold Campus Badge.
                    </p>
                    <div className="mt-2.5 w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all"
                        style={{ width: `${(studentProfile.eventStreak / 6) * 100}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500 text-right font-medium">
                      {studentProfile.eventStreak} / 6 to Next Tier
                    </div>
                  </div>

                  {/* Trending Campus Topics */}
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="font-bold text-slate-500 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      Trending on Campus
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">#AIHackathon2026</span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">#BobaRush</span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">#RustSystems</span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">#SunsetStreetball</span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">#GoogleInterviews</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="font-mono text-blue-600 font-semibold">⚡ You got places to be 🚶</span>
              <span className="text-[10px] text-slate-400">v2.6 Live</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
