import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfileScreen = ({ history }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const { loading, error, user } = useSelector(state => state.userDetails);
    const { success } = useSelector(state => state.userUpdateProfile);
    const { userInfo } = useSelector(state => state.userLogin);
    const { loading: loadingOrders, error: errorOrders, orders } = useSelector(state => state.orderListMy);

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        } else {
            if (!user || !user.name || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET });
                dispatch(getUserDetails('profile'));
                dispatch(listMyOrders());
            } else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [dispatch, history, userInfo, user, success]);

    const nameChangeHandler = (event) => {
        setName(event.target.value);
    };
    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    };
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    };
    const confirmPasswordChangeHandler = (event) => {
        setConfirmPassword(event.target.value);
    };
    const submitHandler = (event) => {
        event.preventDefault();
        if (password === confirmPassword) {
            dispatch(updateUserProfile({ id: user._id, name, email, password }));
            setMessage('');
        } else {
            setMessage('Passwords doesn\'t match');
        }
    };

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {success && <Message variant='success'>Profile Updated</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text' placeholder='Enter name' value={name} onChange={nameChangeHandler}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder='Enter email' value={email} onChange={emailChangeHandler}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' value={password} placeholder='Enter password' onChange={passwordChangeHandler}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='confirmPassword'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' value={confirmPassword} placeholder='Re-enter password' onChange={confirmPasswordChangeHandler}></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary' className='my-3'>Update Profile</Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2>My orders</h2>
                {loadingOrders
                    ? <Loader />
                    : errorOrders
                        ? <Message variant='danger'>{error}</Message>
                        : <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : <i className='fas fa-times' style={{ color: 'red' }}></i>}</td>
                                        <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <i className='fas fa-times' style={{ color: 'red' }}></i>}</td>
                                        <td><Button className='btn-sm' variant='light'><Link to={`/orders/${order._id}`}>Details</Link></Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                }
            </Col>
        </Row>
    );
};

export default ProfileScreen;
