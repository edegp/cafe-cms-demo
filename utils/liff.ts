export const getLiffProfile = async (liff) => {
  // LIFF Profile
  const profilePromise = liff.getProfile();
  const tokenPromise = liff.getAccessToken();
  const idTokenPromise = liff.getIDToken();
  const profile = await profilePromise;
  const token = await tokenPromise;
  const idToken = await idTokenPromise;

  const lineUser = {
    expire: new Date().getTime() + 1000 * 60 * 30,
    userId: profile.userId,
    name: profile.displayName,
    image: profile.pictureUrl,
    token: token,
    idToken: idToken,
  };

  return lineUser;
};
