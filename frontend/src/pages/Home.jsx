// frontend/src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/Hero/HeroSection'; // We'll modify HeroSection's button

const HomePage = () => {
  const navigate = useNavigate(); // Hook for navigation

  // We will pass this function to HeroSection or have HeroSection directly navigate
  const handleGetStarted = () => {
    navigate('/tool'); // Navigate to the main tool page
  };

  return (
    <Layout>
      {/* Pass handleGetStarted to HeroSection or modify HeroSection to use navigate */}
      <HeroSection onGetStartedClick={handleGetStarted} />
      
      {/* You can add other sections to your landing page here later if needed */}
      {/* e.g., Features, How it Works, Testimonials */}
      <div className="py-12 text-center">
        <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-secondary hover:bg-green-700 text-white font-bold py-4 px-10 rounded-lg text-xl shadow-lg"
        >
            Proceed to Document Tool
        </motion.button>
      </div>
    </Layout>
  );
};

export default HomePage;