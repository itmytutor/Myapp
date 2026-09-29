import React from 'react';
import { Session } from '../types';
import { Calendar, Clock, MapPin, Video, BookOpen, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface SessionCardProps {
  session: Session;
  onSelect: (session: Session) => void;
  onOpenJournal: (session: Session) => void;
  onReschedule: (session: Session) => void;
  onMarkCompleted?: (session: Session) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onSelect,
  onOpenJournal,
  onReschedule,
  onMarkCompleted,
}) => {
  const getStatusBadge = (status: Session['status']) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full">
            Cancelled
          </span>
        );
    }
  };

  const formattedDate = new Date(session.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all duration-200 flex flex-col gap-3 group relative cursor-pointer"
      onClick={() => onSelect(session)}
    >
      {/* Top row: Subject & Status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-medium text-emerald-700 tracking-tight block">
            {session.subject}
          </span>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-tight">
            {session.title}
          </h3>
        </div>
        {getStatusBadge(session.status)}
      </div>

      {/* Time & Location details */}
      <div className="flex flex-col gap-1 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium text-slate-800">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{session.startTime} - {session.endTime}</span>
          <span className="text-slate-300">·</span>
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500">
          {session.mode === 'In-Person' ? (
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          ) : (
            <Video className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          )}
          <span className="truncate">{session.location}</span>
        </div>
      </div>

      {/* Learner Info Row */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={session.learnerAvatar}
            alt={session.learnerName}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80';
            }}
          />
          <div className="text-xs">
            <span className="text-slate-400 text-[10px] block leading-none">Learner</span>
            <span className="font-semibold text-slate-800">{session.learnerName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onOpenJournal(session)}
            title="Open or write journal entry"
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-3 h-3 text-emerald-600" />
            <span>Journal</span>
          </button>

          {session.status === 'upcoming' && onMarkCompleted && (
            <button
              onClick={() => onMarkCompleted(session)}
              title="Mark session as completed"
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 transition flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              <span>Complete</span>
            </button>
          )}

          {session.status === 'upcoming' && (
            <button
              onClick={() => onReschedule(session)}
              title="Reschedule session"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onSelect(session)}
            title="View full details"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
