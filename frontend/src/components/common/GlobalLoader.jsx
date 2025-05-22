// frontend/src/components/common/GlobalLoader.jsx
import React from 'react';
import Lottie from 'lottie-react';
// Make sure this is an animation that is designed to loop well.
import infinityLoadingAnimationData from '../../assets/animations/infinity-loading.json'; 

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
        backgroundColor: 'rgba(243, 244, 246, 0.9)', // Using brand-light with opacity
        backdropFilter: 'blur(5px)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 9999,
      }}
    >
      <div style={{ width: '150px', height: '150px' }}> {/* Adjust size */}
        <Lottie 
          animationData={infinityLoadingAnimationData} 
          loop={true} // <<<< ENSURE THIS IS TRUE
          autoplay={true} 
        />
      </div>
    </div>
  );
};

export default GlobalLoader;