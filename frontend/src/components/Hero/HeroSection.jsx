// frontend/src/components/Hero/HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
// Ensure this path and filename matches your chosen hero animation
import heroScanAnimationData from '../../assets/animations/hero-doc-scan.json'; 

// Accept onGetStartedClick as a prop
const HeroSection = ({ onGetStartedClick }) => { 
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger the animation of children
        delayChildren: 0.1,   // Small delay before children start animating
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section 
      className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-brand-primary via-blue-500 to-indigo-600 text-white overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 sm:mb-6"
        >
          Transform Raw Documents into Polished Reports Instantly.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-indigo-100 mb-8 sm:mb-10 max-w-xl md:max-w-3xl mx-auto"
        >
          DocuMorph AI uses advanced AI to automatically format, summarize, and structure
          your complex documents, saving you hours of manual work.
        </motion.p>

        <motion.div variants={itemVariants} className="w-full flex justify-center"> 
          <motion.button
            onClick={onGetStartedClick} // Use the passed prop
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} 
            whileTap={{ scale: 0.95 }}
            className="bg-brand-accent hover:bg-amber-500 text-brand-dark font-bold py-3 px-6 sm:py-3 sm:px-8 text-base md:text-lg rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50"
          >
            Get Started Now
          </motion.button>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="mt-10 sm:mt-12 md:mt-16 max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto"
        >
          <Lottie 
            animationData={heroScanAnimationData} 
            loop={true} 
            autoplay={true} 
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;