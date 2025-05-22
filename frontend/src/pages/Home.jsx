// frontend/src/pages/Home.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/Hero/HeroSection';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log("Attempting to navigate to /tool via 'Get Started' button click...");
    navigate('/tool'); 
  };

  return (
    <Layout>
      <HeroSection onGetStartedClick={handleGetStarted} /> {/* Pass the handler to HeroSection */}
      
      <div className="py-12 sm:py-16 text-center">
        <motion.button
            onClick={handleGetStarted} // This button also uses the same handler
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-secondary hover:bg-green-700 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-lg text-lg sm:text-xl shadow-lg"
        >
            Proceed to Document Tool
        </motion.button>

        {/* Test Link for Debugging */}
        <p className="mt-6 text-sm">
          <Link to="/tool" className="text-brand-primary hover:underline font-medium">
            (Test Navigation Link to Tool Page)
          </Link>
        </p>
      </div>
      
      {/* You can add other sections to your landing page here later if needed */}
      {/* e.g., Features, How it Works, Testimonials */}
      {/* Example for a features section placeholder:
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-brand-dark mb-10">Features Overview</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Smart Formatting</h3>
              <p className="text-slate-600">Automatically apply professional templates.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">AI Summarization</h3>
              <p className="text-slate-600">Get concise summaries of long documents.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">OCR Capabilities</h3>
              <p className="text-slate-600">Extract text from images and PDFs.</p>
            </div>
          </div>
        </div>
      </section>
      */}
    </Layout>
  );
};

export default HomePage;