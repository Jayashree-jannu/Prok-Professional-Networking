const API_URL = 'http://127.0.0.1:5000';

export const jobsApi = {
  getJobs: async () => {
    const response = await fetch(`${API_URL}/jobs`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  getJob: async (jobId: number) => {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  applyForJob: async (jobId: number) => {
    const response = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },
}; 