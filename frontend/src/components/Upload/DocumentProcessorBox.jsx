// frontend/src/components/Upload/DocumentProcessorBox.jsx
// (Consider renaming the file and component if it makes more sense for your project structure,
// e.g., if this will be the main interaction point for all document processing)

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
// Ensure this import path is correct and points to your updated api/index.js
import { processDocumentViaN8n } from '../../api'; 
import { UploadCloud, CheckCircle, XCircle, RefreshCw, FileText } from 'lucide-react'; // Added FileText

// Import Lottie animations (ensure paths are correct)
import processingAnimationData from '../../assets/animations/processing.json';
import successAnimationData from '../../assets/animations/task-success.json';
import errorAnimationData from '../../assets/animations/error-404.json';

// General Lottie Player for different states
const StateAnimation = ({ animationData, message, loop = true }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center justify-center text-center my-4"
  >
    <div className="w-32 h-32 md:w-40 md:h-40">
      <Lottie animationData={animationData} loop={loop} autoplay={true} />
    </div>
    {message && <p className="mt-3 text-slate-700 font-medium">{message}</p>}
  </motion.div>
);


const DocumentProcessorBox = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  
  // UI State: 'idle', 'selecting', 'processing', 'success', 'error'
  const [uiState, setUiState] = useState('idle'); 
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [processingResult, setProcessingResult] = useState(null); // To store the JSON from n8n
  
  const fileInputRef = useRef(null);

  // No need for formattedDocUrl or uploadedFilename specifically for this n8n flow initially,
  // unless n8n returns a direct download URL later for generated files.

  const resetState = () => {
    setSelectedFile(null);
    setUiState('idle');
    setFeedbackMessage('');
    setProcessingResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Basic validation for image types for OCR, can be expanded
      if (!file.type.startsWith('image/')) {
        setFeedbackMessage('Please select an image file for OCR processing.');
        setUiState('error'); // Or a different state like 'invalid_file'
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setSelectedFile(file);
      setUiState('selecting');
      setFeedbackMessage(`Selected: ${file.name}`);
      setProcessingResult(null); 
    } else {
      resetState();
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleProcessDocument = async () => {
    if (!selectedFile) {
      setFeedbackMessage('Please select a file first.');
      setUiState('error');
      return;
    }
    setUiState('processing'); // One state for the entire n8n flow
    setFeedbackMessage(`Processing ${selectedFile.name}...`);
    setProcessingResult(null);

    try {
      // Call the new API function that triggers the n8n workflow
      const result = await processDocumentViaN8n(selectedFile); 
      setProcessingResult(result); // Store the JSON response from n8n
      setUiState('success');
      // You can customize the success message based on 'result' if needed
      setFeedbackMessage(`Processing complete for ${selectedFile.name}!`); 
    } catch (error) {
      setFeedbackMessage(error.message || 'Processing failed. Please try again.');
      setUiState('error');
    }
  };

  // Determine message icon and color based on uiState (simplified)
  let messageIcon = null;
  let messageColorClass = 'text-slate-600'; // Default
  if (uiState === 'error') {
    messageIcon = <XCircle className="inline mr-2 h-5 w-5" />;
    messageColorClass = 'text-red-600';
  } else if (uiState === 'success' || uiState === 'selecting') { // Grouped success-like states
    messageIcon = <CheckCircle className="inline mr-2 h-5 w-S5" />;
    messageColorClass = 'text-green-600';
  }


  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg mx-auto min-h-[400px] flex flex-col" // Increased min-h
    >
      <AnimatePresence mode="wait">
        {uiState === 'processing' && (
          <StateAnimation key="processing" animationData={processingAnimationData} message="Processing your document via n8n..." />
        )}
        {uiState === 'success' && (
          <motion.div key="success" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center">
            <StateAnimation animationData={successAnimationData} message={feedbackMessage} loop={false} />
            {/* Display the n8n JSON result */}
            {processingResult && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-left">
                    <p className="font-semibold text-green-700">Result from n8n:</p>
                    <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto whitespace-pre-wrap break-all">
                        {JSON.stringify(processingResult, null, 2)}
                    </pre>
                </div>
            )}
            <button onClick={resetState} className="mt-6 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
              <RefreshCw className="inline mr-2 h-4 w-4"/> Process Another
            </button>
          </motion.div>
        )}
        {uiState === 'error' && (
          <motion.div key="error" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center">
            <StateAnimation animationData={errorAnimationData} message={feedbackMessage} loop={false} />
            <button onClick={resetState} className="mt-6 bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors">
              <RefreshCw className="inline mr-2 h-4 w-4"/> Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show initial UI elements only if not in a terminal Lottie state ('processing', 'success', 'error') */}
      {(uiState === 'idle' || uiState === 'selecting') && (
        <div className="flex flex-col flex-grow justify-center">
          <h3 className="text-2xl font-semibold text-brand-dark mb-6 text-center">
            Smart Document Processor
          </h3>
          <input 
            type="file" 
            onChange={handleFileChange} 
            ref={fileInputRef}
            className="hidden" 
            // Initially focusing on images for OCR. Expand as needed.
            accept="image/png, image/jpeg, image/webp" 
          />

          {(uiState === 'idle' || (uiState === 'selecting' && !selectedFile)) && ( // Show Choose File if idle or no file selected
            <motion.button
              onClick={triggerFileSelect}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-150 ease-in-out flex items-center justify-center mb-4 shadow-md"
            >
              <UploadCloud className="mr-2 h-5 w-5" /> Choose Image File
            </motion.button>
          )}

          {uiState === 'selecting' && selectedFile && (
            <div className="text-center mb-4">
              <div className="p-3 mb-3 border border-slate-200 rounded-md bg-slate-50 flex items-center justify-center">
                <FileText className="h-6 w-6 text-brand-primary mr-3" />
                <p className={`text-sm font-medium ${messageColorClass}`}>
                  {feedbackMessage}
                </p>
              </div>
              <motion.button
                onClick={handleProcessDocument} // Calls the new handler
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="w-full bg-brand-secondary text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-150 ease-in-out flex items-center justify-center shadow-md"
              >
                Process with DocuMorph AI
              </motion.button>
            </div>
          )}
          
          {/* General feedback message if idle but has a message (e.g., from previous error then reset) */}
          { (uiState === 'idle' && feedbackMessage) &&
            <p className={`mt-4 text-center text-sm font-medium ${messageColorClass}`}>
              {messageIcon} {feedbackMessage}
            </p>
          }
        </div>
      )}
    </motion.div>
  );
};

export default DocumentProcessorBox;