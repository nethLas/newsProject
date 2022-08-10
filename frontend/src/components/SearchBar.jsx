import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSearchStories } from '../features/stories/storiesSlice';

function SearchBar() {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const onChange = (e) => setSearch((prev) => e.target.value);
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getSearchStories(search));
  };
  return (
    <Form>
      <InputGroup className="mb-1">
        <Form.Control
          placeholder="search"
          type="text"
          value={search}
          onChange={onChange}
          minLength={5}
        />
        <Button
          className="btn btn-primary"
          onClick={handleSearch}
          type="submit"
        >
          GO
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchBar;
