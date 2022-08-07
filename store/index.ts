import React from "react";
import {
  createSlice,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { getLiffProfile } from "utils/liff";
import ja from "public/locales/ja";

type Restaurant = {
  id: number;
  name: string;
  img: string;
  address: string;
  start: string;
  end: string;
  holiday: string;
  tel: string;
  line: string;
  budget: number;
  seats: number;
  smoking: number;
  map: string[];
};

type Course = {
  id: number;
  name: string;
  time: number;
  price: number;
  comment: string;
  text: string;
  value: number;
};

type Message = {
  no: string;
  restaurant: Restaurant;
  name: string;
  course: Course;
  day: string;
  people: number;
  start: string;
  end: string;
  LIFF_INITED: boolean;
};

type LineUser = {
  expire: string;
  userId: string;
  name: string;
  token: string;
  idToken: string;
};
type T = {
  type: string;
  language: string;
  title: string;
  top: {
    title: string;
    msg001: string;
    msg002: string;
    msg003: string;
    msg004: string;
    msg005: string;
    msg006: string;
  };
  delete: { title: string; msg001: string };
  areas: {
    msg001: string;
    msg002: string;
    msg003: string;
    msg004: string;
    msg005: string;
    msg006: string;
    msg007: string;
  };
  calendar: {
    vacant: string;
    vacant_little: string;
    full: string;
    short_vacant: string;
    short_vacant_little: string;
    short_full: string;
    closingday: string;
    short_closingday: string;
    vacancy: string;
    msg001: string;
    msg002: string;
    msg003: string;
    msg004: string;
    msg005: string;
    msg006: string;
    msg007: string;
    msg008: string;
    msg009: string;
    msg010: string;
    msg011: string;
    msg012: string;
    msg013: string;
    msg014: string;
    msg015: string;
    msg016: string;
    msg017: string;
  };
  completed: {
    msg001: string;
    msg002: string;
    msg003: string;
    msg004: string;
    msg005: string;
    msg006: string;
    msg007: string;
    msg008: string;
    msg009: string;
    msg010: string;
    msg011: string;
    msg012: string;
    msg013: string;
    yyyymmdd: string;
  };
  delete_completed: {
    msg001: string;
    msg002: string;
    msg003: string;
    msg004: string;
    msg005: string;
    msg006: string;
    msg007: string;
    msg008: string;
    msg009: string;
    msg010: string;
    msg011: string;
    msg012: string;
    msg013: string;
    yyyymmdd: string;
  };
  footer: {
    shop: string;
    day: string;
    selection: string;
  };
  utils: {
    sun: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    hol: string;
  };
  restaurant: {
    yen: string;
    yyyymm: string;
    allowed: string;
    not_allowed: string;
    no_course: string;
    vacant: string;
    vacant_little: string;
    full: string;
  };
  error: {
    msg001: string;
    msg002: string;
    msg003: string;
    msg004: string;
    msg005: string;
  };
};

type State = {
  message?: Message | null;
  started?: string;
  locales?: string[];
  locale?: string;
  sessionId?: string;
  lineUser?: LineUser;
  restaurant?: Object;
  axiosError?: Object;
  t?: T;
  isLoading?: boolean;
};

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
  blacklist: ["message"], // What you don't wanna to persist
  // whitelist: ['auth'] // What you want to persist
};

const initialState: State = {
  message: null,
  started: null,
  locales: ["ja"],
  locale: "ja",
  sessionId: null,
  lineUser: null,
  restaurant: null,
  axiosError: null,
  t: null,
  isLoading: false,
};

const restaurantSlice = createSlice({
  name: "reserve",
  initialState,
  reducers: {
    HYDRATE: (state, action) => ({ ...state, ...action.payload }),
    TICK: (state, action) => ({ ...state, tick: action.payload }),
    clear: (state) => ({
      ...state,
      message: null,
      started: null,
      locale: "ja",
      // sessionId: null,
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
          ...action.payload,
        },
      };
    },
    clearFlash: (state, action) => {
      if (!action.payload) {
        return { ...state, message: null };
      } else if (action.payload in state.message) {
        return {
          ...state,
          message: { ...state.message, [action.payload]: undefined },
        };
      }
    },
    setT: (state, action) => {
      return { ...state, t: action.payload === "ja" ? ja : ja };
    },
    setIsLoading: (state, action) => {
      return { ...state, isLoading: action.payload };
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
  setIsLoading,
} = restaurantSlice.actions;
export default persistedReducer;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(setFlash, setIsLoading),
  effect: (action, listenerApi) => {
    const { lineUser, message }: State = listenerApi.getState();
    if (message?.LIFF_INITED) {
      import("@line/liff").then((result) => {
        const liff = result.default;
        //  　LIFFプロファイル取得・設定
        const _settingLiffProfile = async (liff) => {
          const _lineUser = await getLiffProfile(liff);
          listenerApi.dispatch(setLineUser(_lineUser));
        };
        // LIFF Login & Profile
        if (!lineUser || !("expire" in lineUser)) {
          // Get LIFF Profile & Token
          _settingLiffProfile(liff);
        } else {
          const now = new Date();
          const expire = parseInt(lineUser.expire, 10);
          if (expire < now.getTime()) {
            // Get LIFF Profile & Token
            _settingLiffProfile(liff);
          }
        }
      });
    }
  },
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ["persist/PERSIST"] },
    }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);
