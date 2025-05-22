// frontend/src/components/common/GlobalLoader.jsx
import React from 'react';
import Lottie from 'lottie-react';
// Choose one of your infinity loading animations
import infinityLoadingAnimationData from '../../assets/animations/infinity-loading.json'; 
// Or use processingAnimationData if you prefer
// import infinityLoadingAnimationData from '../../assets/animations/processing.json'; 

const GlobalLoader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white overlay
        backdropFilter: 'blur(4px)', // Blur effect
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 9999, // Ensure it's on top
      }}
    >
      <div style={{ width: '150px', height: '150px' }}> {/* Adjust size */}
        <Lottie animationData={infinityLoadingAnimationData} loop={true} autoplay={true} />
      </div>
    </div>
  );
};

export default GlobalLoader;