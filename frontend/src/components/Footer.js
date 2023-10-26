import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return <footer>
        <Container>
            <Row>
                <Col className='text-center py-2'>
                    Copyright &copy; The Bookmark
                </Col>
            </Row>
        </Container>
    </footer>;
};

export default Footer;
