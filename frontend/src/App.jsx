// frontend/src/App.jsx
import React, { useState, useEffect, Suspense } from 'react'; // Added Suspense, useState, useEffect
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import GlobalLoader from './components/common/GlobalLoader'; // Import GlobalLoader
import HomePage from './pages/Home';
import UploadAndFormatPage from './pages/UploadAndFormatPage';

// Example: Simulating a global loading state for initial app load
const AppContent = () => {
  const [appLoading, setAppLoading] = useState(true); // Simulating initial app load

  useEffect(() => {
    // Simulate loading time (e.g., fetching initial config, user data)
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1500); // Show loader for 1.5 seconds for demo
    return () => clearTimeout(timer);
  }, []);

  const location = useLocation();

  return (
    <>
      <GlobalLoader isLoading={appLoading} /> 
      <AnimatePresence mode="wait">
        {!appLoading && ( // Only render routes when app is not "globally" loading
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tool" element={<UploadAndFormatPage />} />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <Router>
      {/* Suspense can be used here if you lazy load page components */}
      {/* <Suspense fallback={<GlobalLoader isLoading={true} />}> */}
        <AppContent />
      {/* </Suspense> */}
    </Router>
  );
}

export default App;