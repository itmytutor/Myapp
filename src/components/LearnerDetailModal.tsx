import React from 'react';
import { Learner, Session } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, PlusCircle, QrCode, Share2, Phone, UserCheck, Calendar, Sparkles } from 'lucide-react';

interface LearnerDetailModalProps {
  learner: Learner | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenJournal: (learner: Learner) => void;
  onAddJournalEntry: (learner: Learner) => void;
  onNewSession: (learner: Learner) => void;
  onShowQR: (learner: Learner) => void;
  sessions: Session[];
}

export const LearnerDetailModal: React.FC<LearnerDetailModalProps> = ({
  learner,
  isOpen,
  onClose,
  onOpenJournal,
  onAddJournalEntry,
  onNewSession,
  onShowQR,
  sessions,
}) => {
  if (!isOpen || !learner) return null;

  const learnerSessions = sessions.filter((s) => s.learnerId === learner.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden z-10"
        >
          {/* Grab Handle */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2.5 sm:hidden" />

          {/* Header */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-slate-900">{learner.name}'s Details</h2>
            <button
              onClick={() => onShowQR(learner)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              title="Show QR Code"
            >
              <QrCode className="w-5 h-5 text-emerald-600" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Big Avatar & Bio */}
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={learner.avatarUrl}
                  alt={learner.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <UserCheck className="w-3 h-3 text-white" />
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-2">{learner.name}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {learner.age} years old · {learner.gender}
              </p>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onOpenJournal(learner)}
                className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 text-emerald-900 flex flex-col items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span className="text-[11px] font-bold">Open Journal</span>
              </button>

              <button
                onClick={() => onAddJournalEntry(learner)}
                className="p-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200/70 text-blue-900 flex flex-col items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5 text-blue-700" />
                <span className="text-[11px] font-bold">Add Entry</span>
              </button>

              <button
                onClick={() => onNewSession(learner)}
                className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200/70 text-purple-900 flex flex-col items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-purple-700" />
                <span className="text-[11px] font-bold">New Session</span>
              </button>
            </div>

            {/* Child Details Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Child Details
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{learner.dateOfBirth}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500 font-medium">Age</span>
                  <span className="font-semibold text-slate-800">{learner.age} years old</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500 font-medium">Gender</span>
                  <span className="font-semibold text-slate-800">{learner.gender}</span>
                </div>
                <div className="flex justify-between items-start border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500 font-medium">Diagnoses / Needs</span>
                  <span className="font-semibold text-emerald-800 text-right max-w-[200px]">
                    {learner.diagnoses.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500 font-medium">Account Status</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active Learner
                  </span>
                </div>
              </div>
            </div>

            {/* Parent & Emergency Contact */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Parent & Emergency Contact
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{learner.parentName}</span>
                  <span className="text-slate-500">{learner.parentContact}</span>
                </div>
                <a
                  href={`tel:${learner.parentContact}`}
                  className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  title="Call Parent"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Clinical & Therapy Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Therapist Observations & Sensory Profile
              </h4>
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 leading-relaxed">
                {learner.notes}
              </div>
            </div>

            {/* Recent Scheduled Sessions for this Learner */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Scheduled & Past Sessions ({learnerSessions.length})
              </h4>
              <div className="space-y-2">
                {learnerSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">{sess.title}</span>
                      <span className="text-slate-500 text-[11px]">
                        {sess.date} · {sess.startTime}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sess.status === 'upcoming'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {sess.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => onShowQR(learner)}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Learner QR & Invite</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onNewSession(learner);
              }}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Session</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
