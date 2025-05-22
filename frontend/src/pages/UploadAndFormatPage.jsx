// frontend/src/pages/UploadAndFormatPage.jsx
import React from 'react';
import Layout from '../components/layout/Layout';
import UploadBox from '../components/Upload/UploadBox'; // Your existing UploadBox
import { motion } from 'framer-motion';

const UploadAndFormatPage = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }} // For page transitions
        transition={{ duration: 0.3 }}
        className="py-10 md:py-12 text-center"
      >
        <h2 className="text-3xl font-bold text-brand-dark mb-4">
          Morph Your Document
        </h2>
        <p className="text-slate-600 mb-8 max-w-xl mx-auto">
          Upload your file, choose your formatting options (coming soon!), and let AI do the work.
        </p>
        <UploadBox /> 
        {/* The UploadBox already handles its own loading/success/error Lottie animations */}
      </motion.div>
    </Layout>
  );
};

export default UploadAndFormatPage;