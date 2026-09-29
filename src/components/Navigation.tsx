import React from 'react';
import { motion } from 'motion/react';
import { Home, Users, QrCode, Calendar, User } from 'lucide-react';

export type TabId = 'sessions' | 'learners' | 'qrcode' | 'journal' | 'calendar' | 'profile';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  learnerCount?: number;
  upcomingCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  learnerCount = 3,
  upcomingCount = 2,
}) => {
  const tabs = [
    {
      id: 'sessions' as TabId,
      label: 'Home',
      icon: Home,
      badge: upcomingCount > 0 ? upcomingCount : undefined,
    },
    {
      id: 'learners' as TabId,
      label: 'Learners',
      icon: Users,
      badge: learnerCount > 0 ? learnerCount : undefined,
    },
    {
      id: 'qrcode' as TabId,
      label: 'QR Code',
      icon: QrCode,
    },
    {
      id: 'calendar' as TabId,
      label: 'Calendar',
      icon: Calendar,
    },
    {
      id: 'profile' as TabId,
      label: 'Profile',
      icon: User,
    },
  ];

  const handleTabClick = (tabId: TabId) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // Safe fallback
      }
    }
    onTabChange(tabId);
  };

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 z-30 sticky bottom-0 shadow-lg">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex flex-col items-center justify-center min-h-[46px] py-1 select-none transition-all active:scale-90 cursor-pointer focus:outline-hidden"
            >
              {/* Active animated indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="activeNavTab"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-emerald-50 rounded-xl -z-10"
                />
              )}

              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-emerald-700 stroke-[2.3]' : 'text-slate-400 stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] h-[14px] flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'text-emerald-800 font-bold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
