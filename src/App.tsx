/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  INITIAL_BUILDINGS, 
  INITIAL_EVENTS, 
  INITIAL_TIMETABLE, 
  INITIAL_STUDENT, 
  INITIAL_ANNOUNCEMENTS, 
  CAMPUS_PATHS, 
  findShortestRoute 
} from './data/campusData';
import { 
  Building, 
  CampusEvent, 
  EventCategory, 
  StudentProfile, 
  TimetableEntry, 
  NavigationRoute, 
  CampusAnnouncement, 
  Room 
} from './types';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { CampusMap } from './components/CampusMap';
import { BuildingDrawer } from './components/BuildingDrawer';
import { EventModal } from './components/EventModal';
import { NavigationCard } from './components/NavigationCard';
import { CampusCopilot } from './components/CampusCopilot';
import { TimetableModal } from './components/TimetableModal';
import { AdminModal } from './components/AdminModal';
import { BellRing, X, Sparkles, Navigation } from 'lucide-react';

export default function App() {
  // Core state
  const [buildings, setBuildings] = useState<Building[]>(INITIAL_BUILDINGS);
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(INITIAL_TIMETABLE);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT);
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>(INITIAL_ANNOUNCEMENTS);

  // Active selections & routes
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null);

  // Filters & Modes
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');

  // UI Panels toggles
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isTimetableOpen, setIsTimetableOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([]);

  // Next class calculation for student
  const nextClass = useMemo(() => {
    return timetable[1] || timetable[0] || null;
  }, [timetable]);

  // Handle route starting
  const handleStartRoute = (toBuildingId: string, roomName?: string) => {
    const route = findShortestRoute(
      studentProfile.currentLocationBuildingId,
      toBuildingId,
      roomName
    );
    setActiveRoute(route);
  };

  const handleEndRoute = () => {
    setActiveRoute(null);
  };

  // Set student location
  const handleSetStudentLocation = (buildingId: string) => {
    setStudentProfile(prev => ({
      ...prev,
      currentLocationBuildingId: buildingId
    }));
  };

  // Event registration toggle
  const handleRegisterEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const nextStatus = !e.isRegistered;
        return {
          ...e,
          isRegistered: nextStatus,
          attendeesCount: nextStatus ? e.attendeesCount + 1 : Math.max(0, e.attendeesCount - 1)
        };
      }
      return e;
    }));

    setStudentProfile(prev => {
      const alreadyIn = prev.registeredEventIds.includes(eventId);
      const updatedList = alreadyIn 
        ? prev.registeredEventIds.filter(id => id !== eventId)
        : [...prev.registeredEventIds, eventId];
      return {
        ...prev,
        registeredEventIds: updatedList,
        eventStreak: !alreadyIn ? prev.eventStreak + 1 : prev.eventStreak
      };
    });
  };

  // Bookmark toggle
  const handleBookmarkEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, isBookmarked: !e.isBookmarked };
      }
      return e;
    }));
  };

  // Admin handlers
  const handleAddEvent = (newEvent: CampusEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    // Also update host building event count
    setBuildings(prev => prev.map(b => {
      if (b.id === newEvent.buildingId) {
        return { ...b, activeEventsCount: b.activeEventsCount + 1 };
      }
      return b;
    }));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleAddAnnouncement = (ann: CampusAnnouncement) => {
    setAnnouncements(prev => [ann, ...prev]);
  };

  const handleAddRoom = (buildingId: string, room: Room) => {
    setBuildings(prev => prev.map(b => {
      if (b.id === buildingId) {
        return {
          ...b,
          rooms: [...b.rooms, room],
          activeClassroomsCount: b.activeClassroomsCount + 1
        };
      }
      return b;
    }));
  };

  // Urgent active announcements
  const activeAnnouncements = announcements.filter(
    a => !dismissedAnnouncements.includes(a.id)
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-sans select-none">
      {/* 1. TOP NAVIGATION BAR */}
      <TopNav
        buildings={buildings}
        events={events}
        activeCategoryFilter={activeCategoryFilter}
        isLiveMode={isLiveMode}
        userRole={userRole}
        studentProfile={studentProfile}
        nextClass={nextClass}
        onFilterChange={setActiveCategoryFilter}
        onToggleLiveMode={() => setIsLiveMode(prev => !prev)}
        onToggleUserRole={() => {
          setUserRole(prev => (prev === 'student' ? 'admin' : 'student'));
          if (userRole === 'student') setIsAdminOpen(true);
        }}
        onSelectBuilding={(b) => setSelectedBuilding(b)}
        onSelectEvent={(e) => setSelectedEvent(e)}
        onOpenTimetable={() => setIsTimetableOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(prev => !prev)}
        onOpenAdminModal={() => setIsAdminOpen(true)}
        onStartRoute={handleStartRoute}
      />

      {/* 2. URGENT ANNOUNCEMENT TICKER BANNER (if any) */}
      {activeAnnouncements.length > 0 && (
        <div className="relative z-20 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider shrink-0">
              <BellRing className="w-3 h-3 text-amber-300 animate-pulse" />
              {activeAnnouncements[0].urgency}
            </span>
            <span className="truncate">
              <strong>{activeAnnouncements[0].title}:</strong> {activeAnnouncements[0].message}
            </span>
          </div>
          <button
            onClick={() => setDismissedAnnouncements(prev => [...prev, activeAnnouncements[0].id])}
            className="p-1 rounded hover:bg-white/20 ml-2 shrink-0 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. MAIN WORKSPACE: SIDEBAR + INTERACTIVE MAP STAGE */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Interactive Sidebar */}
        <Sidebar
          buildings={buildings}
          events={events}
          timetable={timetable}
          studentProfile={studentProfile}
          nextClass={nextClass}
          isOpen={isSidebarOpen}
          onToggleOpen={() => setIsSidebarOpen(prev => !prev)}
          onSelectBuilding={(b) => setSelectedBuilding(b)}
          onSelectEvent={(e) => setSelectedEvent(e)}
          onStartRoute={handleStartRoute}
          onOpenTimetable={() => setIsTimetableOpen(true)}
          onRegisterEvent={handleRegisterEvent}
        />

        {/* Center / Full Canvas: Interactive 3D Digital Twin Campus Map */}
        <main className="relative flex-1 h-full overflow-hidden bg-slate-950">
          <CampusMap
            buildings={buildings}
            events={events}
            selectedBuilding={selectedBuilding}
            selectedEvent={selectedEvent}
            activeCategoryFilter={activeCategoryFilter}
            isLiveMode={isLiveMode}
            activeRoute={activeRoute}
            studentProfile={studentProfile}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
            onSelectEvent={(e) => setSelectedEvent(e)}
            onStartRoute={handleStartRoute}
            onSetStudentLocation={handleSetStudentLocation}
          />
        </main>
      </div>

      {/* 4. MODALS & SLIDE-OVER PANELS */}

      {/* Building Details Slide-over Drawer */}
      <BuildingDrawer
        building={selectedBuilding}
        events={events}
        studentProfile={studentProfile}
        onClose={() => setSelectedBuilding(null)}
        onSelectEvent={(e) => setSelectedEvent(e)}
        onStartRoute={handleStartRoute}
        onSetStudentLocation={handleSetStudentLocation}
      />

      {/* Event Details Card Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRegister={handleRegisterEvent}
        onBookmark={handleBookmarkEvent}
        onStartRoute={handleStartRoute}
      />

      {/* Active Navigation HUD Card */}
      <NavigationCard
        route={activeRoute}
        buildings={buildings}
        onEndRoute={handleEndRoute}
      />

      {/* Campus Copilot AI Chat Widget */}
      <CampusCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        buildings={buildings}
        events={events}
        timetable={timetable}
        studentProfile={studentProfile}
        onSelectBuilding={(b) => setSelectedBuilding(b)}
        onStartRoute={handleStartRoute}
        onFilterCategory={(cat) => setActiveCategoryFilter(cat)}
      />

      {/* Student Timetable Modal */}
      <TimetableModal
        isOpen={isTimetableOpen}
        onClose={() => setIsTimetableOpen(false)}
        timetable={timetable}
        buildings={buildings}
        onUpdateTimetable={setTimetable}
        onStartRoute={handleStartRoute}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        buildings={buildings}
        events={events}
        announcements={announcements}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
        onAddAnnouncement={handleAddAnnouncement}
        onAddRoom={handleAddRoom}
      />
    </div>
  );
}
