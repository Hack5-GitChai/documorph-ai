// frontend/src/components/Hero/HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react'; // Import Lottie component
// Import your Lottie JSON animation file for the hero
import heroScanAnimationData from '../../assets/animations/hero-doc-scan.json'; // Using this one!

const HeroSection = () => {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = { 
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
        delayChildren: 0.1, 
      },
    },
  };
  const itemVariants = { 
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section 
      className="py-16 md:py-24 bg-gradient-to-br from-brand-primary via-blue-500 to-indigo-600 text-white overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6 text-center">
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6"
        >
          Transform Raw Documents into Polished Reports Instantly.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto"
        >
          DocuMorph AI uses advanced AI to automatically format, summarize, and structure
          your complex documents, saving you hours of manual work.
        </motion.p>

        <motion.div variants={itemVariants}> 
          <motion.button
            onClick={scrollToUpload}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} 
            whileTap={{ scale: 0.95 }}
            className="bg-brand-accent hover:bg-amber-500 text-brand-dark font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-lg text-lg sm:text-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50"
          >
            Get Started Now
          </motion.button>
        </motion.div>

        {/* Lottie Animation Area - Using hero-doc-scan.json */}
        <motion.div 
          variants={itemVariants} 
          className="mt-12 md:mt-16 max-w-xs sm:max-w-sm md:max-w-md mx-auto" // Control size of Lottie container
        >
          <Lottie 
            animationData={heroScanAnimationData} 
            loop={true} 
            autoplay={true} 
            className="w-full h-auto" // Ensure it scales within its container
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;