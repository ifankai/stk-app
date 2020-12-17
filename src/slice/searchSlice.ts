import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    queries: {},
    loading: false,
  },
  reducers: {
    displaySearchQueries: (state, action) => {
      state.queries = action.payload;
      state.loading = false;
    },
    setSearchLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { displaySearchQueries, setSearchLoading } = searchSlice.actions;

export default searchSlice.reducer;
