import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCode, faHeart } from '@fortawesome/free-solid-svg-icons';

const Header: FC = () => {
    return (
        <footer className='container py-4'>
            <div className='col'>
                <p className='lead text-center'>
                    <a href='https://github.com/bmiddha/final-countdown'><FontAwesomeIcon icon={faCode} /> with <FontAwesomeIcon icon={faHeart} /> by Bharat Middha.<br />
                        <FontAwesomeIcon icon={faGithub} /> github.com/bmiddha/final-countdown</a>
                </p>
            </div>
        </footer>
    );
};

export default Header;
