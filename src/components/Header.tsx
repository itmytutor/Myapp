import React from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  userName: string;
  avatarUrl: string;
  role: UserRole;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  avatarUrl,
  role,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
}) => {
  // Current dynamic time-based greeting & formatted date
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = now.toLocaleDateString('en-US', options);

  const hour = now.getHours();
  let timeGreeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (hour >= 17) {
    timeGreeting = 'Good evening';
  }

  // Extract first name
  const firstName = userName.split(' ')[0] || userName;

  return (
    <header className="w-full bg-white px-5 pt-3 pb-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex flex-col">
        <span className="text-[11px] font-medium text-slate-400 tracking-tight flex items-center gap-1">
          {formattedDate}
          {role === 'teacher' ? (
            <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 font-semibold px-1.5 py-0.2 rounded-sm ml-1">
              Therapist
            </span>
          ) : (
            <span className="inline-flex items-center text-[10px] text-blue-700 bg-blue-50 font-semibold px-1.5 py-0.2 rounded-sm ml-1">
              Parent
            </span>
          )}
        </span>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
          {timeGreeting}, <span className="text-emerald-700">{firstName}</span>
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Notification Button */}
        <button
          onClick={onOpenNotifications}
          aria-label="View notifications"
          className="relative w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition active:scale-95 border border-slate-200/80 cursor-pointer"
        >
          <Bell className="w-4 h-4 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute 1 top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* Profile Avatar Button */}
        <button
          onClick={onOpenProfile}
          aria-label="Open profile settings"
          className="relative w-9 h-9 rounded-full ring-2 ring-emerald-500/30 hover:ring-emerald-500 overflow-hidden transition active:scale-95 cursor-pointer shadow-xs"
        >
          <img
            src={avatarUrl}
            alt={userName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
            }}
          />
        </button>
      </div>
    </header>
  );
};
