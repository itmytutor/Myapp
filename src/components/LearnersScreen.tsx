import React, { useState } from 'react';
import { Learner, Session } from '../types';
import { Users, Search, Plus, QrCode, BookOpen, Calendar, ChevronRight, UserPlus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LearnersScreenProps {
  learners: Learner[];
  sessions: Session[];
  onSelectLearner: (learner: Learner) => void;
  onOpenJournal: (learner: Learner) => void;
  onAddJournalEntry: (learner: Learner) => void;
  onNewSession: (learner: Learner) => void;
  onShowQR: (learner: Learner) => void;
  onAddNewLearner: () => void;
}

export const LearnersScreen: React.FC<LearnersScreenProps> = ({
  learners,
  sessions,
  onSelectLearner,
  onOpenJournal,
  onAddJournalEntry,
  onNewSession,
  onShowQR,
  onAddNewLearner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = learners.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.diagnoses.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      {/* Top Header & Search */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10 px-5 pt-3.5 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Learners</h2>
            <span className="text-[11px] text-slate-400 font-medium">
              Special Education & Developmental Tracking
            </span>
          </div>

          <button
            onClick={onAddNewLearner}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Learner</span>
          </button>
        </div>

        {/* Stats Row (Directly matching wireframe) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center">
            <span className="text-lg font-bold text-emerald-700 block leading-tight">
              {learners.length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Total Learners</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center">
            <span className="text-lg font-bold text-blue-700 block leading-tight">
              {sessions.filter((s) => s.status === 'upcoming').length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Active Sessions</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center">
            <span className="text-lg font-bold text-amber-600 block leading-tight">0</span>
            <span className="text-[10px] text-slate-500 font-medium">Pending Approvals</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by learner name, diagnosis, or skill..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Learners List */}
      <div className="p-4 space-y-3.5 flex-1">
        {filtered.map((learner) => {
          const learnerUpcoming = sessions.filter(
            (s) => s.learnerId === learner.id && s.status === 'upcoming'
          );

          return (
            <motion.div
              key={learner.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelectLearner(learner)}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex flex-col gap-3"
            >
              {/* Top row: Avatar + Name + QR */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={learner.avatarUrl}
                    alt={learner.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100 shadow-xs"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {learner.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {learner.age} yrs old · {learner.gender}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowQR(learner);
                  }}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 transition cursor-pointer"
                  title="Show QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              {/* Diagnoses Tags */}
              <div className="flex flex-wrap gap-1">
                {learner.diagnoses.map((diag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 px-2 py-0.5 rounded-md"
                  >
                    {diag}
                  </span>
                ))}
              </div>

              {/* Upcoming Session summary if any */}
              {learnerUpcoming.length > 0 && (
                <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Next: {learnerUpcoming[0].startTime} ({learnerUpcoming[0].subject})</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-1.5 py-0.2 rounded-sm">
                    {learnerUpcoming[0].date}
                  </span>
                </div>
              )}

              {/* Bottom Action Buttons (Matching wireframe) */}
              <div
                className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1.5 flex-1">
                  <button
                    onClick={() => onOpenJournal(learner)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Journal</span>
                  </button>

                  <button
                    onClick={() => onAddJournalEntry(learner)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Add Entry</span>
                  </button>

                  <button
                    onClick={() => onNewSession(learner)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Session</span>
                  </button>
                </div>

                <button
                  onClick={() => onSelectLearner(learner)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
