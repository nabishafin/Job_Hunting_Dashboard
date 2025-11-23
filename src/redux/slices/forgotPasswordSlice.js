import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setResetEmail: (state, action) => {
      state.email = action.payload;
    },
    clearResetEmail: (state) => {
      state.email = null;
    },
  },
});

export const { setResetEmail, clearResetEmail } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
