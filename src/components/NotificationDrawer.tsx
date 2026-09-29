import React from 'react';
import { AppNotification } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCheck, Clock, BookOpen, Calendar, ArrowLeft, X } from 'lucide-react';

interface NotificationDrawerProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ y: '-100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-md bg-white rounded-b-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Notifications</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAllAsRead}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                You're all caught up! No notifications.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition text-xs space-y-1 ${
                    notif.read
                      ? 'bg-slate-50 border-slate-200/80 text-slate-600'
                      : 'bg-emerald-50/70 border-emerald-200 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      {notif.type === 'session' && <Calendar className="w-3.5 h-3.5 text-emerald-600" />}
                      {notif.type === 'journal' && <BookOpen className="w-3.5 h-3.5 text-blue-600" />}
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
