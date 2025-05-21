// frontend/src/components/Layout.jsx
import React from 'react';

// Basic Navbar component (can be moved to its own file later)
const Navbar = () => {
  return (
    <nav style={{ background: '#333', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <h1>DocuMorph AI</h1>
    </nav>
  );
};

// Basic Footer component (can be moved to its own file later)
const Footer = () => {
  return (
    <footer style={{ background: '#333', color: 'white', padding: '1rem', textAlign: 'center', marginTop: 'auto' }}>
      <p>© {new Date().getFullYear()} DocuMorph AI. All rights reserved.</p>
    </footer>
  );
};

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '1rem 2rem' }}> {/* Added some padding */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;