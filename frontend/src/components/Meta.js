import { Helmet } from 'react-helmet';
import React from 'react';

const Meta = ({ title, description, keywords }) => {
    return <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
    </Helmet>;
};

Meta.defaultProps = {
    title: 'Welcome to Proshop',
    description: 'Your one stop for all books you need',
    keywords: 'books, buy books, books at best price'
}

export default Meta;
