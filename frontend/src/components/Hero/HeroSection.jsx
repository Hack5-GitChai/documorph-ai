// frontend/src/components/Hero/HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion'; // Import motion

const HeroSection = () => {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger the animation of children
        delayChildren: 0.1, // Small delay before children start animating
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 120 } },
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

        {/* For the button, we'll let it be a child of the container for staggering,
            but apply its own specific variant for scale and springiness */}
        <motion.div variants={itemVariants}> 
          <motion.button
            // Use buttonVariants for its own unique animation style if needed,
            // or just itemVariants if simple y-translate and opacity is fine.
            // Let's use buttonVariants for more distinct button animation.
            // We apply initial/animate here so it's not double-animated by parent if variants are too different.
            // However, if buttonVariants also uses opacity/y, the stagger from parent will still apply.
            // For simplicity now, let's assume its variant is compatible with parent's stagger.
            // If not, we'd remove variants from the parent that controls this button.
            // A simpler way: just use itemVariants for the wrapper div and specific whileHover/Tap for button.

            // Let's stick to simpler for now, making it part of the itemVariants flow
            // and then add its own hover/tap.
            onClick={scrollToUpload}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} 
            whileTap={{ scale: 0.95 }}
            className="bg-brand-accent hover:bg-amber-500 text-brand-dark font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-lg text-lg sm:text-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50"
          >
            Get Started Now
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 md:mt-16">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg max-w-2xl mx-auto min-h-[200px] flex items-center justify-center border border-white/20">
            <p className="text-indigo-100 text-lg italic">
              Future Illustration or Lottie Animation will appear here.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;