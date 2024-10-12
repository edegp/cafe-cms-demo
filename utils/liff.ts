import { Liff } from "@line/liff"

export const getLiffProfile = async (liff: Liff) => {
  // LIFF Profile
  const profile = await liff.getProfile()
  const token = await liff.getAccessToken()
  const idToken = await liff.getIDToken()

  const lineUser = {
    expire: new Date().getTime() + 1000 * 60 * 30,
    userId: profile.userId,
    name: profile.displayName,
    image: profile.pictureUrl,
    token: token,
    idToken: idToken,
  }

  return lineUser
}
