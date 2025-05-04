import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  user: {},
};

const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = UserSlice.actions;

export default UserSlice.reducer;
