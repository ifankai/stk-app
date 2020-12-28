import { createSlice } from "@reduxjs/toolkit";

export const commonSlice = createSlice({
  name: "common",
  initialState: {
    error: {
      show: false,
      message: "",
    },
    loading: false,
  },
  reducers: {
    setErrorMessage: (state, action) => {
      state.error.show = true;
      state.error.message = action.payload;
    },
    setErrorShow: (state, action) => {
      state.error.show = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setErrorMessage, setErrorShow, setLoading } = commonSlice.actions;
export default commonSlice.reducer;
