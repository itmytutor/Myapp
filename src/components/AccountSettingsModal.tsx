import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ALL_AVAILABLE_SUBJECTS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Save, AlertTriangle, Shield, HelpCircle, Check, Trash2, X } from 'lucide-react';

interface AccountSettingsModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  profile,
  isOpen,
  onClose,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0); // 0: None, 1: First warning, 2: Final confirmation

  if (!isOpen) return null;

  const handleToggleSubject = (subject: string) => {
    if (formData.subjects.includes(subject)) {
      setFormData({
        ...formData,
        subjects: formData.subjects.filter((s) => s !== subject),
      });
    } else {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subject],
      });
    }
  };

  const handleToggleGradeLevel = (level: string) => {
    if (formData.gradeLevels.includes(level)) {
      setFormData({
        ...formData,
        gradeLevels: formData.gradeLevels.filter((g) => g !== level),
      });
    } else {
      setFormData({
        ...formData,
        gradeLevels: [...formData.gradeLevels, level],
      });
    }
  };

  const handleSave = () => {
    onUpdateProfile(formData);
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
            <button
              onClick={onClose}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-slate-900">Account Settings</h2>
            <button
              onClick={handleSave}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
            >
              Save
            </button>
          </div>

          {/* Form Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Profile Information
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Display Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Brief Bio / Credentials</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed"
                />
              </div>
            </div>

            {/* Grade Level Selection (From mockup wireframe) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Grade Level
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Early Childhood', 'Primary', 'Secondary', 'Tertiary', 'All Levels'].map((lvl) => {
                  const isSelected = formData.gradeLevels.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleToggleGradeLevel(lvl)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject Expertise Tags (From mockup wireframe) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Specialized Subjects ({formData.subjects.length} selected)
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                {ALL_AVAILABLE_SUBJECTS.map((subject) => {
                  const isSelected = formData.subjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => handleToggleSubject(subject)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-xs font-bold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {subject}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social & Contact Links */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Contact & Social Links
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Instagram Link"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Facebook Link"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Contact Phone No."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <input
                type="text"
                placeholder="Physical Office / Clinic Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            {/* Danger Zone: Delete Account Flow (Matching Wireframe) */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                Danger Zone
              </h3>
              <p className="text-xs text-slate-500">
                Permanently remove your account, profile credentials, learner records, and therapy logs.
              </p>
              <button
                type="button"
                onClick={() => setDeleteStep(1)}
                className="w-full py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>

          {/* Delete Account Warning Confirmation Modal (Wireframe screen 6) */}
          {deleteStep > 0 && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center space-y-3 shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-7 h-7" />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {deleteStep === 1 ? 'Delete Account' : 'Are you sure you want to Continue?'}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {deleteStep === 1
                    ? 'Once you delete your account, it cannot be undone. All your data will be permanently erased from this app.'
                    : 'This action cannot be undone. Are you sure you want to continue?'}
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  {deleteStep === 1 ? (
                    <button
                      onClick={() => setDeleteStep(2)}
                      className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        alert('Account deletion simulated safely.');
                        setDeleteStep(0);
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      Confirm Delete
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteStep(0)}
                    className="w-full py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
                  >
                    GO Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
