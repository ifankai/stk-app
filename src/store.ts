import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import searchSlice from "./slice/searchSlice";

export const store = configureStore({
  reducer: {
    search: searchSlice,
  },
});

// Type definitions
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
