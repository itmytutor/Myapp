import React, { useState } from 'react';
import { Learner, JournalEntry, MilestoneRating } from '../types';
import { ALL_AVAILABLE_SUBJECTS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Camera, Image, Mic, Sparkles, CheckCircle2, AlertCircle, Bookmark } from 'lucide-react';

interface NewJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  learners: Learner[];
  initialLearnerId?: string;
  onSaveEntry: (entry: JournalEntry) => void;
}

export const NewJournalEntryModal: React.FC<NewJournalEntryModalProps> = ({
  isOpen,
  onClose,
  learners,
  initialLearnerId,
  onSaveEntry,
}) => {
  const [learnerId, setLearnerId] = useState(initialLearnerId || learners[0]?.id || '');
  const [subject, setSubject] = useState('Art Therapy');
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState<MilestoneRating>('thriving');
  const [content, setContent] = useState('');
  const [sharedWithParent, setSharedWithParent] = useState(true);
  const [attachedImage, setAttachedImage] = useState<string>('/src/assets/images/journal_art_therapy_1790320589823.jpg');

  if (!isOpen) return null;

  const currentLearner = learners.find((l) => l.id === learnerId) || learners[0];

  const handleSave = (isDraft: boolean) => {
    if (!title.trim() && !isDraft) {
      alert('Please enter an activity title for the entry.');
      return;
    }

    const newEntry: JournalEntry = {
      id: 'journal_' + Date.now(),
      learnerId: currentLearner.id,
      learnerName: currentLearner.name,
      learnerAvatar: currentLearner.avatarUrl,
      tutorName: 'Jamelyn Allessa',
      tutorAvatar: '/src/assets/images/tutor_avatar_1790320554488.jpg',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      subject: subject,
      title: title.trim() || 'Untitled Session Reflection',
      rating: rating,
      content: content.trim() || 'No detailed observations recorded yet.',
      images: attachedImage ? [attachedImage] : [],
      isDraft: isDraft,
      sharedWithParent: isDraft ? false : sharedWithParent,
      likes: 0,
      comments: [],
    };

    onSaveEntry(newEntry);
    onClose();
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
            <h2 className="text-base font-bold text-slate-900">New Journal Entry</h2>
            <button
              onClick={() => handleSave(true)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              Draft
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Learner Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Learner</label>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {learners.map((lrn) => (
                  <button
                    key={lrn.id}
                    type="button"
                    onClick={() => setLearnerId(lrn.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition shrink-0 cursor-pointer ${
                      learnerId === lrn.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={lrn.avatarUrl}
                      alt={lrn.name}
                      className="w-5 h-5 rounded-full object-cover"
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

            {/* Milestone Rating Selection (Exactly as shown in mockup) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                Milestone Status / Performance
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Struggling */}
                <button
                  type="button"
                  onClick={() => setRating('struggling')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    rating === 'struggling'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 ring-1 ring-rose-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Struggling</span>
                </button>

                {/* Coping */}
                <button
                  type="button"
                  onClick={() => setRating('coping')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    rating === 'coping'
                      ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Coping</span>
                </button>

                {/* Thriving */}
                <button
                  type="button"
                  onClick={() => setRating('thriving')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    rating === 'thriving'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Thriving</span>
                </button>
              </div>
            </div>

            {/* Subject Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                {ALL_AVAILABLE_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Entry Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Activity Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Clay Modeling & Bilateral Pinch Grasp"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Observations / Notes Content */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Session Observations</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Document specific behavioral milestones, sensory stimuli responses, and therapeutic breakthroughs..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Media Attachment Row (Photo / Video / Voice) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">Media Attachments</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setAttachedImage(
                      attachedImage
                        ? ''
                        : '/src/assets/images/journal_sensory_play_1790320571534.jpg'
                    )
                  }
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    attachedImage
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Image className="w-4 h-4 text-emerald-600" />
                  <span>{attachedImage ? 'Photo Attached' : 'Attach Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Video capture ready for tablet & phone cameras.')}
                  className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-blue-500" />
                  <span>Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Voice note recording simulated.')}
                  className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-purple-500" />
                  <span>Audio</span>
                </button>
              </div>

              {attachedImage && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-36">
                  <img src={attachedImage} alt="Attachment" className="w-full h-36 object-cover" />
                  <button
                    type="button"
                    onClick={() => setAttachedImage('')}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-[10px] px-2 py-0.5 rounded-full"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Share with Parent Toggle */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Share with Parent</span>
                <span className="text-[11px] text-slate-500">
                  Allow {currentLearner.name}’s parent to view and comment
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSharedWithParent(!sharedWithParent)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  sharedWithParent ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 left-0.5 ${
                    sharedWithParent ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save Journal Entry</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
