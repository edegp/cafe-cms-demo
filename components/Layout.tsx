import * as React from "react";
import Head from "next/head";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const TemplateWrapper = ({ title, description, children }) => {
  return (
    <>
      <Head>
        {/* <html lang='ja' /> */}
        <title>{title}</title>
        <meta name='description' content={description} />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/favicon/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          href='/favicon/favicon-32x32.png'
          sizes='32x32'
        />
        <link
          rel='icon'
          type='image/png'
          href='/favicon/favicon-16x16.png'
          sizes='16x16'
        />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#ff4400' />
        <meta name='theme-color' content='#fff' />
        <meta property='og:type' content='business.business' />
        <meta property='og:title' content={title} />
        <meta property='og:url' content='/' />
        <meta property='og:image' content='/og-image.jpg' />
        <meta name='viewport' content='initial-scale=1, maximum-scale=1' />
      </Head>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default TemplateWrapper;
