// frontend/src/pages/ToolPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate for programmatic navigation
import Layout from '../components/layout/Layout';
import UploadBox from '../components/Upload/DocumentProcessorBox'; // Your main upload component
import { motion } from 'framer-motion';
import { 
    FileUp,         // For main upload
    ScanText,       // OCR
    MessageSquareText, // Summarizer
    Rows,           // Table Enhancer
    ImagePlay,      // Image Captioner
    Edit,           // Full Editor
    Settings2,      // Formatting Options (general)
    Palette,        // Templates
    BookOpen,       // Document Preview (future part of main flow)
    Sparkles,       // AI suggestions
    Replace,        // AI Rewriter
    History         // Versioning
} from 'lucide-react';

// Reusable Feature Button Component
const FeatureButton = ({ icon, title, description, to, isComingSoon = false, onClick }) => {
  const navigate = useNavigate();
  const commonClasses = "flex flex-col items-center p-4 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-2";
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${commonClasses} ${isComingSoon ? 'border-amber-400 hover:border-amber-500' : 'border-transparent hover:border-brand-primary'}`}
      disabled={isComingSoon && !to} // Disable if coming soon and no specific "under construction" route
    >
      <div className={`mb-3 p-3 rounded-full ${isComingSoon ? 'bg-amber-100' : 'bg-brand-primary/10'}`}>
        {React.cloneElement(icon, { 
          className: `w-7 h-7 sm:w-8 sm:h-8 ${isComingSoon ? 'text-amber-600' : 'text-brand-primary'}`,
          strokeWidth: 1.5
        })}
      </div>
      <h3 className={`font-semibold text-sm sm:text-base md:text-lg ${isComingSoon ? 'text-amber-700' : 'text-brand-dark'}`}>{title}</h3>
      {description && <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center">{description}</p>}
      {isComingSoon && <span className="text-xs text-amber-600 font-medium mt-2">(Coming Soon)</span>}
    </button>
  );
};


const ToolPage = () => {
  // In the future, this page might have more complex state 
  // to manage the multi-step document processing journey

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="py-8 sm:py-10"
      >
        {/* Main Smart Document Transformer Section */}
        <section className="mb-16 md:mb-20 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-brand-primary to-blue-500 text-white py-3 px-6 rounded-full shadow-md mb-6">
            <FileUp className="w-6 h-6 mr-2" />
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Smart Document Transformer
            </h1>
          </div>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Upload your unstructured document (.docx, .txt, images, PDFs). DocuMorph AI will intelligently process and format it into a professional report.
          </p>
          
          {/* The Main Upload Box */}
          <div id="smart-document-upload" className="max-w-xl lg:max-w-2xl mx-auto">
            <UploadBox /> 
          </div>
          {/* Placeholder for formatting options related to the main upload */}
          <div className="mt-8 text-sm text-slate-500">
            {/* <p>(Advanced formatting options & template selection will appear here after upload or by default)</p> */}
          </div>
        </section>

        {/* Auxiliary Tools & Features Section */}
        <section id="auxiliary-tools">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">
              Explore Features & Utilities
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Access specific tools or learn more about upcoming enhancements.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {/* Current/Core Tools (might link to modals or specific views later) */}
            <FeatureButton 
              icon={<Settings2 />} 
              title="Format Options" 
              description="Fine-tune styles."
              to="/tool/format-options" // Will show UnderConstructionPage
            />
            <FeatureButton 
              icon={<Palette />} 
              title="Templates" 
              description="Browse & apply."
              to="/templates" // Will show UnderConstructionPage (already routed)
            />
             <FeatureButton 
              icon={<ScanText />} 
              title="OCR Text" 
              description="From images/PDFs."
              to="/tool/ocr" // Will show UnderConstructionPage
            />
            <FeatureButton 
              icon={<MessageSquareText />} 
              title="Summarize" 
              description="Get key insights."
              to="/tool/summarize" // Will show UnderConstructionPage
            />
            <FeatureButton 
              icon={<Edit />} 
              title="Document Editor" 
              description="Full rich-text editing."
              to="/tool/editor" // Will show UnderConstructionPage
              isComingSoon={true}
            />

            {/* Future Enhancements */}
            <FeatureButton 
              icon={<Rows />} 
              title="Table Tools" 
              description="Extract & analyze."
              to="/tool/tables" 
              isComingSoon={true}
            />
            <FeatureButton 
              icon={<ImagePlay />} 
              title="Image Tools" 
              description="Captions & alt-text."
              to="/tool/images" 
              isComingSoon={true}
            />
            <FeatureButton 
              icon={<Sparkles />} 
              title="AI Suggestions" 
              description="Content improvements."
              to="/tool/ai-assist" 
              isComingSoon={true}
            />
             <FeatureButton 
              icon={<Replace />} 
              title="AI Rewriter" 
              description="Enhance clarity."
              to="/tool/rewrite" 
              isComingSoon={true}
            />
            <FeatureButton 
              icon={<History />} 
              title="Version History" 
              description="Track document changes."
              to="/tool/history" 
              isComingSoon={true}
            />
            {/* Add more as planned */}
          </div>
        </section>
      </motion.div>
    </Layout>
  );
};

export default ToolPage;