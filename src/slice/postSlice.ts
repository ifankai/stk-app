import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    segment: "unread",    
  },
  reducers: {
    setSegment: (state, action) => {
      state.segment = action.payload;
    },
  },
});

export const { setSegment } = postSlice.actions;

export default postSlice.reducer;