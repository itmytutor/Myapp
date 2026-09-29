import React, { useState } from 'react';
import { Learner, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scan,
  QrCode,
  Copy,
  Check,
  Share2,
  Flashlight,
  Camera,
  RotateCw,
  Sparkles,
  UserCheck,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface QRCodeScreenProps {
  learners: Learner[];
  profile: UserProfile;
  onSelectLearner: (learner: Learner) => void;
  onSessionCreated?: () => void;
}

export const QRCodeScreen: React.FC<QRCodeScreenProps> = ({
  learners,
  profile,
  onSelectLearner,
}) => {
  const [activeMode, setActiveMode] = useState<'scan' | 'invite'>('scan');
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>(
    learners[0]?.id || 'profile'
  );
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scannedResult, setScannedResult] = useState<null | {
    name: string;
    type: string;
    avatar: string;
    details: string;
  }>(null);

  // Selected subject for QR invite
  const isSelectedProfile = selectedLearnerId === 'profile';
  const currentLearner = learners.find((l) => l.id === selectedLearnerId) || learners[0];

  const inviteUrl = isSelectedProfile
    ? `https://mytutor.app/connect/tutor-${profile.username}`
    : `https://mytutor.app/invite/${currentLearner.name.toLowerCase()}-${currentLearner.id.slice(-4)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Safe fallback
      }
    }
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Connect on myTutor - ${isSelectedProfile ? profile.name : currentLearner.name}`,
          text: `Join ${isSelectedProfile ? profile.name : currentLearner.name}'s special education learning profile on myTutor:`,
          url: inviteUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const simulateScanTarget = (targetName: string, targetType: string, avatar: string, details: string) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([20, 40, 20]);
      } catch {
        // Safe fallback
      }
    }
    setScannedResult({
      name: targetName,
      type: targetType,
      avatar,
      details,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      {/* Top Header & Mode Toggle */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10 px-5 pt-3.5 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">QR Code & Scanner</h2>
            <span className="text-[11px] text-slate-400 font-medium">
              Seamless pairing for parents & therapists
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full text-emerald-800 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-bit</span>
          </div>
        </div>

        {/* Dual Mode Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveMode('scan')}
            className={`py-2 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'scan'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scan className="w-4 h-4 text-emerald-600" />
            <span>QR Scanner</span>
          </button>

          <button
            onClick={() => setActiveMode('invite')}
            className={`py-2 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'invite'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>My QR & Invite Link</span>
          </button>
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeMode === 'scan' ? (
          /* ================= QR SCANNER VIEW ================= */
          <div className="space-y-4 flex flex-col items-center">
            {/* Viewfinder Camera Box */}
            <div className="relative w-full max-w-xs aspect-square bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 flex flex-col items-center justify-center">
              {/* Simulated camera feed background texture */}
              <div className={`absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 opacity-90 ${
                flashlightOn ? 'brightness-125' : ''
              }`} />

              {/* Grid guide overlay */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Viewfinder Target Frame */}
              <div className="relative w-56 h-56 rounded-2xl border-2 border-emerald-500/40 flex items-center justify-center">
                {/* 4 Corner brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

                {/* Animated Laser Scanning Line */}
                <motion.div
                  animate={{
                    y: [-90, 90, -90],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-48 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981]"
                />

                {/* Subtle center crosshair */}
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 ring-4 ring-emerald-500/20" />
              </div>

              {/* Top Controls Overlay inside camera (Flashlight & Camera Flip) */}
              <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-10">
                <button
                  onClick={() => setFlashlightOn(!flashlightOn)}
                  className={`p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
                    flashlightOn
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                  title="Toggle Flashlight"
                >
                  <Flashlight className="w-4 h-4" />
                </button>

                <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-medium">
                  {isFrontCamera ? 'Front Lens' : 'Wide 1x'}
                </div>

                <button
                  onClick={() => setIsFrontCamera(!isFrontCamera)}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition cursor-pointer"
                  title="Switch Camera"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom status text inside camera */}
              <div className="absolute bottom-3 text-center px-4">
                <p className="text-[11px] text-emerald-300/90 font-medium tracking-wide">
                  Align QR code inside square
                </p>
              </div>
            </div>

            {/* Test Simulation Controls (For easy interactive testing) */}
            <div className="w-full max-w-xs bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Simulate Instant Scan Test
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    simulateScanTarget(
                      'Shiloh (Learner)',
                      'Special Education Learner',
                      '/src/assets/images/child_shiloh_1790320606576.jpg',
                      'Age 4 · Sensory Processing Sensitivity · Enrolled in Art Therapy'
                    )
                  }
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-left transition cursor-pointer flex items-center gap-2"
                >
                  <img
                    src="/src/assets/images/child_shiloh_1790320606576.jpg"
                    alt="Shiloh"
                    className="w-7 h-7 rounded-full object-cover border"
                  />
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block leading-tight">
                      Scan Shiloh
                    </span>
                    <span className="text-[10px] text-emerald-700">Learner QR</span>
                  </div>
                </button>

                <button
                  onClick={() =>
                    simulateScanTarget(
                      'Teacher Jamelyn',
                      'Special Ed Therapist',
                      '/src/assets/images/tutor_avatar_1790320554488.jpg',
                      'Verified Therapist · 6+ yrs experience · Ready to connect'
                    )
                  }
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-left transition cursor-pointer flex items-center gap-2"
                >
                  <img
                    src="/src/assets/images/tutor_avatar_1790320554488.jpg"
                    alt="Jamelyn"
                    className="w-7 h-7 rounded-full object-cover border"
                  />
                  <div>
                    <span className="text-xs font-bold text-blue-950 block leading-tight">
                      Scan Jamelyn
                    </span>
                    <span className="text-[10px] text-blue-700">Therapist QR</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Instruction Callout */}
            <div className="w-full max-w-xs p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">How scanning works:</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Parents or therapists scan this code to link accounts, view developmental session updates, and collaborate on milestones in real time.
              </p>
            </div>
          </div>
        ) : (
          /* ================= MY QR CODE & INVITE LINK VIEW ================= */
          <div className="space-y-4 flex flex-col items-center">
            {/* Identity Switcher Chips (Learner vs Tutor) */}
            <div className="w-full max-w-xs space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">
                Generate QR & Invite For:
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {/* Tutor Chip */}
                <button
                  onClick={() => setSelectedLearnerId('profile')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isSelectedProfile
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>Tutor Profile</span>
                </button>

                {/* Learners Chips */}
                {learners.map((lrn) => (
                  <button
                    key={lrn.id}
                    onClick={() => setSelectedLearnerId(lrn.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      selectedLearnerId === lrn.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={lrn.avatarUrl}
                      alt={lrn.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span>{lrn.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* High-Fidelity Printable QR Card (Matching wireframe design) */}
            <div className="w-full max-w-xs bg-white border border-slate-200 rounded-3xl p-5 shadow-md flex flex-col items-center text-center space-y-3 relative overflow-hidden">
              {/* Profile Pill Header */}
              <div className="flex items-center gap-2.5 bg-emerald-50/80 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                <img
                  src={isSelectedProfile ? profile.avatarUrl : currentLearner.avatarUrl}
                  alt={isSelectedProfile ? profile.name : currentLearner.name}
                  className="w-6 h-6 rounded-full object-cover border border-white"
                />
                <span className="text-xs font-bold text-emerald-950">
                  {isSelectedProfile ? profile.name : currentLearner.name}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-white px-1.5 py-0.2 rounded-sm border border-emerald-200">
                  {isSelectedProfile ? 'Specialist' : 'Learner'}
                </span>
              </div>

              {/* Vector SVG QR Code */}
              <div className="p-3 bg-white rounded-2xl border-2 border-emerald-500 shadow-inner">
                <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none">
                  {/* Position Corner 1 */}
                  <rect x="8" y="8" width="26" height="26" rx="5" fill="#047857" />
                  <rect x="12" y="12" width="18" height="18" rx="3" fill="white" />
                  <rect x="16" y="16" width="10" height="10" rx="2" fill="#047857" />

                  {/* Position Corner 2 */}
                  <rect x="66" y="8" width="26" height="26" rx="5" fill="#047857" />
                  <rect x="70" y="12" width="18" height="18" rx="3" fill="white" />
                  <rect x="74" y="16" width="10" height="10" rx="2" fill="#047857" />

                  {/* Position Corner 3 */}
                  <rect x="8" y="66" width="26" height="26" rx="5" fill="#047857" />
                  <rect x="12" y="70" width="18" height="18" rx="3" fill="white" />
                  <rect x="16" y="74" width="10" height="10" rx="2" fill="#047857" />

                  {/* QR Pattern Blocks */}
                  <rect x="38" y="10" width="8" height="8" rx="1.5" fill="#065f46" />
                  <rect x="50" y="10" width="8" height="8" rx="1.5" fill="#065f46" />
                  <rect x="38" y="22" width="14" height="6" rx="1.5" fill="#065f46" />
                  <rect x="42" y="32" width="8" height="8" rx="1.5" fill="#065f46" />
                  <rect x="54" y="32" width="8" height="8" rx="1.5" fill="#065f46" />

                  <rect x="10" y="40" width="8" height="8" rx="1.5" fill="#065f46" />
                  <rect x="22" y="40" width="8" height="8" rx="1.5" fill="#065f46" />
                  <rect x="14" y="52" width="16" height="8" rx="1.5" fill="#065f46" />

                  {/* Center Brand Medallion */}
                  <circle cx="50" cy="50" r="11" fill="white" />
                  <circle cx="50" cy="50" r="9" fill="#10b981" />
                  <path
                    d="M46.5 49.5l2.5 2.5 4.5-4.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <rect x="68" y="40" width="10" height="8" rx="1.5" fill="#065f46" />
                  <rect x="82" y="40" width="8" height="8" rx="1.5" fill="#065f46" />
                  <rect x="68" y="52" width="22" height="8" rx="1.5" fill="#065f46" />

                  <rect x="38" y="68" width="8" height="16" rx="1.5" fill="#065f46" />
                  <rect x="50" y="68" width="16" height="8" rx="1.5" fill="#065f46" />
                  <rect x="50" y="80" width="8" height="12" rx="1.5" fill="#065f46" />
                  <rect x="72" y="68" width="18" height="18" rx="2" fill="#065f46" />
                </svg>
              </div>

              <p className="text-xs text-slate-500 max-w-[230px]">
                Scan with mobile camera to immediately pair with this profile.
              </p>
            </div>

            {/* Invite Link Box */}
            <div className="w-full max-w-xs space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Personal Invite Link</span>
                {copied && (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Copied to clipboard!
                  </span>
                )}
              </label>

              <div className="bg-white border border-slate-200 rounded-2xl p-2 pl-3 flex items-center justify-between text-xs shadow-xs">
                <span className="font-mono text-slate-600 truncate mr-2 select-all text-[11px]">
                  {inviteUrl}
                </span>

                <button
                  onClick={handleCopyLink}
                  className={`p-2 rounded-xl border transition active:scale-95 cursor-pointer shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={handleShareNative}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scanned Result Modal Sheet */}
      <AnimatePresence>
        {scannedResult && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setScannedResult(null)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4 z-10"
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto sm:hidden" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 ring-4 ring-emerald-50 shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    QR Successfully Scanned
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{scannedResult.name}</h3>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs">
                <img
                  src={scannedResult.avatar}
                  alt={scannedResult.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <span className="font-bold text-slate-800 block">{scannedResult.type}</span>
                  <span className="text-slate-500 text-[11px]">{scannedResult.details}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setScannedResult(null)}
                  className="py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Scan Another
                </button>
                <button
                  onClick={() => {
                    const foundLearner = learners.find((l) =>
                      scannedResult.name.toLowerCase().includes(l.name.toLowerCase())
                    );
                    setScannedResult(null);
                    if (foundLearner) {
                      onSelectLearner(foundLearner);
                    }
                  }}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition cursor-pointer"
                >
                  <span>Open Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
