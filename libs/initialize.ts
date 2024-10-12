import { NextRouter } from "next/router"
import {
  store,
  setIsLoading,
  setLocale,
  setStarted,
  setT,
  setFlash,
} from "store"

const liffId =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIFF_ID
    : process.env.NEXT_PUBLIC_LIFF_ID_DEV

export const Initialize = async (router: NextRouter) => {
  const { message } = store.getState()
  store.dispatch(setIsLoading(true))
  if (!message?.LIFF_INITED) {
    store.dispatch(
      setStarted(
        new Date().toLocaleString("ja-JP", {
          timeZone: "Asia/Tokyo",
        })
      )
    )
    // 言語
    if ("lang" in router.query) {
      store.dispatch(setLocale(router.query.lang))
    }
    await store.dispatch(setT(router.locale))
    Promise.all([import("@line/liff"), import("@line/liff-mock")]).then(
      (result) => {
        const liff = result[0].default
        const LiffMockPlugin = result[1].default
        // LIFF Initialize
        const mock = Boolean(process.env.NODE_ENV !== "production")
        if (mock) {
          liff.use(new LiffMockPlugin())
        }
        liff
          .init({
            liffId,
            mock,
          })
          .then(() => {
            if (!liff.isLoggedIn()) {
              liff.login({
                redirectUri:
                  router.pathname == "/restaurant/delete"
                    ? `${window.location.origin}/restaurant/delete`
                    : `${window.location.origin}/restaurant`,
              })
              liff.getProfile().then((profile) => {
                console.log(profile)
              })
            }
            store.dispatch(setFlash({ LIFF_INITED: true }))
          })
          .catch((err) => {
            console.log(err)
          })
      }
    )
  }
  store.dispatch(setIsLoading(false))
}
