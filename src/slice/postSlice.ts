import { createSlice } from "@reduxjs/toolkit";
import { PageRoot } from "../model/PageRoot";
import { Post } from "../model/Post";
import postService from "../service/post.service";
import { AppDispatch } from "../store";
import { setErrorMessage } from "./commonSlice";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    segment: "unread",
    unreadPosts: [],
    readPosts: [],
    favoritePosts: [],
    searchPosts: [],
    searchPage: 1,
    showDetail: false,
    postDetail: "",
    noMoreData: false,
  },
  reducers: {
    setSegment: (state, action) => {
      state.segment = action.payload;
    },
    setUnreadPosts: (state, action) => {
      state.unreadPosts = action.payload;
    },
    setReadPosts: (state, action) => {
      state.readPosts = action.payload;
    },
    setFavoritePosts: (state, action) => {
      state.favoritePosts = action.payload;
    },
    setSearchPosts: (state, action) => {
      state.searchPosts = action.payload;
    },
    setPostsBySegment: (state, action) => {
      const segment = state.segment;
      if (segment === "unread") {
        state.unreadPosts = [
          ...action.payload,
          ...state.unreadPosts,
        ] as never[];
        //state.unreadPosts = action.payload
      } else if (segment === "read") {
        state.readPosts = action.payload;
      } else if (segment === "favorite") {
        state.favoritePosts = action.payload;
      } else if (segment === "search") {
        if (state.searchPage === 1) {
          state.searchPosts = action.payload;
        } else {
          state.searchPosts = [
            ...state.searchPosts,
            ...action.payload,
          ] as never[];
        }
      }
    },
    setSearchPage: (state, action) => {
      state.searchPage = action.payload;
    },
    setShowDetail: (state, action) => {
      state.showDetail = action.payload;
    },
    setPostDetail: (state, action) => {
      state.postDetail = action.payload;
    },
    setNoMoreData: (state, action) => {
      state.noMoreData = action.payload;
    },
  },
});

// Thunk functions
export const getPost = (
  segment: string,
  page: number,
  keyword: string
) => async (dispatch: AppDispatch) => {
  try {
    const result = await postService.getPost(segment, keyword, page, 10);

    if (result.success) {
      const newPosts = await (result.data as PageRoot<Post>).list;
      //console.log(newPosts)
      if (newPosts.length < 10) {
        dispatch(setNoMoreData(true));
      } else {
        dispatch(setNoMoreData(false));
      }
      dispatch(setPostsBySegment(newPosts));
    } else {
      dispatch(setErrorMessage(result.data as string));
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const {
  setSegment,
  setUnreadPosts,
  setReadPosts,
  setFavoritePosts,
  setSearchPosts,
  setPostsBySegment,
  setSearchPage,
  setShowDetail,
  setPostDetail,
  setNoMoreData,
} = postSlice.actions;

export default postSlice.reducer;
