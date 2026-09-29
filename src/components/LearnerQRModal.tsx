import React, { useState } from 'react';
import { Learner } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Copy, Check, Share2, ExternalLink } from 'lucide-react';

interface LearnerQRModalProps {
  learner: Learner | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LearnerQRModal: React.FC<LearnerQRModalProps> = ({
  learner,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'invite'>('qr');

  if (!isOpen || !learner) return null;

  const inviteUrl = `https://mytutor.app/invite/${learner.name.toLowerCase()}-${learner.id.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          className="relative w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-slate-900">
              {activeTab === 'qr' ? 'Learner QR' : 'Learner Invite'}
            </h2>
            <div className="w-8" />
          </div>

          {/* Tab Selector */}
          <div className="p-3 bg-slate-50 border-b border-slate-100">
            <div className="grid grid-cols-2 p-1 bg-slate-200/60 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('qr')}
                className={`py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'qr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Scan QR Code
              </button>
              <button
                onClick={() => setActiveTab('invite')}
                className={`py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'invite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Share Invite Link
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            {/* Learner Info */}
            <div className="flex items-center gap-3 bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-100">
              <img
                src={learner.avatarUrl}
                alt={learner.name}
                className="w-10 h-10 rounded-full object-cover border border-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {learner.name}
                </span>
                <span className="text-[10px] text-emerald-800 font-medium">
                  {learner.age} yrs · Special Education
                </span>
              </div>
            </div>

            {activeTab === 'qr' ? (
              /* QR Code View */
              <div className="space-y-3 flex flex-col items-center">
                <div className="p-4 bg-white rounded-3xl border-2 border-emerald-500 shadow-xl flex items-center justify-center">
                  {/* Clean SVG QR code representation */}
                  <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
                    {/* Corner Position Markers */}
                    <rect x="10" y="10" width="24" height="24" rx="4" fill="#047857" />
                    <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
                    <rect x="18" y="18" width="8" height="8" rx="1" fill="#047857" />

                    <rect x="66" y="10" width="24" height="24" rx="4" fill="#047857" />
                    <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
                    <rect x="74" y="18" width="8" height="8" rx="1" fill="#047857" />

                    <rect x="10" y="66" width="24" height="24" rx="4" fill="#047857" />
                    <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
                    <rect x="18" y="74" width="8" height="8" rx="1" fill="#047857" />

                    {/* Dot matrix pattern */}
                    <rect x="40" y="12" width="6" height="6" rx="1" fill="#065f46" />
                    <rect x="52" y="12" width="6" height="6" rx="1" fill="#065f46" />
                    <rect x="40" y="24" width="12" height="6" rx="1" fill="#065f46" />
                    <rect x="40" y="36" width="6" height="6" rx="1" fill="#065f46" />
                    <rect x="52" y="36" width="12" height="6" rx="1" fill="#065f46" />

                    <rect x="12" y="44" width="6" height="6" rx="1" fill="#065f46" />
                    <rect x="24" y="44" width="6" height="6" rx="1" fill="#065f46" />
                    <rect x="18" y="54" width="12" height="6" rx="1" fill="#065f46" />

                    <rect x="40" y="48" width="8" height="8" rx="2" fill="#047857" />
                    <rect x="54" y="48" width="8" height="8" rx="2" fill="#047857" />
                    <rect x="46" y="60" width="16" height="8" rx="2" fill="#065f46" />

                    <rect x="70" y="44" width="8" height="8" rx="2" fill="#065f46" />
                    <rect x="82" y="44" width="6" height="6" rx="1" fill="#065f46" />
                    <rect x="70" y="56" width="18" height="6" rx="1" fill="#065f46" />

                    <rect x="40" y="74" width="6" height="14" rx="1" fill="#065f46" />
                    <rect x="52" y="74" width="14" height="6" rx="1" fill="#065f46" />
                    <rect x="74" y="74" width="14" height="14" rx="2" fill="#065f46" />

                    {/* Center Logo Badge */}
                    <circle cx="50" cy="50" r="10" fill="white" />
                    <circle cx="50" cy="50" r="8" fill="#10b981" />
                    <path d="M47 49l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500 max-w-[220px]">
                  Scan with any camera or the myTutor parent app to instantly connect and view therapy sessions.
                </p>
              </div>
            ) : (
              /* Invite Link View */
              <div className="space-y-4 w-full">
                <p className="text-xs text-slate-500">
                  Share this secure pairing link with the parent or co-therapist to grant real-time access.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs text-left">
                  <span className="font-mono text-slate-700 truncate mr-2 select-all">
                    {inviteUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer shrink-0"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {copied && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                    Copied link to clipboard!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied' : 'Copy Invite Link'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
