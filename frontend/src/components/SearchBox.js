import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const SearchBox = ({ history }) => {
    const [keyword, setKeyword] = useState('');
    const keywordChangeHandler = (event) => {
        setKeyword(event.target.value);
    }
    const submitHandler = (event) => {
        event.preventDefault();
        if (keyword.trim()) {
            history.push(`/search/${keyword}`);
        } else {
            history.push('/');
        }
    }
    return (
        <Form onSubmit={submitHandler} inline className="d-flex">
            <Form.Control type='text' name='q' onChange={keywordChangeHandler} placeholder='Search books' className='mr-sm-2 ml-sm-5' value={keyword}></Form.Control>
            <Button type='submit' varaint='outline-light' className='p-2'>Search</Button>
        </Form>
    );
};

export default SearchBox;
