import React from 'react';
import { Session, Learner } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, MapPin, Video, Calendar, BookOpen, CheckCircle, XCircle, RotateCcw, Sparkles } from 'lucide-react';

interface SessionDetailModalProps {
  session: Session | null;
  learner?: Learner;
  isOpen: boolean;
  onClose: () => void;
  onAddJournal: (session: Session) => void;
  onReschedule: (session: Session) => void;
  onCancelSession: (sessionId: string) => void;
  onCompleteSession: (sessionId: string) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  learner,
  isOpen,
  onClose,
  onAddJournal,
  onReschedule,
  onCancelSession,
  onCompleteSession,
}) => {
  if (!isOpen || !session) return null;

  const formattedDate = new Date(session.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden z-10"
        >
          {/* Top Grab Handle */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden" />

          {/* Modal Header */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-slate-900">Session Details</h2>
            <div className="w-8" />
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Learner Hero Card */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3.5">
              <img
                src={session.learnerAvatar}
                alt={session.learnerName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <div className="flex-1">
                <span className="text-[11px] font-semibold text-emerald-800 tracking-wider uppercase block">
                  Enrolled Learner
                </span>
                <h3 className="text-lg font-bold text-slate-900">{session.learnerName}</h3>
                {learner && (
                  <p className="text-xs text-slate-600">
                    {learner.age} yrs old · {learner.gender} · {learner.diagnoses.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Session Info Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Session Information
              </h4>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                {/* Subject */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Subject</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    {session.subject}
                  </span>
                </div>

                {/* Date */}
                <div className="flex justify-between items-center text-sm border-t border-slate-200/60 pt-2.5">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" /> Date
                  </span>
                  <span className="font-semibold text-slate-800">{formattedDate}</span>
                </div>

                {/* Time */}
                <div className="flex justify-between items-center text-sm border-t border-slate-200/60 pt-2.5">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" /> Time
                  </span>
                  <span className="font-semibold text-slate-800">
                    {session.startTime} - {session.endTime} (1 hr)
                  </span>
                </div>

                {/* Mode & Location */}
                <div className="flex justify-between items-start text-sm border-t border-slate-200/60 pt-2.5">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    {session.mode === 'In-Person' ? (
                      <MapPin className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Video className="w-4 h-4 text-blue-500" />
                    )}
                    Location / Link
                  </span>
                  <span className="font-semibold text-slate-800 text-right max-w-[200px]">
                    {session.location}
                  </span>
                </div>

                {/* Rate */}
                {session.rate && (
                  <div className="flex justify-between items-center text-sm border-t border-slate-200/60 pt-2.5">
                    <span className="text-slate-500 font-medium">Standard Rate</span>
                    <span className="font-semibold text-slate-900">{session.rate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes / Plan */}
            {session.notes && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Therapy Objectives & Notes
                </h4>
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{session.notes}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onAddJournal(session);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Add Journal Entry</span>
              </button>

              {session.status === 'upcoming' ? (
                <button
                  onClick={() => onCompleteSession(session.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Completed</span>
                </button>
              ) : (
                <button
                  onClick={() => onReschedule(session)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm flex items-center justify-center gap-1.5 active:scale-98 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Book Again</span>
                </button>
              )}
            </div>

            {session.status === 'upcoming' && (
              <div className="flex gap-2">
                <button
                  onClick={() => onReschedule(session)}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reschedule</span>
                </button>
                <button
                  onClick={() => onCancelSession(session.id)}
                  className="py-2 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Session</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
