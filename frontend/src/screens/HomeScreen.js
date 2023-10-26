import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = ({ match }) => {
    const keyword = match.params.keyword;
    const pageNo = match.params.pageNo || 1;

    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { loading, error, products, pages, page } = productList;
    useEffect(() => {
        dispatch(listProducts(keyword, pageNo));
    }, [dispatch, keyword, pageNo]);

    if (loading) {
        return <>
            <Meta />
            <Loader />
        </>;
    }

    if (error) {
        return <>
            <Meta />
            <Message variant='danger'>{error}</Message>
        </>;
    }

    return <React.Fragment>
        <Meta />
        {!keyword ? (
            <>
                <ProductCarousel />
                <h1>Latest Releases</h1>
            </>
        ) : (
            <>
                <Link to='/' className='btn btn-light'>
                    Go Back
                </Link>
                <h1>Search Results</h1>
            </>
        )}

        <Row>
            {products.map(product => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                </Col>
            ))}
        </Row>
        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
    </React.Fragment>;
};

export default HomeScreen;

