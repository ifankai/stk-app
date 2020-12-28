import { createSlice } from "@reduxjs/toolkit";
import { PageRoot } from "../model/PageRoot";
import { Post } from "../model/Post";
import postService from "../service/post.service";
import { AppDispatch } from "../store";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    text: "",
    posts: [],
    loading: false,
  },
  reducers: {
    setSearchText:  (state, action) => {
      state.text = action.payload;
    },
    setSearchPosts: (state, action) => {
      state.posts = action.payload;
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
      const result = await postService.doSearchByCode(query)

      if (result.success) {
        const posts = await (result.data as PageRoot<Post>).list;
        console.log(posts)
        dispatch(setSearchPosts(posts));
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

export const {setSearchText, setSearchPosts, setSearchLoading } = searchSlice.actions;

export default searchSlice.reducer;
