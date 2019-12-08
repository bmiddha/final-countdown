import React, { FC, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
    applyFilter: (filterString: string) => void;
    filter: string;
}

const Header: FC<HeaderProps> = ({applyFilter, filter}) => {
    const [filterString, setFilterString] = useState<string>('');

    useEffect(() => {
        setFilterString(filter);
    }, [filter]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        applyFilter(filterString);
        // filterFinals(allFinals, filterString);
    };

    const updateFilterString = (e: React.FormEvent<HTMLInputElement>) => {
        setFilterString(e.currentTarget.value);
    };

    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <a className='navbar-brand' href='/'><img src='/icon-120.png' width='30' height='30' alt='' /> Final Countdown</a>

            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
                <span className='navbar-toggler-icon'></span>
            </button>

            <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                <ul className='navbar-nav mr-auto'>
                    <NavLink to='/' className='nav-item' activeClassName='active' exact>
                        <span className='nav-link'>Home</span>
                    </NavLink>
                    <NavLink to='/myfinals' className='nav-item' activeClassName='active'>
                        <span className='nav-link'>My Finals</span>
                    </NavLink>
                    <NavLink to='/config' className='nav-item' activeClassName='active'>
                        <span className='nav-link'>Config</span>
                    </NavLink>
                </ul>
                <form className='form-inline my-2 my-lg-0' onSubmit={handleSubmit}>
                    <input className='form-control mr-sm-2' name='filterString' type='search' placeholder='Regex Filter' aria-label='Regex Filter' value={filterString} onChange={updateFilterString} />
                    <button className='btn btn-outline-success my-2 my-sm-0' type='submit'>Filter</button>
                </form>
            </div>
        </nav >
    );
};

export default Header;
