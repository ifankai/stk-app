import { createSlice } from "@reduxjs/toolkit";
import { StockModel } from "../model/StockModel";
import stockService from "../service/stock.service";
import { AppDispatch } from "../store";

export const stockSlice = createSlice({
  name: "stock",
  initialState: {
    code: "",
    name: "",
    loading: false,
    info: {} as StockModel,
  },
  reducers: {
    setStockLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStockCode: (state, action) => {
      state.code = action.payload;
    },
    setStockName: (state, action) => {
      state.name = action.payload;
    },
    setStockInfo: (state, action) => {
      state.info = action.payload;
    },
  },
});

// Thunk functions
export const getStockInfo = (code: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setStockLoading(true));
    const result = await stockService.getStockInfo(code);

    if (result.success) {
      const stockInfo = result.data;
      //console.log(stockInfo)
      dispatch(setStockInfo(stockInfo));
    } else {
      dispatch(setStockLoading(false));
      console.log(result.data);
    }
  } catch (error) {
    console.log(error.message);
    dispatch(setStockLoading(false));
  }
};

export const {
  setStockLoading,
  setStockCode,
  setStockName,
  setStockInfo,
} = stockSlice.actions;
export default stockSlice.reducer;
