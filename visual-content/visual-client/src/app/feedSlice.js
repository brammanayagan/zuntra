import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pins: [],
  feedLoading: false,
  searchQuery: "",
  activeCategory: "",
  selectedPin: null,
  isPinModalOpen: false,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setPins: (state, action) => {
      state.pins = action.payload;
    },
    addPin: (state, action) => {
      state.pins = [action.payload, ...state.pins];
    },
    removePin: (state, action) => {
      state.pins = state.pins.filter((p) => p._id !== action.payload);
    },
    setFeedLoading: (state, action) => {
      state.feedLoading = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setSelectedPin: (state, action) => {
      state.selectedPin = action.payload;
      state.isPinModalOpen = !!action.payload;
    },
    closePinModal: (state) => {
      state.selectedPin = null;
      state.isPinModalOpen = false;
    },
  },
});

export const {
  setPins,
  addPin,
  removePin,
  setFeedLoading,
  setSearchQuery,
  setActiveCategory,
  setSelectedPin,
  closePinModal,
} = feedSlice.actions;

export default feedSlice.reducer;
