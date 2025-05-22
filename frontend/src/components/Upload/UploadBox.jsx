// frontend/src/components/Upload/UploadBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import Lottie from 'lottie-react';
import { uploadDocument, formatDocumentAndGetBlob } from '../../api';
import { UploadCloud, FileText, CheckCircle, XCircle, Download, RefreshCw } from 'lucide-react';

// Import Lottie animations
import processingAnimationData from '../../assets/animations/processing.json'; // For active processing
import successAnimationData from '../../assets/animations/task-success.json';   // For success states
import errorAnimationData from '../../assets/animations/error-404.json';     // For error states (using 404 as generic error)

// General Lottie Player for different states
const StateAnimation = ({ animationData, message, loop = true }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center justify-center text-center my-4" // Added my-4
  >
    <div className="w-32 h-32 md:w-40 md:h-40"> {/* Controlled Lottie size */}
      <Lottie animationData={animationData} loop={loop} autoplay={true} />
    </div>
    {message && <p className="mt-3 text-slate-700 font-medium">{message}</p>}
  </motion.div>
);


const UploadBox = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState('');
  
  // UI State: 'idle', 'selecting', 'uploading', 'uploaded', 'formatting', 'success', 'error'
  const [uiState, setUiState] = useState('idle'); 
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [formattedDocUrl, setFormattedDocUrl] = useState(null);
  
  const fileInputRef = useRef(null);
  const successLottieRef = useRef(null); // Ref for non-looping success animation

  useEffect(() => {
    // Cleanup object URL when component unmounts or URL changes
    return () => {
      if (formattedDocUrl) {
        URL.revokeObjectURL(formattedDocUrl);
      }
    };
  }, [formattedDocUrl]);

  const resetState = () => {
    setSelectedFile(null);
    setUploadedFilename('');
    setUiState('idle');
    setFeedbackMessage('');
    if (formattedDocUrl) URL.revokeObjectURL(formattedDocUrl);
    setFormattedDocUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUiState('selecting');
      setFeedbackMessage(`Selected: ${file.name}`);
      setFormattedDocUrl(null); 
      setUploadedFilename(''); // Reset uploaded filename if new file is chosen
    } else {
      resetState();
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleUpload = async () => {
    if (!selectedFile) {
      setFeedbackMessage('Please select a file first.');
      setUiState('error');
      return;
    }
    setUiState('uploading');
    setFeedbackMessage(`Uploading ${selectedFile.name}...`);
    try {
      const response = await uploadDocument(selectedFile);
      setUploadedFilename(response.filename); 
      setUiState('uploaded');
      setFeedbackMessage(`Uploaded: ${response.filename}. Ready to format.`);
    } catch (error) {
      setFeedbackMessage(error.message || 'Upload failed. Please try again.');
      setUiState('error');
    }
  };

  const handleFormat = async () => {
    if (!uploadedFilename) {
      setFeedbackMessage('File not uploaded yet.');
      setUiState('error');
      return;
    }
    setUiState('formatting');
    setFeedbackMessage(`Formatting ${uploadedFilename}...`);
    try {
      const blob = await formatDocumentAndGetBlob(uploadedFilename);
      const url = URL.createObjectURL(blob);
      setFormattedDocUrl(url); 
      setUiState('success');
      setFeedbackMessage(`Formatting complete for ${uploadedFilename}!`);
      successLottieRef.current?.play(); // If Lottie component has such a method
    } catch (error) {
      setFeedbackMessage(error.message || 'Formatting failed. Please try again.');
      setUiState('error');
    }
  };

  // Determine message icon and color based on uiState
  let messageIcon = null;
  let messageColorClass = 'text-slate-600';
  if (uiState === 'error') {
    messageIcon = <XCircle className="inline mr-2 h-5 w-5" />;
    messageColorClass = 'text-red-600';
  } else if (uiState === 'success' || uiState === 'uploaded' || uiState === 'selecting') {
    messageIcon = <CheckCircle className="inline mr-2 h-5 w-5" />;
    messageColorClass = 'text-green-600';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg mx-auto min-h-[350px] flex flex-col" // Added min-h and flex
    >
      <AnimatePresence mode="wait"> {/* Helps with smooth transitions between states */}
        {uiState === 'uploading' && (
          <StateAnimation key="uploading" animationData={processingAnimationData} message="Uploading your document..." />
        )}
        {uiState === 'formatting' && (
          <StateAnimation key="formatting" animationData={processingAnimationData} message="Morphing your document..." />
        )}
        {uiState === 'success' && (
          <motion.div key="success" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center">
            <StateAnimation animationData={successAnimationData} message={feedbackMessage} loop={false} />
            {formattedDocUrl && (
              <div className="mt-4">
                <a 
                  href={formattedDocUrl} 
                  download={`${uploadedFilename.split('.')[0]}_formatted.docx`}
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out"
                >
                  <Download className="mr-2 h-5 w-5" /> Download Formatted Document
                </a>
                <button onClick={resetState} className="mt-4 ml-4 text-sm text-slate-500 hover:text-brand-primary">Start Over</button>
              </div>
            )}
          </motion.div>
        )}
        {uiState === 'error' && (
          <motion.div key="error" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center">
            <StateAnimation animationData={errorAnimationData} message={feedbackMessage} loop={false} />
            <button onClick={resetState} className="mt-4 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              <RefreshCw className="inline mr-2 h-4 w-4"/> Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show initial UI elements only if not in a terminal Lottie state */}
      {(uiState === 'idle' || uiState === 'selecting' || uiState === 'uploaded') && (
        <div className="flex flex-col flex-grow justify-center"> {/* For centering content vertically */}
          <h3 className="text-2xl font-semibold text-brand-dark mb-6 text-center">
            Upload and Format Document
          </h3>
          <input 
            type="file" 
            onChange={handleFileChange} 
            ref={fileInputRef}
            className="hidden" 
            accept=".txt,.pdf,.doc,.docx,image/*"
          />

          {(uiState === 'idle' || !selectedFile) && (
            <motion.button
              onClick={triggerFileSelect}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-150 ease-in-out flex items-center justify-center mb-4 shadow-md"
            >
              <UploadCloud className="mr-2 h-5 w-5" /> Choose File
            </motion.button>
          )}

          {uiState === 'selecting' && selectedFile && (
            <div className="text-center mb-4">
              <p className={`text-sm font-medium flex items-center justify-center mb-3 ${messageColorClass}`}>
                {messageIcon} {feedbackMessage}
              </p>
              <motion.button
                onClick={handleUpload}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="w-full bg-brand-secondary text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-150 ease-in-out flex items-center justify-center shadow-md"
              >
                <UploadCloud className="mr-2 h-5 w-5" /> 1. Upload File
              </motion.button>
            </div>
          )}
          
          {uiState === 'uploaded' && uploadedFilename && (
             <div className="text-center mb-4">
              <p className={`text-sm font-medium flex items-center justify-center mb-3 ${messageColorClass}`}>
                {messageIcon} {feedbackMessage}
              </p>
              <motion.button
                onClick={handleFormat}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="w-full bg-brand-accent text-brand-dark font-semibold py-3 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-150 ease-in-out flex items-center justify-center shadow-md"
              >
                2. Format "{uploadedFilename.substring(0,20)}${uploadedFilename.length > 20 ? '...' : ''}"
              </motion.button>
            </div>
          )}
          
          {/* General feedback message if not tied to a specific Lottie state */}
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

export default UploadBox;