import { Helmet } from "react-helmet";
import { HelmetProvider } from "react-helmet-async";

const PageHead = ({ title, description, imageUrl, url}) => {

    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:url" content={url} />
            </Helmet>
        </HelmetProvider>
    );
};

export default PageHead;
