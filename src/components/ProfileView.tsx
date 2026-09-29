import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { Settings, Shield, HelpCircle, Star, LogOut, Globe, Instagram, Facebook, Phone, MapPin, RefreshCw, Edit3 } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  currentRole: UserRole;
  onOpenSettings: () => void;
  onToggleRole: () => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  currentRole,
  onOpenSettings,
  onToggleRole,
  onOpenAuth,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      {/* Top Banner / Avatar Lockup (Matching wireframe) */}
      <div className="bg-white border-b border-slate-200/80 p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-18 h-18 rounded-full object-cover border-4 border-emerald-100 shadow-md"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
              }}
            />
            <button
              onClick={onOpenSettings}
              className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xs border-2 border-white transition active:scale-95 cursor-pointer"
              title="Edit Profile"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">{profile.name}</h2>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full capitalize">
                {currentRole}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">@{profile.username}</span>

            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={onOpenSettings}
                className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition active:scale-95 cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                onClick={onToggleRole}
                className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 hover:bg-emerald-100 text-xs font-semibold transition active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3 text-emerald-600" />
                <span>Switch Role</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Brief Description
          </span>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {profile.bio}
          </p>
        </div>

        {/* Grade Levels */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Grade Levels Handled
          </span>
          <div className="flex flex-wrap gap-1.5">
            {profile.gradeLevels.map((lvl) => (
              <span
                key={lvl}
                className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-md"
              >
                {lvl}
              </span>
            ))}
          </div>
        </div>

        {/* Subject Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Subjects & Specialties
          </span>
          <div className="flex flex-wrap gap-1.5">
            {profile.subjects.map((subj) => (
              <span
                key={subj}
                className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
              >
                {subj}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Contact & Links List */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Contact Information
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400">Website:</span>
              <a href={profile.website} target="_blank" rel="noreferrer" className="text-emerald-700 truncate font-medium">
                {profile.website}
              </a>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
              <span className="text-slate-400">Instagram:</span>
              <span className="truncate">{profile.instagram}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-400">Facebook:</span>
              <span className="truncate">{profile.facebook}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-400">Phone:</span>
              <span>{profile.phone}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="text-slate-400">Address:</span>
              <span className="truncate">{profile.address}</span>
            </div>
          </div>
        </div>

        {/* System Settings & Actions List */}
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs font-medium">
          <button
            onClick={onOpenSettings}
            className="w-full p-3.5 flex items-center justify-between text-slate-800 hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Account Settings</span>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          <button
            onClick={() => alert('Privacy & Security rules: Encryption active.')}
            className="w-full p-3.5 flex items-center justify-between text-slate-800 hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-slate-500" />
              <span>Privacy & Security</span>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          <button
            onClick={() => alert('myTutor v2.0 - Special Education Platform')}
            className="w-full p-3.5 flex items-center justify-between text-slate-800 hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Help & About myTutor</span>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          <button
            onClick={() => alert('Thank you for rating myTutor 5 stars!')}
            className="w-full p-3.5 flex items-center justify-between text-slate-800 hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Rate the App</span>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="w-full p-3.5 flex items-center justify-between text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-rose-600" />
              <span className="font-bold">Log Out / Switch Account</span>
            </div>
            <span className="text-rose-400">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};
