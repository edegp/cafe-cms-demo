"use client"

import { useEffect } from "react"
import { store, setWindowSize } from "store"

export const useWindowSize = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useEffect(() => {
    const updateSize = () =>
      store.dispatch(setWindowSize([window.innerWidth, window.innerHeight]))
    window.addEventListener("resize", updateSize)
    updateSize()

    return () => window.removeEventListener("resize", updateSize)
  }, [])
}
