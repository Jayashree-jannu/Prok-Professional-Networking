import React, { useState } from 'react';
import PostCreate from '../posts/PostCreate';
import PostList from '../posts/PostList';

const Feed: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-6">
        <PostCreate onPostCreated={handlePostCreated} />
        <PostList key={refreshKey} />
      </div>
    </div>
  );
};

export default Feed; 