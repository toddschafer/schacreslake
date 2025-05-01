import React from "react";
import { Helmet } from "react-helmet";

import { domainName, seoDescription, seoTitle } from "../../cms/data.json";

import "../styles/index.scss";

const Layout = ({ children }) => {
  return (
    <>
      <Helmet>
        <html lang="en" className="has-navbar-fixed-top" />

        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />

        <meta name="author" content="Schacres Lake" />
        <meta name="copyright" content="© Schacres Lake" />

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        <link rel="canonical" href={`https://${domainName}`} />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#D3D3D3" />
        <meta name="theme-color" content="#D3D3D3" />
      </Helmet>

      {children}
    </>
  );
};

export default Layout;
