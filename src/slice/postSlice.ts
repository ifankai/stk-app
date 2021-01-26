import { createSlice } from "@reduxjs/toolkit";
import { PageRoot } from "../model/PageRoot";
import { Post } from "../model/Post";
import postService from "../service/post.service";
import { AppDispatch } from "../store";
import { setErrorMessage } from "./commonSlice";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    segment: "all",
    allPosts: [],
    favoritePosts: [],
    searchPosts: [],
    showDetail: false,
    postDetail: "",
    noMoreData: false,
  },
  reducers: {
    setSegment: (state, action) => {
      state.segment = action.payload;
    },
    setAllPosts: (state, action) => {
      state.allPosts = action.payload;
    },
    setFavoritePosts: (state, action) => {
      state.favoritePosts = action.payload;
    },
    setSearchPosts: (state, action) => {
      state.searchPosts = action.payload;
    },
    setPostsBySegment: (state, action) => {
      const segment = state.segment;
      if (segment === "all") {
        state.allPosts = action.payload;
      } else if (segment === "favorite") {
        state.favoritePosts = action.payload;
      } else if (segment === "search") {
        state.searchPosts = action.payload;;
      }
    },
    setPostsBySegmentAtStart: (state, action) => {
      const segment = state.segment;
      if (segment === "all") {
        state.allPosts = [...action.payload, ...state.allPosts] as never[];
      } else if (segment === "favorite") {
        state.favoritePosts = [...action.payload, ...state.favoritePosts] as never[];
      } else if (segment === "search") {
        state.searchPosts = [...action.payload, ...state.searchPosts] as never[];
      }
    },
    setPostsBySegmentAtEnd: (state, action) => {
      const segment = state.segment;
      if (segment === "all") {
        state.allPosts = [...state.allPosts, ...action.payload] as never[];
      } else if (segment === "favorite") {
        state.favoritePosts = [...state.favoritePosts, ...action.payload] as never[];
      } else if (segment === "search") {
        state.searchPosts = [...state.searchPosts, ...action.payload] as never[];
      }
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
export const getPostAfter = (
  segment: string,
  insertTimeAfter: number,
  keyword: string
) => async (dispatch: AppDispatch) => {
  dispatch(getPost(segment, -1, insertTimeAfter, keyword));
};

export const getPostBefore = (
  segment: string,
  insertTimeBefore: number,
  keyword: string
) => async (dispatch: AppDispatch) => {
  dispatch(getPost(segment, insertTimeBefore, -1, keyword));
};

export const getPost = (
  segment: string,
  insertTimeBefore: number,
  insertTimeAfter: number,
  keyword: string
) => async (dispatch: AppDispatch) => {
  try {
    const result = await postService.getPost(
      segment,
      keyword,
      insertTimeBefore,
      insertTimeAfter,
      10
    );

    if (result.success) {
      const newPosts = await (result.data as PageRoot<Post>).list;
      //console.log(newPosts)
      if (newPosts.length < 10) {
        dispatch(setNoMoreData(true));
      } else {
        dispatch(setNoMoreData(false));
      }
      if(insertTimeBefore === -1 && insertTimeAfter === -1){
        dispatch(setPostsBySegment(newPosts));
      }else if(insertTimeBefore === -1 && insertTimeAfter !== -1){
        dispatch(setPostsBySegmentAtStart(newPosts));
      }else if(insertTimeBefore !== -1 && insertTimeAfter === -1){
        dispatch(setPostsBySegmentAtEnd(newPosts));
      }
    } else {
      dispatch(setErrorMessage(result.data as string));
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const {
  setSegment,
  setAllPosts,
  setFavoritePosts,
  setSearchPosts,
  setPostsBySegment,
  setPostsBySegmentAtStart,
  setPostsBySegmentAtEnd,
  setShowDetail,
  setPostDetail,
  setNoMoreData,
} = postSlice.actions;

export default postSlice.reducer;
