import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = ({ history }) => {
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);

    const dispatch = useDispatch();

    const addressChangeHandler = (event) => {
        setAddress(event.target.value);
    };
    const cityChangeHandler = (event) => {
        setCity(event.target.value);
    };
    const postalCodeChangeHandler = (event) => {
        setPostalCode(event.target.value);
    };
    const countryChangeHandler = (event) => {
        setCountry(event.target.value);
    };
    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        history.push('/payment');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address' className='my-1'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter address'
                        value={address}
                        required
                        onChange={addressChangeHandler}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='city' className='my-1'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter city'
                        value={city}
                        required
                        onChange={cityChangeHandler}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='postalCode' className='my-1'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter postal code'
                        value={postalCode}
                        required
                        onChange={postalCodeChangeHandler}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='country' className='my-1'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter country'
                        value={country}
                        required
                        onChange={countryChangeHandler}
                    >
                    </Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary' className='my-3'>Continue</Button>
            </Form>
        </FormContainer>
    );
};

export default ShippingScreen;
