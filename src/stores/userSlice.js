import { createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  user: {},
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  role: null, // Add role field
};

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("setUser Payload:", action.payload);
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Extract and store role from user data - handle multiple possible structures
      const role = action.payload.user?.role ||
        action.payload.user?.data?.role ||
        action.payload.role ||
        null;
      state.role = role;
      console.log("Extracted Role:", role); // Debug log

      // Explicitly save to localStorage
      localStorage.setItem('token', action.payload.accessToken);
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
      // Save role to localStorage for additional persistence
      if (role) {
        localStorage.setItem('userRole', role);
        console.log("Role saved to localStorage:", role); // Debug log
      }
    },
    clearUser: (state) => {
      state.user = {};
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null; // Clear role on logout
      localStorage.removeItem('token'); // Explicitly remove from localStorage
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken'); // Remove legacy key
      localStorage.removeItem('userRole'); // Remove role from localStorage
    },
    resetUser: () => initialState,
  },
});

// Export the actions and reducer
export const { setUser, clearUser, resetUser } = userSlice.actions;

// Selectors
export const selectUser = (state) => {
  const user = state.user.user;
  if (user && user.data) {
    return user.data;
  }
  return user;
};
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectAccessToken = (state) => state.user.accessToken;
export const selectRefreshToken = (state) => state.user.refreshToken;
export const selectUserRole = (state) => {
  // Try to get role from Redux state first
  if (state.user.role) {
    return state.user.role;
  }
  // Fallback to localStorage if Redux hasn't rehydrated yet
  return localStorage.getItem('userRole');
};

// Export the reducer
export default userSlice.reducer;
