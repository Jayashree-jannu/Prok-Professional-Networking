import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

// Props: receives current profile and onSave callback
interface ProfileEditFormProps {
  profile: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
  onAvatarUpload: (file: File) => Promise<string>;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile, onSave, onCancel, loading, error, onAvatarUpload }) => {
  // --- State for all editable fields ---
  const [form, setForm] = useState<{
    username: string;
    email: string;
    title: string;
    location: string;
    bio: string;
    skills: string;
    avatar: File | null;
    social: {
      linkedin?: string;
      twitter?: string;
      github?: string;
    };
    education: { school: string; degree: string; period: string }[];
  }>({
    username: profile.username || '',
    email: profile.email || '',
    title: profile.title || '',
    location: profile.location || '',
    bio: profile.bio || '',
    skills: profile.skills || '',
    avatar: null,
    social: profile.social || {},
    education: profile.education || [],
  });
  const [education, setEducation] = useState(form.education);

  // --- State for UI feedback ---
  const [touched, setTouched] = useState<any>({});
  const [avatarUrl, setAvatarUrl] = useState<string>(profile.avatar || '');

  // --- Validation logic ---
  // TODO: Extend validation for new fields as needed
  const validate = (state: typeof form) => {
    const errors: any = {};
    if (!state.username.trim()) errors.username = 'Username is required.';
    if (!state.email.match(/^\S+@\S+\.\S+$/)) errors.email = 'Invalid email address.';
    if (!state.title.trim()) errors.title = 'Title is required.';
    if (!state.location.trim()) errors.location = 'Location is required.';
    if (state.bio.length < 10) errors.bio = 'Bio must be at least 10 characters.';
    if (!state.skills.trim()) errors.skills = 'At least one skill is required.';
    return errors;
  };

  // --- Input change handler ---
  // Handles both normal and social fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const key = name.split('.')[1];
      setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));
      setTouched((t: any) => ({ ...t, [name]: true }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
      setTouched((t: any) => ({ ...t, [name]: true }));
    }
  };

  // --- Avatar image upload handler ---
  // Handles upload to backend and progress UI
  const handleImageChange = async (file: File | null) => {
    setForm((f) => ({ ...f, avatar: file }));
    setTouched((t: any) => ({ ...t, avatar: true }));
    if (file) {
      try {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          if (progress >= 100) clearInterval(interval);
        }, 200);
        // Use onAvatarUpload prop
        const newAvatarUrl = await onAvatarUpload(file);
        setAvatarUrl(newAvatarUrl);
        setForm((f) => ({ ...f, avatar: null }));
      } catch (err) {
        // Handle error
      }
    }
  };

  // --- Blur handler for validation feedback ---
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((t: any) => ({ ...t, [name]: true }));
  };

  // --- Education change handler ---
  const handleEducationChange = (idx: number, field: string, value: string) => {
    const updated = education.map((edu: any, i: number) =>
      i === idx ? { ...edu, [field]: value } : edu
    );
    setEducation(updated);
    setForm((f) => ({ ...f, education: updated }));
  };

  // --- Education add handler ---
  const handleAddEducation = () => {
    const updated = [...education, { school: '', degree: '', period: '' }];
    setEducation(updated);
    setForm((f) => ({ ...f, education: updated }));
  };

  // --- Education remove handler ---
  const handleRemoveEducation = (idx: number) => {
    const updated = education.filter((_: any, i: number) => i !== idx);
    setEducation(updated);
    setForm((f) => ({ ...f, education: updated }));
  };

  // --- Form submit handler ---
  // Calls onSave with all profile data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, email: true, bio: true, skills: true, avatar: true });
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) return;
    onSave({
      username: form.username,
      email: form.email,
      title: form.title,
      location: form.location,
      bio: form.bio,
      skills: form.skills,
      avatar: avatarUrl || '',
      social: form.social,
      education: education,
    });
  };

  // --- Render form ---
  // TODO: Add more fields as needed (e.g., location, title, etc.)
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <form
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-auto space-y-8"
        onSubmit={handleSubmit}
      >
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-4">
          <ImageUpload
            value={form.avatar}
            onChange={handleImageChange}
          />
          <span className="mt-2 text-gray-700 font-medium">Profile Photo</span>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.username && validate(form).username ? 'border-red-400' : ''}`}
            />
            {touched.username && validate(form).username && <div className="text-red-500 text-sm mt-1">{validate(form).username}</div>}
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.email && validate(form).email ? 'border-red-400' : ''}`}
            />
            {touched.email && validate(form).email && <div className="text-red-500 text-sm mt-1">{validate(form).email}</div>}
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.title && validate(form).title ? 'border-red-400' : ''}`}
            />
            {touched.title && validate(form).title && <div className="text-red-500 text-sm mt-1">{validate(form).title}</div>}
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.location && validate(form).location ? 'border-red-400' : ''}`}
            />
            {touched.location && validate(form).location && <div className="text-red-500 text-sm mt-1">{validate(form).location}</div>}
          </div>
        </div>

        {/* Bio & Skills */}
        <div>
          <label className="block text-gray-900 font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={3}
            className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.bio && validate(form).bio ? 'border-red-400' : ''}`}
          />
          {touched.bio && validate(form).bio && <div className="text-red-500 text-sm mt-1">{validate(form).bio}</div>}
        </div>
        <div>
          <label className="block text-gray-900 font-medium mb-1">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.skills && validate(form).skills ? 'border-red-400' : ''}`}
          />
          {touched.skills && validate(form).skills && <div className="text-red-500 text-sm mt-1">{validate(form).skills}</div>}
        </div>

        {/* Education Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Education</h3>
          <div className="space-y-4">
            {education.map((edu: any, idx: number) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-gray-900 font-medium mb-1">School</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={e => handleEducationChange(idx, 'school', e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.education && validate(form).education ? 'border-red-400' : ''}`}
                  />
                  {touched.education && validate(form).education && validate(form).education[idx] && validate(form).education[idx].school ? <div className="text-red-500 text-sm mt-1">{validate(form).education[idx].school}</div> : null}
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={e => handleEducationChange(idx, 'degree', e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.education && validate(form).education ? 'border-red-400' : ''}`}
                  />
                  {touched.education && validate(form).education && validate(form).education[idx] && validate(form).education[idx].degree ? <div className="text-red-500 text-sm mt-1">{validate(form).education[idx].degree}</div> : null}
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-gray-900 font-medium mb-1">Period</label>
                    <input
                      type="text"
                      value={edu.period}
                      onChange={e => handleEducationChange(idx, 'period', e.target.value)}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.education && validate(form).education ? 'border-red-400' : ''}`}
                    />
                    {touched.education && validate(form).education && validate(form).education[idx] && validate(form).education[idx].period ? <div className="text-red-500 text-sm mt-1">{validate(form).education[idx].period}</div> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    className="ml-2 px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddEducation}
              className="mt-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium"
            >
              Add Education
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">LinkedIn URL</label>
            <input
              type="text"
              name="social.linkedin"
              value={form.social.linkedin || ''}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.social && validate(form).social ? 'border-red-400' : ''}`}
            />
            {touched.social && validate(form).social && validate(form).social.linkedin ? <div className="text-red-500 text-sm mt-1">{validate(form).social.linkedin}</div> : null}
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-1">Twitter URL</label>
            <input
              type="text"
              name="social.twitter"
              value={form.social.twitter || ''}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.social && validate(form).social ? 'border-red-400' : ''}`}
            />
            {touched.social && validate(form).social && validate(form).social.twitter ? <div className="text-red-500 text-sm mt-1">{validate(form).social.twitter}</div> : null}
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-1">GitHub URL</label>
            <input
              type="text"
              name="social.github"
              value={form.social.github || ''}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.social && validate(form).social ? 'border-red-400' : ''}`}
            />
            {touched.social && validate(form).social && validate(form).social.github ? <div className="text-red-500 text-sm mt-1">{validate(form).social.github}</div> : null}
          </div>
        </div>

        {/* Error/Loading States */}
        {error && <div className="text-red-600 text-center font-medium">{error}</div>}
        {loading && <div className="text-blue-600 text-center font-medium">Saving...</div>}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            disabled={loading}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm; 