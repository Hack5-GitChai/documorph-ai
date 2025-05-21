
// frontend/src/components/Hero/HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
// Import a placeholder icon or image if you have one, or we'll just use text
import { FileSliders } from 'lucide-react'; // Example: Using a Lucide icon as a placeholder

// ... (scrollToUpload and variants remain the same) ...
const HeroSection = () => {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = { /* ... as before ... */ 
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
        delayChildren: 0.1, 
      },
    },
  };
  const itemVariants = { /* ... as before ... */ 
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const buttonVariants = { /* ... as before ... */ 
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

        {/* Updated Visual Placeholder Area */}
        <motion.div variants={itemVariants} className="mt-12 md:mt-16">
          <div className="bg-white/10 backdrop-blur-sm p-8 sm:p-12 rounded-lg max-w-xl lg:max-w-2xl mx-auto min-h-[250px] flex flex-col items-center justify-center border border-white/20">
            <FileSliders size={64} className="text-indigo-200 mb-4" strokeWidth={1.5} />
            <p className="text-indigo-100 text-lg italic">
              Smart Document Transformation
            </p>
            <p className="text-indigo-200 text-sm mt-1">
              (Lottie animation or engaging graphic coming soon!)
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
export default HeroSection;