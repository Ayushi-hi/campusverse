import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Trash2
} from 'lucide-react';
import { CampusEvent, Building, EventCategory, CampusAnnouncement, Room } from '../types';
import { playTapSound, playRegisterSuccessSound } from '../utils/soundEffects';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildings: Building[];
  events: CampusEvent[];
  announcements: CampusAnnouncement[];
  onAddEvent: (newEvent: CampusEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onAddAnnouncement: (announcement: CampusAnnouncement) => void;
  onAddRoom: (buildingId: string, room: Room) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  buildings,
  events,
  announcements,
  onAddEvent,
  onDeleteEvent,
  onAddAnnouncement,
  onAddRoom
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'announcements' | 'buildings'>('events');

  // Event creation form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('hackathons');
  const [buildingId, setBuildingId] = useState(buildings[0]?.id || 'block-a');
  const [venueName, setVenueName] = useState('Innovation Lab - Floor 3');
  const [startTime, setStartTime] = useState('02:00 PM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [organizer, setOrganizer] = useState('Campus Dev Guild');
  const [description, setDescription] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(150);
  const [image] = useState('https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80');

  // Announcement creation form state
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annUrgency, setAnnUrgency] = useState<'info' | 'urgent' | 'highlight'>('urgent');

  // Room addition state
  const [roomBuildingId, setRoomBuildingId] = useState(buildings[0]?.id || 'block-a');
  const [roomNumber, setRoomNumber] = useState('B302');
  const [roomName, setRoomName] = useState('Interactive Media Lab');
  const [roomFloor, setRoomFloor] = useState(3);
  const [roomType, setRoomType] = useState<Room['type']>('lab');
  const [roomCapacity, setRoomCapacity] = useState(45);

  if (!isOpen) return null;

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    playRegisterSuccessSound();
    const b = buildings.find(item => item.id === buildingId);

    const newEvt: CampusEvent = {
      id: `evt-${Date.now()}`,
      title,
      description: description || 'New dynamic campus event open for all students and clubs.',
      category,
      buildingId,
      venueName: venueName || b?.name || 'Campus Venue',
      date: 'Today',
      startTime,
      endTime,
      isLiveNow: true,
      organizer,
      attendeesCount: 1,
      maxParticipants: Number(maxParticipants) || 100,
      tags: [category, 'Campus2026', 'Live'],
      image,
      registrationOpen: true
    };

    onAddEvent(newEvt);
    setTitle('');
    setDescription('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;

    playRegisterSuccessSound();
    const newAnn: CampusAnnouncement = {
      id: `ann-${Date.now()}`,
      title: annTitle,
      message: annMessage,
      urgency: annUrgency,
      timestamp: 'Just now',
      author: 'Campus Operations Center'
    };

    onAddAnnouncement(newAnn);
    setAnnTitle('');
    setAnnMessage('');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !roomNumber.trim()) return;

    playRegisterSuccessSound();
    const newR: Room = {
      id: `room-${Date.now()}`,
      buildingId: roomBuildingId,
      roomNumber,
      name: roomName,
      floor: Number(roomFloor),
      type: roomType,
      capacity: Number(roomCapacity),
      isOccupied: false
    };

    onAddRoom(roomBuildingId, newR);
    setRoomNumber('');
    setRoomName('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 max-h-[88vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-display text-slate-900">
                  Campusverse Admin Console
                </h2>
                <p className="text-xs text-slate-500">
                  Manage live campus events, urgent alerts, and room schedules
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playTapSound();
                onClose();
              }}
              className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Tabs */}
          <div className="flex border-b border-slate-200 bg-white text-xs font-semibold">
            <button
              onClick={() => {
                playTapSound();
                setActiveTab('events');
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === 'events'
                  ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              🎉 Event Creator ({events.length})
            </button>
            <button
              onClick={() => {
                playTapSound();
                setActiveTab('announcements');
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === 'announcements'
                  ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📢 Announcements ({announcements.length})
            </button>
            <button
              onClick={() => {
                playTapSound();
                setActiveTab('buildings');
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === 'buildings'
                  ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              🏫 Add Room / Facility
            </button>
          </div>

          {/* Admin Content Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* TAB 1: CREATE EVENT */}
            {activeTab === 'events' && (
              <div className="space-y-5">
                <form onSubmit={handleCreateEvent} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Create & Broadcast New Campus Event
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold">Event Title</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. AI Prompt Challenge 2026"
                        className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as EventCategory)}
                        className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        <option value="hackathons">Hackathon / Coding</option>
                        <option value="workshops">Workshop / Masterclass</option>
                        <option value="classes">Special Lecture</option>
                        <option value="clubs">Club Activity</option>
                        <option value="events">Cultural Event</option>
                        <option value="sports">Sports Tournament</option>
                        <option value="food">Food / Canteen Pop-up</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold">Building</label>
                      <select
                        value={buildingId}
                        onChange={(e) => setBuildingId(e.target.value)}
                        className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        {buildings.map(b => (
                          <option key={b.id} value={b.id}>{b.name.split('(')[0]}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold">Venue / Room</label>
                      <input
                        type="text"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        placeholder="e.g. Grand Auditorium"
                        className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold">Start & End Time</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          placeholder="02:00 PM"
                          className="w-1/2 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-slate-400 font-bold">to</span>
                        <input
                          type="text"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          placeholder="05:00 PM"
                          className="w-1/2 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold">Max Participants</label>
                      <input
                        type="number"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(Number(e.target.value))}
                        className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold">Description</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief details about the event..."
                      className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Publish Event To 3D Map 🚀
                    </button>
                  </div>
                </form>

                {/* Existing Events Management */}
                <div>
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Live Campus Events ({events.length})
                  </h4>
                  <div className="space-y-2">
                    {events.map(e => (
                      <div
                        key={e.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{e.title}</div>
                          <div className="text-[10px] text-slate-500">{e.venueName} • {e.startTime}</div>
                        </div>

                        <button
                          onClick={() => {
                            playTapSound();
                            onDeleteEvent(e.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <div className="space-y-5">
                <form onSubmit={handleCreateAnnouncement} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Post Campus-Wide Announcement
                  </h3>

                  <div className="text-xs space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold">Title</label>
                      <input
                        type="text"
                        required
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        placeholder="e.g. 🚨 Tech Hub Power Maintenance Tonight"
                        className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold">Message</label>
                      <textarea
                        rows={2}
                        required
                        value={annMessage}
                        onChange={(e) => setAnnMessage(e.target.value)}
                        placeholder="Detailed campus broadcast message..."
                        className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold">Priority</label>
                      <select
                        value={annUrgency}
                        onChange={(e) => setAnnUrgency(e.target.value as any)}
                        className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800"
                      >
                        <option value="urgent">Urgent Alert</option>
                        <option value="highlight">Highlight Notification</option>
                        <option value="info">General Info</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Broadcast Announcement 📢
                    </button>
                  </div>
                </form>

                {/* Existing announcements */}
                <div className="space-y-2">
                  {announcements.map(ann => (
                    <div
                      key={ann.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="font-bold text-slate-900">{ann.title}</div>
                      <p className="text-slate-600 mt-1 text-[11px]">{ann.message}</p>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono">{ann.author} • {ann.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ADD ROOM */}
            {activeTab === 'buildings' && (
              <form onSubmit={handleCreateRoom} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Add New Classroom / Facility to Building
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold">Target Building</label>
                    <select
                      value={roomBuildingId}
                      onChange={(e) => setRoomBuildingId(e.target.value)}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800"
                    >
                      {buildings.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold">Room Number</label>
                    <input
                      type="text"
                      required
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g. B302"
                      className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold">Room / Lab Name</label>
                    <input
                      type="text"
                      required
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="e.g. Autonomous Systems Lab"
                      className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold">Floor Number</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={roomFloor}
                      onChange={(e) => setRoomFloor(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold">Room Type</label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value as any)}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800"
                    >
                      <option value="classroom">Classroom / Lecture Hall</option>
                      <option value="lab">Computer / Hardware Lab</option>
                      <option value="auditorium">Auditorium / Theatre</option>
                      <option value="amenity">Canteen / Lounge</option>
                      <option value="sports">Gym / Sports Court</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold">Capacity</label>
                    <input
                      type="number"
                      value={roomCapacity}
                      onChange={(e) => setRoomCapacity(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Add Room to 3D Building 🏫
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
