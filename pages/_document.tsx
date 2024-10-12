import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja" className="touch-manipulation">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-16x16.png"
          sizes="16x16"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff4400" />
        <meta name="theme-color" content="#fff" />
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content="/" />
        <meta property="og:image" content="/og-image.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
        {process.env.NEXT_PUBLIC_FONT_SCRIPT && (
          <script
            type="module"
            id="font-script"
            // strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `${process.env.NEXT_PUBLIC_FONT_SCRIPT}`,
            }}
          />
        )}
      </body>
    </Html>
  );
}
