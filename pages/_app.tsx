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
  setFlash,
  setT,
  persistor,
  setIsLoading,
} from "store";
import { PersistGate } from "redux-persist/integration/react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const liffId =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIFF_ID
    : process.env.NEXT_PUBLIC_LIFF_ID_DEV;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
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
                      ? `${window.location.origin}/restaurant/delete`
                      : `${window.location.origin}/restaurant`,
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
  }, [message]);

  useEffect(() => {
    router.events.on("routeChangeStart", () =>
      store.dispatch(setIsLoading(true))
    );
    router.events.on("routeChangeComplete", () =>
      store.dispatch(setIsLoading(false))
    );
    router.events.on("routeChangeError", () =>
      store.dispatch(setIsLoading(false))
    );
    return () => {
      router.events.off("routeChangeStart", () =>
        store.dispatch(setIsLoading(true))
      );
      router.events.off("routeChangeComplete", () =>
        store.dispatch(setIsLoading(false))
      );
      router.events.off("routeChangeError", () =>
        store.dispatch(setIsLoading(false))
      );
    };
  }, [router]);

  if (router.pathname.startsWith("/restaurant"))
    return (
      <>
        <Provider store={store}>
          <PersistGate
            loading={
              <Spin
                className='absolute left-1/2 top-1/2 z-50 mx-auto text-primary'
                indicator={
                  <LoadingOutlined className='font-[36px] text-primary' spin />
                }
                size='large'
                tip='送信中'
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
