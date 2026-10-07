import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Navigation
} from 'lucide-react';
import { TimetableEntry, Building } from '../types';
import { playTapSound } from '../utils/soundEffects';

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetable: TimetableEntry[];
  buildings: Building[];
  onUpdateTimetable: (newTimetable: TimetableEntry[]) => void;
  onStartRoute: (buildingId: string, roomName?: string) => void;
}

export const TimetableModal: React.FC<TimetableModalProps> = ({
  isOpen,
  onClose,
  timetable,
  buildings,
  onUpdateTimetable,
  onStartRoute
}) => {
  const [activeDay, setActiveDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [isAdding, setIsAdding] = useState(false);

  // New class form fields
  const [newSubject, setNewSubject] = useState('');
  const [newCode, setNewCode] = useState('CS202');
  const [newBuildingId, setNewBuildingId] = useState(buildings[0]?.id || 'block-a');
  const [newRoomName, setNewRoomName] = useState('Room A101');
  const [newProf, setNewProf] = useState('');
  const [newStartTime, setNewStartTime] = useState('09:00 AM');
  const [newEndTime, setNewEndTime] = useState('10:30 AM');
  const [newType, setNewType] = useState<'Lecture' | 'Lab' | 'Tutorial'>('Lecture');

  if (!isOpen) return null;

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  const filteredTimetable = timetable.filter(t => t.day === activeDay);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    playTapSound();
    const building = buildings.find(b => b.id === newBuildingId);

    const newEntry: TimetableEntry = {
      id: `tt-${Date.now()}`,
      day: activeDay,
      subject: newSubject,
      code: newCode,
      buildingId: newBuildingId,
      roomId: `room-${Date.now()}`,
      venueName: `${building?.name.split('(')[0] || 'Campus'} - ${newRoomName}`,
      professor: newProf || 'Faculty Instructor',
      startTime: newStartTime,
      endTime: newEndTime,
      startMinutes: 540,
      type: newType
    };

    onUpdateTimetable([...timetable, newEntry]);
    setNewSubject('');
    setIsAdding(false);
  };

  const handleDeleteClass = (id: string) => {
    playTapSound();
    onUpdateTimetable(timetable.filter(t => t.id !== id));
  };

  const applyPreset = (presetName: string) => {
    playTapSound();
    if (presetName === 'cs_ai') {
      onUpdateTimetable([
        { id: 'tt-1', day: 'Monday', subject: 'Data Structures & Algorithms', code: 'CS201', buildingId: 'block-a', roomId: 'room-a101', venueName: 'Turing Hall (A101)', professor: 'Dr. Sarah Vance', startTime: '09:00 AM', endTime: '10:30 AM', startMinutes: 540, type: 'Lecture' },
        { id: 'tt-2', day: 'Monday', subject: 'Cloud Computing & Distributed Systems', code: 'CS304', buildingId: 'innovation-lab', roomId: 'room-lab3', venueName: 'Lab 3 (Floor 3)', professor: 'Prof. Alex Mercer', startTime: '11:00 AM', endTime: '12:45 PM', startMinutes: 660, type: 'Lab' },
        { id: 'tt-3', day: 'Monday', subject: 'Human-Computer Interaction (HCI)', code: 'CS208', buildingId: 'block-b', roomId: 'room-b204', venueName: 'Design Studio B204', professor: 'Prof. Elena Rostova', startTime: '02:00 PM', endTime: '03:30 PM', startMinutes: 840, type: 'Lecture' },
        { id: 'tt-4', day: 'Tuesday', subject: 'Machine Learning Foundations', code: 'AI301', buildingId: 'innovation-lab', roomId: 'room-lab1', venueName: 'GPU Cluster Lab', professor: 'Dr. David Cho', startTime: '10:00 AM', endTime: '12:00 PM', startMinutes: 600, type: 'Lecture' },
        { id: 'tt-5', day: 'Wednesday', subject: 'Operating Systems Kernel Engineering', code: 'CS204', buildingId: 'block-a', roomId: 'room-a201', venueName: 'Lecture Hall A201', professor: 'Prof. Marcus Brody', startTime: '09:30 AM', endTime: '11:00 AM', startMinutes: 570, type: 'Lecture' },
        { id: 'tt-6', day: 'Thursday', subject: 'Cybersecurity & Cryptography', code: 'SEC302', buildingId: 'block-b', roomId: 'room-b102', venueName: 'Security Lab B102', professor: 'Dr. Aris Thorne', startTime: '01:00 PM', endTime: '03:00 PM', startMinutes: 780, type: 'Lab' },
        { id: 'tt-7', day: 'Friday', subject: 'Tech Venture Studio & Pitching', code: 'ENT201', buildingId: 'auditorium', roomId: 'room-aud', venueName: 'Grand Auditorium', professor: 'Guest Founders', startTime: '03:00 PM', endTime: '05:00 PM', startMinutes: 900, type: 'Lecture' }
      ]);
    } else if (presetName === 'design') {
      onUpdateTimetable([
        { id: 'tt-1', day: 'Monday', subject: 'Spatial Computing & 3D Web UI', code: 'DES301', buildingId: 'innovation-lab', roomId: 'room-lab3', venueName: 'Interactive Lab', professor: 'Prof. Chloe Rivera', startTime: '10:00 AM', endTime: '12:30 PM', startMinutes: 600, type: 'Lab' },
        { id: 'tt-2', day: 'Tuesday', subject: 'Typography & Motion Graphics', code: 'DES204', buildingId: 'block-b', roomId: 'room-b204', venueName: 'Design Studio B204', professor: 'Elena Vance', startTime: '01:00 PM', endTime: '03:30 PM', startMinutes: 780, type: 'Lecture' },
        { id: 'tt-3', day: 'Thursday', subject: 'Generative Design Workshop', code: 'DES402', buildingId: 'innovation-lab', roomId: 'room-lab1', venueName: 'VR / GenAI Bay', professor: 'Marcus Brody', startTime: '02:00 PM', endTime: '04:00 PM', startMinutes: 840, type: 'Tutorial' }
      ]);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-display text-slate-900">
                  Student Class Timetable & Schedule
                </h2>
                <p className="text-xs text-slate-500">
                  Interactive schedule linked directly to your 3D campus twin
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

          {/* Preset Quick Fill & Add Class Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 font-bold">PRESETS:</span>
              <button
                onClick={() => applyPreset('cs_ai')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors shadow-xs"
              >
                CS & AI Junior Year
              </button>
              <button
                onClick={() => applyPreset('design')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors shadow-xs"
              >
                Design & Digital Media
              </button>
            </div>

            <button
              onClick={() => {
                playTapSound();
                setIsAdding(!isAdding);
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Class</span>
            </button>
          </div>

          {/* Add Class Form Drawer */}
          {isAdding && (
            <form onSubmit={handleAddClass} className="p-4 bg-slate-50/80 border-b border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-600 font-semibold">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Neural Networks & Deep Learning"
                    className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-semibold">Campus Building</label>
                  <select
                    value={newBuildingId}
                    onChange={(e) => setNewBuildingId(e.target.value)}
                    className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {buildings.map(b => (
                      <option key={b.id} value={b.id}>{b.name.split('(')[0]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-semibold">Room / Lab Number</label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g. Lab 3 (Floor 2)"
                    className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-semibold">Professor Name</label>
                  <input
                    type="text"
                    value={newProf}
                    onChange={(e) => setNewProf(e.target.value)}
                    placeholder="e.g. Dr. Jane Doe"
                    className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-semibold">Time Window</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      placeholder="09:00 AM"
                      className="w-1/2 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400 font-bold">to</span>
                    <input
                      type="text"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                      placeholder="10:30 AM"
                      className="w-1/2 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-semibold">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab Session</option>
                    <option value="Tutorial">Tutorial / Discussion</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  Save to Schedule
                </button>
              </div>
            </form>
          )}

          {/* Day Tabs */}
          <div className="flex items-center px-4 border-b border-slate-200 bg-white gap-2">
            {days.map(d => {
              const count = timetable.filter(t => t.day === d).length;
              const isSelected = activeDay === d;
              return (
                <button
                  key={d}
                  onClick={() => {
                    playTapSound();
                    setActiveDay(d);
                  }}
                  className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    isSelected 
                      ? 'border-blue-600 text-blue-600 font-bold' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{d}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timetable List Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredTimetable.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No classes scheduled for {activeDay}. Enjoy your free time or add one using the button above!
              </div>
            ) : (
              filteredTimetable.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 self-stretch rounded-full bg-blue-600 my-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {item.subject}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {item.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1 text-slate-700">
                          <Clock className="w-3 h-3 text-blue-600" />
                          {item.startTime} - {item.endTime}
                        </span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          {item.venueName}
                        </span>
                        <span>👨‍🏫 {item.professor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        playTapSound();
                        onStartRoute(item.buildingId, item.venueName);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors border border-blue-200"
                    >
                      <Navigation className="w-3 h-3 text-blue-600" />
                      <span>Take me there</span>
                    </button>

                    <button
                      onClick={() => handleDeleteClass(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Class"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
