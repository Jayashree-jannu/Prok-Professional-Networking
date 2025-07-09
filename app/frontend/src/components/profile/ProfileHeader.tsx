import React from 'react';

interface ProfileHeaderProps {
  profile: {
    avatar?: string;
    username: string;
    title?: string;
    location?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
    };
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const [imgError, setImgError] = React.useState(false);
  const BACKEND_URL = "http://127.0.0.1:5001";
  const avatarUrl = !imgError && profile.avatar && profile.avatar !== ''
    ? (profile.avatar.startsWith('http') ? profile.avatar : `${BACKEND_URL}${profile.avatar}${profile.avatar.includes('?') ? '&t=' + Date.now() : '?t=' + Date.now()}`)
    : 'https://randomuser.me/api/portraits/lego/1.jpg';

  const social = profile.social || {};

  return (
    <div className="flex flex-col md:flex-row items-center md:items-end md:justify-between bg-white p-6 rounded-xl shadow-lg mb-6">
      <div className="flex items-center space-x-4">
        <img
          src={avatarUrl}
          alt={profile.username}
          className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover shadow-md"
          onError={() => setImgError(true)}
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.username}</h1>
          {profile.title && <p className="text-gray-600 text-lg">{profile.title}</p>}
          {profile.location && <p className="text-gray-500 text-sm">{profile.location}</p>}
        </div>
      </div>
      {((social.linkedin || social.twitter || social.github)) && (
        <div className="flex space-x-4 mt-4 md:mt-0">
          {social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Twitter</a>
          )}
          {social.github && (
            <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">GitHub</a>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader; 