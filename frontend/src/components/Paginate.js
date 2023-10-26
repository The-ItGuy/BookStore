import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    return pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map(x => (
                <Pagination.Item key={x + 1} active={x + 1 === page} >
                    <Link to={!isAdmin ? keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}` : `/admin/productlist/page/${x + 1}`} style={{ color: 'aqua' }}>
                        {x + 1}
                    </Link>
                </Pagination.Item>
            ))}
        </Pagination>
    )
};

export default Paginate;
