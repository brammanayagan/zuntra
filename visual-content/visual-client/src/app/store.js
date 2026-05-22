import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import feedReducer from "./feedSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
  },
});

export default store;
