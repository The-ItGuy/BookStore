import React from 'react';
import { Col, Image, ListGroup, ListGroupItem, Row, Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import Message from '../components/Message';

const CartScreen = ({ match, location, history }) => {
    // const productId = match.params.id;
    // const queryParams = new URLSearchParams(location.search);
    // const qty = queryParams.get('qty') ? Number(queryParams.get('qty')) : 1;

    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart);
    // useEffect(() => {
    //     if (productId) {
    //         dispatch(addToCart(productId, qty));
    //     }
    // }, [dispatch, productId, qty]);

    const changeQtyHandler = (productId, qty) => {
        // console.log('change');
        dispatch(addToCart(productId, qty));
    };
    const removeFromCartHandler = (productId) => {
        dispatch(removeFromCart(productId));
    };
    const checkoutHandler = () => {
        history.push('/login?redirect=shipping');
    };

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0
                    ? (<Message>Your cart is empty. <Link to='/'>Go Back</Link></Message>)
                    : (
                        <ListGroup variant='flush'>
                            {cartItems.map(item => (
                                <ListGroupItem key={item.product}>
                                    <Row>
                                        <Col md={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/products/${item.product}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={2}>${item.price}</Col>
                                        <Col md={3}>
                                            <Form.Select
                                                value={item.qty}
                                                onChange={(e) => changeQtyHandler(item.product, Number(e.target.value))}
                                            >
                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col md={2}>
                                            <Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}>
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    )
                }
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                            Rs {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroupItem>
                        <ListGroupItem>
                            <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                                Procedd to checkout
                            </Button>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
};

export default CartScreen;
