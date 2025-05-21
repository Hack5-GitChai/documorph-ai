// frontend/src/components/Hero/HeroSection.jsx
import React from 'react';
// We'll import Framer Motion later when we add animations
// import { motion } from 'framer-motion'; 

const HeroSection = () => {
  const scrollToUpload = () => {
    // This assumes you'll have an element with id="upload-section" later
    // We'll add this ID to your UploadBox container in Home.jsx
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-brand-primary via-blue-500 to-indigo-600 text-white"> {/* Example gradient */}
      <div className="container mx-auto px-6 text-center">
        {/* Headline - We'll add Framer Motion animation later */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Transform Raw Documents into Polished Reports Instantly.
        </h1>

        {/* Sub-headline/Description - We'll add Framer Motion animation later */}
        <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto">
          DocuMorph AI uses advanced AI to automatically format, summarize, and structure
          your complex documents, saving you hours of manual work.
        </p>

        {/* Call to Action Button */}
        <button
          onClick={scrollToUpload}
          className="bg-brand-accent hover:bg-amber-500 text-brand-dark font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-lg text-lg sm:text-xl shadow-lg transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50"
        >
          Get Started Now
        </button>

        {/* Placeholder for an illustration or Lottie animation later */}
        {/* <div className="mt-12">
          <img src="/path-to-your-hero-illustration.webp" alt="Document Transformation Illustration" className="mx-auto max-w-md" />
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;