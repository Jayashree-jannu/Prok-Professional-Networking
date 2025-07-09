const API_URL = 'http://127.0.0.1:5001';

export async function loginUser(credentials: { username?: string; email?: string; password: string }) {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export const authApi = {
  signup: async (userData: { username: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
}; 