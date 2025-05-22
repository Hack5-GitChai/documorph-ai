// frontend/src/pages/UnderConstructionPage.jsx
import React from 'react';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout'; // Assuming your Layout component
// Import your under-construction Lottie animation
import underConstructionAnimationData from '../assets/animations/under-construction.json'; // ADJUST FILENAME

const UnderConstructionPage = ({ featureName = "This Feature" }) => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16 md:py-20">
        <div className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-6">
          <Lottie 
            animationData={underConstructionAnimationData} 
            loop={true} 
            autoplay={true} 
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-3">
          {featureName} is Under Construction!
        </h1>
        <p className="text-slate-600 text-lg mb-8 max-w-md">
          We're working hard to bring this amazing feature to you soon. Please check back later!
        </p>
        <Link
          to="/" // Link back to the Home page
          className="bg-brand-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out"
        >
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
};

export default UnderConstructionPage;