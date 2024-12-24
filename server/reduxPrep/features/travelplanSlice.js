// src/redux/features/travelPlansSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
require("dotenv").config();

const API_URL = process.env.REDUX_URL;

// Thunks
export const fetchTravelPlans = createAsyncThunk(
  "travelPlans/fetchTravelPlans",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const addTravelPlan = createAsyncThunk(
  "travelPlans/addTravelPlan",
  async (travelPlan) => {
    const response = await axios.post(API_URL, travelPlan);
    return response.data;
  }
);

export const updateTravelPlan = createAsyncThunk(
  "travelPlans/updateTravelPlan",
  async ({ id, travelPlan }) => {
    const response = await axios.put(`${API_URL}/${id}`, travelPlan);
    return response.data;
  }
);

export const deleteTravelPlan = createAsyncThunk(
  "travelPlans/deleteTravelPlan",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

// Slice
const travelPlansSlice = createSlice({
  name: "travelPlans",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch travel plans
      .addCase(fetchTravelPlans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTravelPlans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTravelPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add travel plan
      .addCase(addTravelPlan.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update travel plan
      .addCase(updateTravelPlan.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (plan) => plan.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete travel plan
      .addCase(deleteTravelPlan.fulfilled, (state, action) => {
        state.items = state.items.filter((plan) => plan.id !== action.payload);
      });
  },
});

export default travelPlansSlice.reducer;
