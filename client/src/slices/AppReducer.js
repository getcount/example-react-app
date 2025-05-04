import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  theme: 'light',
};

const AppSlice = createSlice({
  name: 'App',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = AppSlice.actions;

export default AppSlice.reducer;
