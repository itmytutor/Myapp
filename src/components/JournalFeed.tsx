import React, { useState } from 'react';
import { JournalEntry, Learner } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Heart, MessageCircle, Share2, Sparkles, Filter, FileText, CheckCircle2 } from 'lucide-react';

interface JournalFeedProps {
  entries: JournalEntry[];
  learners: Learner[];
  onSelectEntry: (entry: JournalEntry) => void;
  onOpenNewEntry: () => void;
  onToggleLike: (entryId: string) => void;
}

export const JournalFeed: React.FC<JournalFeedProps> = ({
  entries,
  learners,
  onSelectEntry,
  onOpenNewEntry,
  onToggleLike,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'my' | 'shared' | 'draft'>('all');
  const [selectedLearnerFilter, setSelectedLearnerFilter] = useState<string>('all');

  const filteredEntries = entries.filter((entry) => {
    // Learner filter
    if (selectedLearnerFilter !== 'all' && entry.learnerId !== selectedLearnerFilter) {
      return false;
    }

    // Tab filter
    if (filterTab === 'draft') return entry.isDraft;
    if (entry.isDraft) return false; // Non-draft tabs don't show drafts

    if (filterTab === 'shared') return entry.sharedWithParent;
    if (filterTab === 'my') return !entry.isDraft;
    return true;
  });

  const getRatingBadge = (rating: JournalEntry['rating']) => {
    switch (rating) {
      case 'thriving':
        return (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Thriving
          </span>
        );
      case 'coping':
        return (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Coping
          </span>
        );
      case 'struggling':
        return (
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Struggling
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      {/* Top Filter Tabs (Matching wireframe) */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10 px-4 pt-3 pb-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Learning Journal</h2>
          <button
            onClick={onOpenNewEntry}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Entry</span>
          </button>
        </div>

        {/* Tab Filter bar */}
        <div className="grid grid-cols-4 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {[
            { id: 'all', label: 'All' },
            { id: 'my', label: 'My Entries' },
            { id: 'shared', label: 'Shared' },
            { id: 'draft', label: 'Draft' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`py-1.5 text-center rounded-lg transition text-[11px] cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Learner Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedLearnerFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedLearnerFilter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Learners
          </button>
          {learners.map((lrn) => (
            <button
              key={lrn.id}
              onClick={() => setSelectedLearnerFilter(lrn.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
                selectedLearnerFilter === lrn.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <img
                src={lrn.avatarUrl}
                alt={lrn.name}
                className="w-3.5 h-3.5 rounded-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <span>{lrn.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Entries List Feed */}
      <div className="p-4 space-y-4 flex-1">
        {filteredEntries.length === 0 ? (
          /* Empty State matching wireframe "No draft yet" */
          <div className="py-16 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {filterTab === 'draft' ? 'No draft yet' : 'No entries found'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {filterTab === 'draft'
                  ? 'Drafts saved during sessions will appear here for review before sharing.'
                  : 'Write your first developmental reflection or document therapy milestones.'}
              </p>
            </div>
            <button
              onClick={onOpenNewEntry}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              Create New Entry
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <motion.div
              key={entry.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelectEntry(entry)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex flex-col"
            >
              {/* Header: Learner + Rating */}
              <div className="p-3.5 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={entry.learnerAvatar}
                    alt={entry.learnerName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {entry.learnerName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {entry.date} · {entry.subject}
                    </span>
                  </div>
                </div>

                {getRatingBadge(entry.rating)}
              </div>

              {/* Photos Gallery preview if any */}
              {entry.images.length > 0 && (
                <div className="w-full h-44 bg-slate-100 overflow-hidden relative">
                  <img
                    src={entry.images[0]}
                    alt={entry.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  {entry.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      +{entry.images.length - 1} photos
                    </span>
                  )}
                </div>
              )}

              {/* Title & Notes Content */}
              <div className="p-3.5 space-y-1.5 flex-1">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {entry.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {entry.content}
                </p>
              </div>

              {/* Footer: Likes, Comments, Shared badge */}
              <div
                className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleLike(entry.id)}
                    className="flex items-center gap-1 hover:text-rose-600 transition active:scale-90 cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        entry.likedByCurrentUser
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="text-[11px] font-semibold">{entry.likes}</span>
                  </button>

                  <button
                    onClick={() => onSelectEntry(entry)}
                    className="flex items-center gap-1 hover:text-slate-700 transition cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-[11px] font-semibold">{entry.comments.length}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  {entry.sharedWithParent ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Shared with parent
                    </span>
                  ) : (
                    <span>Private notes</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
