import { createSlice } from "@reduxjs/toolkit";
import { PageRoot } from "../model/PageRoot";
import { SearchResult } from "../model/SearchResult";
import searchService from "../service/search.service";
import { AppDispatch } from "../store";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    text: "",
    results: [],
    loading: false,
  },
  reducers: {
    setSearchText:  (state, action) => {
      state.text = action.payload;
    },
    setSearchResult: (state, action) => {
      state.results = action.payload;
      state.loading = false;
    },
    setSearchLoading: (state, action) => {
      state.loading = action.payload;
    },    
  },
});


// Thunk functions
export const getSearchResult = (query: string) => async (
  dispatch: AppDispatch
) => {
  try {
    if (query.length) {
      dispatch(setSearchLoading(true));
      const result = await searchService.getSearchResult(query)

      if (result.success) {
        const searchResults = (result.data as unknown as PageRoot<SearchResult>).list;
        console.log(searchResults)
        dispatch(setSearchResult(searchResults));
      } else {
        dispatch(setSearchLoading(false));
        console.log(result.data);
      }
    }
  } catch (error) {
    console.log(error.message);
    dispatch(setSearchLoading(false));
  }
};

export const {setSearchText, setSearchResult, setSearchLoading } = searchSlice.actions;
export default searchSlice.reducer;
