// frontend/src/App.jsx
import React, { useState, useEffect, Suspense } from 'react'; // Suspense is imported but not used yet, okay for now
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import GlobalLoader from './components/common/GlobalLoader';
import HomePage from './pages/Home';
import ToolPage from './pages/ToolPage'; // CORRECTED: Import ToolPage
import UnderConstructionPage from './pages/UnderConstructionPage'; // ADDED: Import UnderConstructionPage
// Import NotFoundPage later when you create it

const AppContent = () => {
  const [appLoading, setAppLoading] = useState(true); // Simulating initial app load
  useEffect(() => {
    // Simulate loading time (e.g., fetching initial config, user data)
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1000); // Show loader for 1 second for demo
    return () => clearTimeout(timer);
  }, []);

  const location = useLocation();

  return (
    <>
      <GlobalLoader isLoading={appLoading} /> 
      <AnimatePresence mode="wait"> {/* 'wait' ensures one page animates out before next animates in */}
        {!appLoading && ( // Only render routes when app is not "globally" loading
          <Routes location={location} key={location.pathname}> {/* Key prop is important for AnimatePresence */}
            <Route path="/" element={<HomePage />} />
            <Route path="/tool" element={<ToolPage />} /> {/* CORRECTED: Use ToolPage */}
            
            {/* Routes for placeholder/upcoming features using UnderConstructionPage */}
            <Route path="/features" element={<UnderConstructionPage featureName="Our Awesome Features" />} />
            <Route path="/templates" element={<UnderConstructionPage featureName="Document Templates Gallery" />} />
            <Route path="/tool/format-options" element={<UnderConstructionPage featureName="Advanced Format Options" />} />
            <Route path="/tool/ocr" element={<UnderConstructionPage featureName="OCR Service" />} />
            <Route path="/tool/summarize" element={<UnderConstructionPage featureName="Summarization Tool" />} />
            <Route path="/tool/editor" element={<UnderConstructionPage featureName="Full Document Editor" />} />
            <Route path="/tool/tables" element={<UnderConstructionPage featureName="Table Tools" />} />
            <Route path="/tool/images" element={<UnderConstructionPage featureName="Image Tools" />} />
            <Route path="/tool/ai-assist" element={<UnderConstructionPage featureName="AI Content Suggestions" />} />
            <Route path="/tool/rewrite" element={<UnderConstructionPage featureName="AI Rewriter Tool" />} />
            <Route path="/tool/history" element={<UnderConstructionPage featureName="Document Version History" />} />

            {/* Catch-all for 404 - using UnderConstructionPage as a temporary 404 */}
            {/* Replace with a dedicated NotFoundPage later */}
            <Route path="*" element={<UnderConstructionPage featureName="Page Not Found (404)" />} /> 
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <Router>
      {/* If you start lazy-loading page components, you'll wrap AppContent with <Suspense>
          <Suspense fallback={<GlobalLoader isLoading={true} />}> 
            <AppContent />
          </Suspense>
      */}
      <AppContent />
    </Router>
  );
}

export default App;