import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getUserList, deleteUser } from '../actions/userActions';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';

const UserListScreen = ({ history }) => {
    const dispatch = useDispatch();
    const { loading, error, users } = useSelector(state => state.userList);

    const { userInfo } = useSelector(state => state.userLogin);
    const { loading: loadingDelete, success: successDelete, error: errorDelete } = useSelector(state => state.userDelete);

    useEffect(() => {
        if (userInfo && userInfo.isAdmin)
            dispatch(getUserList());
        else
            history.push('/login');
    }, [dispatch, history, userInfo, successDelete]);

    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <Message variant='danger'>{error}</Message>
    }

    const deleteHandler = (userId) => {
        if (window.confirm('Are you sure')) {
            dispatch(deleteUser(userId));
        }
    };

    return (
        <React.Fragment>
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th></th>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                            <td>{user.isAdmin ? (<i className='fas fa-check' style={{ color: 'green' }}></i>) : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}</td>
                            <td>
                                <Link to={`/admin/users/${user._id}/edit`} className='btn-sm'><i className='fas fa-edit'></i></Link>
                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}><i className='fas fa-trash'></i></Button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        </React.Fragment>
    );
};

export default UserListScreen;
