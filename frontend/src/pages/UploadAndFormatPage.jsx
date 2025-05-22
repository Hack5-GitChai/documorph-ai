// frontend/src/pages/UploadAndFormatPage.jsx
import React from 'react';
import Layout from '../components/layout/Layout';
import UploadBox from '../components/Upload/UploadBox';
import { motion } from 'framer-motion';

const UploadAndFormatPage = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="py-8 sm:py-10 text-center" // Adjusted padding
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3 sm:mb-4">
          Morph Your Document
        </h2>
        <p className="text-slate-600 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
          Upload your file, choose your formatting options (coming soon!), and let AI do the work.
        </p>
        <UploadBox /> 
      </motion.div>
    </Layout>
  );
};
export default UploadAndFormatPage;