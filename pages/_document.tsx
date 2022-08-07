import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        {process.env.FONT_SCTIPT && (
          <Script
            id="font-script"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `${process.env.FONT_SCTIPT}`,
            }}
          />
        )}
      </body>
    </Html>
  );
}
