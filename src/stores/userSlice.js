import { createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  user: {},
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
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
      localStorage.setItem('token', action.payload.accessToken); // Explicitly save to localStorage
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
    clearUser: (state) => {
      state.user = {};
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('token'); // Explicitly remove from localStorage
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken'); // Remove legacy key
    },
    resetUser: () => initialState,
  },
});

// Export the actions and reducer
export const { setUser, clearUser, resetUser } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectAccessToken = (state) => state.user.accessToken;
export const selectRefreshToken = (state) => state.user.refreshToken;

// Export the reducer
export default userSlice.reducer;
