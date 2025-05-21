// frontend/src/pages/Home.jsx
import React from 'react';
import Layout from '../components/layout/Layout';      // CORRECTED PATH
import UploadBox from '../components/Upload/UploadBox';  // CORRECTED PATH
// Import HeroSection when ready
// import HeroSection from '../components/Hero/HeroSection'; 

const HomePage = () => {
  return (
    <Layout> {/* Wrap content with Layout */}
      <div className="text-center"> {/* Example: Tailwind class for centering */}
        {/* <HeroSection /> You'll add this later */}
        <h2 className="text-3xl font-bold text-brand-dark my-6">Welcome to DocuMorph AI</h2>
        <p className="text-lg text-slate-600 mb-8">
          Upload your document below to get started with smart formatting and analysis.
        </p>
        <UploadBox />
      </div>
    </Layout>
  );
};

export default HomePage;