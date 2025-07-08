import React, { useState } from 'react';

interface ProfileInfoProps {
  profile: {
    bio?: string;
    skills?: string | string[];
    experience?: { company: string; role: string; period: string; description: string }[];
    education?: { school: string; degree: string; period: string }[];
    contact?: { email?: string; phone?: string; website?: string };
  };
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4">
      <button
        className="w-full flex justify-between items-center py-2 px-4 bg-gray-100 rounded-lg focus:outline-none md:cursor-default"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span className="font-semibold text-gray-700">{title}</span>
        <span className="md:hidden">{open ? '−' : '+'}</span>
      </button>
      <div className={`transition-all duration-200 ${open ? 'block' : 'hidden'} md:block bg-white p-4 rounded-b-lg border border-t-0 border-gray-200`}>{children}</div>
    </div>
  );
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : (profile.skills ? profile.skills.split(',').map((s: string) => s.trim()) : []);
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Bio">
        <p className="text-gray-700">{profile.bio || 'No bio provided.'}</p>
      </CollapsibleSection>
      <CollapsibleSection title="Skills">
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? skills.map((skill: string) => (
            <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">{skill}</span>
          )) : <span className="text-gray-400">No skills listed.</span>}
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="Work Experience">
        <ul className="space-y-2">
          {profile.experience?.map((exp) => (
            <li key={exp.company + exp.role} className="border-b pb-2 last:border-b-0">
              <div className="font-semibold text-gray-800">{exp.role} @ {exp.company}</div>
              <div className="text-gray-500 text-sm">{exp.period}</div>
              <div className="text-gray-700 text-sm">{exp.description}</div>
            </li>
          ))}
        </ul>
      </CollapsibleSection>
      <CollapsibleSection title="Education">
        <ul className="space-y-2">
          {profile.education?.map((edu) => (
            <li key={edu.school + edu.degree}>
              <div className="font-semibold text-gray-800">{edu.degree}</div>
              <div className="text-gray-500 text-sm">{edu.school} ({edu.period})</div>
            </li>
          ))}
        </ul>
      </CollapsibleSection>
      {profile.contact && (
        <CollapsibleSection title="Contact Information">
          <div className="space-y-1">
            {profile.contact.email && <div><span className="font-medium">Email:</span> <a href={`mailto:${profile.contact.email}`} className="text-blue-600 hover:underline">{profile.contact.email}</a></div>}
            {profile.contact.phone && <div><span className="font-medium">Phone:</span> {profile.contact.phone}</div>}
            {profile.contact.website && <div><span className="font-medium">Website:</span> <a href={profile.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.contact.website}</a></div>}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
};

export default ProfileInfo; 