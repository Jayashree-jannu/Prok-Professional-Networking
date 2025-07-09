import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

interface Post {
  id: number;
  content: string;
  media_url?: string | null;
  created_at?: string;
  // Add other fields as needed
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/posts`);
        setPosts(response.data.posts || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        {loading && <div>Loading posts...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && posts.length === 0 && <div>No posts yet.</div>}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            <div className="mb-2 text-gray-800">{post.content}</div>
            {post.media_url && (
              <div className="mb-2">
                {post.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img
                    src={`${API_BASE_URL}${post.media_url}`}
                    alt="Post media"
                    className="max-h-64 rounded"
                  />
                ) : post.media_url.match(/\.(mp4|webm)$/i) ? (
                  <video
                    src={`${API_BASE_URL}${post.media_url}`}
                    controls
                    className="max-h-64 rounded"
                  />
                ) : null}
              </div>
            )}
            {post.created_at && (
              <div className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList; 