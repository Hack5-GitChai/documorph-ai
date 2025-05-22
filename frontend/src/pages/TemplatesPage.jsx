// frontend/src/pages/TemplatesPage.jsx
import React from 'react';
import Layout from '../components/layout/Layout'; // Adjust path if Layout is elsewhere

const TemplatesPage = () => {
  return (
    <Layout>
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold">Templates</h1>
        <p className="mt-4 text-lg">Browse our document templates coming soon!</p>
      </div>
    </Layout>
  );
};

export default TemplatesPage; // <<--- Make sure this default export exists!