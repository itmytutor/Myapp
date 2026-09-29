import React, { ReactNode } from 'react';
import { PlatformMode, UserRole } from '../types';
import { Smartphone, Monitor, Apple, Sparkles, RefreshCw, LogIn } from 'lucide-react';

interface DeviceFrameProps {
  children: ReactNode;
  platform: PlatformMode;
  onPlatformChange: (platform: PlatformMode) => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  currentRole: UserRole;
  onToggleRole: () => void;
  onOpenAuthModal: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  platform,
  onPlatformChange,
  isFrameMode,
  onToggleFrameMode,
  currentRole,
  onToggleRole,
  onOpenAuthModal,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center">
      {/* Platform & Environment Controls Toolbar */}
      <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Brand & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                myTutor
                <span className="text-[10px] font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                  v2.0 Native
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Special Education & Developmental Tutoring
              </div>
            </div>
          </div>

          {/* Interactive Mode Selectors */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Role Switcher */}
            <button
              onClick={onToggleRole}
              title="Switch user role between Teacher and Parent"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Role:</span>
              <strong className="capitalize text-emerald-300 font-semibold">{currentRole}</strong>
              <RefreshCw className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {/* Platform Selector (iOS vs Android) */}
            <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => onPlatformChange('ios')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition text-xs font-medium cursor-pointer ${
                  platform === 'ios'
                    ? 'bg-slate-900 text-white shadow-sm border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iOS</span>
              </button>
              <button
                onClick={() => onPlatformChange('android')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition text-xs font-medium cursor-pointer ${
                  platform === 'android'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
            </div>

            {/* Frame Mode Toggle (Chassis vs Fluid) */}
            <button
              onClick={onToggleFrameMode}
              title="Toggle mobile device frame"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition text-xs cursor-pointer"
            >
              {isFrameMode ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Phone Frame</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Fluid Screen</span>
                </>
              )}
            </button>

            {/* View Onboarding/Auth Screens Demo */}
            <button
              onClick={onOpenAuthModal}
              title="View Onboarding / Sign In screens from wireframe"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition text-xs shadow-sm cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Auth & Onboarding</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
        {isFrameMode ? (
          /* Phone Chassis Mockup (iPhone 16 / Pixel 9 Pro style) */
          <div className="relative my-auto transition-all duration-300">
            {/* Outer Physical Frame */}
            <div className={`relative w-[390px] h-[844px] max-h-[92vh] rounded-[48px] p-3 shadow-2xl transition-all duration-300 ${
              platform === 'ios'
                ? 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 ring-1 ring-slate-600/50 shadow-emerald-950/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
                : 'bg-gradient-to-b from-slate-800 to-slate-900 ring-2 ring-emerald-600/30 rounded-[40px]'
            }`}>
              {/* Outer Edge Hardware buttons */}
              <div className="absolute -left-1 top-24 w-1 h-8 bg-slate-700 rounded-l-sm" />
              <div className="absolute -left-1 top-36 w-1 h-12 bg-slate-700 rounded-l-sm" />
              <div className="absolute -left-1 top-52 w-1 h-12 bg-slate-700 rounded-l-sm" />
              <div className="absolute -right-1 top-32 w-1 h-16 bg-slate-700 rounded-r-sm" />

              {/* Inner Screen Display */}
              <div className={`relative w-full h-full bg-[#FAFAF9] text-slate-900 overflow-hidden flex flex-col ${
                platform === 'ios' ? 'rounded-[38px]' : 'rounded-[30px]'
              }`}>
                {/* Dynamic Island / Notch & Top Status Bar */}
                {platform === 'ios' ? (
                  <div className="w-full pt-2.5 pb-1 px-7 flex items-center justify-between z-30 select-none bg-white text-slate-900 border-b border-slate-100">
                    <span className="text-[13px] font-semibold tracking-tight">9:41</span>
                    {/* iOS Dynamic Island */}
                    <div className="h-6 w-28 bg-black rounded-full flex items-center justify-end pr-2 gap-1.5 shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-950 ring-1 ring-emerald-500/50 animate-pulse"></div>
                    </div>
                    {/* Status Icons */}
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <svg className="w-4 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.64 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                      </svg>
                      {/* Battery */}
                      <div className="w-5 h-2.5 rounded-[4px] border border-slate-800 p-0.5 flex items-center">
                        <div className="h-full w-full bg-emerald-600 rounded-[2px]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Android Material Status Bar */
                  <div className="w-full pt-1.5 pb-1 px-6 flex items-center justify-between z-30 select-none bg-white text-slate-900 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium">9:41</span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">5G</span>
                    </div>
                    {/* Center Hole Punch */}
                    <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-800 mx-auto" />
                    <div className="flex items-center gap-1.5 text-xs text-slate-700">
                      <span className="text-[11px] font-medium">95%</span>
                      <div className="w-3.5 h-3 border border-slate-700 rounded-sm p-0.5 flex items-end">
                        <div className="w-full h-full bg-emerald-600 rounded-xs" />
                      </div>
                    </div>
                  </div>
                )}

                {/* App Content Canvas */}
                <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#F8FAFC]">
                  {children}
                </div>

                {/* Bottom Gesture Indicator Bar */}
                <div className="w-full py-1.5 bg-white flex justify-center items-center z-30 select-none">
                  {platform === 'ios' ? (
                    <div className="w-32 h-1 bg-slate-300 rounded-full hover:bg-slate-400 transition" />
                  ) : (
                    <div className="w-16 h-1 bg-slate-400 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Full Fluid Screen View */
          <div className="w-full max-w-md h-screen sm:h-[90vh] sm:rounded-3xl shadow-xl overflow-hidden flex flex-col bg-[#F8FAFC] border border-slate-800">
            {/* Top Bar Indicator for Fluid Mode */}
            <div className="w-full py-1 px-4 bg-slate-900 text-[11px] text-slate-400 flex items-center justify-between border-b border-slate-800">
              <span className="font-semibold text-emerald-400">myTutor · {platform.toUpperCase()} Mode</span>
              <span>390 × 844 viewport</span>
            </div>
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#F8FAFC]">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
