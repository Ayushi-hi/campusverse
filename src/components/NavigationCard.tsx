import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Navigation, 
  X, 
  ChevronRight, 
  CheckCircle2
} from 'lucide-react';
import { NavigationRoute, Building } from '../types';
import { playTapSound, playNavSuccessSound } from '../utils/soundEffects';

interface NavigationCardProps {
  route: NavigationRoute | null;
  buildings: Building[];
  onEndRoute: () => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  route,
  buildings,
  onEndRoute
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!route) return null;

  const destBuilding = buildings.find(b => b.id === route.toBuildingId);
  const startBuilding = buildings.find(b => b.id === route.fromBuildingId);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        id="active-navigation-hud"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg bg-white/95 backdrop-blur-2xl border border-blue-300 rounded-3xl p-4 shadow-2xl text-slate-800"
      >
        {/* Top Header: Destination & Stats */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md animate-pulse">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold flex items-center gap-1">
                <span>Active Campus Route</span>
                <span>•</span>
                <span>Live Guidance</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Heading to {destBuilding?.name.split('(')[0] || 'Destination'}
                {route.destinationRoom && <span className="text-blue-600"> ({route.destinationRoom})</span>}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-emerald-700">
                🚶 {route.walkMinutes} min
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {route.distanceMeters}m walk
              </div>
            </div>

            <button
              onClick={() => {
                playTapSound();
                onEndRoute();
              }}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              title="End Navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Turn-by-Turn Guidance Step Carousel */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-xs font-mono font-bold flex items-center justify-center shrink-0">
              {currentStepIdx + 1}
            </span>
            <div className="text-xs font-medium text-slate-800 leading-snug">
              {route.steps[currentStepIdx] || route.steps[0]}
            </div>
          </div>

          {currentStepIdx < route.steps.length - 1 ? (
            <button
              onClick={() => {
                playTapSound();
                setCurrentStepIdx(prev => Math.min(route.steps.length - 1, prev + 1));
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 text-[11px] font-bold text-blue-700 shrink-0 flex items-center gap-1 transition-colors shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                playNavSuccessSound();
                onEndRoute();
              }}
              className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 shadow-sm hover:bg-emerald-200 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Arrived
            </button>
          )}
        </div>

        {/* Quick Origin / Destination indicator */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
          <span className="truncate max-w-[45%]">From: {startBuilding?.code || 'Current Spot'}</span>
          <span className="text-blue-600 font-bold">➔ ➔ ➔</span>
          <span className="truncate max-w-[45%] text-right font-semibold text-slate-800">To: {destBuilding?.code}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
