// frontend/src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Import specific icons you are using in this component
import { FileSliders, Menu, X } from 'lucide-react'; // <<<<< ADD FileSliders HERE

const NavLink = ({ to, children }) => (
  // ... (rest of NavLink component as before)
  <Link
    to={to}
    className="text-slate-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  // ... (rest of MobileNavLink component as before)
  <Link
    to={to}
    onClick={onClick}
    className="block text-slate-100 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
  >
    {children}
  </Link>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-brand-dark shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center text-white">
              <FileSliders className="h-8 w-8 mr-2 text-brand-accent" /> {/* Now it's defined */}
              <span className="font-bold text-xl tracking-tight">DocuMorph AI</span>
            </Link>
          </div>

          {/* Desktop Navigation Links (Hidden on small screens) */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/tool">Tool</NavLink>
            <NavLink to="/features">Features</NavLink>
            <NavLink to="/templates">Templates</NavLink>
          </div>

          {/* Desktop User Actions (Hidden on small screens) - Placeholder */}
          <div className="hidden md:block">
            <button className="bg-brand-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Show/Hide based on state) */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/tool" onClick={() => setIsMobileMenuOpen(false)}>Tool</MobileNavLink>
            <MobileNavLink to="/features" onClick={() => setIsMobileMenuOpen(false)}>Features</MobileNavLink>
            <MobileNavLink to="/templates" onClick={() => setIsMobileMenuOpen(false)}>Templates</MobileNavLink>
            <div className="pt-2">
                 <button className="w-full bg-brand-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">
                    Sign Up
                </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;