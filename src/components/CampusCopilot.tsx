import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  ArrowRight
} from 'lucide-react';
import { 
  Building, 
  CampusEvent, 
  CopilotMessage, 
  StudentProfile, 
  TimetableEntry 
} from '../types';
import { playTapSound } from '../utils/soundEffects';

interface CampusCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  buildings: Building[];
  events: CampusEvent[];
  timetable: TimetableEntry[];
  studentProfile: StudentProfile;
  onSelectBuilding: (building: Building) => void;
  onStartRoute: (toBuildingId: string, roomName?: string) => void;
  onFilterCategory: (category: any) => void;
}

export const CampusCopilot: React.FC<CampusCopilotProps> = ({
  isOpen,
  onClose,
  buildings,
  events,
  timetable,
  studentProfile,
  onSelectBuilding,
  onStartRoute,
  onFilterCategory
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'm-1',
      sender: 'copilot',
      text: "Hello! I'm your Campus Copilot 🤖. Ask me about your next class, live hackathons, food spots, or directions anywhere on campus!",
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const quickPrompts = [
    { text: "Where is my next class? 🚶", query: "Where is my next class?" },
    { text: "Are there any hackathons today? 💻", query: "Are there any hackathons today?" },
    { text: "Where is the AI Lab? 🧪", query: "Where is the AI Lab?" },
    { text: "What's happening right now? 🔥", query: "What is happening around campus right now?" },
    { text: "Find food / boba spots 🧋", query: "Where can I get food or boba?" },
    { text: "Show me Block B 🏫", query: "Where is Block B?" }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    playTapSound();

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Contextual campus intelligence matching
    setTimeout(() => {
      const q = text.toLowerCase();
      let reply = "";
      let action: CopilotMessage['action'] = undefined;

      if (q.includes('next class') || q.includes('my class')) {
        const next = timetable[0];
        if (next) {
          reply = `Your next class is ${next.subject} with ${next.professor} at ${next.startTime} in ${next.venueName}! It's a short 3-minute stroll from your current location.`;
          action = {
            label: `Navigate to ${next.venueName}`,
            type: 'show_route',
            payload: { toBuildingId: next.buildingId, destinationRoom: next.venueName }
          };
        } else {
          reply = "You don't have any classes scheduled right now. Time to explore or grab a snack!";
        }
      } else if (q.includes('hackathon') || q.includes('coding')) {
        const hackathon = events.find(e => e.category === 'hackathons');
        if (hackathon) {
          reply = `We have "${hackathon.title}" happening at ${hackathon.venueName}! Top prize: ${hackathon.prizes || 'Cash & Mentorship'}. ${hackathon.attendeesCount} builders registered.`;
          action = {
            label: `View ${hackathon.title}`,
            type: 'focus_building',
            payload: { buildingId: hackathon.buildingId }
          };
        } else {
          reply = "No active hackathons at this exact moment, but keep an eye on the Events tab!";
        }
      } else if (q.includes('food') || q.includes('eat') || q.includes('canteen') || q.includes('boba') || q.includes('snack')) {
        const canteen = buildings.find(b => b.id === 'canteen');
        reply = "The Neon Canteen is serving lunch right now! Check out the Matcha Boba & Crispy Tacos. The crowd is bustling!";
        if (canteen) {
          action = {
            label: "Take me to The Canteen",
            type: 'show_route',
            payload: { toBuildingId: canteen.id }
          };
        }
      } else if (q.includes('ai lab') || q.includes('innovation') || q.includes('lab')) {
        const lab = buildings.find(b => b.id === 'innovation-lab');
        reply = "The Innovation & AI Labs is in the west quad. Equipped with GPU clusters and robotics staging areas!";
        if (lab) {
          action = {
            label: "Inspect Innovation Labs",
            type: 'focus_building',
            payload: { buildingId: lab.id }
          };
        }
      } else if (q.includes('library') || q.includes('quiet') || q.includes('study')) {
        const lib = buildings.find(b => b.id === 'central-library');
        reply = "The Central Library has quiet study zones on Floor 2 and soundproof collaboration pods on Floor 3!";
        if (lib) {
          action = {
            label: "Route to Central Library",
            type: 'show_route',
            payload: { toBuildingId: lib.id }
          };
        }
      } else if (q.includes('block b') || q.includes('block a') || q.includes('sports') || q.includes('auditorium')) {
        const match = buildings.find(b => q.includes(b.name.toLowerCase()) || q.includes(b.code.toLowerCase()));
        if (match) {
          reply = `Found ${match.name}! It features ${match.floors} floors with ${match.rooms.length} rooms and labs.`;
          action = {
            label: `Focus on ${match.code}`,
            type: 'focus_building',
            payload: { buildingId: match.id }
          };
        } else {
          reply = "I found several spots matching that name. Let me show you the full campus directory!";
        }
      } else {
        reply = `Got it! I searched the campus digital twin for "${text}". Explore the interactive 3D map by clicking on any building to view real-time occupancy and events!`;
      }

      const botMsg: CopilotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'copilot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action
      };

      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
    }, 600);
  };

  const handleActionClick = (action: NonNullable<CopilotMessage['action']>) => {
    playTapSound();
    if (action.type === 'focus_building') {
      const b = buildings.find(item => item.id === action.payload.buildingId);
      if (b) {
        onSelectBuilding(b);
      }
    } else if (action.type === 'show_route') {
      onStartRoute(action.payload.toBuildingId, action.payload.destinationRoom);
    } else if (action.type === 'filter_category') {
      onFilterCategory(action.payload.category);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        id="campus-copilot-window"
        className="fixed bottom-6 right-6 z-50 w-[92%] sm:w-96 h-[540px] max-h-[85vh] bg-white/98 backdrop-blur-2xl border border-blue-200 rounded-3xl shadow-2xl flex flex-col text-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-3.5 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900 font-display">Campus Copilot</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  AI Grounded
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Live campus assistant</p>
            </div>
          </div>

          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}

                {/* Map Action Button if Copilot suggested one */}
                {msg.action && (
                  <button
                    onClick={() => handleActionClick(msg.action)}
                    className="mt-2.5 w-full py-1.5 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm group"
                  >
                    <span>{msg.action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-mono p-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Campus Copilot is thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Chips Carousel */}
        <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium whitespace-nowrap border border-slate-200 transition-colors shadow-xs"
            >
              {p.text}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Copilot anything..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};
