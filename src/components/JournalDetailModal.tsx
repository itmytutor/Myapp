import React, { useState } from 'react';
import { JournalEntry, JournalComment, UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, Send, MessageCircle, CheckCircle2, Sparkles, User, Trash2 } from 'lucide-react';

interface JournalDetailModalProps {
  entry: JournalEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleLike: (entryId: string) => void;
  onAddComment: (entryId: string, commentText: string) => void;
  currentRole: UserRole;
  currentUserName: string;
  currentUserAvatar: string;
}

export const JournalDetailModal: React.FC<JournalDetailModalProps> = ({
  entry,
  isOpen,
  onClose,
  onToggleLike,
  onAddComment,
  currentRole,
  currentUserName,
  currentUserAvatar,
}) => {
  const [commentInput, setCommentInput] = useState('');

  if (!isOpen || !entry) return null;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(entry.id, commentInput.trim());
    setCommentInput('');
  };

  const getRatingBadge = (rating: JournalEntry['rating']) => {
    switch (rating) {
      case 'thriving':
        return (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Milestone: Thriving
          </span>
        );
      case 'coping':
        return (
          <span className="text-xs font-bold text-amber-800 bg-amber-100/90 border border-amber-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            Milestone: Coping
          </span>
        );
      case 'struggling':
        return (
          <span className="text-xs font-bold text-rose-800 bg-rose-100/90 border border-rose-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            Needs Support
          </span>
        );
    }
  };

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
            <h2 className="text-base font-bold text-slate-900">Journal Entry</h2>
            <button
              onClick={() => onToggleLike(entry.id)}
              className="p-1.5 rounded-full hover:bg-rose-50 text-slate-500 transition cursor-pointer"
            >
              <Heart
                className={`w-5 h-5 ${
                  entry.likedByCurrentUser ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                }`}
              />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Top Learner & Educator Lockup */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={entry.learnerAvatar}
                  alt={entry.learnerName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200 shadow-xs"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{entry.learnerName}</h3>
                  <p className="text-xs text-slate-500">
                    Logged by {entry.tutorName} · {entry.date}
                  </p>
                </div>
              </div>

              {getRatingBadge(entry.rating)}
            </div>

            {/* Subject Tag & Title */}
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 inline-block mb-1">
                {entry.subject}
              </span>
              <h1 className="text-lg font-bold text-slate-900 leading-snug">
                {entry.title}
              </h1>
            </div>

            {/* Gallery Photos */}
            {entry.images.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={entry.images[0]}
                  alt={entry.title}
                  className="w-full max-h-72 object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
            )}

            {/* Reflection Content Body */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Session Observation & Progress
              </span>
              <p>{entry.content}</p>
            </div>

            {/* Comments Thread Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-slate-500" />
                  <span>Discussion & Parent Feedback ({entry.comments.length})</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  {entry.likes} {entry.likes === 1 ? 'cheer' : 'cheers'}
                </span>
              </div>

              {entry.comments.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  No comments yet. Share your feedback or ask a question below!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {entry.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-5 h-5 rounded-full object-cover border"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                          <span className="font-bold text-slate-800">{comment.authorName}</span>
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-sm ${
                              comment.authorRole === 'parent'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {comment.authorRole === 'parent' ? 'Parent' : 'Therapist'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-slate-600 pl-6">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comment Input Bar */}
          <form
            onSubmit={handleSubmitComment}
            className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={`Comment as ${currentUserName.split(' ')[0]}...`}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
