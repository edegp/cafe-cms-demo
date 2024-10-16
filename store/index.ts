import {
  createSlice,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import createWebStorage from "redux-persist/lib/storage/createWebStorage"
import { getLiffProfile } from "utils/liff"
import ja from "public/locales/ja"
import { Liff } from "@line/liff"

export type Restaurant = {
  id: number
  name: string
  img: string
  address: string
  start: string
  end: string
  holiday: string
  tel: string
  line: string
  budget: number
  seats: number
  smoking: number
  map: {
    latitude: number
    longitude: number
  }
}

export type Course = {
  id: number
  name: string
  time: number
  price: number
  comment: string
  text: string
  value: number
}

type Message = {
  no: string
  restaurant: Restaurant
  name: string
  course: Course
  day: string
  people: number
  start: string
  end: string
  LIFF_INITED: boolean
}

type LineUser = {
  expire: string
  userId: string
  name: string
  token: string
  idToken: string
}
export type T = {
  [x: string]: string | Object
  top: { [key: string]: string }
  delete: { [key: string]: string }
  areas: { [key: string]: string }
  calendar: { [key: string]: string }
  completed: { [key: string]: string }
  delete_completed: { [key: string]: string }
  footer: { [key: string]: string }
  utils: { [key: string]: string }
  restaurant: { [key: string]: string }
  error: { [key: string]: string }
}

export type State = {
  message?: Message | null
  started?: string
  locales?: string[]
  locale?: string
  sessionId?: string
  lineUser?: LineUser
  restaurant?: Object
  axiosError?: Object
  t?: T
  isLoading?: boolean
  clientSize?: [number, number]
}

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null)
    },
    setItem(_key, value) {
      return Promise.resolve(value)
    },
    removeItem(_key) {
      return Promise.resolve()
    },
  }
}

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage()

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["message"], // What you don't wanna to persist
  // whitelist: ['auth'] // What you want to persist
}

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
  clientSize: [0, 0],
}

const restaurantSlice = createSlice({
  name: "reserve",
  initialState,
  reducers: {
    // HYDRATE: (state, action) => ({ ...state, ...action.payload }),
    // TICK: (state, action) => ({ ...state, tick: action.payload }),
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
      return { ...state, started: action.payload }
    },
    setLocale: (state, action) => {
      if (state.locales.includes(action.payload)) {
        return { ...state, locale: action.payload }
      }
    },
    setSession: (state, action) => {
      return { ...state, sessionId: action.payload }
    },
    setLineUser: (state, action) => {
      return { ...state, lineUser: action.payload }
    },
    setRestaurant: (state, action) => {
      return { ...state, restaurant: action.payload }
    },
    setAxiosError: (state, action) => {
      return { ...state, aciosError: action.payload }
    },
    setFlash: (state, action) => {
      return {
        ...state,
        message: {
          ...state.message,
          ...action.payload,
        },
      }
    },
    clearFlash: (state, action) => {
      if (!action.payload) {
        return { ...state, message: null }
      } else if (action.payload in state.message) {
        return {
          ...state,
          message: { ...state.message, [action.payload]: undefined },
        }
      }
    },
    setT: (state, action) => {
      return { ...state, t: action.payload === "ja" ? ja : ja }
    },
    setIsLoading: (state, action) => {
      return { ...state, isLoading: action.payload }
    },
    setWindowSize: (state, action) => {
      return { ...state, clientSize: action.payload }
    },
  },
})

const persistedReducer = persistReducer(persistConfig, restaurantSlice.reducer)

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
  setWindowSize,
} = restaurantSlice.actions
export default persistedReducer

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  // @ts-ignore
  predicate: (action: AnyAction, currentState: State, previousState: State) => {
    return currentState.isLoading === true || currentState.message?.LIFF_INITED
  },
  effect: (action, listenerApi) => {
    const { lineUser, message }: State = listenerApi.getState()
    if (message?.LIFF_INITED) {
      import("@line/liff").then((result) => {
        const liff = result.default
        //  　LIFFプロファイル取得・設定
        const _settingLiffProfile = async (liff: Liff) => {
          const _lineUser = await getLiffProfile(liff)
          listenerApi.dispatch(setLineUser(_lineUser))
        }
        // LIFF Login & Profile
        if (!lineUser || !("expire" in lineUser)) {
          // Get LIFF Profile & Token
          _settingLiffProfile(liff)
        } else {
          const now = new Date()
          const expire = parseInt(lineUser.expire, 10)
          if (expire < now.getTime()) {
            // Get LIFF Profile & Token
            _settingLiffProfile(liff)
          }
        }
      })
    }
  },
})

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ["persist/PERSIST"] },
    }).prepend(listenerMiddleware.middleware),
})

export const persistor = persistStore(store)
