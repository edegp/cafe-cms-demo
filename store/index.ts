import React from "react";
import { createSlice, configureStore } from "@reduxjs/toolkit";

const reserveSlice = createSlice({
  name: "reserve",
  initialState: {
    message: null,
    started: null,
    locales: ["ja"],
    locale: "ja",
    sessionId: null,
    lineUser: null,
    restaurant: null,
    axiosError: null,
  },
  reducers: {
    clear: (state) => ({
      ...state,
      started: null,
      locale: "ja",
      sessionId: null,
      lineUser: null,
      restaurant: null,
      axiosError: null,
    }),
    setStarted: (state, action) => {
      return { ...state, started: action.payload };
    },
    setLocale: (state, action) => {
      if (state.locales.includes(action.payload)) {
        return { ...state, locale: action.payload };
      }
    },
    setSession: (state, action) => {
      return { ...state, sessionId: action.payload };
    },
    setLineUser: (state, action) => {
      return { ...state, lineUser: action.payload };
    },
    setRestaurant: (state, action) => {
      return { ...state, restaurant: action.payload };
    },
    setAxiosError: (state, action) => {
      return { ...state, aciosError: action.payload };
    },
    setFlash: (state, action) => {
      return {
        ...state,
        message: { [action.payload.name]: action.payload.value },
      };
    },
    clearFlash: (state, action) => {
      if (action.payload.name === undefined) {
        return { ...state, message: null };
      } else if (action.payload.name in state.message) {
        return { ...state, message: { [action.payload.name]: undefined } };
      }
    },
  },
});

export const {
  clear,
  setStarted,
  setLocale,
  setSession,
  setLineUser,
  setRestaurant,
  setAxiosError,
  setFlash,
  clearFlash,
} = reserveSlice.actions;
export default reserveSlice.reducer;

export const store = configureStore({
  reducer: reserveSlice.reducer,
});

export const selectors = {
  axiosError(state) {
    return state.axiosError;
  },
  isAxiosError(state) {
    return state.axiosError != null ? true : false;
  },
};
