import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';

const RegisterScreen = ({ location, history }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const { loading, error, userInfo } = useSelector(state => state.userRegister);

    const queryParams = new URLSearchParams(location.search);
    const redirect = queryParams.get('redirect') ? queryParams.get('redirect') : '/';

    useEffect(() => {
        if (userInfo) {
            history.push(redirect);
        }
    }, [history, userInfo, redirect]);

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
            dispatch(register(name, email, password));
            setMessage('');
        } else {
            setMessage('Passwords doesn\'t match');
        }
    };

    if (loading) {
        return <Loader />;
    }

    return <FormContainer>
        <h1>Register</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
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
            <Button type='submit' variant='primary' className='my-3'>Register</Button>
        </Form>
        <Row className='py-3'>
            <Col>
                Already registered ? {' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
            </Col>
        </Row>
    </FormContainer>;
};

export default RegisterScreen;
