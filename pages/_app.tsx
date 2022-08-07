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

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const liffId =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_LIFF_ID
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
                liff.login({
                  redirectUri:
                    router.pathname == "/restaurant/delete"
                      ? `${window.location.origin}/delete`
                      : `${window.location.origin}`,
                });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, router]);
  if (isLoading)
    return (
      <Spin tip="Loading..." className="position absolute mx-auto">
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </Spin>
    );
  if (router.pathname.startsWith("/restaurant"))
    return (
      <>
        <Provider store={store}>
          <PersistGate
            loading={
              <Spin
                className="absolute top-1/2 left1/2 z-50 mx-auto text-primary"
                indicator={
                  <LoadingOutlined className="font-[36px] text-primary" spin />
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
        {/* </React.StrictMode> */}
      </>
    );
  return <Component {...pageProps} />;
}

export default MyApp;
