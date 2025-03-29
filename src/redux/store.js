import { configureStore } from "@reduxjs/toolkit";
import pdfReducer from "./pdfSlice";

export const store = configureStore({
  reducer: {
    pdf: pdfReducer,
  },
});

export default store;
