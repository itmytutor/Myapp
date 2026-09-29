export type UserRole = 'teacher' | 'parent';

export type SessionStatus = 'upcoming' | 'completed' | 'cancelled';

export type MilestoneRating = 'struggling' | 'coping' | 'thriving';

export type PlatformMode = 'ios' | 'android';

export interface Learner {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  avatarUrl: string;
  dateOfBirth: string;
  diagnoses: string[];
  notes: string;
  parentName: string;
  parentContact: string;
  activeSessionsCount: number;
  completedSessionsCount: number;
}

export interface Session {
  id: string;
  title: string;
  subject: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "05:00 PM"
  endTime: string; // e.g. "06:00 PM"
  status: SessionStatus;
  mode: 'In-Person' | 'Online';
  location: string;
  notes?: string;
  rate?: string;
  color?: string;
}

export interface JournalComment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  tutorName: string;
  tutorAvatar: string;
  date: string;
  subject: string;
  title: string;
  rating: MilestoneRating;
  content: string;
  images: string[];
  isDraft: boolean;
  sharedWithParent: boolean;
  likes: number;
  likedByCurrentUser?: boolean;
  comments: JournalComment[];
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  instagram: string;
  facebook: string;
  threads: string;
  tiktok: string;
  address: string;
  gradeLevels: string[];
  subjects: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'session' | 'journal' | 'system';
}
