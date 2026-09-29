import React, { useState } from 'react';
import { Session, Learner, SessionStatus } from '../types';
import { SessionCard } from './SessionCard';
import { Calendar, Plus, Users, Sparkles, Filter, ChevronRight, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface SessionsScreenProps {
  sessions: Session[];
  learners: Learner[];
  onSelectSession: (session: Session) => void;
  onOpenJournal: (session: Session) => void;
  onRescheduleSession: (session: Session) => void;
  onMarkCompleted: (session: Session) => void;
  onOpenBookModal: () => void;
  onSelectLearner: (learner: Learner) => void;
}

export const SessionsScreen: React.FC<SessionsScreenProps> = ({
  sessions,
  learners,
  onSelectSession,
  onOpenJournal,
  onRescheduleSession,
  onMarkCompleted,
  onOpenBookModal,
  onSelectLearner,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | SessionStatus>('all');

  const filteredSessions = sessions.filter((s) => {
    if (statusFilter === 'all') return true;
    return s.status === statusFilter;
  });

  const upcomingCount = sessions.filter((s) => s.status === 'upcoming').length;
  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const cancelledCount = sessions.filter((s) => s.status === 'cancelled').length;

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 pb-20">
      {/* Top Stats summary bar (Directly matching wireframe) */}
      <div className="grid grid-cols-3 gap-2">
        <div
          onClick={() => setStatusFilter('upcoming')}
          className="bg-white border border-slate-200/90 rounded-2xl p-3 text-center shadow-xs cursor-pointer hover:border-emerald-300 transition"
        >
          <span className="text-xl font-extrabold text-emerald-700 block leading-tight">
            {upcomingCount}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">Upcoming</span>
        </div>

        <div
          onClick={() => setStatusFilter('all')}
          className="bg-white border border-slate-200/90 rounded-2xl p-3 text-center shadow-xs cursor-pointer hover:border-emerald-300 transition"
        >
          <span className="text-xl font-extrabold text-blue-700 block leading-tight">
            {learners.length}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">Learners</span>
        </div>

        <div
          onClick={() => setStatusFilter('completed')}
          className="bg-white border border-slate-200/90 rounded-2xl p-3 text-center shadow-xs cursor-pointer hover:border-emerald-300 transition"
        >
          <span className="text-xl font-extrabold text-slate-700 block leading-tight">
            {completedCount}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">Completed</span>
        </div>
      </div>

      {/* Quick Learners Carousel Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Learners
          </h3>
          <span className="text-[11px] font-semibold text-emerald-800">
            {learners.length} enrolled
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {learners.map((lrn) => (
            <button
              key={lrn.id}
              onClick={() => onSelectLearner(lrn)}
              className="flex items-center gap-2.5 bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl px-3 py-2 shadow-xs transition active:scale-95 cursor-pointer shrink-0"
            >
              <div className="relative">
                <img
                  src={lrn.avatarUrl}
                  alt={lrn.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-100"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white absolute bottom-0 right-0" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block leading-none">
                  {lrn.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {lrn.age} yrs · {lrn.gender}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* What's Today / Sessions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">What's Today</h2>
            <span className="text-xs font-semibold text-slate-400">
              ({filteredSessions.length})
            </span>
          </div>

          <button
            onClick={onOpenBookModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Session</span>
          </button>
        </div>

        {/* Filter Pills (Matching wireframe) */}
        <div className="grid grid-cols-4 p-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold shadow-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`py-1.5 text-center rounded-lg transition text-[11px] cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sessions Card Feed */}
        {filteredSessions.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center p-6 space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No sessions match this filter</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Schedule learning sessions or switch filters to view completed therapy logs.
            </p>
            <button
              onClick={onOpenBookModal}
              className="mt-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Schedule New Session
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onSelect={onSelectSession}
                onOpenJournal={onOpenJournal}
                onReschedule={onRescheduleSession}
                onMarkCompleted={onMarkCompleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
