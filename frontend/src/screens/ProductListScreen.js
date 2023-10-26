import React, { useEffect } from 'react';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

const ProductListScreen = ({ history, match }) => {
    const pageNo = match.params.pageNo || 1;
    const dispatch = useDispatch();
    const { loading, error, products, page, pages } = useSelector(state => state.productList);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = useSelector(state => state.productDelete);
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = useSelector(state => state.productCreate);
    const { userInfo } = useSelector(state => state.userLogin);
    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET });
        if (!userInfo.isAdmin)
            history.push('/login');
        if (successCreate) {
            history.push(`/admin/products/${createdProduct._id}/edit`);
        } else {
            dispatch(listProducts("", pageNo));
        }
    }, [dispatch, history, userInfo, pageNo, successDelete, successCreate, createdProduct]);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure?"))
            dispatch(deleteProduct(id));
    };

    const createProductHandler = () => {
        dispatch(createProduct());
    };

    return (
        <React.Fragment>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message varaint='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message varaint='danger'>{errorCreate}</Message>}
            {loading ? <Loader /> : error ? <Message varaint='danger'>{errorDelete}</Message> :
                <>
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Genre</th>
                            <th>Publisher</th>
                            <th></th>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.genre}</td>
                                    <td>{product.publisher}</td>
                                    <td>
                                        <Link to={`/admin/products/${product._id}/edit`} className='btn-sm'><i className='fas fa-edit'></i></Link>
                                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}><i className='fas fa-trash'></i></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true} />
                </>}
        </React.Fragment>
    );
};

export default ProductListScreen;
