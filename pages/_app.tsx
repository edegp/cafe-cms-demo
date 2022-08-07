import "styles/tailwind.scss";
import "styles/globals.scss";
import "styles/tailwind-utils.scss";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Provider } from "react-redux";
import RestaurantLayout from "components/RestaurantLayout";
import { useRouter } from "next/router";
import {
  store,
  setStarted,
  setLocale,
  setLineUser,
  setFlash,
  setT,
  persistor,
  setIsLoading,
} from "store";
import { PersistGate } from "redux-persist/integration/react";
import Head from "next/head";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { initializeConnect } from "react-redux/es/components/connect";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const liffId =
    process.env.NODE_ENV === "production"
      ? router.pathname === "/restaurant/delete"
        ? process.env.NEXT_PUBLIC_LIFF_ID_DELETE
        : process.env.NEXT_PUBLIC_LIFF_ID
      : router.pathname === "/restaurant/delete"
      ? process.env.NEXT_PUBLIC_LIFF_ID_DELETE_DEV
      : process.env.NEXT_PUBLIC_LIFF_ID_DEV;
  const { message, isLoading } = store.getState();
  const Initialize = async () => {
    store.dispatch(setIsLoading(true));
    if (!message?.LIFF_INITED) {
      store.dispatch(
        setStarted(
          new Date().toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
          })
        )
      );
      // 言語
      if ("lang" in router.query) {
        store.dispatch(setLocale(router.query.lang));
      }
      await store.dispatch(setT(router.locale));
      Promise.all([import("@line/liff"), import("@line/liff-mock")]).then(
        (result) => {
          const liff = result[0].default;
          const LiffMockPlugin = result[1].default;
          // LIFF Initialize
          const mock = Boolean(process.env.NODE_ENV !== "production");
          if (mock) {
            liff.use(new LiffMockPlugin());
          }
          liff
            .init({
              liffId,
              mock,
            })
            .then(() => {
              const loggedIn = liff.isLoggedIn();
              if (!loggedIn) {
                liff.login();
              }
              store.dispatch(setFlash({ LIFF_INITED: true }));
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    }
    store.dispatch(setIsLoading(false));
  };
  useEffect(() => {
    if (router.pathname.startsWith("/restaurant")) Initialize();
  }, [message]);
  if (isLoading)
    <Spin tip="Loading...">
      <LoadingOutlined style={{ fontSize: 24 }} spin />
    </Spin>;
  if (router.pathname.startsWith("/restaurant"))
    return (
      <>
        {/* <React.StrictMode> */}
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon/favicon-32x32.png"
            sizes="32x32"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon/favicon-16x16.png"
            sizes="16x16"
          />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff4400" />
          <meta name="theme-color" content="#fff" />
          <meta property="og:type" content="business.business" />
          <html lang="ja" />
          <meta property="og:url" content="/" />
          <meta property="og:image" content="/og-image.jpg" />
        </Head>
        <Provider store={store}>
          <PersistGate loading={<div>loading...</div>} persistor={persistor}>
            <RestaurantLayout>
              <Component {...pageProps} />
            </RestaurantLayout>
          </PersistGate>
        </Provider>
        {/* </React.StrictMode> */}
      </>
    );
  return <Component {...pageProps} />;
}

export default MyApp;
