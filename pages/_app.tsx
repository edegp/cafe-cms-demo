import "styles/tailwind.scss";
import "styles/globals.scss";
import "styles/tailwind-utils.scss";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import RestaurantLayout from "components/RestaurantLayout";
import { getLiffProfile } from "utils/liff";
import { useRouter } from "next/router";
import {
  store,
  setStarted,
  setLocale,
  setLineUser,
  setFlash,
  setT,
  persistor,
} from "store";
import { PersistGate } from "redux-persist/integration/react";
import Head from "next/head";

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

  const { lineUser, t } = store.getState();
  const [message, setMessage] = useState({ LIFF_INITED: false });
  useEffect(() => {
    if (router.pathname.startsWith("/restaurant")) {
      Promise.all([import("@line/liff"), import("@line/liff-mock")]).then(
        (result) => {
          const liff = result[0].default;
          const LiffMockPlugin = result[1].default;
          const inited = message?.["LIFF_INITED"];
          //  　LIFFプロファイル取得・設定
          const _settingLiffProfile = async (liff) => {
            const _lineUser = await getLiffProfile(liff);
            store.dispatch(setLineUser(_lineUser));
          };
          // LIFF Login & Profile
          if (inited) {
            if (!lineUser || !("expire" in lineUser)) {
              // Get LIFF Profile & Token
              _settingLiffProfile(liff);
              // console.log(context.store.lineUser);
            } else {
              const now = new Date();
              const expire = parseInt(lineUser.expire, 10);
              if (expire < now.getTime()) {
                // Get LIFF Profile & Token
                _settingLiffProfile(liff);
              }
            }
          } else {
            // 起動時間
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
            store.dispatch(setT(router.locale));
            // LIFF Initialize
            const MOCK = Boolean(process.env.MOCK === "true");
            let mock;
            if (MOCK) {
              mock = true;
              liff.use(new LiffMockPlugin());
            }
            liff
              .init({
                liffId,
                mock,
              })
              .then(() => {
                store.dispatch(setFlash({ LIFF_INITED: true }));
                setMessage({ LIFF_INITED: true });
                const loggedIn = liff.isLoggedIn();
                if (!loggedIn) {
                  liff.login();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      );
    }
  }, [router.pathname, message, router.query, router.locale, lineUser]);
  if (router.pathname.startsWith("/restaurant"))
    return (
      <>
        {/* <React.StrictMode> */}
        <Head>
          {process.env.FONT_SCTIPT && (
            <script
              dangerouslySetInnerHTML={{
                __html: `${process.env.FONT_SCTIPT}`,
              }}
            />
          )}
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
