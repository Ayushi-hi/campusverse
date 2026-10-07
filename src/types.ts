export type EventCategory = 
  | 'classes'
  | 'labs'
  | 'hackathons'
  | 'workshops'
  | 'clubs'
  | 'events'
  | 'announcements'
  | 'sports'
  | 'food';

export interface Room {
  id: string;
  buildingId: string;
  roomNumber: string;
  name: string;
  floor: number;
  type: 'classroom' | 'lab' | 'auditorium' | 'seminar' | 'office' | 'canteen' | 'sports';
  capacity: number;
  currentOccupancy?: number;
  currentClass?: string;
  currentProf?: string;
  isOccupied?: boolean;
}

export interface Building {
  id: string;
  code: string;
  name: string;
  tagline: string;
  type: 'academic' | 'lab' | 'auditorium' | 'hub' | 'library' | 'food' | 'sports' | 'outdoor';
  x: number; // percentage in map coordinate space (0-100)
  y: number;
  width: number;
  height: number;
  floors: number;
  color: string;
  accentColor: string;
  icon: string;
  rooms: Room[];
  facilities: string[];
  activeClassroomsCount: number;
  activeLabsCount: number;
  activeEventsCount: number;
  description: string;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Packed';
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  buildingId: string;
  roomId?: string;
  venueName: string;
  date: string;
  startTime: string; // e.g. "10:00 AM"
  endTime: string;   // e.g. "06:00 PM"
  isLiveNow: boolean;
  organizer: string;
  organizerAvatar?: string;
  attendeesCount: number;
  maxParticipants: number;
  tags: string[];
  image: string;
  isRegistered?: boolean;
  isBookmarked?: boolean;
  registrationOpen: boolean;
  prizes?: string;
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  subject: string;
  code: string;
  buildingId: string;
  roomId: string;
  venueName: string;
  professor: string;
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "10:30 AM"
  startMinutes: number; // minutes from midnight for easy sorting
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface StudentProfile {
  name: string;
  avatar: string;
  handle: string;
  department: string;
  semester: string;
  studentId: string;
  eventStreak: number;
  registeredEventIds: string[];
  bookmarkedEventIds: string[];
  currentLocationBuildingId: string;
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  message: string;
  urgency: 'info' | 'urgent' | 'highlight';
  timestamp: string;
  author: string;
}

export interface NavigationRoute {
  fromBuildingId: string;
  toBuildingId: string;
  destinationRoom?: string;
  distanceMeters: number;
  walkMinutes: number;
  steps: string[];
  pathPoints: { x: number; y: number }[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  action?: {
    type: 'focus_building' | 'show_route' | 'filter_category' | 'register_event';
    payload: any;
    label: string;
  };
}
