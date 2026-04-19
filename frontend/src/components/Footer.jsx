import React from 'react';

const Footer = () => {
    return (
        <footer style={{ marginTop: '4rem', padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <p>&copy; {new Date().getFullYear()} Evently - College Event Management. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
