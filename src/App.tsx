/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserRole,
  PlatformMode,
  Session,
  Learner,
  JournalEntry,
  UserProfile,
  AppNotification,
} from './types';
import {
  TUTOR_PROFILE,
  INITIAL_LEARNERS,
  INITIAL_SESSIONS,
  INITIAL_JOURNALS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';
import { SessionsScreen } from './components/SessionsScreen';
import { LearnersScreen } from './components/LearnersScreen';
import { JournalFeed } from './components/JournalFeed';
import { QRCodeScreen } from './components/QRCodeScreen';
import { CalendarView } from './components/CalendarView';
import { ProfileView } from './components/ProfileView';
import { SessionDetailModal } from './components/SessionDetailModal';
import { BookSessionModal } from './components/BookSessionModal';
import { LearnerDetailModal } from './components/LearnerDetailModal';
import { LearnerQRModal } from './components/LearnerQRModal';
import { JournalDetailModal } from './components/JournalDetailModal';
import { NewJournalEntryModal } from './components/NewJournalEntryModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Device & Platform Simulation State
  const [platform, setPlatform] = useState<PlatformMode>('ios');
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);

  // User State
  const [currentRole, setCurrentRole] = useState<UserRole>('teacher');
  const [userProfile, setUserProfile] = useState<UserProfile>(TUTOR_PROFILE);

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<TabId>('sessions');

  // Application Data State
  const [learners, setLearners] = useState<Learner[]>(INITIAL_LEARNERS);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [journals, setJournals] = useState<JournalEntry[]>(INITIAL_JOURNALS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals & Drawers State
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isSessionDetailOpen, setIsSessionDetailOpen] = useState(false);

  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [isLearnerDetailOpen, setIsLearnerDetailOpen] = useState(false);

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookLearnerId, setBookLearnerId] = useState<string | undefined>(undefined);

  const [selectedJournalEntry, setSelectedJournalEntry] = useState<JournalEntry | null>(null);
  const [isJournalDetailOpen, setIsJournalDetailOpen] = useState(false);

  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);
  const [newJournalLearnerId, setNewJournalLearnerId] = useState<string | undefined>(undefined);

  const [qrLearner, setQrLearner] = useState<Learner | null>(null);
  const [isQROpen, setIsQROpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Role toggle
  const handleToggleRole = () => {
    const nextRole: UserRole = currentRole === 'teacher' ? 'parent' : 'teacher';
    setCurrentRole(nextRole);
    if (nextRole === 'parent') {
      setUserProfile({
        ...userProfile,
        name: 'Sarah Jenkins',
        username: 'sarah_jenkins',
        role: 'parent',
        bio: 'Parent of Shiloh (4 yrs old). Dedicated to developmental speech & occupational milestones.',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      });
    } else {
      setUserProfile(TUTOR_PROFILE);
    }
  };

  // Session Handlers
  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
    setIsSessionDetailOpen(true);
  };

  const handleOpenBookSession = (learnerId?: string) => {
    setBookLearnerId(learnerId);
    setIsBookModalOpen(true);
  };

  const handleSessionCreated = (newSession: Session | Session[]) => {
    const sessionList = Array.isArray(newSession) ? newSession : [newSession];
    setSessions((prev) => [...sessionList, ...prev]);
    // Dispatch system notification
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title: sessionList.length > 1 ? `${sessionList.length} Sessions Scheduled` : 'New Session Scheduled',
      message:
        sessionList.length > 1
          ? `${sessionList[0].subject} booked across ${sessionList.length} dates starting ${sessionList[0].date}.`
          : `${sessionList[0].title} on ${sessionList[0].date} at ${sessionList[0].startTime}.`,
      time: 'Just now',
      read: false,
      type: 'session',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleCompleteSession = (sessionId: string) => {
    setSessions(
      sessions.map((s) => (s.id === sessionId ? { ...s, status: 'completed' } : s))
    );
    if (selectedSession && selectedSession.id === sessionId) {
      setSelectedSession({ ...selectedSession, status: 'completed' });
    }
  };

  const handleCancelSession = (sessionId: string) => {
    setSessions(
      sessions.map((s) => (s.id === sessionId ? { ...s, status: 'cancelled' } : s))
    );
    setIsSessionDetailOpen(false);
  };

  const handleReschedule = (session: Session) => {
    setIsSessionDetailOpen(false);
    handleOpenBookSession(session.learnerId);
  };

  // Learner Handlers
  const handleSelectLearner = (learner: Learner) => {
    setSelectedLearner(learner);
    setIsLearnerDetailOpen(true);
  };

  const handleShowQR = (learner: Learner) => {
    setQrLearner(learner);
    setIsQROpen(true);
  };

  const handleAddNewLearner = () => {
    const newLearnerName = prompt('Enter new learner full name:');
    if (!newLearnerName) return;
    const newAge = prompt('Enter age in years:', '5');
    const newDiagnoses = prompt('Enter diagnoses / developmental focus (comma-separated):', 'Developmental Support');

    const createdLearner: Learner = {
      id: 'learner_' + Date.now(),
      name: newLearnerName,
      age: parseInt(newAge || '5', 10),
      gender: 'Female',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      dateOfBirth: 'May 10, 2021',
      diagnoses: newDiagnoses ? newDiagnoses.split(',').map((s) => s.trim()) : ['Early Childhood Focus'],
      notes: 'New enrolled learner profile. Initial assessment planned.',
      parentName: 'Family Guardian',
      parentContact: '+1 (555) 019-4829',
      activeSessionsCount: 0,
      completedSessionsCount: 0,
    };

    setLearners([...learners, createdLearner]);
    handleSelectLearner(createdLearner);
  };

  // Journal Handlers
  const handleOpenJournalForLearner = (learner: Learner) => {
    setIsLearnerDetailOpen(false);
    setActiveTab('journal');
  };

  const handleAddJournalEntryForLearner = (learner: Learner) => {
    setIsLearnerDetailOpen(false);
    setNewJournalLearnerId(learner.id);
    setIsNewJournalOpen(true);
  };

  const handleOpenJournalFromSession = (session: Session) => {
    setIsSessionDetailOpen(false);
    setNewJournalLearnerId(session.learnerId);
    setIsNewJournalOpen(true);
  };

  const handleSelectJournalEntry = (entry: JournalEntry) => {
    setSelectedJournalEntry(entry);
    setIsJournalDetailOpen(true);
  };

  const handleToggleLike = (entryId: string) => {
    setJournals(
      journals.map((j) => {
        if (j.id === entryId) {
          const isLiked = j.likedByCurrentUser;
          return {
            ...j,
            likedByCurrentUser: !isLiked,
            likes: isLiked ? j.likes - 1 : j.likes + 1,
          };
        }
        return j;
      })
    );
    if (selectedJournalEntry && selectedJournalEntry.id === entryId) {
      const isLiked = selectedJournalEntry.likedByCurrentUser;
      setSelectedJournalEntry({
        ...selectedJournalEntry,
        likedByCurrentUser: !isLiked,
        likes: isLiked ? selectedJournalEntry.likes - 1 : selectedJournalEntry.likes + 1,
      });
    }
  };

  const handleAddJournalComment = (entryId: string, commentText: string) => {
    const newComment = {
      id: 'c_' + Date.now(),
      authorName: userProfile.name,
      authorRole: currentRole,
      authorAvatar: userProfile.avatarUrl,
      text: commentText,
      timestamp: 'Just now',
    };

    const updated = journals.map((j) => {
      if (j.id === entryId) {
        return {
          ...j,
          comments: [...j.comments, newComment],
        };
      }
      return j;
    });

    setJournals(updated);

    if (selectedJournalEntry && selectedJournalEntry.id === entryId) {
      setSelectedJournalEntry({
        ...selectedJournalEntry,
        comments: [...selectedJournalEntry.comments, newComment],
      });
    }
  };

  const handleSaveJournalEntry = (entry: JournalEntry) => {
    setJournals([entry, ...journals]);
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title: 'New Journal Entry Logged',
      message: `Journal added for ${entry.learnerName}: "${entry.title}"`,
      time: 'Just now',
      read: false,
      type: 'journal',
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Unread notifications count
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotifsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <DeviceFrame
      platform={platform}
      onPlatformChange={setPlatform}
      isFrameMode={isFrameMode}
      onToggleFrameMode={() => setIsFrameMode(!isFrameMode)}
      currentRole={currentRole}
      onToggleRole={handleToggleRole}
      onOpenAuthModal={() => setIsAuthModalOpen(true)}
    >
      {/* Native App Top Header */}
      <Header
        userName={userProfile.name}
        avatarUrl={userProfile.avatarUrl}
        role={currentRole}
        unreadCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setActiveTab('profile')}
      />

      {/* Main Tab Screen Transitions */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'sessions' && (
            <motion.div
              key="sessions"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col"
            >
              <SessionsScreen
                sessions={sessions}
                learners={learners}
                onSelectSession={handleSelectSession}
                onOpenJournal={handleOpenJournalFromSession}
                onRescheduleSession={handleReschedule}
                onMarkCompleted={(s) => handleCompleteSession(s.id)}
                onOpenBookModal={() => handleOpenBookSession()}
                onSelectLearner={handleSelectLearner}
              />
            </motion.div>
          )}

          {activeTab === 'learners' && (
            <motion.div
              key="learners"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col"
            >
              <LearnersScreen
                learners={learners}
                sessions={sessions}
                onSelectLearner={handleSelectLearner}
                onOpenJournal={handleOpenJournalForLearner}
                onAddJournalEntry={handleAddJournalEntryForLearner}
                onNewSession={(l) => handleOpenBookSession(l.id)}
                onShowQR={handleShowQR}
                onAddNewLearner={handleAddNewLearner}
              />
            </motion.div>
          )}

          {activeTab === 'qrcode' && (
            <motion.div
              key="qrcode"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col"
            >
              <QRCodeScreen
                learners={learners}
                profile={userProfile}
                onSelectLearner={handleSelectLearner}
              />
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col"
            >
              <JournalFeed
                entries={journals}
                learners={learners}
                onSelectEntry={handleSelectJournalEntry}
                onOpenNewEntry={() => {
                  setNewJournalLearnerId(undefined);
                  setIsNewJournalOpen(true);
                }}
                onToggleLike={handleToggleLike}
              />
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col"
            >
              <CalendarView
                sessions={sessions}
                onSelectSession={handleSelectSession}
                onOpenBookSession={() => handleOpenBookSession()}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col"
            >
              <ProfileView
                profile={userProfile}
                currentRole={currentRole}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onToggleRole={handleToggleRole}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        learnerCount={learners.length}
        upcomingCount={sessions.filter((s) => s.status === 'upcoming').length}
      />

      {/* Modals & Flow Drawers */}
      <SessionDetailModal
        session={selectedSession}
        learner={learners.find((l) => l.id === selectedSession?.learnerId)}
        isOpen={isSessionDetailOpen}
        onClose={() => setIsSessionDetailOpen(false)}
        onAddJournal={handleOpenJournalFromSession}
        onReschedule={handleReschedule}
        onCancelSession={handleCancelSession}
        onCompleteSession={handleCompleteSession}
      />

      <BookSessionModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        learners={learners}
        initialLearnerId={bookLearnerId}
        onSessionCreated={handleSessionCreated}
        existingSessions={sessions}
      />

      <LearnerDetailModal
        learner={selectedLearner}
        isOpen={isLearnerDetailOpen}
        onClose={() => setIsLearnerDetailOpen(false)}
        onOpenJournal={handleOpenJournalForLearner}
        onAddJournalEntry={handleAddJournalEntryForLearner}
        onNewSession={(l) => handleOpenBookSession(l.id)}
        onShowQR={handleShowQR}
        sessions={sessions}
      />

      <LearnerQRModal
        learner={qrLearner}
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
      />

      <JournalDetailModal
        entry={selectedJournalEntry}
        isOpen={isJournalDetailOpen}
        onClose={() => setIsJournalDetailOpen(false)}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddJournalComment}
        currentRole={currentRole}
        currentUserName={userProfile.name}
        currentUserAvatar={userProfile.avatarUrl}
      />

      <NewJournalEntryModal
        isOpen={isNewJournalOpen}
        onClose={() => setIsNewJournalOpen(false)}
        learners={learners}
        initialLearnerId={newJournalLearnerId}
        onSaveEntry={handleSaveJournalEntry}
      />

      <AccountSettingsModal
        profile={userProfile}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateProfile={setUserProfile}
      />

      <NotificationDrawer
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={handleMarkAllNotifsRead}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(role, name) => {
          setCurrentRole(role);
          setUserProfile({
            ...userProfile,
            name: name,
            role: role,
          });
        }}
      />
    </DeviceFrame>
  );
}
