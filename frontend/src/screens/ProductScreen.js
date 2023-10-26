import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, createProductReview } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import { addToCart } from '../actions/cartActions';

const ProductScreen = ({ history, match }) => {
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const dispatch = useDispatch();
    const { loading, error, product } = useSelector(state => state.productDetails);
    const { loading: loadingReview, error: errorReview, success: successReview } = useSelector(state => state.productReviewCreate);
    const { userInfo } = useSelector(state => state.userLogin);

    useEffect(() => {
        if (successReview) {
            alert('Thank you for your review !!');
            setRating(0);
            setComment('');
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }
        dispatch(listProductDetails(match.params.id));
    }, [dispatch, match, successReview]);

    const qtyChangeHandler = (event) => {
        setQty(event.target.value);
    }
    const ratingChangeHandler = (event) => {
        setRating(event.target.value);
    }
    const commentChangeHandler = (event) => {
        setComment(event.target.value);
    }

    const addToCartHandler = () => {
        // Redirecting to /cart/:id?qty=<>
        // history.push(`/cart/${match.params.id}?qty=${qty}`);
        dispatch(addToCart(product._id, qty));
        history.push(`/cart`);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        console.log({ rating, comment });
        dispatch(createProductReview(match.params.id, { rating, comment }));
    }

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <Message variant='danger'>{error}</Message>;
    }

    return <>
        <Meta title={product.name} />
        <Link className='btn btn-light my-3' to='/'>Go Back</Link>
        <Row>
            <Col md={4}>
                <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={5}>
                <ListGroup variant='flush'>
                    <ListGroupItem>
                        <h3>{product.name}</h3>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    </ListGroupItem>
                    <ListGroupItem>
                        Price : Rs {product.price}
                    </ListGroupItem>
                    <ListGroupItem>
                        {product.description}
                    </ListGroupItem>
                </ListGroup>
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <Row>
                                <Col>Price : </Col>
                                <Col><strong>Rs {product.price}</strong></Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Status : </Col>
                                <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                            </Row>
                        </ListGroupItem>
                        {product.countInStock > 0 && (
                            <ListGroupItem>
                                <Row>
                                    <Col>Qty : </Col>
                                    <Col>
                                        <Form.Select value={qty} onChange={qtyChangeHandler}>
                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        )}
                        <ListGroupItem>
                            <Button className='btn-block' style={{ width: '100%' }} type='button' disabled={product.countInStock === 0} onClick={addToCartHandler}>
                                Add to Cart
                            </Button>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <h2>Reviews</h2>
                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant='flush'>
                    {product.reviews.map(review => (
                        <ListGroupItem key={review._id}>
                            <strong>{review.name}</strong>
                            <Rating value={review.rating} />
                            <p>{review.createdAt.substring(0, 10)}</p>
                            <p>{review.comment}</p>
                        </ListGroupItem>
                    ))}
                    <ListGroupItem>
                        <h2>Write a Customer Review</h2>
                        {loadingReview && <Loader />}
                        {errorReview && <Message variant='danger'>{errorReview}</Message>}
                        {userInfo ? (
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='rating'>
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Select value={rating} onChange={ratingChangeHandler}>
                                        <option key='1' value={1}>1 - Poor</option>
                                        <option key='2' value={2}>2 - Fair</option>
                                        <option key='3' value={3}>3 - Good</option>
                                        <option key='4' value={4}>4 - Very good</option>
                                        <option key='5' value={5}>5 - Excellent</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group controlId='comment'>
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control as='textarea' rows={3} onChange={commentChangeHandler} value={comment}></Form.Control>
                                </Form.Group>
                                <Button type='submit' varaint='primary'>Submit Review</Button>
                            </Form>
                        ) : <Message>Please <Link to='/login'>Login</Link></Message>}
                    </ListGroupItem>
                </ListGroup>
            </Col>
        </Row>
    </>;
};

export default ProductScreen;
