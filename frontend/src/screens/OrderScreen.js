import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';
import Message from '../components/Message';
import Loader from '../components/Loader';
import axios from 'axios';

const OrderScreen = ({ match, history }) => {
    const orderId = match.params.id;
    const [sdkReady, setSdkReady] = useState(false);
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector(state => state.orderDetails);
    const { success: successPay, loading: loadingPay, error: errorPay } = useSelector(state => state.orderPay);
    const { success: successDeliver, loading: loadingDeliver, error: errorDeliver } = useSelector(state => state.orderDeliver);
    const { userInfo } = useSelector(state => state.userLogin);

    useEffect(() => {
        if (!userInfo) {
            history.push('/');
        }
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=INR`
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        }
        if (!order || order._id !== orderId || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [order, orderId, dispatch, successPay, successDeliver, history, userInfo]);

    const successPaymentHandler = () => {
        // console.log({ id: 'testid123', status: 'COMPLETED', update_time: Date.now(), email_address: order.user.email })
        dispatch(payOrder(orderId, { id: 'testid123', status: 'COMPLETED', update_time: Date.now(), payer: { email_address: order.user.email } }));
        dispatch({ type: ORDER_PAY_RESET });
        dispatch(getOrderDetails(orderId));
    }
    const deliverHandler = () => {
        dispatch(deliverOrder(orderId));
    }
    if (loading) {
        return <Loader />;
    }


    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    }
    order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0));

    return <React.Fragment>
        <h1>Order {order._id}</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {errorPay && <Message variant='danger'>{errorPay}</Message>}
        {errorDeliver && <Message variant='danger'>{errorDeliver}</Message>}
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroupItem>
                        <h2>Shipping</h2>
                        <p><strong>Name : </strong> {order.user.name}</p>
                        <p><strong>Email : </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                        <p>
                            <strong>Address : </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country} - {order.shippingAddress.postalCode}
                        </p>
                        {order.isDelivered ? <Message variant='success'>Delivered at {order.deliveredAt.substring(0, 10)}</Message> : <Message variant='danger'>Not delivered</Message>}
                    </ListGroupItem>
                    <ListGroupItem>
                        <h2>Payment Method</h2>
                        <p><strong>Method : </strong>
                            {order.paymentMethod}</p>
                        {order.isPaid ? <Message variant='success'>Paid at {order.paidAt.substring(0, 10)}</Message> : <Message variant='danger'>Not paid</Message>}
                    </ListGroupItem>
                    <ListGroupItem>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0
                            ? <Message>Your order is empty</Message>
                            : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroupItem key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} X Rs {item.price} = Rs {item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            )
                        }
                    </ListGroupItem>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h2>Order Summary</h2>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Items</Col>
                                <Col>Rs {order.itemsPrice}</Col>
                            </Row>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>Rs {order.shippingPrice}</Col>
                            </Row>
                            <Row>
                                <Col>Tax</Col>
                                <Col>Rs {order.taxPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Total</Col>
                                <Col>Rs {order.totalPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        {!order.isPaid && (
                            <ListGroupItem>
                                {loadingPay && <Loader />}
                                {!sdkReady ? <Loader /> : (
                                    <PayPalButton amount={order.totalPrice} onClick={successPaymentHandler} currency="INR" />
                                )}
                            </ListGroupItem>
                        )}
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroupItem>
                                <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                    Mark as delivered
                                </Button>
                            </ListGroupItem>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </React.Fragment>;
};

export default OrderScreen;
