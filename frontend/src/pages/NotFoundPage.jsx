// frontend/src/pages/NotFoundPage.jsx (EXAMPLE - for later with routing)
import React from 'react';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom'; // Assuming React Router
import error404AnimationData from '../assets/animations/error-404.json';
import Layout from '../components/layout/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-center py-10">
        <div className="w-64 h-64 md:w-80 md:h-80">
          <Lottie animationData={error404AnimationData} loop={true} autoplay={true} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mt-4">Oops! Page Not Found</h1>
        <p className="text-slate-600 mt-2 mb-6">
          The page you are looking for might have been removed or doesn't exist.
        </p>
        <Link
          to="/"
          className="bg-brand-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;