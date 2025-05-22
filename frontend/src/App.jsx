// frontend/src/App.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import GlobalLoader from './components/common/GlobalLoader';
import HomePage from './pages/Home';
import UploadAndFormatPage from './pages/UploadAndFormatPage';
import FeaturesPage from './pages/FeaturesPage';   // Import
import TemplatesPage from './pages/TemplatesPage'; // Import
// Import NotFoundPage later

const AppContent = () => {
  // ... (appLoading logic as before)
  const [appLoading, setAppLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 1000); // Reduced demo time
    return () => clearTimeout(timer);
  }, []);
  const location = useLocation();

  return (
    <>
      <GlobalLoader isLoading={appLoading} /> 
      <AnimatePresence mode="wait">
        {!appLoading && (
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tool" element={<UploadAndFormatPage />} />
            <Route path="/features" element={<FeaturesPage />} />   {/* Add route */}
            <Route path="/templates" element={<TemplatesPage />} /> {/* Add route */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;