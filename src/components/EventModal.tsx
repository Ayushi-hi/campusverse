import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  X, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  Share2, 
  Bookmark, 
  Navigation, 
  Sparkles, 
  Trophy, 
  CheckCircle2
} from 'lucide-react';
import { CampusEvent } from '../types';
import { playTapSound, playRegisterSuccessSound } from '../utils/soundEffects';

interface EventModalProps {
  event: CampusEvent | null;
  onClose: () => void;
  onRegister: (eventId: string) => void;
  onBookmark: (eventId: string) => void;
  onStartRoute: (buildingId: string, roomName?: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  onRegister,
  onBookmark,
  onStartRoute
}) => {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const handleRegister = () => {
    playRegisterSuccessSound();
    onRegister(event.id);
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.65 }
    });
  };

  const handleShare = () => {
    playTapSound();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCalendar = () => {
    playTapSound();
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CampusVerse//Smart Campus Map//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.venueName}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const attendancePercent = Math.min(100, Math.round((event.attendeesCount / event.maxParticipants) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-800"
        >
          {/* Close button */}
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Event Header Poster Image */}
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges on Poster */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md">
                  {event.category}
                </span>

                {event.isLiveNow && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wider bg-rose-500 text-white flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    LIVE NOW
                  </span>
                )}
              </div>

              {event.prizes && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-amber-900 bg-amber-200/90 backdrop-blur-md flex items-center gap-1 shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-amber-700" />
                  {event.prizes}
                </span>
              )}
            </div>
          </div>

          {/* Event Body Content */}
          <div className="p-6 pt-4 space-y-4">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">
                {event.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{event.venueName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-600">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{event.date} • {event.startTime} - {event.endTime}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {event.description}
            </p>

            {/* Attendance & Capacity Meter */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-blue-600" />
                  Student Participation
                </span>
                <span className="font-mono font-bold text-blue-700">
                  {event.attendeesCount} / {event.maxParticipants} Spots
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${attendancePercent}%` }}
                />
              </div>
            </div>

            {/* Organizer Info & Tags */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-2">
                {event.organizerAvatar ? (
                  <img
                    src={event.organizerAvatar}
                    alt={event.organizer}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                    🎓
                  </div>
                )}
                <span className="text-slate-500 truncate max-w-[200px]">
                  Organized by <strong className="text-slate-800">{event.organizer}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    playTapSound();
                    onBookmark(event.id);
                  }}
                  className={`p-2 rounded-xl border transition-colors ${
                    event.isBookmarked 
                      ? 'bg-amber-50 text-amber-700 border-amber-300' 
                      : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
                  }`}
                  title="Bookmark Event"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-white text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors"
                  title="Share Event Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {copied && (
              <div className="text-center text-[11px] text-emerald-700 font-semibold bg-emerald-50 py-1 rounded-lg border border-emerald-200">
                ✓ Event link copied to clipboard!
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                id="modal-btn-get-directions"
                onClick={() => {
                  playTapSound();
                  onStartRoute(event.buildingId, event.venueName);
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>GET DIRECTIONS</span>
              </button>

              <button
                id="modal-btn-register"
                onClick={handleRegister}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                  event.isRegistered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                {event.isRegistered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>REGISTERED ✓</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>REGISTER NOW</span>
                  </>
                )}
              </button>
            </div>

            {/* Add to Calendar Sub-link */}
            <div className="text-center pt-1">
              <button
                onClick={handleDownloadCalendar}
                className="text-[11px] text-slate-500 hover:text-blue-600 underline font-mono inline-flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                Add to Google / Apple Calendar (.ics)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
