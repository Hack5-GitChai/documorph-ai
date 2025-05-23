// frontend/src/components/Upload/DocumentProcessorBox.jsx

import React, { useState, useRef } from 'react'; // Removed useEffect for this test
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
// Keep this import, but we might not even call the function in this test
import { processDocumentViaN8n } from '../../api'; 
import { UploadCloud, CheckCircle, XCircle, RefreshCw, FileText } from 'lucide-react';

import processingAnimationData from '../../assets/animations/processing.json';
import successAnimationData from '../../assets/animations/task-success.json';
import errorAnimationData from '../../assets/animations/error-404.json';

const StateAnimation = ({ animationData, message, loop = true }) => (
  // ... (StateAnimation component remains the same) ...
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
  const [uiState, setUiState] = useState('idle'); 
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [processingResult, setProcessingResult] = useState(null);
  const fileInputRef = useRef(null);

  const resetState = () => { /* ... (resetState remains the same) ... */ 
    setSelectedFile(null);
    setUiState('idle');
    setFeedbackMessage('');
    setProcessingResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (event) => { /* ... (handleFileChange remains the same) ... */ 
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFeedbackMessage('Please select an image file for OCR processing.');
        setUiState('error'); 
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

  // --- MODIFIED FOR DEBUGGING ---
  const handleProcessDocument = async () => {
    alert("DEBUG TEST: 'handleProcessDocument' (for N8N flow) was CLICKED!");
    // For this test, we are NOT calling the API yet.
    // We just want to see if this specific function is triggered by the button.
    // If this alert appears, the button is wired correctly to THIS function.
    // If another alert appears, or no alert, the button is wired elsewhere.
    console.log("DEBUG TEST: handleProcessDocument CALLED. Selected file:", selectedFile ? selectedFile.name : "None");
    // setUiState('processing'); // Comment out API call for now
    // setFeedbackMessage(`TESTING: Click registered for ${selectedFile?.name}...`);
    // setProcessingResult(null);
    return; // Stop further execution for this test
  };

  // --- IF YOU HAVE OLD HANDLERS, ADD ALERTS TO THEM TOO ---
  const handleOldUploadLogic = async () => { // Example name for an old function
    alert("DEBUG TEST: 'handleOldUploadLogic' was CLICKED! This is WRONG for n8n flow.");
    console.log("DEBUG TEST: handleOldUploadLogic CALLED.");
  };
  
  const handleOldFormatLogic = async () => { // Example name for an old function
    alert("DEBUG TEST: 'handleOldFormatLogic' was CLICKED! This is WRONG for n8n flow.");
    console.log("DEBUG TEST: handleOldFormatLogic CALLED.");
  };


  // ... (messageIcon, messageColorClass logic remains the same) ...
  // ... (JSX for motion.div, AnimatePresence remains the same) ...

  return (
     <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg mx-auto min-h-[400px] flex flex-col"
    >
      {/* ... AnimatePresence and StateAnimation parts ... */}
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
            accept="image/png, image/jpeg, image/webp" 
          />

          {(uiState === 'idle' || (uiState === 'selecting' && !selectedFile)) && (
            <motion.button
              onClick={triggerFileSelect}
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
              {/* ENSURE THIS BUTTON IS THE ONE YOU ARE CLICKING */}
              <motion.button
                onClick={handleProcessDocument} // THIS IS THE KEY ONCLICK
                className="w-full bg-brand-secondary text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-150 ease-in-out flex items-center justify-center shadow-md"
              >
                Process with DocuMorph AI
              </motion.button>
            </div>
          )}
          
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