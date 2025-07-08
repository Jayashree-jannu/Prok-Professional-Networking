import React, { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileEditForm from './ProfileEditForm';
import { fetchProfile, updateProfile, uploadAvatar } from './api';

const ProfileView: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProfile()
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handleProfileUpdate = async (data: any) => {
    try {
      setLoading(true);
      await updateProfile(data);
      const updated = await fetchProfile();
      setProfile(updated);
      setEditMode(false);
      setLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await uploadAvatar(file);
      // Add cache-busting by appending timestamp
      const newAvatar = result.avatar + '?t=' + Date.now();
      setProfile((prev: any) => ({ ...prev, avatar: newAvatar }));
      return newAvatar;
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-100 min-h-screen">
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          Profile updated successfully!
        </div>
      )}
      {/* Profile Header with Edit Button */}
      <div className="relative mb-8">
        <ProfileHeader profile={profile} />
        <button
          className="absolute top-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setEditMode((e) => !e)}
        >
          {editMode ? 'View Profile' : 'Edit Profile'}
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* About */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2 text-gray-900">About</h3>
            <p className={profile.bio ? 'text-gray-900' : 'text-gray-700'}>{profile.bio || 'No bio provided.'}</p>
          </div>
          {/* Skills */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(profile.skills) ? profile.skills : (profile.skills ? profile.skills.split(',').map((s: string) => s.trim()) : [])).map((skill: string) => (
                <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">{skill}</span>
              ))}
            </div>
          </div>
          {/* Education */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Education</h3>
            <ul className="space-y-2">
              {profile.education?.length > 0 ? (
                profile.education.map((edu: any) => (
                  <li key={edu.school + edu.degree}>
                    <div className="font-semibold text-gray-800">{edu.degree}</div>
                    <div className="text-gray-500 text-sm">{edu.school} ({edu.period})</div>
                  </li>
                ))
              ) : (
                <li className="text-gray-700">Add your education details to let others know about your background.</li>
              )}
            </ul>
          </div>
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Recent Activity</h3>
            <div className="text-gray-700">Actively working on new projects and learning new skills!</div>
          </div>
        </div>
        {/* Side column */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Contact Information</h3>
            <div className="space-y-1">
              {profile.email && <div><span className="font-medium text-gray-900">{profile.email}</span></div>}
              {profile.contact?.phone && <div><span className="font-medium text-gray-900">{profile.contact.phone}</span></div>}
              {profile.location && <div><span className="font-medium text-gray-900">{profile.location}</span></div>}
            </div>
          </div>
          {/* Languages */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Languages</h3>
            <ul className="space-y-1">
              <li><span className="font-medium text-gray-900">Tamil</span> <span className="text-gray-700">Native</span></li>
              <li><span className="font-medium text-gray-900">English</span> <span className="text-gray-700">Professional</span></li>
              <li><span className="font-medium text-gray-900">Hindi</span> <span className="text-gray-700">Conversational</span></li>
            </ul>
          </div>
          {/* Connections */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-gray-900">{profile.connections ?? '200+'}</div>
            <div className="text-gray-900">Connections</div>
            <div className="mt-2 text-lg font-semibold text-gray-900">{profile.mutualConnections ?? 25}</div>
            <div className="text-gray-900">Mutual</div>
          </div>
        </div>
      </div>
      {/* Edit form overlay */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
            <ProfileEditForm 
              profile={profile} 
              onSave={handleProfileUpdate} 
              onCancel={() => setEditMode(false)}
              loading={loading}
              error={error}
              onAvatarUpload={handleAvatarUpload}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView; 