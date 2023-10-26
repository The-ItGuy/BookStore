import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import SearchBox from './SearchBox';

const Header = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.userLogin);

    const signOutHandler = () => {
        dispatch(logout());
    };

    return <header>
        <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect >
            <Container>

                <Navbar.Brand as={Link} to="/">The Bookmark</Navbar.Brand>

                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Route render={({ history }) => <SearchBox history={history} />} />
                    <Nav >
                        <Nav.Link as={Link} to="/cart"><i className='fas fa-shopping-cart' ></i> Cart</Nav.Link>
                        {userInfo
                            ? (<NavDropdown title={userInfo.name} id='username'>
                                <NavDropdown.Item as={Link} to='/profile'>Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={signOutHandler}>Sign Out</NavDropdown.Item>
                            </NavDropdown>)
                            : (<Nav.Link as={Link} to="/login" ><i className='fas fa-user' ></i> Sign in</Nav.Link>)
                        }
                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title='Admin' id='admin'>
                                <NavDropdown.Item as={Link} to='/admin/userlist'>Users</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to='/admin/productlist'>Products</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to='/admin/orderlist'>Orders</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>;
};

export default Header;

