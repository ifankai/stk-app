import { createSlice } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import { PageRoot } from "../model/PageRoot";
import { EsDocument } from "../model/SearchResult";
import postService from "../service/post.service";
import searchService from "../service/search.service";
import { AppDispatch } from "../store";
import { setErrorMessage } from "./commonSlice";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    segment: "all",
    subSegment: "all",
    allPosts: {} as PageRoot<EsDocument>,
    favoritePosts: {} as PageRoot<EsDocument>,
    searchResults: {} as PageRoot<EsDocument>,
    searchPage: 1,
    showDetail: false,
    postDetail: "",
    noMoreData: false,
  },
  reducers: {
    setSegment: (state, action) => {
      state.segment = action.payload;
    },
    setSubSegment: (state, action) => {
      state.subSegment = action.payload;
    },
    setAllPosts: (state, action) => {
      state.allPosts = action.payload;
    },
    setFavoritePosts: (state, action) => {
      state.favoritePosts = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchPage: (state, action) => {
      state.searchPage = action.payload;
    },
    setPostsBySegment: (state, action) => {
      const segment = state.segment;
      if (segment === "all") {
        state.allPosts = action.payload;
      } else if (segment === "favorite") {
        state.favoritePosts = action.payload;
      } else if (segment === "search") {
        state.searchResults = action.payload;;
      }
    },
    setPostsBySegmentAtStart: (state, action) => {
      const segment = state.segment;
      if (segment === "all") {
        state.allPosts.list = [...action.payload.list, ...state.allPosts.list] as never[];
      } else if (segment === "favorite") {
        state.favoritePosts.list = [...action.payload.list, ...state.favoritePosts.list] as never[];
      } else if (segment === "search") {
        state.searchResults.list = [...action.payload.list, ...state.searchResults.list] as never[];
      }
    },
    setPostsBySegmentAtEnd: (state, action) => {
      const segment = state.segment;
      if (segment === "all") {
        state.allPosts.list = [...state.allPosts.list, ...action.payload.list] as never[];
      } else if (segment === "favorite") {
        state.favoritePosts.list = [...state.favoritePosts.list, ...action.payload.list] as never[];
      } else if (segment === "search") {
        //state.searchResults.list.push(action.payload.list);
        state.searchResults.list = [...state.searchResults.list, ...action.payload.list] as never[];
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
  idAfter: number,
  keyword: string
) => async (dispatch: AppDispatch) => {
  dispatch(getPost(segment, -1, idAfter, keyword));
};

export const getPostBefore = (
  segment: string,
  idBefore: number,
  keyword: string
) => async (dispatch: AppDispatch) => {
  dispatch(getPost(segment, idBefore, -1, keyword));
};

export const getPost = (
  segment: string,
  idBefore: number,
  idAfter: number,
  keyword: string
) => async (dispatch: AppDispatch) => {
  try {
    const result = await postService.getPost(
      segment,
      keyword,
      idBefore,
      idAfter,
      10
    );

    if (result.success) {
      const pageRoot = await (result.data as PageRoot<EsDocument>);
      //console.log(pageRoot)
      if (pageRoot.list.length < 10 && idAfter === -1) {
        dispatch(setNoMoreData(true));
      } else {
        dispatch(setNoMoreData(false));
      }
      if(idBefore === -1 && idAfter === -1){
        dispatch(setPostsBySegment(pageRoot));
      }else if(idBefore === -1 && idAfter !== -1){
        dispatch(setPostsBySegmentAtStart(pageRoot));
      }else if(idBefore !== -1 && idAfter === -1){
        dispatch(setPostsBySegmentAtEnd(pageRoot));
      }
    } else {
      dispatch(setErrorMessage(result.data as string));
    }
  } catch (error) {
    console.log(error);
  }
};

export const getSearchResults = (query: string, page: number = 1) => async (
  dispatch: AppDispatch,
  getState: RootStateOrAny
) => {
  try {
    console.log("query", query, page)
    if (query.length) {
      //dispatch(setSearchLoading(true));
      const other = getState().post.subSegment === "all"?"":getState().post.subSegment
      const result = await searchService.getSearchResult(query, other, page)

      if (result.success) {        
        const searchResults = result.data as unknown as PageRoot<EsDocument>
        if(page === 1){
          dispatch(setSearchResults(searchResults))  
        }else{
          dispatch(setPostsBySegmentAtEnd(searchResults));
        }
      } else {
        //dispatch(setSearchLoading(false));
        console.log(result.data);
      }
    }
  } catch (error) {
    console.log(error);
    //dispatch(setSearchLoading(false));
  }
};

export const {
  setSegment,
  setSubSegment,
  setAllPosts,
  setFavoritePosts,
  setSearchResults,
  setSearchPage,
  setPostsBySegment,
  setPostsBySegmentAtStart,
  setPostsBySegmentAtEnd,
  setShowDetail,
  setPostDetail,
  setNoMoreData,
} = postSlice.actions;

export default postSlice.reducer;
