// frontend/src/pages/ToolPage.jsx (Revised Focus)
import React, { useState } from 'react'; // Added useState for potential future state here
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
// We might need a more sophisticated UploadBox or a new component for this core flow
// Let's call it SmartDocumentProcessor.jsx for now (conceptually)
// For now, we can adapt UploadBox.jsx or start a new component.
// For simplicity in this step, let's assume UploadBox handles the initial upload.
import UploadBox from '../components/Upload/UploadBox'; 
import { FileSliders, HelpCircle, Sparkles } from 'lucide-react'; // Example icons

const ToolPage = () => {
  // State for this page could eventually manage the overall document processing flow
  // e.g., current step (upload, processing, preview), document ID, etc.
  // const [currentDocument, setCurrentDocument] = useState(null);
  // const [processingStep, setProcessingStep] = useState('upload');

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="py-8 sm:py-10"
      >
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark inline-flex items-center">
            <FileSliders className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-brand-primary" />
            Smart Document Transformer
          </h1>
          <p className="text-slate-600 mt-3 text-base sm:text-lg max-w-2xl mx-auto">
            Upload your unstructured document (.docx, .txt, images of handwriting, PDFs with tables & equations). 
            DocuMorph AI will intelligently format it into a professional report.
          </p>
        </div>

        {/* Core "Smart Document Formatting" Upload Area */}
        {/* This UploadBox will need to be enhanced or replaced to handle the multi-stage process */}
        <div id="smart-document-upload"> {/* Target for any "Get Started" buttons if needed */}
          <UploadBox /> 
          {/* 
            Future Enhancements for this section:
            - Options to select output format (DOCX, PDF)
            - Template selection (once templates are built)
            - Toggles for specific AI features (e.g., "Enable OCR", "Generate Summary")
          */}
        </div>
        
        <hr className="my-12 md:my-16 border-slate-300" />

        {/* Section for Auxiliary/Specific Tools (Less Prominent) */}
        <section id="auxiliary-tools" className="mt-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-brand-dark inline-flex items-center">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 mr-2 text-brand-accent" />
              Quick Tools & Utilities
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Need a specific task done quickly?
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Example: These could link to modal pop-ups or simpler interfaces */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
              <h3 className="font-semibold text-lg text-brand-primary mb-2">Quick OCR</h3>
              <p className="text-sm text-slate-600">Extract text from a single image.</p>
              {/* Add a button or link here */}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
              <h3 className="font-semibold text-lg text-brand-primary mb-2">Quick Summary</h3>
              <p className="text-sm text-slate-600">Summarize a block of text.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
              <h3 className="font-semibold text-lg text-brand-primary mb-2">Help & FAQs</h3>
              <p className="text-sm text-slate-600">Find answers to common questions.</p>
            </div>
          </div>
        </section>

      </motion.div>
    </Layout>
  );
};

export default ToolPage;