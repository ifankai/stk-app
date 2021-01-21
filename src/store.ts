import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import commonSlice from "./slice/commonSlice";
import postSlice from "./slice/postSlice";
import searchSlice from "./slice/searchSlice";
import stockSlice from "./slice/stockSlice";

export const store = configureStore({
  reducer: {
    search: searchSlice,
    post: postSlice,
    common: commonSlice,
    stock: stockSlice,
  },
});

// Type definitions
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
