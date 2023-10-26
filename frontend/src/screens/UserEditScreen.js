import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '../actions/userActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const dispatch = useDispatch();
    const { loading, error, user } = useSelector(state => state.userDetails);
    const { loading: loadingUpdate, error: errorUpdate, success } = useSelector(state => state.userUpdate);

    useEffect(() => {
        if (success) {
            dispatch({ type: USER_UPDATE_RESET });
            history.push('/admin/userlist');
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId));
            } else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
            }
        }
    }, [user, userId, dispatch, success, history]);

    const nameChangeHandler = (event) => {
        setName(event.target.value);
    };
    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    };
    const isAdminChangeHandler = (event) => {
        setIsAdmin(event.target.checked);
    };
    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser({ _id: userId, name, email, isAdmin }));

    };

    if (loading) {
        return <Loader />;
    }

    return (
        <React.Fragment>
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {error && <Message variant='danger'>{error}</Message>}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loadingUpdate ? <Loader /> :
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type='text' placeholder='Enter name' value={name} onChange={nameChangeHandler}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type='email' placeholder='Enter email' value={email} onChange={emailChangeHandler}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='isadmin'>
                            <Form.Check type='checkbox' checked={isAdmin} label='Is Admin' onChange={isAdminChangeHandler}></Form.Check>
                        </Form.Group>
                        <Button type='submit' variant='primary' className='my-3'>Update</Button>
                    </Form>}
            </FormContainer>
        </React.Fragment>
    );
};

export default UserEditScreen;
