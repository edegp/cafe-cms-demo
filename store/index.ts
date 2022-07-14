import React from "react";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
// import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import ja from "public/locales/ja";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // blacklist: ['counter'] // What you don't wanna to persist
  // whitelist: ['auth'] // What you want to persist
};

const restaurantSlice = createSlice({
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
    t: null,
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
        message: {
          ...state.message,
          [action.payload.name]: action.payload.value,
        },
      };
    },
    clearFlash: (state, action) => {
      if (action.payload.name === undefined) {
        return { ...state, message: null };
      } else if (action.payload.name in state.message) {
        return { ...state, message: { [action.payload.name]: undefined } };
      }
    },
    setT: (state, action) => {
      return { ...state, t: action.payload === "ja" ? ja : ja };
    },
  },
});

const persistedReducer = persistReducer(persistConfig, restaurantSlice.reducer);

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
  setT,
} = restaurantSlice.actions;
export default persistedReducer;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

export const selectors = {
  axiosError(state) {
    return state.axiosError;
  },
  isAxiosError(state) {
    return state.axiosError != null ? true : false;
  },
};
