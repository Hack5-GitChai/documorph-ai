// frontend/src/pages/Home.jsx
import React from 'react';
import Layout from '../components/Layout'; // Import the Layout
import UploadBox from '../components/UploadBox'; // Import the UploadBox

const HomePage = () => {
  return (
    <Layout> {/* Wrap content with Layout */}
      <div style={{ textAlign: 'center' }}>
        <h2>Welcome to DocuMorph AI</h2>
        <p>Upload your document below to get started with smart formatting and analysis.</p>
        <UploadBox />
      </div>
    </Layout>
  );
};

export default HomePage;