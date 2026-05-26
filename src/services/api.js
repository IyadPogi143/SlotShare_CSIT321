const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

// Helper to make API requests
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof TypeError) {
      throw new Error('Unable to connect to server. Please ensure the backend is running on port 5000.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) => 
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getCurrentUser: () => 
    request('/auth/me'),
};

// Listings API
export const listingsAPI = {
  // Public — browse all active listings
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/listings${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) =>
    request(`/listings/${id}`),

  // Owner — get only MY listings (any status)
  getMyListings: () =>
    request('/listings/my'),

  create: (data) =>
    request('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/listings/${id}`, { method: 'DELETE' }),
};

// Bookings API
export const bookingsAPI = {
  // Driver — bookings I made
  getMyBookings: () =>
    request('/bookings/as-renter'),

  // Owner — bookings on my listings
  getIncomingBookings: () =>
    request('/bookings/as-owner'),

  create: (data) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  accept: (id) =>
    request(`/bookings/${id}/accept`, { method: 'PATCH' }),

  reject: (id) =>
    request(`/bookings/${id}/reject`, { method: 'PATCH' }),

  cancel: (id) =>
    request(`/bookings/${id}/cancel`, { method: 'PATCH' }),
};

// Users API (Admin)
export const usersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/users${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => 
    request(`/users/${id}`),

  update: (id, userData) => 
    request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  delete: (id) => 
    request(`/users/${id}`, {
      method: 'DELETE',
    }),

  updatePassword: (id, password) => 
    request(`/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    }),

  getStats: () => 
    request('/users/stats/summary'),
};

// Admin Bookings API
export const adminBookingsAPI = {
  // GET /api/admin/bookings — all bookings with driver + listing info, filterable
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/admin/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // PATCH /api/admin/bookings/:id/status — set status manually
  updateStatus: (id, status) =>
    request(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // DELETE /api/admin/bookings/:id
  delete: (id) =>
    request(`/admin/bookings/${id}`, { method: 'DELETE' }),
};

// Admin Listings API (from previous session)
export const adminListingsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/admin/listings${queryString ? `?${queryString}` : ''}`);
  },

  updateStatus: (id, status) =>
    request(`/admin/listings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id) =>
    request(`/admin/listings/${id}`, { method: 'DELETE' }),
};

// Utility functions
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default {
  auth: authAPI,
  users: usersAPI,
  listings: listingsAPI,
  bookings: bookingsAPI,
  adminListings: adminListingsAPI,
  adminBookings: adminBookingsAPI,
  setToken,
  removeToken,
  isAuthenticated,
  getUserFromToken,
};