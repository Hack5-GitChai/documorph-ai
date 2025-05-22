// frontend/src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // This will cause an error if Router is not a parent
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout'; // Check this path
import HeroSection from '../components/Hero/HeroSection'; // Check this path

const HomePage = () => {
  // const navigate = useNavigate(); // TEMPORARILY COMMENT OUT if Router is removed from App.jsx for testing
  const handleGetStarted = () => {
    console.log("Get Started Clicked - navigation would go here");
    // navigate('/tool'); // TEMPORARILY COMMENT OUT
  };

  return (
    <Layout>
      <HeroSection onGetStartedClick={handleGetStarted} />
      <div className="py-12 sm:py-16 text-center">
        <motion.button
            onClick={handleGetStarted}
            // ... other props
        >
            Proceed to Document Tool
        </motion.button>
      </div>
    </Layout>
  );
};
export default HomePage;