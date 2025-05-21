// frontend/src/pages/Home.jsx
import React from 'react';
import Layout from '../components/layout/Layout';
import UploadBox from '../components/Upload/UploadBox';
import HeroSection from '../components/Hero/HeroSection'; // Import the HeroSection

const HomePage = () => {
  return (
    <Layout>
      <HeroSection /> {/* Add the HeroSection at the top */}
      
      {/* This div will contain the upload area. We give it an ID for scrolling. */}
      <div id="upload-section" className="py-10 md:py-16 text-center">
        <h2 className="text-3xl font-bold text-brand-dark mb-4">
          Ready to Morph Your Document?
        </h2>
        <p className="text-slate-600 mb-8 max-w-xl mx-auto">
          Choose your file below. We currently support .txt for dummy formatting.
          More formats and features coming soon!
        </p>
        <UploadBox />
      </div>
    </Layout>
  );
};

export default HomePage;