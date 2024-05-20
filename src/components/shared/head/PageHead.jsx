import React from "react";
import { Helmet } from "react-helmet";

const PageHead = ({ title, description, imageUrl, url }) => {
    return (
            <Helmet>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:url" content={url} />
            </Helmet>
    );
};

export default PageHead;
