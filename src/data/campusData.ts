import { Building, CampusEvent, TimetableEntry, StudentProfile, CampusAnnouncement } from '../types';

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'block-a',
    code: 'BLK-A',
    name: 'Block A (Science & Academic Wing)',
    tagline: 'Main Academic Lecture Theatres & Smart Classrooms',
    type: 'academic',
    x: 28,
    y: 26,
    width: 140,
    height: 100,
    floors: 4,
    color: '#3b82f6',
    accentColor: '#60a5fa',
    icon: 'School',
    facilities: ['Wi-Fi 7 Gigabit', 'AC Lecture Halls', 'Elevators', 'Water Dispenser', 'Vending Machines'],
    activeClassroomsCount: 8,
    activeLabsCount: 2,
    activeEventsCount: 2,
    description: 'Home to Mathematics, Physics, and Foundational CS lectures. Equipped with interactive dual-laser projection halls.',
    crowdLevel: 'High',
    rooms: [
      { id: 'room-a101', buildingId: 'block-a', roomNumber: 'A101', name: 'Turing Hall', floor: 1, type: 'auditorium', capacity: 180, currentClass: 'Data Structures & Algorithms', currentProf: 'Dr. Sarah Vance', isOccupied: true },
      { id: 'room-a201', buildingId: 'block-a', roomNumber: 'A201', name: 'Lecture Hall 2A', floor: 2, type: 'classroom', capacity: 65, currentClass: 'Discrete Mathematics', currentProf: 'Prof. Miller', isOccupied: true },
      { id: 'room-a302', buildingId: 'block-a', roomNumber: 'A302', name: 'Smart Room 302', floor: 3, type: 'classroom', capacity: 55, currentClass: 'DBMS Architecture', currentProf: 'Dr. Raymond Holt', isOccupied: false },
      { id: 'room-a405', buildingId: 'block-a', roomNumber: 'A405', name: 'Seminar Suite Alpha', floor: 4, type: 'seminar', capacity: 40, isOccupied: false }
    ]
  },
  {
    id: 'block-b',
    code: 'BLK-B',
    name: 'Block B (Engineering Wing)',
    tagline: 'Software Architecture, IoT & Cloud Laboratories',
    type: 'academic',
    x: 72,
    y: 26,
    width: 140,
    height: 100,
    floors: 4,
    color: '#8b5cf6',
    accentColor: '#a78bfa',
    icon: 'Cpu',
    facilities: ['High-Power Workstations', 'GPU Cluster Access', 'Study Booths', 'Locker Room'],
    activeClassroomsCount: 7,
    activeLabsCount: 4,
    activeEventsCount: 3,
    description: 'Engineering nerve center featuring specialized systems engineering, compiler labs, and electronics prototyping.',
    crowdLevel: 'Moderate',
    rooms: [
      { id: 'room-b102', buildingId: 'block-b', roomNumber: 'B102', name: 'Systems Engineering Room', floor: 1, type: 'classroom', capacity: 70, currentClass: 'Operating Systems Internals', currentProf: 'Prof. Dennis Ritchie Jr.', isOccupied: true },
      { id: 'room-b204', buildingId: 'block-b', roomNumber: 'B204', name: 'Room B204 (Data Structures)', floor: 2, type: 'classroom', capacity: 60, currentClass: 'Advanced Algorithms', currentProf: 'Dr. Aris Thorne', isOccupied: true },
      { id: 'room-b305', buildingId: 'block-b', roomNumber: 'B305', name: 'Network Security Lab', floor: 3, type: 'lab', capacity: 45, isOccupied: false }
    ]
  },
  {
    id: 'innovation-lab',
    code: 'LAB-X',
    name: 'Innovation & AI Labs',
    tagline: 'Deep Learning, Robotics & Quantum Sandbox',
    type: 'lab',
    x: 18,
    y: 52,
    width: 130,
    height: 95,
    floors: 3,
    color: '#06b6d4',
    accentColor: '#22d3ee',
    icon: 'FlaskConical',
    facilities: ['NVIDIA H100 Cluster', 'Motion Capture Rig', '3D Printers', 'Soldering Benches', 'VR Arenas'],
    activeClassroomsCount: 2,
    activeLabsCount: 6,
    activeEventsCount: 4,
    description: '24/7 maker and experimental research space where hackathons, AI hack sprints, and breakthrough demos live.',
    crowdLevel: 'Packed',
    rooms: [
      { id: 'room-lab1', buildingId: 'innovation-lab', roomNumber: 'Lab 1', name: 'Robotics & Drone Bay', floor: 1, type: 'lab', capacity: 35, currentClass: 'Autonomous Navigation', currentProf: 'Dr. Elena Rostova', isOccupied: true },
      { id: 'room-lab2', buildingId: 'innovation-lab', roomNumber: 'Lab 2', name: 'Spatial Computing & XR Lab', floor: 2, type: 'lab', capacity: 30, isOccupied: false },
      { id: 'room-lab3', buildingId: 'innovation-lab', roomNumber: 'Lab 3', name: 'Cloud Computing & Distributed Systems', floor: 3, type: 'lab', capacity: 50, currentClass: 'Cloud Computing 301', currentProf: 'Prof. Alex Mercer', isOccupied: true }
    ]
  },
  {
    id: 'auditorium',
    code: 'AUD-MAIN',
    name: 'Grand Auditorium & Main Hall',
    tagline: '750-Seat Keynote & Global Symposium Venue',
    type: 'auditorium',
    x: 82,
    y: 52,
    width: 130,
    height: 95,
    floors: 2,
    color: '#f43f5e',
    accentColor: '#fb7185',
    icon: 'Mic',
    facilities: ['Dolby Atmos Audio', 'Live Broadcast Studio', 'VIP Green Rooms', 'Simultaneous Translation'],
    activeClassroomsCount: 0,
    activeLabsCount: 0,
    activeEventsCount: 2,
    description: 'The premier college venue for international tech keynotes, startup pitch fests, cultural concerts, and campus convocations.',
    crowdLevel: 'Packed',
    rooms: [
      { id: 'room-aud-hall', buildingId: 'auditorium', roomNumber: 'Hall 1', name: 'Oppenheimer Keynote Amphitheatre', floor: 1, type: 'auditorium', capacity: 750, isOccupied: true },
      { id: 'room-aud-balcony', buildingId: 'auditorium', roomNumber: 'Balcony A', name: 'Upper Observation Deck', floor: 2, type: 'seminar', capacity: 120, isOccupied: false }
    ]
  },
  {
    id: 'central-library',
    code: 'LIB-CORE',
    name: 'Central Library & Knowledge Commons',
    tagline: 'Silent Study Pods, Digital Archives & Espresso Bar',
    type: 'library',
    x: 50,
    y: 18,
    width: 150,
    height: 90,
    floors: 5,
    color: '#10b981',
    accentColor: '#34d399',
    icon: 'BookOpen',
    facilities: ['Soundproof Study Pods', 'Kindle Lending Desk', 'Silent Floor', 'Special Collections', '24/7 Night Lounge'],
    activeClassroomsCount: 1,
    activeLabsCount: 1,
    activeEventsCount: 1,
    description: 'Five floors of ultra-focused study atmosphere with floor-to-ceiling glass architecture overlooking the Central Lawn.',
    crowdLevel: 'Moderate',
    rooms: [
      { id: 'room-lib-pod1', buildingId: 'central-library', roomNumber: 'Pod 402', name: 'Acoustic Focus Cubicle', floor: 4, type: 'classroom', capacity: 6, isOccupied: false },
      { id: 'room-lib-rare', buildingId: 'central-library', roomNumber: 'Room 501', name: 'Archive Reading Room', floor: 5, type: 'seminar', capacity: 25, isOccupied: false }
    ]
  },
  {
    id: 'central-lawn',
    code: 'LAWN',
    name: 'Central Lawn & Amphitheatre',
    tagline: 'Heart of Campus Vibe & Open Air Gatherings',
    type: 'outdoor',
    x: 50,
    y: 48,
    width: 160,
    height: 100,
    floors: 1,
    color: '#84cc16',
    accentColor: '#a3e635',
    icon: 'Trees',
    facilities: ['Solar Charging Benches', 'Ambient Campus Sound', 'Food Truck Bay', 'Hammock Zone', 'Giant Screen'],
    activeClassroomsCount: 0,
    activeLabsCount: 0,
    activeEventsCount: 3,
    description: 'The social epicentre where clubs jam, hackathon breaks happen, and festival stages pop up under the open sky.',
    crowdLevel: 'High',
    rooms: [
      { id: 'room-lawn-stage', buildingId: 'central-lawn', roomNumber: 'Lawn Stage', name: 'Sunken Amphitheatre Stage', floor: 1, type: 'auditorium', capacity: 500, isOccupied: true }
    ]
  },
  {
    id: 'canteen',
    code: 'CAFE',
    name: 'The Neon Canteen & Food Court',
    tagline: 'Fueling Student Brains with Artisanal Street Eats',
    type: 'food',
    x: 24,
    y: 80,
    width: 130,
    height: 95,
    floors: 2,
    color: '#f97316',
    accentColor: '#fb923c',
    icon: 'Coffee',
    facilities: ['Fast RFID Checkout', 'Boba Counter', 'Woodfired Pizza', 'Vegan Delights', 'Outdoor Patio'],
    activeClassroomsCount: 0,
    activeLabsCount: 0,
    activeEventsCount: 2,
    description: 'Vibrant culinary hub bustling with music, board games, hot meals, and high-octane caffeine runs.',
    crowdLevel: 'Packed',
    rooms: [
      { id: 'room-cafe-upper', buildingId: 'canteen', roomNumber: 'Mezzanine', name: 'Rooftop Chill Deck', floor: 2, type: 'canteen', capacity: 110, isOccupied: false }
    ]
  },
  {
    id: 'tech-hub',
    code: 'HUB',
    name: 'Tech Hub & Student Startup Pods',
    tagline: 'Venture Incubation, Coding Guilds & Creator Studios',
    type: 'hub',
    x: 76,
    y: 80,
    width: 130,
    height: 95,
    floors: 3,
    color: '#ec4899',
    accentColor: '#f472b6',
    icon: 'Terminal',
    facilities: ['Podcast Soundbooths', 'Venture Capital Pitch Room', 'Whiteboard Walls', 'Ping Pong Table', 'Coffee Bar'],
    activeClassroomsCount: 2,
    activeLabsCount: 3,
    activeEventsCount: 3,
    description: 'Where campus founders build the next unicorns. Open 24/7 for sprint week, game jams, and open source workshops.',
    crowdLevel: 'High',
    rooms: [
      { id: 'room-hub-pitch', buildingId: 'tech-hub', roomNumber: 'Pod 1', name: 'Founders Arena', floor: 1, type: 'seminar', capacity: 45, isOccupied: true },
      { id: 'room-hub-jam', buildingId: 'tech-hub', roomNumber: 'Hacker Den', name: 'Open Collaboration Studio', floor: 2, type: 'lab', capacity: 80, isOccupied: true }
    ]
  },
  {
    id: 'sports-complex',
    code: 'ARENA',
    name: 'Sports Complex & Esports Arena',
    tagline: 'Indoor Basketball, Olympic Pool & LAN Stage',
    type: 'sports',
    x: 50,
    y: 84,
    width: 140,
    height: 90,
    floors: 2,
    color: '#0ea5e9',
    accentColor: '#38bdf8',
    icon: 'Trophy',
    facilities: ['FIBA Wooden Court', 'Esports Gaming Rig (60 PCs)', 'CrossFit Gym', 'Heated Lap Pool', 'Spectator Bleachers'],
    activeClassroomsCount: 0,
    activeLabsCount: 0,
    activeEventsCount: 2,
    description: 'Home of the campus varsity teams and collegiate esports champions. Tournaments every weekend.',
    crowdLevel: 'Moderate',
    rooms: [
      { id: 'room-arena-court', buildingId: 'sports-complex', roomNumber: 'Court 1', name: 'Main Basketball Arena', floor: 1, type: 'sports', capacity: 400, isOccupied: true },
      { id: 'room-arena-esports', buildingId: 'sports-complex', roomNumber: 'LAN Hub', name: 'Esports Battle Station', floor: 2, type: 'sports', capacity: 90, isOccupied: false }
    ]
  }
];

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'AI HACKATHON 2026: Agentic Futures',
    description: '36-hour sprint building autonomous multi-agent systems and spatial apps. $15,000 cash prizes, venture capital scouts, and free energy drinks!',
    category: 'hackathons',
    buildingId: 'innovation-lab',
    roomId: 'room-lab3',
    venueName: 'Innovation Lab (Floor 3 - Cloud Lab)',
    date: 'Today',
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    isLiveNow: true,
    organizer: 'Campus AI Club & Google Developer Group',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    attendeesCount: 142,
    maxParticipants: 180,
    tags: ['AI', 'Hackathon', 'Cash Prize', 'Agents', 'Cloud'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    isRegistered: true,
    isBookmarked: true,
    registrationOpen: true,
    prizes: '$15,000 + Cloud Credits'
  },
  {
    id: 'evt-2',
    title: 'Keynote: The Post-Quantum Silicon Era',
    description: 'Distinguished lecture by Dr. Maya Lin on topological qubits, scalable quantum algorithms, and next-generation cryptographic resilience.',
    category: 'events',
    buildingId: 'auditorium',
    roomId: 'room-aud-hall',
    venueName: 'Main Auditorium (Oppenheimer Hall)',
    date: 'Today',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    isLiveNow: false,
    organizer: 'Quantum Computing Research Society',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    attendeesCount: 520,
    maxParticipants: 750,
    tags: ['Keynote', 'Quantum', 'Hardware', 'Physics'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    isRegistered: false,
    isBookmarked: true,
    registrationOpen: true
  },
  {
    id: 'evt-3',
    title: '3v3 Sunset Streetball Showdown',
    description: 'High energy half-court tournament with live DJ beat sets, custom merch giveaways, and intramural championship points.',
    category: 'sports',
    buildingId: 'sports-complex',
    roomId: 'room-arena-court',
    venueName: 'Sports Complex (Court 1)',
    date: 'Today',
    startTime: '04:30 PM',
    endTime: '07:00 PM',
    isLiveNow: false,
    organizer: 'Campus Athletics & Basketball Guild',
    attendeesCount: 88,
    maxParticipants: 100,
    tags: ['Basketball', 'Tournament', 'Live DJ', 'Prizes'],
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
    isRegistered: false,
    isBookmarked: false,
    registrationOpen: true
  },
  {
    id: 'evt-4',
    title: 'Zero-to-One Rust Systems Workshop',
    description: 'Hands-on live coding workshop building high-throughput memory-safe web services from scratch. Bring your laptops!',
    category: 'workshops',
    buildingId: 'block-b',
    roomId: 'room-b102',
    venueName: 'Block B (Room B102)',
    date: 'Today',
    startTime: '11:30 AM',
    endTime: '01:00 PM',
    isLiveNow: true,
    organizer: 'Rustaceans Student Chapter',
    attendeesCount: 56,
    maxParticipants: 70,
    tags: ['Rust', 'Systems', 'Backend', 'Hands-on'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    isRegistered: false,
    isBookmarked: false,
    registrationOpen: true
  },
  {
    id: 'evt-5',
    title: 'Matcha & UI/UX Figma Jam',
    description: 'Chill creative design critique, kinetic typography masterclass, and free iced strawberry matcha lattes for all attendees.',
    category: 'clubs',
    buildingId: 'tech-hub',
    roomId: 'room-hub-jam',
    venueName: 'Tech Hub (Open Collaboration Studio)',
    date: 'Today',
    startTime: '03:00 PM',
    endTime: '05:00 PM',
    isLiveNow: false,
    organizer: 'HyperDesign Collective',
    attendeesCount: 64,
    maxParticipants: 80,
    tags: ['Design', 'Figma', 'Matcha', 'Gen-Z'],
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    isRegistered: false,
    isBookmarked: true,
    registrationOpen: true
  },
  {
    id: 'evt-6',
    title: 'Acoustic Jam Session on the Grass',
    description: 'Unplugged guitar, synth jams, and indie vocals under the solar lights on the Central Lawn. Bring instruments or just vibe.',
    category: 'clubs',
    buildingId: 'central-lawn',
    roomId: 'room-lawn-stage',
    venueName: 'Central Lawn Amphitheatre',
    date: 'Today',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    isLiveNow: false,
    organizer: 'Campus Music Society',
    attendeesCount: 110,
    maxParticipants: 300,
    tags: ['Music', 'Live Band', 'Lawn Vibe', 'Chill'],
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    isRegistered: false,
    isBookmarked: false,
    registrationOpen: true
  },
  {
    id: 'evt-7',
    title: 'Late Night Boba & Code Sprint',
    description: 'Flash food deal: 50% off all brown sugar milk teas with student ID. Co-working sprint till midnight at the Canteen mezzanine.',
    category: 'food',
    buildingId: 'canteen',
    roomId: 'room-cafe-upper',
    venueName: 'Neon Canteen (Upper Deck)',
    date: 'Today',
    startTime: '08:00 PM',
    endTime: '11:59 PM',
    isLiveNow: false,
    organizer: 'Canteen Student Union & ByteEats',
    attendeesCount: 95,
    maxParticipants: 150,
    tags: ['Food Deal', 'Boba', 'Late Night', 'Social'],
    image: 'https://images.unsplash.com/photo-1558857563-b37df26a6ef4?w=800&auto=format&fit=crop&q=80',
    isRegistered: false,
    isBookmarked: false,
    registrationOpen: true
  },
  {
    id: 'evt-8',
    title: 'Flash Announcement: Big Tech Placement Drive 2026',
    description: 'Google, Stripe, and Anthropic on-campus interview shortlist released! Check placement portals and prep rooms in Block A.',
    category: 'announcements',
    buildingId: 'block-a',
    venueName: 'Block A Notice Hub & Placement Suite',
    date: 'Today',
    startTime: '09:00 AM',
    endTime: '07:00 PM',
    isLiveNow: true,
    organizer: 'Career & Placement Cell',
    attendeesCount: 420,
    maxParticipants: 500,
    tags: ['Placement', 'Careers', 'Interviews', 'Tech'],
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
    isRegistered: false,
    isBookmarked: true,
    registrationOpen: true
  }
];

export const DEFAULT_TIMETABLE: TimetableEntry[] = [
  {
    id: 'tt-1',
    day: 'Monday',
    subject: 'Data Structures & Algorithms',
    code: 'CS201',
    buildingId: 'block-a',
    roomId: 'room-a101',
    venueName: 'Turing Hall (A101)',
    professor: 'Dr. Sarah Vance',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    startMinutes: 540,
    type: 'Lecture'
  },
  {
    id: 'tt-2',
    day: 'Monday',
    subject: 'Cloud Computing & Distributed Systems',
    code: 'CS304',
    buildingId: 'innovation-lab',
    roomId: 'room-lab3',
    venueName: 'Lab 3 (Floor 3)',
    professor: 'Prof. Alex Mercer',
    startTime: '11:00 AM',
    endTime: '12:45 PM',
    startMinutes: 660,
    type: 'Lab'
  },
  {
    id: 'tt-3',
    day: 'Monday',
    subject: 'Database Management Systems',
    code: 'CS206',
    buildingId: 'block-a',
    roomId: 'room-a302',
    venueName: 'Smart Room 302',
    professor: 'Dr. Raymond Holt',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    startMinutes: 840,
    type: 'Lecture'
  },
  {
    id: 'tt-4',
    day: 'Monday',
    subject: 'Operating Systems Internals',
    code: 'CS301',
    buildingId: 'block-b',
    roomId: 'room-b102',
    venueName: 'Room B102',
    professor: 'Prof. Dennis Ritchie Jr.',
    startTime: '04:00 PM',
    endTime: '05:30 PM',
    startMinutes: 960,
    type: 'Lecture'
  },
  {
    id: 'tt-5',
    day: 'Tuesday',
    subject: 'Autonomous Robotics Lab',
    code: 'AI402',
    buildingId: 'innovation-lab',
    roomId: 'room-lab1',
    venueName: 'Robotics Bay (Lab 1)',
    professor: 'Dr. Elena Rostova',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    startMinutes: 600,
    type: 'Lab'
  },
  {
    id: 'tt-6',
    day: 'Tuesday',
    subject: 'Compiler Design',
    code: 'CS308',
    buildingId: 'block-b',
    roomId: 'room-b204',
    venueName: 'Room B204',
    professor: 'Dr. Aris Thorne',
    startTime: '01:30 PM',
    endTime: '03:00 PM',
    startMinutes: 810,
    type: 'Lecture'
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  handle: '@arivera_cs',
  department: 'Computer Science & AI',
  semester: 'Semester 5 (Junior Year)',
  studentId: 'STU-2024-8841',
  eventStreak: 4,
  registeredEventIds: ['evt-1'],
  bookmarkedEventIds: ['evt-1', 'evt-2', 'evt-5'],
  currentLocationBuildingId: 'central-lawn' // Student starts at Central Lawn
};

export const INITIAL_ANNOUNCEMENTS: CampusAnnouncement[] = [
  {
    id: 'ann-1',
    title: '🚨 Central Lawn Wifi Upgrade Complete',
    message: 'Ultra-low latency Wi-Fi 7 is now active across the entire Central Lawn & Amphitheatre area.',
    urgency: 'highlight',
    timestamp: '20m ago',
    author: 'Campus IT Services'
  },
  {
    id: 'ann-2',
    title: '⚡ Innovation Lab 24-Hour Access for AI Hackathon',
    message: 'Badge scanners active tonight. Free pizza delivery scheduled at 8:30 PM in the Maker Bay.',
    urgency: 'urgent',
    timestamp: '1h ago',
    author: 'Dean of Student Affairs'
  }
];

// Campus path network connecting buildings for realistic routing
export const CAMPUS_WAYPOINTS: Record<string, { x: number; y: number }> = {
  'block-a': { x: 28, y: 26 },
  'block-b': { x: 72, y: 26 },
  'innovation-lab': { x: 18, y: 52 },
  'auditorium': { x: 82, y: 52 },
  'central-library': { x: 50, y: 18 },
  'central-lawn': { x: 50, y: 48 },
  'canteen': { x: 24, y: 80 },
  'tech-hub': { x: 76, y: 80 },
  'sports-complex': { x: 50, y: 84 },
  'crossroad-north': { x: 50, y: 32 },
  'crossroad-south': { x: 50, y: 68 },
  'path-west': { x: 34, y: 50 },
  'path-east': { x: 66, y: 50 }
};

export function calculateWalkingRoute(fromId: string, toId: string, destinationRoomName?: string): {
  distanceMeters: number;
  walkMinutes: number;
  steps: string[];
  pathPoints: { x: number; y: number }[];
} {
  const from = CAMPUS_WAYPOINTS[fromId] || CAMPUS_WAYPOINTS['central-lawn'];
  const to = CAMPUS_WAYPOINTS[toId] || CAMPUS_WAYPOINTS['block-a'];

  // Route passes through central crossroads for visual realism
  const pathPoints: { x: number; y: number }[] = [from];

  if (fromId !== 'central-lawn' && toId !== 'central-lawn') {
    // If navigating between different wings, path goes through central junction
    pathPoints.push({ x: 50, y: 48 });
  }
  pathPoints.push(to);

  // Approximate distance based on percentage coordinates
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const euclidean = Math.sqrt(dx * dx + dy * dy);
  const distanceMeters = Math.max(75, Math.round(euclidean * 4.5));
  const walkMinutes = Math.max(1, Math.round(distanceMeters / 70));

  const steps = [
    `Start from current location at ${fromId.replace('-', ' ').toUpperCase()}`,
    `Walk along paved avenue toward Central Campus (${Math.round(distanceMeters * 0.6)}m)`,
    `Turn towards ${toId.replace('-', ' ').toUpperCase()} plaza`,
    destinationRoomName ? `Enter building foyer and proceed to ${destinationRoomName}` : `Arrive at destination building`
  ];

  return {
    distanceMeters,
    walkMinutes,
    steps,
    pathPoints
  };
}

export const INITIAL_TIMETABLE: TimetableEntry[] = DEFAULT_TIMETABLE;
export const INITIAL_STUDENT: StudentProfile = INITIAL_STUDENT_PROFILE;
export const CAMPUS_PATHS = [];

export function findShortestRoute(
  fromId: string, 
  toId: string, 
  destinationRoomName?: string
) {
  const walk = calculateWalkingRoute(fromId, toId, destinationRoomName);
  return {
    fromBuildingId: fromId,
    toBuildingId: toId,
    destinationRoom: destinationRoomName,
    walkMinutes: walk.walkMinutes,
    distanceMeters: walk.distanceMeters,
    steps: walk.steps,
    pathPoints: walk.pathPoints
  };
}
