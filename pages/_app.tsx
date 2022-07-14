import "styles/tailwind.scss";
import "styles/globals.scss";
import "styles/tailwind-utils.scss";

import React, { useEffect, useState } from "react";
import { store } from "store";
import { Provider } from "react-redux";
import RestaurantLayout from "components/RestaurantLayout";
import { getLiffProfile } from "utils/liff";
import { useRouter } from "next/router";
import {
  setStarted,
  setLocale,
  setLineUser,
  setFlash,
  setT,
  persistor,
} from "store";
import { PersistGate } from "redux-persist/integration/react";

const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { lineUser } = store.getState();
  const [message, setMessage] = useState();
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
                new Date().toLocaleString({
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
            liff.use(new LiffMockPlugin());
            liff
              .init({
                liffId,
                mock: true,
              })
              .then(() => {
                store.dispatch(setFlash({ name: "LIFF_INITED", value: true }));
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
  }, [router.pathname, message, []]);
  if (router.pathname.startsWith("/restaurant"))
    return (
      // <LiffProvider
      //   liffId={process.env.NEXT_PUBLIC_LIFF_ID}
      //   mock={{
      //     enable: process.env.NODE_ENV === "development" && true,
      //   }}
      // >
      //   <MyUserContextProvider>
      <Provider store={store}>
        <PersistGate loading={<div>loading...</div>} persistor={persistor}>
          <RestaurantLayout>
            <Component {...pageProps} />
          </RestaurantLayout>
        </PersistGate>
      </Provider>
      //   </MyUserContextProvider>
      // </LiffProvider>
    );
  return <Component {...pageProps} />;
}

export default MyApp;
