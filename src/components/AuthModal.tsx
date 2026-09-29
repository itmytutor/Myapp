import React, { useState } from 'react';
import { UserRole } from '../types';
import { ALL_AVAILABLE_SUBJECTS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Camera, Sparkles, X, User, GraduationCap, HeartHandshake } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (role: UserRole, name: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  // screens: 'login' | 'signup' | 'role' | 'setup_profile'
  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'role' | 'setup_profile'>('login');
  
  // Auth Form State
  const [email, setEmail] = useState('jamelyn123@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  
  // Sign up Form State
  const [firstName, setFirstName] = useState('Jamelyn');
  const [lastName, setLastName] = useState('Allessa');
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');

  // Profile Setup State
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<string[]>(['Early Childhood', 'Primary']);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Art Therapy',
    'Music Therapy',
    'Adaptive Daily Living Skills',
  ]);
  const [agreedTerms, setAgreedTerms] = useState(true);

  if (!isOpen) return null;

  const handleToggleSubject = (subj: string) => {
    if (selectedSubjects.includes(subj)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subj));
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  const handleToggleGrade = (grade: string) => {
    if (selectedGradeLevels.includes(grade)) {
      setSelectedGradeLevels(selectedGradeLevels.filter((g) => g !== grade));
    } else {
      setSelectedGradeLevels([...selectedGradeLevels, grade]);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthSuccess('teacher', 'Jamelyn Allessa');
    onClose();
  };

  const handleSignUpNext = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthScreen('role');
  };

  const handleRoleNext = () => {
    setAuthScreen('setup_profile');
  };

  const handleFinishProfile = () => {
    if (!agreedTerms) {
      alert('Please agree to the Terms of Service to complete registration.');
      return;
    }
    const fullName = `${firstName} ${lastName}`.trim() || 'Jamelyn Allessa';
    onAuthSuccess(selectedRole, fullName);
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
          className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden z-10"
        >
          {/* Top Bar with Close / Back */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            {authScreen !== 'login' ? (
              <button
                onClick={() => {
                  if (authScreen === 'signup') setAuthScreen('login');
                  else if (authScreen === 'role') setAuthScreen('signup');
                  else if (authScreen === 'setup_profile') setAuthScreen('role');
                }}
                className="p-1 -ml-1 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-6" />
            )}

            {/* Brand Logo in header */}
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                mT
              </div>
              <span>myTutor</span>
            </div>

            <button
              onClick={onClose}
              className="p-1 -mr-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content by Screen */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* SCREEN 1: LOGIN (Welcome back!) */}
            {authScreen === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="text-center space-y-1 mb-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 mb-2">
                    <User className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Welcome back!</h2>
                  <p className="text-xs text-slate-500">Sign in to access your sessions and progress journals</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link simulated to ' + email)}
                      className="text-[11px] text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-98 transition cursor-pointer"
                >
                  Sign In
                </button>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <span className="relative px-3 bg-white text-[11px] text-slate-400">or continue with</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAuthSuccess('teacher', 'Jamelyn Allessa');
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <div className="text-center text-xs text-slate-500 pt-2">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthScreen('signup')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}

            {/* SCREEN 2: SIGN UP (Create your Account) */}
            {authScreen === 'signup' && (
              <form onSubmit={handleSignUpNext} className="space-y-3.5">
                <div className="text-center space-y-1 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 mb-1">
                    <User className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Create your Account</h2>
                  <p className="text-xs text-slate-500">Join our caring special education community</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-98 transition cursor-pointer mt-2"
                >
                  Next: Select Role
                </button>

                <div className="text-center text-xs text-slate-500 pt-2">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthScreen('login')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {/* SCREEN 3: ROLE SELECTION ("I am...") */}
            {authScreen === 'role' && (
              <div className="space-y-5">
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">I am a...</h2>
                  <p className="text-xs text-slate-500">
                    Choose how you will be using myTutor
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Parent Card */}
                  <div
                    onClick={() => setSelectedRole('parent')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      selectedRole === 'parent'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      selectedRole === 'parent' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">Parent / Guardian</h3>
                        {selectedRole === 'parent' && (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Book developmental therapy sessions, view milestone photos, and communicate directly with tutors.
                      </p>
                    </div>
                  </div>

                  {/* Teacher / Therapist Card */}
                  <div
                    onClick={() => setSelectedRole('teacher')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      selectedRole === 'teacher'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      selectedRole === 'teacher' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">Teacher / Specialist</h3>
                        {selectedRole === 'teacher' && (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Manage special education learners, schedule sessions, document therapy journals, and track growth.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRoleNext}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-98 transition cursor-pointer"
                >
                  Next: Set up Profile
                </button>
              </div>
            )}

            {/* SCREEN 4: SET UP PROFILE (Grade Levels & Subjects) */}
            {authScreen === 'setup_profile' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="relative w-16 h-16 mx-auto">
                    <img
                      src="/src/assets/images/tutor_avatar_1790320554488.jpg"
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                    />
                    <div className="absolute bottom-0 right-0 p-1 bg-emerald-600 text-white rounded-full">
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Set up Profile</h2>
                  <p className="text-xs text-slate-500">Learners and parents will see this information</p>
                </div>

                {/* Grade Level selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Grade Level</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Early Childhood', 'Primary', 'Secondary', 'Tertiary', 'All Levels'].map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => handleToggleGrade(grade)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          selectedGradeLevels.includes(grade)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subjects Grid */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Subject Expertise ({selectedSubjects.length})
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    {ALL_AVAILABLE_SUBJECTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleToggleSubject(s)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition cursor-pointer ${
                          selectedSubjects.includes(s)
                            ? 'bg-emerald-700 text-white font-bold'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms and conditions checkbox */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <label className="flex items-start gap-2 cursor-pointer select-none text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="leading-tight">
                      I agree to the <strong className="text-emerald-700">Terms of Service</strong>, Privacy Policy, and Child Safety Guidelines.
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleFinishProfile}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-98 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
