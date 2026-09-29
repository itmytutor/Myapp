import React, { useState } from 'react';
import { Session } from '../types';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Video, Plus, CheckCircle2 } from 'lucide-react';

interface CalendarViewProps {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onOpenBookSession: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  sessions,
  onSelectSession,
  onOpenBookSession,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 25)); // Sept 25, 2026
  const [selectedDateStr, setSelectedDateStr] = useState('2026-09-25');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon = 0

  // Sessions for selected date
  const daySessions = sessions.filter((s) => s.date === selectedDateStr);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10 px-5 pt-3 pb-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Calendar</h2>
            <span className="text-[11px] text-slate-400 font-medium">
              {new Date(selectedDateStr).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <button
            onClick={onOpenBookSession}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Session</span>
          </button>
        </div>

        {/* Filter Badges (Matching wireframe) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
              activeCategoryFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setActiveCategoryFilter('learning')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
              activeCategoryFilter === 'learning'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Learning Session</span>
          </button>
          <button
            onClick={() => setActiveCategoryFilter('assessment')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
              activeCategoryFilter === 'assessment'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Assessment</span>
          </button>
          <button
            onClick={() => setActiveCategoryFilter('consultation')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
              activeCategoryFilter === 'consultation'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 border border-blue-200/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Consultation</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Month Calendar Box */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          {/* Navigation Month Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 mb-2">
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
            <span>Su</span>
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: offset }).map((_, i) => (
              <div key={'pad-' + i} className="h-9" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDateStr === dateKey;
              const hasEvents = sessions.some((s) => s.date === dateKey);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDateStr(dateKey)}
                  className={`h-9 w-9 mx-auto rounded-full flex flex-col items-center justify-center font-semibold relative transition active:scale-90 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs ring-2 ring-emerald-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{day}</span>
                  {hasEvents && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-emerald-600 absolute bottom-1" />
                  )}
                  {hasEvents && isSelected && (
                    <span className="w-1 h-1 rounded-full bg-white absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Header */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Agenda for {new Date(selectedDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">
              {daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'}
            </span>
          </div>

          {daySessions.length === 0 ? (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
              <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No sessions scheduled for this day</p>
              <button
                onClick={onOpenBookSession}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                + Schedule a session now
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {daySessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-emerald-300 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                        {session.subject}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{session.title}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        session.status === 'upcoming'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <img
                        src={session.learnerAvatar}
                        alt={session.learnerName}
                        className="w-5 h-5 rounded-full object-cover border"
                      />
                      <span>{session.learnerName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
