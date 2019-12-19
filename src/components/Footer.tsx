import { h, FunctionalComponent } from 'preact';

const Header: FunctionalComponent = () => {
    return (
        <footer className='container py-4'>
            <div className='col'>
                <p className='lead text-center'>
                    <a href='https://github.com/bmiddha/final-countdown'><i className='fas fa-code' /> with <i className='fas fa-heart' /> by Bharat Middha.<br />
                        <i className='fab fa-github' /> github.com/bmiddha/final-countdown</a>
                </p>
            </div>
        </footer>
    );
};

export default Header;
