import React from "react";
import { Helmet } from "react-helmet";
import { HelmetProvider } from "react-helmet-async";

const PageHead = ({ title, description, imageUrl, url, origin }) => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title + (origin === "forum" ? " - shariverse" : " - learniverse")}</title>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:url" content={url} />
            </Helmet>
        </HelmetProvider>
    );
};

export default PageHead;
