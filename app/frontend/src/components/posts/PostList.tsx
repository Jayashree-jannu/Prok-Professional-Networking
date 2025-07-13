import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDebounce } from './useDebounce';
import { useInfiniteScroll } from './useInfiniteScroll';
import { FiMoreHorizontal, FiHeart, FiMessageCircle, FiShare2, FiUser } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Post {
  id: number;
  content: string;
  media_url?: string | null;
  created_at?: string;
  category?: string;
  visibility?: string;
  tags?: string[];
  likes_count?: number;
  views_count?: number;
  title?: string;
  author?: {
    avatar_url?: string;
    username?: string;
    name?: string;
  };
}

const categories = ['All', 'Tech', 'Business', 'Art', 'Science']; // Placeholder, should fetch from API
const visibilities = ['All', 'Public', 'Private', 'Connections'];
const sortOptions = [
  { value: 'created_at', label: 'Newest' },
  { value: 'likes_count', label: 'Most Liked' },
  { value: 'views_count', label: 'Most Viewed' },
];

const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in ms

// Utility: format date as M/D/YYYY
function formatDate(dateString?: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow p-4 mb-4 flex flex-col gap-2">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-6 bg-gray-200 rounded w-full mb-2" />
      <div className="h-40 bg-gray-200 rounded w-full" />
    </div>
  );
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState('All');
  const [tags, setTags] = useState('');
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState<string | null>(null);
  const [sort, setSort] = useState('created_at');

  const debouncedSearch = useDebounce(search, 500);
  const debouncedTags = useDebounce(tags, 500);

  // Fetch categories from API or cache
  useEffect(() => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    const cached = localStorage.getItem('categories_cache');
    let useCache = false;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TIMEOUT) {
          setCategories(['All', ...parsed.data.filter((c: string) => c && c !== 'All')]);
          useCache = true;
        }
      } catch {}
    }
    if (!useCache) {
      axios.get(`${API_BASE_URL}/api/posts/categories`)
        .then(res => {
          const apiCategories = res.data.categories || res.data;
          setCategories(['All', ...apiCategories.filter((c: string) => c && c !== 'All')]);
          localStorage.setItem('categories_cache', JSON.stringify({ data: apiCategories, timestamp: Date.now() }));
        })
        .catch(() => setCategoriesError('Failed to load categories.'))
        .finally(() => setCategoriesLoading(false));
    } else {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch popular tags from API or cache
  useEffect(() => {
    setTagsLoading(true);
    setTagsError(null);
    const cached = localStorage.getItem('tags_cache');
    let useCache = false;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TIMEOUT) {
          setPopularTags(parsed.data);
          useCache = true;
        }
      } catch {}
    }
    if (!useCache) {
      axios.get(`${API_BASE_URL}/api/posts/popular-tags`)
        .then(res => {
          const apiTags = res.data.tags || res.data;
          setPopularTags(apiTags);
          localStorage.setItem('tags_cache', JSON.stringify({ data: apiTags, timestamp: Date.now() }));
        })
        .catch(() => setTagsError('Failed to load tags.'))
        .finally(() => setTagsLoading(false));
    } else {
      setTagsLoading(false);
    }
  }, []);

  const fetchPosts = useCallback(async (reset = false) => {
      setLoading(true);
      setError(null);
      try {
      const params: any = {
        page: reset ? 1 : page,
        per_page: 10,
        sort,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category !== 'All') params.category = category;
      if (visibility !== 'All') params.visibility = visibility;
      if (debouncedTags) params.tags = debouncedTags;
      const res = await axios.get(`${API_BASE_URL}/api/posts`, { params });
      const newPosts = res.data.posts || res.data;
      setPosts(reset ? newPosts : [...posts, ...newPosts]);
      setHasMore(newPosts.length === 10);
      setPage(reset ? 2 : page + 1);
      } catch (err: any) {
      setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
  }, [debouncedSearch, category, visibility, debouncedTags, sort, page]);

  // Reset and refetch on filter/sort/search change
  useEffect(() => {
    setPage(1);
    fetchPosts(true);
    // eslint-disable-next-line
  }, [debouncedSearch, category, visibility, debouncedTags, sort]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (!loading && hasMore) fetchPosts();
  }, [loading, hasMore, fetchPosts]);
  const lastElementRef = useInfiniteScroll(loadMore, hasMore, loading);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Filters & Sorting */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search posts..."
          className="border rounded px-2 py-1 text-black"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1 text-black"
          value={category}
          onChange={e => setCategory(e.target.value)}
          disabled={categoriesLoading}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1 text-black"
          value={visibility}
          onChange={e => setVisibility(e.target.value)}
        >
          {visibilities.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="border rounded px-2 py-1 text-black"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
          {/* Tag suggestions */}
          <div className="flex flex-wrap gap-1 mt-1">
            {tagsLoading && <span className="text-xs text-gray-400">Loading tags...</span>}
            {tagsError && <span className="text-xs text-red-400">{tagsError}</span>}
            {!tagsLoading && !tagsError && popularTags.length > 0 && popularTags.map(tag => (
              <button
                key={tag}
                type="button"
                className="bg-gray-100 hover:bg-blue-100 text-xs px-2 py-1 rounded border border-gray-200 text-black"
                onClick={() => {
                  // Add tag to tags input, deduplicated
                  const currentTags = tags.split(',').map(t => t.trim()).filter(Boolean);
                  if (!currentTags.includes(tag)) {
                    setTags(currentTags.length ? currentTags.concat(tag).join(', ') : tag);
                  }
                }}
                style={{ marginRight: 4, marginBottom: 2 }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
        <select
          className="border rounded px-2 py-1 text-black"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {/* Category error */}
      {categoriesError && <div className="text-xs text-red-400 mb-2">{categoriesError}</div>}
      {/* Post List */}
      {posts.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500 py-8">No posts found.</div>
      )}
      {error && (
        <div className="text-center text-red-500 py-8">{error}</div>
      )}
      <div>
        {posts.map((post, idx) => (
          <div
            key={post.id}
            ref={idx === posts.length - 1 ? lastElementRef : undefined}
            className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col gap-2 sm:gap-3 w-full max-w-full sm:max-w-2xl mx-auto"
          >
            {/* Header: Avatar, Name, Date, Menu */}
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Avatar (placeholder) */}
                <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {post.author?.avatar_url ? (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-gray-400 text-xl" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-xs">{post.author?.name || 'User Name'}</span>
                  <span className="text-xs text-gray-500 truncate">{formatDate(post.created_at)}</span>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                <FiMoreHorizontal className="text-xl text-gray-400" />
              </button>
            </div>
            {/* Title */}
            <div className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 break-words">
              {post.title || 'Post Title'}
            </div>
            {/* Content */}
            <div className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3 break-words">
              <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            </div>
            {/* Media */}
            {post.media_url && (
              <div className="w-full rounded-lg overflow-hidden mb-2 sm:mb-3">
                  <img
                  src={`${API_BASE_URL}${post.media_url}`}
                    alt="Post media"
                  className="w-full h-auto object-cover max-h-60 sm:max-h-72 mx-auto"
                  loading="lazy"
                  />
              </div>
            )}
            {/* Action Row */}
            <div className="flex items-center justify-between mt-1 sm:mt-2 px-1 sm:px-2">
              <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 text-base sm:text-sm focus:outline-none">
                <FiHeart className="text-lg sm:text-base" />
                <span className="text-xs sm:text-sm">{post.likes_count ?? 0}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 text-base sm:text-sm focus:outline-none">
                <FiMessageCircle className="text-lg sm:text-base" />
                <span className="text-xs sm:text-sm">{post.views_count ?? 0}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 text-base sm:text-sm focus:outline-none">
                <FiShare2 className="text-lg sm:text-base" />
                <span className="text-xs sm:text-sm">Share</span>
              </button>
            </div>
          </div>
        ))}
        {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

// LazyImage component using Intersection Observer
function LazyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [show, setShow] = useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setShow(true);
        observer.disconnect();
      }
    });
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return show ? <img ref={imgRef} src={src} alt={alt} className={className} /> : <div ref={imgRef} className={className + ' bg-gray-200'} />;
} 