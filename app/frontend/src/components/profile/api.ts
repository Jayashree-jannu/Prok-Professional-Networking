const API_URL = 'http://127.0.0.1:5001/api/profile';

export async function fetchProfile() {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateProfile(data: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function uploadAvatar(file: File) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('http://127.0.0.1:5001/api/profile/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) {
    let errorMsg = 'Failed to upload avatar';
    try {
      const err = await res.json();
      errorMsg = err.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
} 