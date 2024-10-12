import { store } from "store"

const mediaQueryMin =
  (min: number, style?: TemplateStringsArray | string) => () =>
    `@media screen and (min-width: ${Math.trunc(min)}px)` +
    ((style && `{ ${style} }`) || "")

export const mediaQueryPc = mediaQueryMin(768)()

export const isPCbrowser = () => {
  const { clientSize } = store.getState()
  return clientSize[0] > 768
}
