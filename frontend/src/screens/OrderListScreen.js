import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../actions/orderActions';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderListScreen = ({ history }) => {
    const dispatch = useDispatch();
    const { loading, error, orders } = useSelector(state => state.orderList);

    const { userInfo } = useSelector(state => state.userLogin);

    useEffect(() => {
        if (userInfo && userInfo.isAdmin)
            dispatch(listOrders());
        else
            history.push('/login');
    }, [dispatch, history, userInfo]);

    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <Message variant='danger'>{error}</Message>
    }

    return (
        <React.Fragment>
            <h1>Orders</h1>
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <th>ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                    <th></th>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user && order.user.name}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>Rs {order.totalPrice}</td>
                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : <i className='fas fa-times' style={{ color: 'red' }}></i>}</td>
                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <i className='fas fa-times' style={{ color: 'red' }}></i>}</td>
                            <td>
                                <Link to={`/orders/${order._id}`} className='btn-sm'>Details</Link>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        </React.Fragment>
    );
};

export default OrderListScreen;
