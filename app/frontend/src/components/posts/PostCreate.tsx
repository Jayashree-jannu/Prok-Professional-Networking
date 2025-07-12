import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { FiUploadCloud } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface PostCreateProps {
  onPostCreated?: () => void;
}

const PostCreate: React.FC<PostCreateProps> = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [allowComments, setAllowComments] = useState(false);
  const [publicPost, setPublicPost] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMedia(file);
    setError(null);
    setSuccess(null);
    if (file) {
      // Validate file type and size (max 10MB)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, GIF images or MP4/WEBM videos are allowed.');
        setMedia(null);
        setMediaPreview(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        setMedia(null);
        setMediaPreview(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMedia(file);
      setError(null);
      setSuccess(null);
      // Validate file type and size (max 10MB)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, GIF images or MP4/WEBM videos are allowed.');
        setMedia(null);
        setMediaPreview(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        setMedia(null);
        setMediaPreview(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleMediaBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a post. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }
    if (!content.trim()) {
      setError('Post content is required.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (media) {
        formData.append('media', media);
      }
      // Debug: print token and Authorization header
      console.log('DEBUG: token from localStorage:', token);
      console.log('DEBUG: Authorization header:', token ? `Bearer ${token}` : '');
      const response = await axios.post(`${API_BASE_URL}/api/posts`, formData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setSuccess('Post created successfully!');
      setTitle('');
      setContent('');
      setMedia(null);
      setMediaPreview(null);
      setAllowComments(false);
      setPublicPost(false);
      if (onPostCreated) onPostCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-black">Create Post</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 sm:flex-none px-4 py-2 rounded text-blue-600 border border-blue-600 hover:bg-blue-50 text-black"
              onClick={() => setShowPreview(!showPreview)}
            >
              <span className="text-black">Preview</span>
            </button>
            <button
              type="submit"
              form="create-post-form"
              className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              <span className="text-black">{loading ? 'Posting...' : 'Post'}</span>
            </button>
          </div>
        </div>
        <form id="create-post-form" onSubmit={handleSubmit} className="pb-24">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-black">Title</label>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm text-black"
              placeholder="Enter post title"
              value={title}
              onChange={handleTitleChange}
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-black">Content</label>
            <ReactQuill
              theme="snow"
            value={content}
            onChange={handleContentChange}
              className="bg-white text-black rounded"
              placeholder="What's on your mind?"
              readOnly={loading}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1 text-black">Media</label>
            <div
              className="border-2 border-dashed rounded flex flex-col items-center justify-center py-6 sm:py-8 cursor-pointer hover:border-blue-400 transition min-h-[120px]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleMediaBoxClick}
            >
              {mediaPreview ? (
                media?.type.startsWith('image') ? (
                  <img src={mediaPreview} alt="Preview" className="max-h-40 sm:max-h-48 rounded mx-auto" />
                ) : (
                  <video src={mediaPreview} controls className="max-h-40 sm:max-h-48 rounded mx-auto" />
                )
              ) : (
                <>
                  <FiUploadCloud className="text-3xl sm:text-4xl text-gray-400 mb-2" />
                  <p className="text-black text-sm">Drag and drop files here or click to upload</p>
                  <p className="text-xs text-black">Supports images and videos up to 10MB</p>
                </>
              )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
            onChange={handleMediaChange}
            disabled={loading}
                className="hidden"
                ref={fileInputRef}
              />
            </div>
          </div>
          <hr className="my-4" />
          <div className="mb-4 mt-6">
            <div className="font-semibold mb-2 text-base text-black">Post Settings</div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
              <label className="inline-flex items-center text-black">
                <input
                  type="checkbox"
                  className="form-checkbox accent-blue-600"
                  checked={allowComments}
                  onChange={e => setAllowComments(e.target.checked)}
                  disabled={loading}
                />
                <span className="ml-2 text-black">Allow Comments</span>
              </label>
              <label className="inline-flex items-center text-black">
                <input
                  type="checkbox"
                  className="form-checkbox accent-blue-600"
                  checked={publicPost}
                  onChange={e => setPublicPost(e.target.checked)}
                  disabled={loading}
                />
                <span className="ml-2 text-black">Public Post</span>
              </label>
            </div>
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {success && <div className="text-green-600 mb-2">{success}</div>}
          
          {/* Quick login button for testing */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800 mb-2">Need to login? Use this test account:</p>
            <button
              type="button"
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              onClick={() => {
                localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MjMyNDMzMiwianRpIjoiY2MwZmVjYTAtZmJkNi00YzRlLTgxZWQtNmRjNjFjMGQwYWUwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjQiLCJuYmYiOjE3NTIzMjQzMzIsImV4cCI6MTc1MjMyNzkzMn0.b5CDMjuBGQKkXMpgb347RYnZib_NM2EaEoCgMVU9nK0');
                setSuccess('Token updated! Try creating a post now.');
                setTimeout(() => setSuccess(null), 3000);
              }}
            >
              Login with Test Account
            </button>
          </div>
        </form>
        {showPreview && (
          <div className="mt-8 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold mb-2 text-black">Preview</h3>
            <div className="mb-2 text-xl font-bold text-black">{title || 'Post Title'}</div>
            <div className="mb-2 whitespace-pre-line text-black" dangerouslySetInnerHTML={{ __html: content || 'Post content...' }} />
            {mediaPreview && (
              <div className="mb-2">
                {media?.type.startsWith('image') ? (
                  <img src={mediaPreview} alt="Preview" className="max-h-40 sm:max-h-48 rounded mx-auto" />
                ) : (
                  <video src={mediaPreview} controls className="max-h-40 sm:max-h-48 rounded mx-auto" />
                )}
              </div>
            )}
            <div className="flex gap-4 mt-2">
              {allowComments && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Comments Enabled</span>}
              {publicPost && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Public</span>}
            </div>
          </div>
        )}
      </div>
      {/* Sticky action bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex sm:hidden z-20">
        <button
          type="button"
          className="flex-1 py-3 text-blue-600 font-semibold border-r border-gray-200 text-black"
          onClick={() => setShowPreview(!showPreview)}
        >
          <span className="text-black">Preview</span>
        </button>
          <button
            type="submit"
          form="create-post-form"
          className="flex-1 py-3 bg-blue-600 text-white font-semibold"
            disabled={loading}
          >
          <span className="text-black">{loading ? 'Posting...' : 'Post'}</span>
          </button>
      </div>
    </div>
  );
};

export default PostCreate; 