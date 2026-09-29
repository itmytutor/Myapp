import React, { useState, useEffect } from 'react';
import { Learner, Session } from '../types';
import { ALL_AVAILABLE_SUBJECTS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  MapPin,
  Video,
  User,
  Check,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Wand2,
  Trash2,
} from 'lucide-react';

interface BookSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  learners: Learner[];
  initialLearnerId?: string;
  onSessionCreated: (newSession: Session | Session[]) => void;
  existingSessions?: Session[];
}

const TIME_OPTIONS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '03:30 PM',
  '04:30 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
];

const PRESET_SLOTS = [
  { label: 'Morning', start: '09:00 AM', end: '10:00 AM' },
  { label: 'Mid-Day', start: '11:00 AM', end: '12:00 PM' },
  { label: 'Early Afternoon', start: '01:00 PM', end: '02:00 PM' },
  { label: 'Afternoon', start: '02:00 PM', end: '03:00 PM' },
  { label: 'Late Afternoon', start: '03:30 PM', end: '04:30 PM' },
  { label: 'Evening', start: '05:00 PM', end: '06:00 PM' },
];

// Mock conflicts for specific date/time combinations to demonstrate unavailable times
const KNOWN_CONFLICTS: Record<string, { time: string; reason: string; alternateStart: string; alternateEnd: string }[]> = {
  '2026-09-29': [
    {
      time: '02:00 PM - 03:00 PM',
      reason: 'Teacher Jamelyn has Speech Therapy with Ayshi',
      alternateStart: '03:30 PM',
      alternateEnd: '04:30 PM',
    },
  ],
  '2026-09-30': [
    {
      time: '02:00 PM - 03:00 PM',
      reason: 'Sensory clinic group therapy reserved',
      alternateStart: '11:00 AM',
      alternateEnd: '12:00 PM',
    },
    {
      time: '05:00 PM - 06:00 PM',
      reason: 'Clinical supervision with Dr. Rivera',
      alternateStart: '03:30 PM',
      alternateEnd: '04:30 PM',
    },
  ],
  '2026-10-02': [
    {
      time: '09:00 AM - 10:00 AM',
      reason: 'Occupational milestone assessment',
      alternateStart: '01:00 PM',
      alternateEnd: '02:00 PM',
    },
  ],
};

export const BookSessionModal: React.FC<BookSessionModalProps> = ({
  isOpen,
  onClose,
  learners,
  initialLearnerId,
  onSessionCreated,
  existingSessions = [],
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Dates, 2: Time, 3: Review, 4: Confirmed
  const [selectedDates, setSelectedDates] = useState<string[]>(['2026-09-28', '2026-09-29']);

  // Master / bulk time controls
  const [masterStartTime, setMasterStartTime] = useState('02:00 PM');
  const [masterEndTime, setMasterEndTime] = useState('03:00 PM');
  const [bulkAppliedNotice, setBulkAppliedNotice] = useState(false);

  // Per-date custom times: Record<dateStr, { startTime: string, endTime: string }>
  const [dateTimes, setDateTimes] = useState<Record<string, { startTime: string; endTime: string }>>({
    '2026-09-28': { startTime: '02:00 PM', endTime: '03:00 PM' },
    '2026-09-29': { startTime: '02:00 PM', endTime: '03:00 PM' },
  });

  // Track which date card has its inline time editor open
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const [selectedLearnerId, setSelectedLearnerId] = useState(
    initialLearnerId || learners[0]?.id || ''
  );
  const [selectedSubject, setSelectedSubject] = useState('Art Therapy');
  const [sessionMode, setSessionMode] = useState<'In-Person' | 'Online'>('In-Person');
  const [locationText, setLocationText] = useState('Sensory Therapy Center, Room 2');
  const [notes, setNotes] = useState('Focus on fine motor skills and sensory tactile tolerance.');

  // Current calendar month navigation
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(8); // 8 = September (0-indexed)

  // Ensure all selected dates have an entry in dateTimes
  useEffect(() => {
    setDateTimes((prev) => {
      const next = { ...prev };
      let changed = false;
      selectedDates.forEach((d) => {
        if (!next[d]) {
          next[d] = { startTime: masterStartTime, endTime: masterEndTime };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [selectedDates, masterStartTime, masterEndTime]);

  if (!isOpen) return null;

  const currentLearner = learners.find((l) => l.id === selectedLearnerId) || learners[0];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Calendar setup
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const handleDateClick = (dayNumber: number) => {
    const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    if (selectedDates.includes(formatted)) {
      if (selectedDates.length > 1) {
        setSelectedDates(selectedDates.filter((d) => d !== formatted));
      }
    } else {
      setSelectedDates([...selectedDates, formatted].sort());
      setDateTimes((prev) => ({
        ...prev,
        [formatted]: { startTime: masterStartTime, endTime: masterEndTime },
      }));
    }
  };

  const removeDate = (dateToRemove: string) => {
    if (selectedDates.length <= 1) return;
    setSelectedDates(selectedDates.filter((d) => d !== dateToRemove));
  };

  // Helper to get time range for a date
  const getTimeForDate = (date: string) => {
    return dateTimes[date] || { startTime: masterStartTime, endTime: masterEndTime };
  };

  // Check availability for a specific date and time range
  const checkSlotAvailability = (date: string, start: string, end: string) => {
    const timeRangeStr = `${start} - ${end}`;

    // 1. Check known preset conflicts for simulated teacher schedule
    const dateConflicts = KNOWN_CONFLICTS[date];
    if (dateConflicts) {
      const match = dateConflicts.find((c) => c.time === timeRangeStr);
      if (match) {
        return {
          isAvailable: false,
          reason: match.reason,
          alternateStart: match.alternateStart,
          alternateEnd: match.alternateEnd,
        };
      }
    }

    // 2. Check existing sessions
    const sessionConflict = existingSessions.find(
      (s) =>
        s.date === date &&
        s.status !== 'cancelled' &&
        s.startTime === start
    );
    if (sessionConflict) {
      return {
        isAvailable: false,
        reason: `Session already booked with ${sessionConflict.learnerName} (${sessionConflict.title})`,
        alternateStart: '03:30 PM',
        alternateEnd: '04:30 PM',
      };
    }

    return { isAvailable: true };
  };

  // Modify time for a specific date
  const handleUpdateDateSpecificTime = (date: string, startTime: string, endTime: string) => {
    setDateTimes((prev) => ({
      ...prev,
      [date]: { startTime, endTime },
    }));
  };

  // Apply master time to all selected dates
  const handleApplyTimeToAllDates = (start = masterStartTime, end = masterEndTime) => {
    const updated: Record<string, { startTime: string; endTime: string }> = {};
    selectedDates.forEach((d) => {
      updated[d] = { startTime: start, endTime: end };
    });
    setDateTimes(updated);
    setBulkAppliedNotice(true);
    setTimeout(() => setBulkAppliedNotice(false), 2500);
  };

  // Auto-resolve any dates with unavailable times by switching to alternative slots
  const handleAutoResolveConflicts = () => {
    setDateTimes((prev) => {
      const next = { ...prev };
      selectedDates.forEach((d) => {
        const currentTime = next[d] || { startTime: masterStartTime, endTime: masterEndTime };
        const availability = checkSlotAvailability(d, currentTime.startTime, currentTime.endTime);
        if (!availability.isAvailable && availability.alternateStart && availability.alternateEnd) {
          next[d] = {
            startTime: availability.alternateStart,
            endTime: availability.alternateEnd,
          };
        }
      });
      return next;
    });
  };

  // Check if any selected date currently has an unavailable slot
  const conflictingDates = selectedDates.filter((d) => {
    const t = getTimeForDate(d);
    return !checkSlotAvailability(d, t.startTime, t.endTime).isAvailable;
  });

  const handleBookSubmit = () => {
    // Generate session objects for all selected dates with their specific times
    const createdSessions: Session[] = selectedDates.map((dateStr, idx) => {
      const time = getTimeForDate(dateStr);
      return {
        id: 'sess_' + Date.now() + '_' + idx,
        title: `${selectedSubject} Session`,
        subject: selectedSubject,
        learnerId: currentLearner.id,
        learnerName: currentLearner.name,
        learnerAvatar: currentLearner.avatarUrl,
        date: dateStr,
        startTime: time.startTime,
        endTime: time.endTime,
        status: 'upcoming',
        mode: sessionMode,
        location: locationText,
        notes: notes,
        rate: '$45.00/hr',
      };
    });

    onSessionCreated(createdSessions);
    setStep(4); // Show confirmation
  };

  const handleFinish = () => {
    setStep(1);
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
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            {step > 1 && step < 4 ? (
              <button
                onClick={() => setStep((step - 1) as any)}
                className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer text-xs font-semibold"
              >
                Cancel
              </button>
            )}

            <h2 className="text-base font-bold text-slate-900">
              {step === 1 && 'Select Date/s'}
              {step === 2 && 'Select Time Range'}
              {step === 3 && 'Review & Confirm'}
              {step === 4 && 'Sessions Booked!'}
            </h2>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Step {step} of 3
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1">
            <div
              className="bg-emerald-600 h-1 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* STEP 1: Select Date/s */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Choose one or multiple dates you wish to schedule learning therapy sessions for.
                </p>

                {/* Month Picker Header */}
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <button
                    onClick={() => {
                      if (viewMonth === 0) {
                        setViewMonth(11);
                        setViewYear(viewYear - 1);
                      } else {
                        setViewMonth(viewMonth - 1);
                      }
                    }}
                    className="p-1 text-slate-600 hover:text-slate-900 transition font-bold cursor-pointer"
                  >
                    ‹
                  </button>
                  <span className="text-sm font-bold text-slate-800">
                    {monthNames[viewMonth]} {viewYear}
                  </span>
                  <button
                    onClick={() => {
                      if (viewMonth === 11) {
                        setViewMonth(0);
                        setViewYear(viewYear + 1);
                      } else {
                        setViewMonth(viewMonth + 1);
                      }
                    }}
                    className="p-1 text-slate-600 hover:text-slate-900 transition font-bold cursor-pointer"
                  >
                    ›
                  </button>
                </div>

                {/* Calendar Days Table */}
                <div className="bg-white border border-slate-200 rounded-2xl p-3">
                  <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 mb-2">
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                    <span>Su</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {Array.from({ length: startOffset }).map((_, i) => (
                      <div key={'empty-' + i} className="h-9" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNumber = i + 1;
                      const dayString = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                      const isSelected = selectedDates.includes(dayString);

                      return (
                        <button
                          key={dayNumber}
                          onClick={() => handleDateClick(dayNumber)}
                          className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center font-semibold transition active:scale-90 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-sm font-bold ring-2 ring-emerald-200'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {dayNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Dates Feedback */}
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
                  <span className="text-xs font-semibold text-emerald-900 block mb-1">
                    Selected Dates ({selectedDates.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDates.map((dateStr) => (
                      <span
                        key={dateStr}
                        className="text-[11px] font-medium bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        {new Date(dateStr).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learner Picker for Step 1 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Select Learner</label>
                  <div className="grid grid-cols-3 gap-2">
                    {learners.map((lrn) => (
                      <button
                        key={lrn.id}
                        type="button"
                        onClick={() => setSelectedLearnerId(lrn.id)}
                        className={`p-2 rounded-xl border text-left transition flex flex-col items-center gap-1.5 cursor-pointer ${
                          selectedLearnerId === lrn.id
                            ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={lrn.avatarUrl}
                          alt={lrn.name}
                          className="w-10 h-10 rounded-full object-cover border"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80';
                          }}
                        />
                        <span className="text-xs font-bold text-slate-800 text-center truncate w-full">
                          {lrn.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Select Time Range */}
            {step === 2 && (
              <div className="space-y-5">
                {/* Intro summary */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Configuring {selectedDates.length} Selected Date{selectedDates.length > 1 ? 's' : ''}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review time ranges for all dates. You can modify all dates at once or adjust individual dates.
                    </p>
                  </div>
                  {conflictingDates.length > 0 && (
                    <button
                      onClick={handleAutoResolveConflicts}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Auto-Resolve ({conflictingDates.length})</span>
                    </button>
                  )}
                </div>

                {/* 1. BULK TIME CONTROL: Modify Times For All Dates */}
                <div className="bg-gradient-to-br from-emerald-50/60 to-slate-50 border border-emerald-200/80 rounded-2xl p-3.5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-950">
                        Modify Time for All Dates
                      </span>
                    </div>
                    {bulkAppliedNotice && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Applied to all {selectedDates.length} dates!
                      </span>
                    )}
                  </div>

                  {/* Start & End selector for All Dates */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Start Time (All)
                      </label>
                      <select
                        value={masterStartTime}
                        onChange={(e) => setMasterStartTime(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        End Time (All)
                      </label>
                      <select
                        value={masterEndTime}
                        onChange={(e) => setMasterEndTime(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quick slot presets */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Quick Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_SLOTS.map((slot) => {
                        const isCurrentMaster =
                          masterStartTime === slot.start && masterEndTime === slot.end;
                        return (
                          <button
                            key={slot.label}
                            type="button"
                            onClick={() => {
                              setMasterStartTime(slot.start);
                              setMasterEndTime(slot.end);
                              handleApplyTimeToAllDates(slot.start, slot.end);
                            }}
                            className={`text-[10px] px-2 py-1 rounded-lg border font-semibold transition active:scale-95 cursor-pointer ${
                              isCurrentMaster
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {slot.label} ({slot.start.replace(':00', '')} - {slot.end.replace(':00', '')})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Apply to All Dates Action Button */}
                  <button
                    type="button"
                    onClick={() => handleApplyTimeToAllDates()}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Apply {masterStartTime} - {masterEndTime} to All ({selectedDates.length}) Dates</span>
                  </button>
                </div>

                {/* 2. ALL SELECTED DATES WITH THEIR INDIVIDUAL TIME RANGES */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Selected Dates & Time Ranges ({selectedDates.length})
                    </label>
                    <span className="text-[11px] font-medium text-slate-500">
                      Tap any date to modify its individual time
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedDates.map((dateStr) => {
                      const time = getTimeForDate(dateStr);
                      const availability = checkSlotAvailability(dateStr, time.startTime, time.endTime);
                      const isEditing = editingDate === dateStr;
                      const dateObj = new Date(dateStr);
                      const formattedDate = dateObj.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });

                      return (
                        <motion.div
                          key={dateStr}
                          layout
                          className={`rounded-2xl border transition shadow-xs overflow-hidden ${
                            !availability.isAvailable
                              ? 'bg-rose-50/50 border-rose-300'
                              : isEditing
                              ? 'bg-slate-50 border-emerald-400 ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Card Main Row */}
                          <div className="p-3.5">
                            <div className="flex items-center justify-between gap-2">
                              {/* Date Info */}
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                                    !availability.isAvailable
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  <CalendarIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-bold text-xs text-slate-900">
                                    {formattedDate}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                      <Clock className="w-3 h-3 text-slate-500" />
                                      {time.startTime} - {time.endTime}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Availability Badge & Toggle Action */}
                              <div className="flex items-center gap-2">
                                {availability.isAvailable ? (
                                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-600" /> Available
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                    <AlertTriangle className="w-3 h-3 text-rose-600" /> Unavailable
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setEditingDate(isEditing ? null : dateStr)}
                                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                    isEditing
                                      ? 'bg-slate-200 text-slate-800'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span>{isEditing ? 'Done' : 'Change Time'}</span>
                                  {isEditing ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {selectedDates.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeDate(dateStr)}
                                    title="Remove this date"
                                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Alert if unavailable with quick solution */}
                            {!availability.isAvailable && (
                              <div className="mt-3 p-2.5 bg-rose-100/70 border border-rose-200 rounded-xl text-xs space-y-1.5">
                                <div className="flex items-start gap-1.5 text-rose-900 font-medium">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Slot Unavailable:</strong> {availability.reason}
                                  </span>
                                </div>
                                {availability.alternateStart && availability.alternateEnd && (
                                  <div className="flex items-center justify-between pt-1 border-t border-rose-200/80">
                                    <span className="text-[11px] text-rose-800 font-semibold">
                                      Suggested available time:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleUpdateDateSpecificTime(
                                          dateStr,
                                          availability.alternateStart!,
                                          availability.alternateEnd!
                                        );
                                      }}
                                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                                    >
                                      <Check className="w-3 h-3" />
                                      Switch to {availability.alternateStart} - {availability.alternateEnd}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Inline Time Editor for this specific date */}
                          <AnimatePresence>
                            {isEditing && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-3.5 pb-3.5 pt-1 border-t border-slate-200/70 bg-slate-50 space-y-3"
                              >
                                <div className="text-[11px] font-bold text-slate-700">
                                  Customize Time for {formattedDate}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                                      Start Time
                                    </label>
                                    <select
                                      value={time.startTime}
                                      onChange={(e) =>
                                        handleUpdateDateSpecificTime(
                                          dateStr,
                                          e.target.value,
                                          time.endTime
                                        )
                                      }
                                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                                    >
                                      {TIME_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                                      End Time
                                    </label>
                                    <select
                                      value={time.endTime}
                                      onChange={(e) =>
                                        handleUpdateDateSpecificTime(
                                          dateStr,
                                          time.startTime,
                                          e.target.value
                                        )
                                      }
                                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                                    >
                                      {TIME_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                {/* Quick Slots for this specific date */}
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                    Quick Slots for this Date:
                                  </span>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                    {PRESET_SLOTS.map((slot) => {
                                      const slotAvail = checkSlotAvailability(
                                        dateStr,
                                        slot.start,
                                        slot.end
                                      );
                                      const isChosen =
                                        time.startTime === slot.start &&
                                        time.endTime === slot.end;

                                      return (
                                        <button
                                          key={slot.label}
                                          type="button"
                                          onClick={() => {
                                            handleUpdateDateSpecificTime(
                                              dateStr,
                                              slot.start,
                                              slot.end
                                            );
                                          }}
                                          className={`p-1.5 rounded-xl border text-left text-[11px] transition flex items-center justify-between cursor-pointer ${
                                            isChosen
                                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                              : !slotAvail.isAvailable
                                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                                          }`}
                                        >
                                          <div className="truncate">
                                            <div className="font-bold truncate">{slot.label}</div>
                                            <div className="text-[10px] opacity-80">
                                              {slot.start.replace(':00', '')} - {slot.end.replace(':00', '')}
                                            </div>
                                          </div>
                                          {!slotAvail.isAvailable && !isChosen && (
                                            <span className="text-[9px] font-bold text-rose-600 bg-rose-100 px-1 py-0.5 rounded">
                                              Busy
                                            </span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Session Mode Selector */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-600">Session Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSessionMode('In-Person')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        sessionMode === 'In-Person'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>In-Person</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSessionMode('Online')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        sessionMode === 'Online'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Online Video</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Please review all scheduled dates and times before finalizing the appointments.
                </p>

                {/* Subject Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subject / Therapy Focus</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {ALL_AVAILABLE_SUBJECTS.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Summary Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Learner</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-600" />
                      {currentLearner.name} ({currentLearner.age} yrs old)
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Educator</span>
                    <span className="font-bold text-slate-900">Teacher Jamelyn Allessa</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Mode</span>
                    <span className="font-semibold text-slate-800">{sessionMode}</span>
                  </div>

                  {/* Scheduled Dates & Times List */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                      <span>Scheduled Sessions ({selectedDates.length})</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        $45.00/hr
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {selectedDates.map((dateStr) => {
                        const time = getTimeForDate(dateStr);
                        const formatted = new Date(dateStr).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        });

                        return (
                          <div
                            key={dateStr}
                            className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-bold text-slate-800">{formatted}</span>
                            </div>
                            <div className="flex items-center gap-1 font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{time.startTime} - {time.endTime}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Location Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Location or Meeting Link</label>
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    placeholder="Enter physical address or Meet link"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Session Goals Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Learning Goals / Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Confirmation Success Screen */}
            {step === 4 && (
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedDates.length > 1
                      ? `${selectedDates.length} Sessions Successfully Booked!`
                      : 'Session Successfully Booked!'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Sessions for <strong>{currentLearner.name}</strong> have been scheduled on your agenda.
                  </p>
                </div>

                <div className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left space-y-1.5 max-h-48 overflow-y-auto">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                    Booked Dates & Times
                  </div>
                  {selectedDates.map((dateStr) => {
                    const time = getTimeForDate(dateStr);
                    const formatted = new Date(dateStr).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    });
                    return (
                      <div
                        key={dateStr}
                        className="bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-800">{formatted}</span>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                          {time.startTime} - {time.endTime}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-900 max-w-xs">
                  Automated appointment notifications and calendar invites have been dispatched.
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-98 transition cursor-pointer"
              >
                Next: Select Time ({selectedDates.length} Date{selectedDates.length > 1 ? 's' : ''})
              </button>
            )}
            {step === 2 && (
              <div className="space-y-2">
                {conflictingDates.length > 0 && (
                  <div className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center justify-between">
                    <span>
                      ⚠️ {conflictingDates.length} date{conflictingDates.length > 1 ? 's have' : ' has an'} unavailable time
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoResolveConflicts}
                      className="underline font-bold hover:text-rose-900 cursor-pointer"
                    >
                      Auto-Resolve
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setStep(3)}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-98 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Next: Review Details</span>
                </button>
              </div>
            )}
            {step === 3 && (
              <button
                onClick={handleBookSubmit}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-98 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Book {selectedDates.length} Session{selectedDates.length > 1 ? 's' : ''}</span>
              </button>
            )}
            {step === 4 && (
              <button
                onClick={handleFinish}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm active:scale-98 transition cursor-pointer"
              >
                View in Schedule
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
