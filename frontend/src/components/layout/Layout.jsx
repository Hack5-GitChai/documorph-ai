// frontend/src/components/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer'; // We'll enhance Footer next

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-light text-brand-dark selection:bg-brand-accent selection:text-white">
      {/* selection: classes change text selection color - nice touch */}
      <Navbar />
      <main className="flex-grow w-full container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Added w-full to main to ensure it tries to take full width before container centers it */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;