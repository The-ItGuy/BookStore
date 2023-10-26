import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, updateProduct } from '../actions/productActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import axios from 'axios';

const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id;

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [publisher, setPublisher] = useState('');
    const [genre, setGenre] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();
    const { loading, error, product } = useSelector(state => state.productDetails);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector(state => state.productUpdate);

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            history.push('/admin/productlist');
        } else {
            if (!product.name || product._id !== productId) {
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setPublisher(product.publisher)
                setGenre(product.genre)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
    }, [product, productId, dispatch, history, successUpdate]);

    const nameChangeHandler = (event) => {
        setName(event.target.value);
    };
    const priceChangeHandler = (event) => {
        setPrice(event.target.value);
    };
    const imageChangeHandler = (event) => {
        setImage(event.target.value);
    };
    const publisherChangeHandler = (event) => {
        setPublisher(event.target.value);
    };
    const genreChangeHandler = (event) => {
        setGenre(event.target.value);
    };
    const countInStockChangeHandler = (event) => {
        setCountInStock(event.target.value);
    };
    const descriptionChangeHandler = (event) => {
        setDescription(event.target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateProduct({ _id: productId, name, price, image, publisher, genre, countInStock, description }));
    };

    const uploadFileHandler = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data.replace('\\', '/'));
            setUploading(false);
        } catch (err) {
            console.log(err);
            setUploading(false);
        }
    };
    if (loading) {
        return <Loader />;
    }

    return (
        <React.Fragment>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {error && <Message variant='danger'>{error}</Message>}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loadingUpdate ? <Loader /> :
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='text' placeholder='Enter name' value={name} onChange={nameChangeHandler}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='price'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type='number' placeholder='Enter price' value={price} onChange={priceChangeHandler}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='image'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type='text' placeholder='Enter image' value={image} onChange={imageChangeHandler}></Form.Control>
                            <Form.Control type='file' label='Choose File' onChange={uploadFileHandler}></Form.Control>

                            {uploading && <Loader />}
                        </Form.Group>
                        <Form.Group controlId='publisher'>
                            <Form.Label>Publisher</Form.Label>
                            <Form.Control type='text' placeholder='Enter publisher' value={publisher} onChange={publisherChangeHandler}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='genre'>
                            <Form.Label>Genre</Form.Label>
                            <Form.Control type='text' placeholder='Enter genre' value={genre} onChange={genreChangeHandler}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='countInStock'>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control type='number' placeholder='Enter countInStock' value={countInStock} onChange={countInStockChangeHandler}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='description'>
                            <Form.Label>description</Form.Label>
                            <Form.Control type='text' placeholder='Enter description' value={description} onChange={descriptionChangeHandler}></Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='primary' className='my-3'>Update</Button>
                    </Form>}
            </FormContainer>
        </React.Fragment>
    );
};

export default ProductEditScreen;
