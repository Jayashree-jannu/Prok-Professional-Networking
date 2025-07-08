import React from 'react';

interface ProfileActivityProps {
  profile: {
    connections?: number;
    mutualConnections?: number;
    // TODO: Add activity array when backend is ready
    // activity?: ActivityType[];
  };
}

const ProfileActivity: React.FC<ProfileActivityProps> = ({ profile }) => {
  // TODO: Fetch and display real activity data from the backend
  // const activity = profile.activity || [];
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <span className="font-bold text-lg text-gray-900">Activity</span>
          <span className="ml-4 text-gray-500 text-sm">Connections: {profile.connections ?? 0} | Mutual: {profile.mutualConnections ?? 0}</span>
        </div>
      </div>
      {/* Activity feed placeholder */}
      <div className="text-gray-400 text-center py-8">
        No recent activity.
      </div>
      {/* TODO: Map activity array here when available */}
    </div>
  );
};

export default ProfileActivity; 