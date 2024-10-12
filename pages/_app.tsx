import "styles/tailwind.scss"
import "styles/globals.scss"
import "styles/tailwind-utils.scss"

import React, { useEffect, useLayoutEffect, useState } from "react"
import { Provider } from "react-redux"
import RestaurantLayout from "components/RestaurantLayout"
import { useRouter } from "next/router"
import {
  store,
  setStarted,
  setLocale,
  setFlash,
  setT,
  persistor,
  setIsLoading,
} from "store"
import { PersistGate } from "redux-persist/integration/react"
import { LoadingOutlined } from "@ant-design/icons"
import { Spin } from "antd"
import ErrorBoundary from "antd/lib/alert/ErrorBoundary"
import Head from "next/head"
import { useWindowSize } from "libs/useWindowSize"
import { Initialize } from "libs/initialize"

const liffId =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIFF_ID
    : process.env.NEXT_PUBLIC_LIFF_ID_DEV

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const { message } = store.getState()
  useWindowSize()

  useEffect(() => {
    if (router.pathname.startsWith("/restaurant")) Initialize(router)
  }, [message])

  useEffect(() => {
    router.events.on("routeChangeStart", () =>
      store.dispatch(setIsLoading(true))
    )
    router.events.on("routeChangeComplete", () =>
      store.dispatch(setIsLoading(false))
    )
    router.events.on("routeChangeError", () =>
      store.dispatch(setIsLoading(false))
    )
    return () => {
      router.events.off("routeChangeStart", () =>
        store.dispatch(setIsLoading(true))
      )
      router.events.off("routeChangeComplete", () =>
        store.dispatch(setIsLoading(false))
      )
      router.events.off("routeChangeError", () =>
        store.dispatch(setIsLoading(false))
      )
    }
  }, [router])

  if (router.pathname.startsWith("/restaurant"))
    return (
      <>
        {pageProps.title && (
          <Head>
            <title>{pageProps?.title}</title>
            <meta property="og:title" content={pageProps?.title} key="title" />
          </Head>
        )}
        <ErrorBoundary>
          <Provider store={store}>
            <PersistGate
              loading={
                <Spin
                  className="absolute left-1/2 top-1/2 z-50 mx-auto text-primary"
                  indicator={
                    <LoadingOutlined
                      className="font-[36px] text-primary"
                      spin
                    />
                  }
                  size="large"
                  tip="送信中"
                />
              }
              persistor={persistor}
            >
              <RestaurantLayout>
                <Component {...pageProps} />
              </RestaurantLayout>
            </PersistGate>
          </Provider>
        </ErrorBoundary>
        {/* </React.StrictMode> */}
      </>
    )
  return <Component {...pageProps} />
}

export default MyApp
