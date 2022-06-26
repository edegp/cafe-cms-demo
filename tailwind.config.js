// tailwind.config.js
// function withOpacity(variableName) {
//   return ({ opacityValue }) => {
//     if (opacityValue !== undefined) {
//       return `rgba(var(${variableName}), ${opacityValue})`;
//     }
//     return `rgb(var(${variableName}))`;
//   };
// }

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {
    fontSize: {
      xs: "calc(0.2vw + 10px)",
      sm: "calc(0.35vw + 12px)",
      md: "calc(0.75vw + 13px)",
      lg: "calc(1.2vw + 15px)",
      xl: "calc(1.5vw + 15px)",
      "2xl": "calc(1.6vw + 16px)",
      "3xl": "calc(1.7vw + 18px)",
      "4xl": "calc(1.9vw + 20px)",
      "5xl": "calc(2.5vw + 25px)",
    },
    screens: {
      sxsp: "360px",
      sp: "480px",
      tablet: "640px",
      laptop: "1024px",
      desktop: "1280px",
    },
    extend: {
      dropShadow: {
        blow: [
          "0px 2px 4px rgba(0,0,0,0.2)",
          "0px 4px 5px rgba(0,0,0,0.14)",
          "0px 1px 10px rgba(0,0,0,0.12)",
        ],
      },
      colors: {
        primary: "#04ac4d",
        secondary: "#ead808",
        // color: withOpacity("--color-primary"),
      },
      extend: {},
      spacing: {
        // "h-w": "calc(4.16666667vw - 30px)",
        // "h-logo": "calc(4.16666667vw - 40px)",
        28: "7rem",
      },
      // fontFamily: {
      // My: ["My"],
      // Gilroy: ["Gilroy"],
      // "Noto-Sans": ["Noto Sans JP"],
      // },
      gridTemplateRows: {
        8: "repeat(8, minmax(0, 1fr))",
      },
    },
  },
  plugins: [
    require("tailwindcss-fluid-spacing"),
    require("tailwindcss-textshadow"),
  ],
};
