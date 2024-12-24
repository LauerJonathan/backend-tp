import { configureStore } from "@reduxjs/toolkit";
import travelPlansSlice from "./features/travelplanSlice";

export const store = configureStore({
  reducer: {
    companies: travelPlansSlice,
  },
});
