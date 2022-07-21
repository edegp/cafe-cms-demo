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

const liffId = process.env.NEXT_PUBLIC_LIFF_ID_3;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // const store = useStore();
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
            // liff.use(new LiffMockPlugin());
            liff
              .init({
                liffId,
                // mock: true,
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
          <script
            dangerouslySetInnerHTML={{
              __html: `  (function(d) {
    var config = {
      kitId: 'hcn3pwq',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);`,
            }}
          />
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
