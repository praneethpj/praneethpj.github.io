import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pdfUrl: null,
  loading: true,
  error: null,
};

const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {
    setPdfUrl: (state, action) => {
      state.pdfUrl = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetPdfState: (state) => {
      state.pdfUrl = null;
      state.loading = true;
      state.error = null;
    },
  },
});

// Export actions
export const { setPdfUrl, setLoading, setError, resetPdfState } = pdfSlice.actions;

// Export reducer
export default pdfSlice.reducer;
