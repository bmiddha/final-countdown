import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const Navigation: FC = () => (
    <nav>
        <Link to='/'>Home</Link>
        <Link to='/config'>Config</Link>
    </nav>
);

export default Navigation;