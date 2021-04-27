import React, { FC, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export type HeaderProps = {
  applyFilter: (filterString: string) => void;
  filter: string;
};

export const Header: FC<HeaderProps> = ({ applyFilter, filter }) => {
  const [filterString, setFilterString] = useState<string>('');

  useEffect(() => {
    setFilterString(filter);
  }, [filter]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilter(filterString);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>
        <img src="/icon-120.png" width="30" height="30" alt="" /> Final Countdown
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Form inline onSubmit={handleSubmit}>
          <FormControl
            type="text"
            name="filterString"
            placeholder="Regex Filter"
            aria-label="Regex Filter"
            className="mr-sm-2"
            value={filterString}
            onChange={(e) => setFilterString(e.currentTarget.value)}
          />
          <Button variant="outline-success" type="submit">
            Filter
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
