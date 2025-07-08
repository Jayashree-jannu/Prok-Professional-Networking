export const mockUser = {
  id: 1,
  name: 'Jane Doe',
  title: 'Software Engineer',
  location: 'San Francisco, CA',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  social: {
    linkedin: 'https://linkedin.com/in/janedoe',
    twitter: 'https://twitter.com/janedoe',
    github: 'https://github.com/janedoe',
  },
  bio: 'Passionate developer with 5+ years of experience in full-stack development. Loves building scalable web apps and mentoring new engineers.',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'],
  contact: {
    email: 'jane.doe@example.com',
    phone: '+1 555-123-4567',
    website: 'https://janedoe.dev',
  },
  experience: [
    {
      company: 'TechCorp',
      role: 'Senior Software Engineer',
      period: '2021 - Present',
      description: 'Leading a team of 6 engineers to build scalable SaaS products.'
    },
    {
      company: 'Webify',
      role: 'Frontend Developer',
      period: '2018 - 2021',
      description: 'Developed modern web interfaces with React and Redux.'
    }
  ],
  education: [
    {
      school: 'Stanford University',
      degree: 'B.S. Computer Science',
      period: '2014 - 2018'
    }
  ],
  connections: 350,
  mutualConnections: 12
};

export const mockActivity = [
  { id: 1, type: 'post', content: 'Excited to start a new project!', date: '2024-07-01' },
  { id: 2, type: 'connection', content: 'Connected with John Smith', date: '2024-06-28' },
  { id: 3, type: 'post', content: 'Shared an article on React best practices.', date: '2024-06-25' },
  { id: 4, type: 'interaction', content: "Commented on Alice's post.", date: '2024-06-20' },
]; 