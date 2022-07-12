// import { useEffect, useState, createContext, useContext } from "react";
// import { useLiff } from "use-line-liff";

// export const UserContext = createContext(undefined);

// export const MyUserContextProvider = (props) => {
//   const { liff } = useLiff();
//   const [started, setStarted] = useState(null);
//   const [locales, setLocales] = useState(["ja"]);
//   const [locale, setLocale] = useState("ja");
//   const [sessionId, setSessionId] = useState(null);
//   const [lineUser, setLineUser] = useState(null);
//   const [restaurant, setRestaurant] = useState(null);
//   const [axiosError, setAxiosError] = useState(null);

//   const profilePromise = () => liff.getProfile();
//   const tokenPromise = () => liff.getAccessToken();
//   const idTokenPromise = () => liff.getIDToken();

//   useEffect(() => {
//     if (!liff) return;
//     setStarted(new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
//     if (!liff.isLoggedIn()) {
//       liff.login();
//     }
//     Promise.allSettled([
//       profilePromise(),
//       tokenPromise(),
//       idTokenPromise(),
//     ]).then((result) => {
//       if (
//         result[0].status === "fulfilled" &&
//         result[1].status === "fulfilled" &&
//         result[2].status === "fulfilled"
//       )
//         setLineUser({
//           expire: new Date().getTime() + 1000 * 60 * 30,
//           userId: result[0].value.userId,
//           name: result[0].value.displayName,
//           image: result[0].value.pictureUrl,
//           token: result[1].value,
//           idToken: result[2].value,
//         });
//     });
//   }, [liff]);

//   const value = {
//     liff,
//     started,
//     setStarted,
//     locales,
//     setLocales,
//     locale,
//     setLocale,
//     sessionId,
//     setSessionId,
//     lineUser,
//     setLineUser,
//     restaurant,
//     setRestaurant,
//     axiosError,
//     setAxiosError,
//   };
//   return <UserContext.Provider value={value} {...props} />;
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error(`useUser must be used within a MyUserContextProvider.`);
//   }
//   return context;
// };
